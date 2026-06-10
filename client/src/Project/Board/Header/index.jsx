import React from 'react';

import { Button } from 'shared/components';

import { Header, BoardName } from './Styles';

const REPO_URL = 'https://github.com/ktuladhar/jira-clone';

const ProjectBoardHeader = () => (
  <Header>
    <BoardName>Kanban board</BoardName>
    <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
      <Button icon="github">Github Repo</Button>
    </a>
  </Header>
);

export default ProjectBoardHeader;
