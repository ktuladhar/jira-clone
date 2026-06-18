import styled, { keyframes } from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const Chat = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f9fc 0%, #fff 180px);
`;

export const ChatHeader = styled.div`
  padding: 28px 28px 20px;
  border-bottom: 1px solid ${color.borderLightest};
  background: #fff;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6554c0 0%, #0052cc 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 82, 204, 0.22);
`;

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatTitle = styled.div`
  color: ${color.textDarkest};
  ${font.medium}
  ${font.size(20)}
`;

export const ChatSubtitle = styled.div`
  margin-top: 4px;
  color: ${color.textMedium};
  ${font.size(13)}
`;

export const ProjectBadge = styled.div`
  display: inline-block;
  margin-top: 14px;
  padding: 5px 10px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  ${font.medium}
  ${font.size(11.5)}
`;

export const Messages = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 24px;
  overflow-y: auto;
  ${mixin.scrollableY}
`;

export const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  gap: 6px;
`;

export const MessageLabel = styled.div`
  padding: 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${color.textLight};
  ${font.bold}
  ${font.size(10.5)}
`;

export const Message = styled.div`
  max-width: 88%;
  padding: 12px 14px;
  border-radius: ${props => (props.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px')};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  background: ${props => (props.isUser ? color.primary : '#fff')};
  color: ${props => (props.isUser ? '#fff' : color.textDarkest)};
  border: ${props => (props.isUser ? 'none' : `1px solid ${color.borderLightest}`)};
  box-shadow: ${props =>
    props.isUser ? '0 4px 12px rgba(0, 82, 204, 0.18)' : '0 1px 3px rgba(9, 30, 66, 0.06)'};
`;

export const ActionsSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

export const ActionPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${props => actionPillColors[props.type] || color.backgroundLight};
  color: ${props => actionPillTextColors[props.type] || color.textDark};
  ${font.medium}
  ${font.size(11)}
`;

const actionPillColors = {
  create: color.backgroundLightSuccess,
  move: color.backgroundLightPrimary,
  update: color.secondary,
};

const actionPillTextColors = {
  create: color.success,
  move: color.primary,
  update: color.textDark,
};

export const Composer = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid ${color.borderLightest};
  background: #fff;
`;

export const ComposerBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 10px 10px 10px 14px;
  border: 1px solid ${color.borderLight};
  border-radius: 12px;
  background: ${color.backgroundLightest};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus-within {
    border-color: ${color.borderInputFocus};
    box-shadow: 0 0 0 3px rgba(76, 154, 255, 0.15);
    background: #fff;
  }
`;

export const ComposerInput = styled.textarea`
  flex: 1;
  min-height: 24px;
  max-height: 120px;
  resize: none;
  padding: 4px 0;
  border: none;
  background: transparent;
  color: ${color.textDarkest};
  ${font.size(14)}
  line-height: 1.45;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${color.textLight};
  }
`;

export const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #6554c0 0%, #0052cc 100%);
  color: #fff;
  ${mixin.clickable}
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    transform: scale(1.04);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px 8px 24px;
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(101, 84, 192, 0.12) 0%, rgba(0, 82, 204, 0.12) 100%);
  color: ${color.primary};
`;

export const EmptyTitle = styled.div`
  color: ${color.textDarkest};
  ${font.medium}
  ${font.size(18)}
`;

export const EmptyText = styled.div`
  margin-top: 8px;
  max-width: 300px;
  color: ${color.textMedium};
  line-height: 1.55;
  ${font.size(14)}
`;

export const HintGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 340px;
  margin-top: 20px;
`;

export const HintChip = styled.button`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid ${color.borderLightest};
  border-radius: 10px;
  background: #fff;
  color: ${color.textDark};
  text-align: left;
  line-height: 1.4;
  ${font.size(13)}
  ${mixin.clickable}
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: ${color.borderInputFocus};
    background: ${color.backgroundLightPrimary};
    transform: translateY(-1px);
  }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
  40% { transform: translateY(-4px); opacity: 1; }
`;

export const TypingBubble = styled(Message)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
`;

export const TypingDots = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${color.textLight};
    animation: ${bounce} 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
`;
