import moment from 'moment';
import { intersection, times } from 'lodash';

export const MONTH_OPTIONS = times(12, index => ({
  value: index + 1,
  label: moment()
    .month(index)
    .format('MMMM'),
}));

export const getYearOptions = issues => {
  const currentYear = moment().year();
  const years = new Set([currentYear]);

  issues.forEach(issue => {
    if (issue.dueDate) {
      years.add(moment(issue.dueDate).year());
    }
  });

  const minYear = Math.min(...years, currentYear - 5);
  const maxYear = Math.max(...years, currentYear + 5);

  return times(maxYear - minYear + 1, index => {
    const year = minYear + index;
    return { value: year, label: String(year) };
  });
};

export const buildViewMonthKey = (year, month) =>
  moment()
    .year(year)
    .month(month - 1)
    .startOf('month')
    .format('YYYY-MM');

export const defaultCalendarFilters = {
  selectedDate: null,
  viewMonthKey: moment().format('YYYY-MM'),
  searchTerm: '',
  assigneeIds: [],
  types: [],
  statuses: [],
  priorities: [],
  unscheduledOnly: false,
};

export const getViewMonthKey = dateKey =>
  moment(dateKey || undefined)
    .startOf('month')
    .format('YYYY-MM');

export const isCalendarFilterActive = calendar =>
  Boolean(
    calendar &&
      (calendar.selectedDate ||
        calendar.unscheduledOnly ||
        calendar.searchTerm ||
        calendar.assigneeIds.length > 0 ||
        calendar.types.length > 0 ||
        calendar.statuses.length > 0 ||
        calendar.priorities.length > 0),
  );

export const applyCalendarFilters = (issues, calendar) => {
  if (!isCalendarFilterActive(calendar)) return issues;

  let filtered = issues;

  if (calendar.unscheduledOnly) {
    filtered = filtered.filter(issue => !issue.dueDate);
  } else if (calendar.selectedDate) {
    filtered = filtered.filter(
      issue => issue.dueDate && moment(issue.dueDate).isSame(calendar.selectedDate, 'day'),
    );
  }

  if (calendar.searchTerm) {
    const term = calendar.searchTerm.toLowerCase();
    filtered = filtered.filter(issue => issue.title.toLowerCase().includes(term));
  }

  if (calendar.assigneeIds.length > 0) {
    filtered = filtered.filter(
      issue => intersection(issue.userIds, calendar.assigneeIds).length > 0,
    );
  }

  if (calendar.types.length > 0) {
    filtered = filtered.filter(issue => calendar.types.includes(issue.type));
  }

  if (calendar.statuses.length > 0) {
    filtered = filtered.filter(issue => calendar.statuses.includes(issue.status));
  }

  if (calendar.priorities.length > 0) {
    filtered = filtered.filter(issue => calendar.priorities.includes(issue.priority));
  }

  return filtered;
};

export const getIssuesForCalendarDay = (issues, date, calendar) => {
  const dayIssues = issues.filter(
    issue => issue.dueDate && moment(issue.dueDate).isSame(date, 'day'),
  );

  return applyCalendarFilters(dayIssues, {
    ...calendar,
    selectedDate: null,
    unscheduledOnly: false,
  });
};
