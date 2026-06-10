import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { times, range } from 'lodash';

import { formatDate, formatDateForAPI, formatDateTimeForAPI } from 'shared/utils/dateTime';
import Icon from 'shared/components/Icon';

import {
  DateSection,
  YearSelect,
  SelectedMonthYear,
  Grid,
  PrevNextIcons,
  DayName,
  Day,
} from './Styles';

const propTypes = {
  withTime: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
};

const defaultProps = {
  withTime: true,
  value: undefined,
};

const getInitialMonth = dateValue => {
  const date = dateValue && moment(dateValue).isValid() ? moment(dateValue) : moment();
  return date.clone().startOf('month');
};

const DatePickerDateSection = ({ withTime, value, onChange, setDropdownOpen }) => {
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth(value));

  useEffect(() => {
    setSelectedMonth(getInitialMonth(value));
  }, [value]);

  const handleYearChange = event => {
    const year = Number(event.target.value);
    if (!year) return;

    setSelectedMonth(moment(selectedMonth).set({ year }));
  };

  const handleMonthChange = addOrSubtract => {
    setSelectedMonth(moment(selectedMonth)[addOrSubtract](1, 'month'));
  };

  const handleDayChange = newDate => {
    if (withTime) {
      const existingHour = value ? moment(value).hour() : '00';
      const existingMinute = value ? moment(value).minute() : '00';
      const newDateWithExistingTime = newDate.set({
        hour: existingHour,
        minute: existingMinute,
      });
      onChange(formatDateTimeForAPI(newDateWithExistingTime));
    } else {
      onChange(formatDateForAPI(newDate));
      setDropdownOpen(false);
    }
  };

  return (
    <DateSection>
      <SelectedMonthYear>{formatDate(selectedMonth, 'MMM YYYY')}</SelectedMonthYear>

      <YearSelect value={selectedMonth.year()} onChange={handleYearChange}>
        {generateYearOptions(selectedMonth.year()).map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </YearSelect>

      <PrevNextIcons>
        <Icon type="arrow-left" onClick={() => handleMonthChange('subtract')} />
        <Icon type="arrow-right" onClick={() => handleMonthChange('add')} />
      </PrevNextIcons>

      <Grid>
        {generateWeekDayNames().map(name => (
          <DayName key={name}>{name}</DayName>
        ))}
        {generateFillerDaysBeforeMonthStart(selectedMonth).map(i => (
          <Day key={`before-${i}`} isFiller />
        ))}
        {generateMonthDays(selectedMonth).map(date => (
          <Day
            key={date}
            isToday={moment().isSame(date, 'day')}
            isSelected={value && moment(value).isValid() && moment(value).isSame(date, 'day')}
            onClick={() => handleDayChange(date)}
          >
            {formatDate(date, 'D')}
          </Day>
        ))}
        {generateFillerDaysAfterMonthEnd(selectedMonth).map(i => (
          <Day key={`after-${i}`} isFiller />
        ))}
      </Grid>
    </DateSection>
  );
};

const generateYearOptions = selectedYear => {
  const currentYear = moment().year();
  const minYear = Math.min(currentYear - 10, selectedYear);
  const maxYear = Math.max(currentYear + 10, selectedYear);

  return times(maxYear - minYear + 1, index => {
    const year = minYear + index;
    return { label: String(year), value: year };
  });
};

const generateWeekDayNames = () => moment.weekdaysMin(true);

const generateFillerDaysBeforeMonthStart = selectedMonth => {
  const count = selectedMonth.diff(moment(selectedMonth).startOf('week'), 'days');
  return range(count);
};

const generateMonthDays = selectedMonth =>
  times(selectedMonth.daysInMonth()).map(i => moment(selectedMonth).add(i, 'days'));

const generateFillerDaysAfterMonthEnd = selectedMonth => {
  const selectedMonthEnd = moment(selectedMonth).endOf('month');
  const weekEnd = moment(selectedMonthEnd).endOf('week');
  const count = weekEnd.diff(selectedMonthEnd, 'days');
  return range(count);
};

DatePickerDateSection.propTypes = propTypes;
DatePickerDateSection.defaultProps = defaultProps;

export default DatePickerDateSection;
