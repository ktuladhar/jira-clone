import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';

import { isCalendarFilterActive } from './CalendarFilter/utils';
import CalendarFilter from './CalendarFilter';

import {
  Filters,
  SearchInput,
  Avatars,
  AvatarIsActiveBorder,
  StyledAvatar,
  StyledButton,
  ClearAll,
} from './Styles';

const propTypes = {
  issues: PropTypes.array.isRequired,
  projectUsers: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
};

const ProjectBoardFilters = ({ issues, projectUsers, defaultFilters, filters, mergeFilters }) => {
  const { searchTerm, userIds, myOnly, calendar, recent } = filters;

  const areFiltersCleared =
    !searchTerm && userIds.length === 0 && !myOnly && !isCalendarFilterActive(calendar) && !recent;

  return (
    <Filters data-testid="board-filters">
      <SearchInput
        icon="search"
        value={searchTerm}
        onChange={value => mergeFilters({ searchTerm: value })}
      />
      <Avatars>
        {projectUsers.map(user => (
          <AvatarIsActiveBorder key={user.id} isActive={userIds.includes(user.id)}>
            <StyledAvatar
              avatarUrl={user.avatarUrl}
              name={user.name}
              onClick={() => mergeFilters({ userIds: xor(userIds, [user.id]) })}
            />
          </AvatarIsActiveBorder>
        ))}
      </Avatars>
      <StyledButton
        variant="empty"
        isActive={myOnly}
        onClick={() => mergeFilters({ myOnly: !myOnly })}
      >
        Only My Issues
      </StyledButton>
      <CalendarFilter
        issues={issues}
        projectUsers={projectUsers}
        calendar={calendar}
        mergeFilters={mergeFilters}
      />
      <StyledButton
        variant="empty"
        isActive={recent}
        onClick={() => mergeFilters({ recent: !recent })}
      >
        Recently Updated
      </StyledButton>
      {!areFiltersCleared && (
        <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear all</ClearAll>
      )}
    </Filters>
  );
};

ProjectBoardFilters.propTypes = propTypes;

export default ProjectBoardFilters;
