import React from 'react';

import { Button } from 'shared/components';

import { Header, BoardName } from './Styles';

const UPSTREAM_REPO_URL = 'https://github.com/oldboyxx/jira_clone';

const ProjectBoardHeader = () => (
  <Header>
    <BoardName>Kanban board</BoardName>
    <a href={UPSTREAM_REPO_URL} target="_blank" rel="noreferrer noopener">
      <Button icon="github">Github Repo</Button>
    </a>
  </Header>
);

export default ProjectBoardHeader;
