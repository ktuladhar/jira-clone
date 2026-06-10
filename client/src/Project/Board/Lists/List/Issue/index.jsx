import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { IssueTypeIcon, IssuePriorityIcon, Icon } from 'shared/components';
import { formatDueDateShort, isPastDue } from 'shared/utils/dateTime';

import {
  IssueLink,
  Issue,
  Title,
  Bottom,
  BottomLeft,
  DueDate,
  Assignees,
  AssigneeAvatar,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  issue: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

const ProjectBoardListIssue = ({ projectUsers, issue, index }) => {
  const match = useRouteMatch();

  const assignees = issue.userIds.map(userId => projectUsers.find(user => user.id === userId));

  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided, snapshot) => (
        <IssueLink
          to={`${match.url}/issues/${issue.id}`}
          ref={provided.innerRef}
          data-testid="list-issue"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Issue isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating}>
            <Title>{issue.title}</Title>
            <Bottom>
              <BottomLeft>
                <IssueTypeIcon type={issue.type} />
                <IssuePriorityIcon priority={issue.priority} top={-1} left={4} />
                {issue.dueDate && (
                  <DueDate isOverdue={isPastDue(issue.dueDate, issue.status)}>
                    <Icon type="calendar" />
                    {formatDueDateShort(issue.dueDate)}
                  </DueDate>
                )}
              </BottomLeft>
              <Assignees>
                {assignees.map(user => (
                  <AssigneeAvatar
                    key={user.id}
                    size={24}
                    avatarUrl={user.avatarUrl}
                    name={user.name}
                  />
                ))}
              </Assignees>
            </Bottom>
          </Issue>
        </IssueLink>
      )}
    </Draggable>
  );
};

ProjectBoardListIssue.propTypes = propTypes;

export default ProjectBoardListIssue;
