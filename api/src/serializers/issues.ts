import { pick } from 'lodash';

import { Issue } from 'entities';

export const issuePartial = (issue: Issue): Partial<Issue> =>
  pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'dueDate',
    'createdAt',
    'updatedAt',
    'userIds',
  ]);
