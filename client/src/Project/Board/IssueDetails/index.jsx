import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import api from 'shared/utils/api';
import { getViewMonthKey } from 'Project/Board/Filters/CalendarFilter/utils';
import useApi from 'shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'shared/components';

import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import DueDate from './DueDate';
import Dates from './Dates';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';

const propTypes = {
  issueId: PropTypes.string.isRequired,
  projectUsers: PropTypes.array.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
  mergeFilters: PropTypes.func.isRequired,
  calendarFilters: PropTypes.object.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetails = ({
  issueId,
  projectUsers,
  fetchProject,
  updateLocalProjectIssues,
  mergeFilters,
  calendarFilters,
  modalClose,
}) => {
  const [{ data, error, setLocalData }, fetchIssue] = useApi.get(`/issues/${issueId}`);

  if (!data) return <Loader />;
  if (error) return <PageError />;

  const { issue } = data;

  const updateLocalIssueDetails = fields =>
    setLocalData(currentData => ({ issue: { ...currentData.issue, ...fields } }));

  const updateIssue = updatedFields => {
    api.optimisticUpdate(`/issues/${issueId}`, {
      updatedFields,
      currentFields: issue,
      setLocalData: fields => {
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(issue.id, fields);

        if (Object.prototype.hasOwnProperty.call(fields, 'dueDate')) {
          const calendarUpdates = { ...calendarFilters };

          if (fields.dueDate) {
            calendarUpdates.viewMonthKey = getViewMonthKey(fields.dueDate);
          }

          mergeFilters({ calendar: calendarUpdates });
        }
      },
    });
  };

  return (
    <Fragment>
      <TopActions>
        <Type issue={issue} updateIssue={updateIssue} />
        <TopActionsRight>
          <AboutTooltip
            renderLink={linkProps => (
              <Button icon="feedback" variant="empty" {...linkProps}>
                Give feedback
              </Button>
            )}
          />
          <CopyLinkButton variant="empty" />
          <Delete issue={issue} fetchProject={fetchProject} modalClose={modalClose} />
          <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <Left>
          <Title issue={issue} updateIssue={updateIssue} />
          <Description issue={issue} updateIssue={updateIssue} />
          <Comments issue={issue} fetchIssue={fetchIssue} />
        </Left>
        <Right>
          <Status issue={issue} updateIssue={updateIssue} />
          <AssigneesReporter issue={issue} updateIssue={updateIssue} projectUsers={projectUsers} />
          <Priority issue={issue} updateIssue={updateIssue} />
          <EstimateTracking issue={issue} updateIssue={updateIssue} />
          <DueDate issue={issue} updateIssue={updateIssue} />
          <Dates issue={issue} />
        </Right>
      </Content>
    </Fragment>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;

export default ProjectBoardIssueDetails;
