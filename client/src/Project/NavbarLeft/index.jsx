import React from 'react';
import PropTypes from 'prop-types';

import { Icon, AboutTooltip, AiChatIcon } from 'shared/components';

import {
  NavLeft,
  LogoLink,
  StyledLogo,
  Bottom,
  Item,
  AiItem,
  AiIconWrap,
  ItemText,
} from './Styles';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
  aiChatModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ issueSearchModalOpen, issueCreateModalOpen, aiChatModalOpen }) => (
  <NavLeft>
    <LogoLink to="/">
      <StyledLogo color="#fff" />
    </LogoLink>

    <Item onClick={issueSearchModalOpen}>
      <Icon type="search" size={22} top={1} left={3} />
      <ItemText>Search issues</ItemText>
    </Item>

    <Item onClick={issueCreateModalOpen}>
      <Icon type="plus" size={27} />
      <ItemText>Create Issue</ItemText>
    </Item>

    <Bottom>
      <AiItem onClick={aiChatModalOpen} data-testid="navbar:ai-chat">
        <AiIconWrap>
          <AiChatIcon size={25} />
        </AiIconWrap>
        <ItemText>AI Assistant</ItemText>
      </AiItem>

      <AboutTooltip
        placement="right"
        offset={{ top: -218 }}
        renderLink={linkProps => (
          <Item {...linkProps}>
            <Icon type="help" size={25} />
            <ItemText>About</ItemText>
          </Item>
        )}
      />
    </Bottom>
  </NavLeft>
);

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;
