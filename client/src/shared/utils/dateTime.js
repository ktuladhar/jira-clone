import moment from 'moment';

export const formatDate = (date, format = 'MMMM D, YYYY') =>
  date ? moment(date).format(format) : date;

export const formatDateTime = (date, format = 'MMMM D, YYYY, h:mm A') =>
  date ? moment(date).format(format) : date;

export const formatDateTimeForAPI = date =>
  date
    ? moment(date)
        .utc()
        .format()
    : date;

export const formatDateForAPI = date =>
  date
    ? moment(date)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    : null;

export const parseDisplayDate = (input, format) => {
  const parsed = moment(input, format, true);
  return parsed.isValid() ? parsed : null;
};

export const formatDateTimeConversational = date => (date ? moment(date).fromNow() : date);

export const formatDueDate = date => (date ? moment(date).format('DD/MM/YYYY') : null);

export const formatDueDateShort = date => (date ? moment(date).format('DD/MMM/YY') : null);

export const isPastDue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return moment(dueDate).isBefore(moment(), 'day');
};
