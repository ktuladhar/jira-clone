import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from 'shared/components';

import { SectionTitle } from '../Styles';
import { DueDatePicker } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsDueDate = ({ issue, updateIssue }) => (
  <Fragment>
    <SectionTitle>Due date</SectionTitle>
    <DueDatePicker>
      <DatePicker
        withTime={false}
        withClearValue
        displayFormat="DD/MM/YYYY"
        placeholder="None"
        value={issue.dueDate}
        onChange={dueDate => updateIssue({ dueDate })}
      />
    </DueDatePicker>
  </Fragment>
);

ProjectBoardIssueDetailsDueDate.propTypes = propTypes;

export default ProjectBoardIssueDetailsDueDate;
