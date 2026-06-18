import { catchErrors, BadUserInputError } from 'errors';
import { executeAiActions, getProjectIssueSummaries, planAiChat } from 'services/aiChat';

export const chat = catchErrors(async (req, res) => {
  const { projectId, id: reporterId } = req.currentUser;
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    throw new BadUserInputError({ message: 'Message is required.' });
  }

  const issues = await getProjectIssueSummaries(projectId);
  const plan = await planAiChat(message, history, issues);
  const changedIssues =
    plan.actions.length > 0 ? await executeAiActions(plan.actions, projectId, reporterId) : [];

  res.respond({
    reply: plan.reply,
    actions: plan.actions,
    issues: changedIssues,
  });
});
