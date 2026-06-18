import { Issue } from 'entities';
import { IssuePriority, IssueStatus, IssueType } from 'constants/issues';
import { createEntity, updateEntity } from 'utils/typeorm';

/* global fetch */
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AiAction =
  | {
      action: 'create';
      title: string;
      type?: IssueType;
      status?: IssueStatus;
      priority?: IssuePriority;
      description?: string;
    }
  | {
      action: 'update';
      issueId: number;
      title?: string;
      type?: IssueType;
      status?: IssueStatus;
      priority?: IssuePriority;
      description?: string;
    }
  | {
      action: 'move';
      issueId: number;
      status: IssueStatus;
    };

export type AiChatResult = {
  reply: string;
  actions: AiAction[];
};

type IssueSummary = {
  id: number;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
};

const STATUS_ALIASES: Record<string, IssueStatus> = {
  backlog: IssueStatus.BACKLOG,
  selected: IssueStatus.SELECTED,
  'selected for development': IssueStatus.SELECTED,
  inprogress: IssueStatus.INPROGRESS,
  'in progress': IssueStatus.INPROGRESS,
  done: IssueStatus.DONE,
};

const TYPE_ALIASES: Record<string, IssueType> = {
  task: IssueType.TASK,
  bug: IssueType.BUG,
  story: IssueType.STORY,
};

const PRIORITY_ALIASES: Record<string, IssuePriority> = {
  highest: IssuePriority.HIGHEST,
  high: IssuePriority.HIGH,
  medium: IssuePriority.MEDIUM,
  low: IssuePriority.LOW,
  lowest: IssuePriority.LOWEST,
};

const normalizeStatus = (value?: string): IssueStatus | undefined => {
  if (!value) return undefined;
  return STATUS_ALIASES[value.trim().toLowerCase()];
};

const normalizeType = (value?: string): IssueType | undefined => {
  if (!value) return undefined;
  return TYPE_ALIASES[value.trim().toLowerCase()];
};

const normalizePriority = (value?: string): IssuePriority | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (PRIORITY_ALIASES[normalized]) return PRIORITY_ALIASES[normalized];
  if (Object.values(IssuePriority).includes(normalized as IssuePriority)) {
    return normalized as IssuePriority;
  }
  return undefined;
};

const calculateListPosition = async (projectId: number, status: IssueStatus): Promise<number> => {
  const issues = await Issue.findBy({ projectId, status });
  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};

const buildIssueContext = (issues: Issue[]): IssueSummary[] =>
  issues.map(issue => ({
    id: issue.id,
    title: issue.title,
    type: issue.type,
    status: issue.status,
    priority: issue.priority,
  }));

const parseAiResponse = (content: string): AiChatResult => {
  const parsed = JSON.parse(content) as AiChatResult;

  if (!parsed || typeof parsed.reply !== 'string' || !Array.isArray(parsed.actions)) {
    throw new Error('Invalid AI response format');
  }

  return parsed;
};

const callOpenAi = async (
  message: string,
  history: ChatMessage[],
  issues: IssueSummary[],
): Promise<AiChatResult> => {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const apiKey = openRouterKey || openAiKey;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY or OPENAI_API_KEY is not configured');
  }

  const useOpenRouter = Boolean(openRouterKey);
  const apiUrl = useOpenRouter
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  const model = useOpenRouter
    ? process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
    : process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const issueLines =
    issues.length > 0
      ? issues
          .map(
            issue =>
              `#${issue.id} "${issue.title}" [${issue.status}] type=${issue.type} priority=${issue.priority}`,
          )
          .join('\n')
      : 'No issues yet.';

  const systemPrompt = `You are an AI assistant for a Jira-like kanban board. You help users create, update, and move issues.

Statuses: backlog, selected, inprogress, done
Types: task, bug, story
Priorities: 1 (lowest), 2 (low), 3 (medium), 4 (high), 5 (highest)

Current board issues:
${issueLines}

When the user asks to change the board, respond with JSON only:
{
  "reply": "short friendly confirmation",
  "actions": [
    { "action": "create", "title": "Issue title", "type": "task", "status": "backlog", "priority": "3", "description": "optional" },
    { "action": "update", "issueId": 1, "title": "New title", "priority": "4" },
    { "action": "move", "issueId": 1, "status": "inprogress" }
  ]
}

Rules:
- Use issue IDs from the current board context.
- Support multiple actions in one response when requested.
- If the user is only asking a question, return an empty actions array.
- Never invent issue IDs that are not listed above.`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(useOpenRouter
        ? {
            'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:8080',
            'X-Title': process.env.OPENROUTER_APP_NAME || 'Jira Clone',
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      // OpenAI API field name
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-8).map(entry => ({ role: entry.role, content: entry.content })),
        { role: 'user', content: message },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI request failed: ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI returned an empty response');
  }

  return parseAiResponse(content);
};

const findIssueByReference = (
  issues: IssueSummary[],
  reference: string,
): IssueSummary | undefined => {
  const trimmed = reference.trim().toLowerCase();

  const byId = issues.find(issue => String(issue.id) === trimmed.replace(/^#/, ''));
  if (byId) return byId;

  return issues.find(
    issue => issue.title.toLowerCase() === trimmed || issue.title.toLowerCase().includes(trimmed),
  );
};

const parseRuleBasedActions = (message: string, issues: IssueSummary[]): AiChatResult => {
  const actions: AiAction[] = [];
  const lower = message.toLowerCase();

  const createRegex = /create\s+(?:a\s+)?(?:(task|bug|story)\s+)?(?:called|named|titled|with title)?\s*["']?([^"'\n]+?)["']?(?:\s+in\s+(backlog|selected(?:\s+for\s+development)?|in\s*progress|done))?$/i;
  const createMatch = createRegex.exec(message);
  if (createMatch) {
    const [, type, title, statusText] = createMatch;
    actions.push({
      action: 'create',
      title: title.trim(),
      type: normalizeType(type) || IssueType.TASK,
      status: normalizeStatus(statusText) || IssueStatus.BACKLOG,
      priority: IssuePriority.MEDIUM,
    });
  }

  const moveMatches = message.matchAll(
    /move\s+(?:issue\s+)?#?(\d+|[\w\s-]+?)\s+to\s+(backlog|selected(?:\s+for\s+development)?|in\s*progress|done)/gi,
  );
  for (const match of moveMatches) {
    const [, issueRef, statusText] = match;
    const issue = /^\d+$/.test(issueRef)
      ? issues.find(item => item.id === Number(issueRef))
      : findIssueByReference(issues, issueRef);
    const status = normalizeStatus(statusText);

    if (issue && status) {
      actions.push({ action: 'move', issueId: issue.id, status });
    }
  }

  const renameRegex = /(?:rename|update|change)\s+(?:issue\s+)?#?(\d+)\s+(?:title\s+)?to\s+["']?([^"'\n]+)["']?/i;
  const renameMatch = renameRegex.exec(message);
  if (renameMatch) {
    const [, issueId, title] = renameMatch;
    actions.push({ action: 'update', issueId: Number(issueId), title: title.trim() });
  }

  const priorityRegex = /set\s+priority\s+of\s+(?:issue\s+)?#?(\d+)\s+to\s+(highest|high|medium|low|lowest|\d)/i;
  const priorityMatch = priorityRegex.exec(message);
  if (priorityMatch) {
    const [, issueId, priorityText] = priorityMatch;
    const priority = normalizePriority(priorityText);
    if (priority) {
      actions.push({ action: 'update', issueId: Number(issueId), priority });
    }
  }

  if (actions.length > 0) {
    const summary = actions
      .map(action => {
        if (action.action === 'create') return `created "${action.title}"`;
        if (action.action === 'move') return `moved #${action.issueId} to ${action.status}`;
        if (action.action === 'update' && action.title) return `renamed #${action.issueId}`;
        if (action.action === 'update' && action.priority)
          return `updated priority of #${action.issueId}`;
        return `updated #${(action as { issueId: number }).issueId}`;
      })
      .join(', ');

    return { reply: `Done — ${summary}.`, actions };
  }

  if (lower.includes('help') || lower.includes('what can you')) {
    return {
      reply:
        'I can create, edit, and move issues. Try: "Create a bug called Fix login error", "Move issue 1 to in progress", or "Rename issue 2 to Deploy release".',
      actions: [],
    };
  }

  return {
    reply:
      'I can help manage board issues. Try commands like "Create a task called Write docs", "Move issue 3 to done", or "Set priority of issue 2 to high". Add OPENROUTER_API_KEY or OPENAI_API_KEY in api/.env for natural-language chat.',
    actions: [],
  };
};

export const planAiChat = async (
  message: string,
  history: ChatMessage[],
  issues: IssueSummary[],
): Promise<AiChatResult> => {
  try {
    return await callOpenAi(message, history, issues);
  } catch (_error) {
    return parseRuleBasedActions(message, issues);
  }
};

export const executeAiActions = async (
  actions: AiAction[],
  projectId: number,
  reporterId: number,
): Promise<Issue[]> => {
  const updatedIssues: Issue[] = [];

  for (const action of actions) {
    if (action.action === 'create') {
      const status = action.status || IssueStatus.BACKLOG;
      const listPosition = await calculateListPosition(projectId, status);
      const issue = await createEntity(Issue, {
        title: action.title,
        type: action.type || IssueType.TASK,
        status,
        priority: action.priority || IssuePriority.MEDIUM,
        description: action.description || null,
        descriptionText: action.description || null,
        projectId,
        reporterId,
        listPosition,
      });
      updatedIssues.push(issue);
    } else if (action.action === 'move') {
      const listPosition = await calculateListPosition(projectId, action.status);
      const issue = await updateEntity(Issue, action.issueId, {
        status: action.status,
        listPosition,
      });
      updatedIssues.push(issue);
    } else {
      const updateFields: Partial<Issue> = {};
      if (action.title) updateFields.title = action.title;
      if (action.type) updateFields.type = action.type;
      if (action.priority) updateFields.priority = action.priority;
      if (action.description !== undefined) {
        updateFields.description = action.description;
        updateFields.descriptionText = action.description;
      }
      if (action.status) {
        updateFields.status = action.status;
        updateFields.listPosition = await calculateListPosition(projectId, action.status);
      }

      const issue = await updateEntity(Issue, action.issueId, updateFields);
      updatedIssues.push(issue);
    }
  }
  return updatedIssues;
};

export const getProjectIssueSummaries = async (projectId: number): Promise<IssueSummary[]> => {
  const issues = await Issue.findBy({ projectId });
  return buildIssueContext(issues);
};
