import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  size: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  className: PropTypes.string,
};

const defaultProps = {
  size: 25,
  top: 0,
  left: 0,
  className: undefined,
};

const Svg = styled.svg`
  display: block;
  flex-shrink: 0;
  ${props =>
    props.$left || props.$top ? `transform: translate(${props.$left}px, ${props.$top}px);` : ''}
`;

const AiChatIcon = ({ size, top, left, className }) => (
  <Svg
    className={className}
    $top={top}
    $left={left}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="icon:ai-chat"
    aria-hidden="true"
  >
    <path
      d="M12 3.5L13.35 9.15L19 10.5L13.35 11.85L12 17.5L10.65 11.85L5 10.5L10.65 9.15L12 3.5Z"
      fill="currentColor"
    />
    <path
      d="M18.25 4.25L18.75 6.35L20.85 6.85L18.75 7.35L18.25 9.45L17.75 7.35L15.65 6.85L17.75 6.35L18.25 4.25Z"
      fill="currentColor"
      opacity="0.75"
    />
    <path
      d="M6.25 15.75L6.65 17.35L8.25 17.75L6.65 18.15L6.25 19.75L5.85 18.15L4.25 17.75L5.85 17.35L6.25 15.75Z"
      fill="currentColor"
      opacity="0.55"
    />
  </Svg>
);

AiChatIcon.propTypes = propTypes;
AiChatIcon.defaultProps = defaultProps;

export default AiChatIcon;
