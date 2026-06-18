import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import useApi from 'shared/hooks/api';
import toast from 'shared/utils/toast';
import { AiChatIcon, Icon } from 'shared/components';

import {
  Chat,
  ChatHeader,
  HeaderTop,
  HeaderIcon,
  HeaderText,
  ChatTitle,
  ChatSubtitle,
  ProjectBadge,
  Messages,
  MessageRow,
  MessageLabel,
  Message,
  ActionsSummary,
  ActionPill,
  Composer,
  ComposerBox,
  ComposerInput,
  SendButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  HintGrid,
  HintChip,
  TypingBubble,
  TypingDots,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

const HINTS = [
  'Add a task called Plan the team meeting',
  'Move task 1 to Done',
  'Rename task 2 to Send weekly update',
  'Add a task called Fix broken login button',
];

const formatAction = action => {
  if (action.action === 'create') return { type: 'create', label: `Created "${action.title}"` };
  if (action.action === 'move')
    return { type: 'move', label: `Moved #${action.issueId} to ${action.status}` };
  if (action.action === 'update' && action.title)
    return { type: 'update', label: `Renamed #${action.issueId}` };
  if (action.action === 'update' && action.priority) {
    return { type: 'update', label: `Updated priority of #${action.issueId}` };
  }
  return { type: 'update', label: `Updated #${action.issueId}` };
};

const ProjectAiChat = ({ project, fetchProject }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [{ isCreating }, sendChat] = useApi.post('/ai/chat');

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCreating]);

  const handleSend = async (messageText = input) => {
    const trimmed = (messageText || '').trim();
    if (!trimmed || isCreating) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');

    try {
      const response = await sendChat({
        message: trimmed,
        history: messages,
      });

      if (response.actions && response.actions.length) {
        await fetchProject();
      }

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: response.reply,
          actions: response.actions || [],
        },
      ]);
    } catch (error) {
      toast.error(error);
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Sorry, I could not process that request. Please try again.',
          actions: [],
        },
      ]);
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleHintClick = hint => {
    setInput(hint);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Chat>
      <ChatHeader>
        <HeaderTop>
          <HeaderIcon>
            <AiChatIcon size={22} />
          </HeaderIcon>
          <HeaderText>
            <ChatTitle>AI Assistant</ChatTitle>
            <ChatSubtitle>Create, edit, and move board issues with natural language.</ChatSubtitle>
          </HeaderText>
        </HeaderTop>
        <ProjectBadge>{project.name}</ProjectBadge>
      </ChatHeader>

      <Messages>
        {messages.length === 0 && (
          <EmptyState>
            <EmptyIcon>
              <AiChatIcon size={28} />
            </EmptyIcon>
            <EmptyTitle>How can I help?</EmptyTitle>
            <EmptyText>
              No Jira experience needed — just say what you want in everyday language. Add tasks,
              move them to a different column, or rename them. You can combine a few changes in one
              message.
            </EmptyText>
            <HintGrid>
              {HINTS.map(hint => (
                <HintChip key={hint} type="button" onClick={() => handleHintClick(hint)}>
                  {hint}
                </HintChip>
              ))}
            </HintGrid>
          </EmptyState>
        )}

        {messages.map((entry, index) => {
          const isUser = entry.role === 'user';

          return (
            <MessageRow key={`${entry.role}-${index}`} isUser={isUser}>
              <MessageLabel>{isUser ? 'You' : 'AI Assistant'}</MessageLabel>
              <Message isUser={isUser}>
                {entry.content}
                {entry.actions && entry.actions.length > 0 && (
                  <ActionsSummary>
                    {entry.actions.map((action, actionIndex) => {
                      const formatted = formatAction(action);
                      return (
                        <ActionPill key={`${formatted.label}-${actionIndex}`} type={formatted.type}>
                          {formatted.label}
                        </ActionPill>
                      );
                    })}
                  </ActionsSummary>
                )}
              </Message>
            </MessageRow>
          );
        })}

        {isCreating && (
          <MessageRow isUser={false}>
            <MessageLabel>AI Assistant</MessageLabel>
            <TypingBubble isUser={false}>
              <TypingDots>
                <span />
                <span />
                <span />
              </TypingDots>
            </TypingBubble>
          </MessageRow>
        )}
        <div ref={messagesEndRef} />
      </Messages>

      <Composer>
        <ComposerBox>
          <ComposerInput
            ref={inputRef}
            value={input}
            rows={1}
            placeholder="Try: Add a task called… or Move task 1 to Done"
            onChange={event => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <SendButton
            type="button"
            disabled={!input.trim() || isCreating}
            onClick={() => handleSend()}
          >
            <Icon type="arrow-up" size={18} />
          </SendButton>
        </ComposerBox>
      </Composer>
    </Chat>
  );
};

ProjectAiChat.propTypes = propTypes;

export default ProjectAiChat;
