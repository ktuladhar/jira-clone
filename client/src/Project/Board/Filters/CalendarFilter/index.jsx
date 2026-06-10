import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { range, times } from 'lodash';

import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import {
  IssueType,
  IssueStatus,
  IssuePriority,
  IssueTypeCopy,
  IssueStatusCopy,
  IssuePriorityCopy,
} from 'shared/constants/issues';
import { formatDate } from 'shared/utils/dateTime';
import { Select, Button, Icon } from 'shared/components';

import {
  defaultCalendarFilters,
  isCalendarFilterActive,
  getIssuesForCalendarDay,
  getViewMonthKey,
  MONTH_OPTIONS,
  getYearOptions,
  buildViewMonthKey,
} from './utils';
import {
  CalendarFilterContainer,
  CalendarPanel,
  PANEL_WIDTH,
  Toolbar,
  ToolbarRow,
  SearchInput,
  FilterSelect,
  ToolbarSpacer,
  MonthNavigation,
  MonthLabel,
  NavButton,
  MonthYearSelect,
  CalendarGridWrapper,
  CalendarGrid,
  WeekHeader,
  WeekDay,
  DaysGrid,
  DayCell,
  DayNumber,
  IssueDots,
  IssueDot,
  IssueCount,
  PanelFooter,
  UnscheduledButton,
} from './Styles';

const propTypes = {
  issues: PropTypes.array.isRequired,
  projectUsers: PropTypes.array.isRequired,
  calendar: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
};

const CalendarFilter = ({ issues, projectUsers, calendar, mergeFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState(null);
  const viewMonthKey = calendar.viewMonthKey || getViewMonthKey(calendar.selectedDate);
  const $triggerRef = useRef();
  const $panelRef = useRef();
  const $calendarGridRef = useRef();

  useOnOutsideClick([$triggerRef, $panelRef], isOpen, () => setIsOpen(false));

  const calculatePanelPosition = useCallback(() => {
    if (!$triggerRef.current) return null;

    const rect = $triggerRef.current.getBoundingClientRect();
    const centeredLeft = rect.left + rect.width / 2 - PANEL_WIDTH / 2;
    const clampedLeft = Math.max(8, Math.min(centeredLeft, window.innerWidth - PANEL_WIDTH - 8));

    return {
      top: rect.bottom + 8,
      left: clampedLeft,
    };
  }, []);

  const openPanel = () => {
    if (!calendar.viewMonthKey) {
      mergeFilters({
        calendar: {
          ...calendar,
          viewMonthKey: getViewMonthKey(calendar.selectedDate),
        },
      });
    }
    setPanelPosition(calculatePanelPosition());
    setIsOpen(true);
  };

  const togglePanel = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    openPanel();
  };

  const updateCalendar = updates =>
    mergeFilters({
      calendar: {
        ...calendar,
        ...updates,
      },
    });

  const handleDaySelect = date => {
    const dateKey = date.format('YYYY-MM-DD');
    const isSelected = calendar.selectedDate === dateKey;

    updateCalendar({
      selectedDate: isSelected ? null : dateKey,
      unscheduledOnly: false,
    });
  };

  const handleToday = () => {
    const today = moment();
    navigateToViewMonth(today.format('YYYY-MM'));
    updateCalendar({
      selectedDate: today.format('YYYY-MM-DD'),
      unscheduledOnly: false,
    });
  };

  const navigateToViewMonth = newViewMonthKey => {
    mergeFilters({
      calendar: {
        ...calendar,
        viewMonthKey: newViewMonthKey,
      },
    });
    requestAnimationFrame(() => {
      if ($calendarGridRef.current) {
        $calendarGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  };

  const handlePrevMonth = event => {
    event.stopPropagation();
    navigateToViewMonth(
      moment(viewMonthKey, 'YYYY-MM')
        .subtract(1, 'month')
        .format('YYYY-MM'),
    );
  };

  const handleNextMonth = event => {
    event.stopPropagation();
    navigateToViewMonth(
      moment(viewMonthKey, 'YYYY-MM')
        .add(1, 'month')
        .format('YYYY-MM'),
    );
  };

  const handleMonthSelect = month => {
    navigateToViewMonth(buildViewMonthKey(viewMonth.year(), month));
  };

  const handleYearSelect = year => {
    navigateToViewMonth(buildViewMonthKey(year, viewMonth.month() + 1));
  };

  const handleUnscheduled = () => {
    updateCalendar({
      unscheduledOnly: !calendar.unscheduledOnly,
      selectedDate: null,
    });
  };

  const handleClearCalendar = () => {
    mergeFilters({ calendar: { ...defaultCalendarFilters } });
  };

  const isActive = isCalendarFilterActive(calendar);
  const viewMonth = moment(viewMonthKey, 'YYYY-MM');
  const yearOptions = getYearOptions(issues);
  const selectedMonth = viewMonth.month() + 1;
  const selectedYear = viewMonth.year();
  const weekDays = moment.weekdaysShort(true);
  const monthStart = viewMonth.clone().startOf('month');
  const fillerBefore = monthStart.diff(monthStart.clone().startOf('week'), 'days');
  const monthDays = times(monthStart.daysInMonth(), i => monthStart.clone().add(i, 'days'));
  const monthEnd = monthStart.clone().endOf('month');
  const fillerAfter = monthEnd
    .clone()
    .endOf('week')
    .diff(monthEnd, 'days');

  const renderPanel = () => (
    <div ref={$panelRef}>
      <CalendarPanel
        $top={panelPosition.top}
        $left={panelPosition.left}
        data-testid="calendar-filter-panel"
      >
        <Toolbar>
          <ToolbarRow>
            <SearchInput
              icon="search"
              placeholder="Search calendar"
              value={calendar.searchTerm}
              onChange={value => updateCalendar({ searchTerm: value })}
            />
            <FilterSelect>
              <Select
                isMulti
                variant="normal"
                placeholder="Assignee"
                value={calendar.assigneeIds}
                options={projectUsers.map(user => ({ value: user.id, label: user.name }))}
                onChange={assigneeIds => updateCalendar({ assigneeIds })}
              />
            </FilterSelect>
            <FilterSelect>
              <Select
                isMulti
                variant="normal"
                placeholder="Type"
                value={calendar.types}
                options={Object.values(IssueType).map(type => ({
                  value: type,
                  label: IssueTypeCopy[type],
                }))}
                onChange={types => updateCalendar({ types })}
              />
            </FilterSelect>
            <FilterSelect>
              <Select
                isMulti
                variant="normal"
                placeholder="Status"
                value={calendar.statuses}
                options={Object.values(IssueStatus).map(status => ({
                  value: status,
                  label: IssueStatusCopy[status],
                }))}
                onChange={statuses => updateCalendar({ statuses })}
              />
            </FilterSelect>
            <FilterSelect>
              <Select
                isMulti
                variant="normal"
                placeholder="More filters"
                value={calendar.priorities}
                options={Object.values(IssuePriority).map(priority => ({
                  value: priority,
                  label: IssuePriorityCopy[priority],
                }))}
                onChange={priorities => updateCalendar({ priorities })}
              />
            </FilterSelect>
          </ToolbarRow>

          <ToolbarRow>
            <Button variant="empty" onClick={handleToday}>
              Today
            </Button>
            <MonthNavigation>
              <NavButton type="button" onClick={handlePrevMonth} aria-label="Previous month">
                <Icon type="arrow-left" />
              </NavButton>
              <MonthLabel>{formatDate(viewMonth, 'MMM YYYY')}</MonthLabel>
              <NavButton type="button" onClick={handleNextMonth} aria-label="Next month">
                <Icon type="arrow-right" />
              </NavButton>
            </MonthNavigation>
            <ToolbarSpacer />
            <MonthYearSelect>
              <Select
                variant="normal"
                withClearValue={false}
                placeholder="Month"
                value={selectedMonth}
                options={MONTH_OPTIONS}
                onChange={handleMonthSelect}
              />
            </MonthYearSelect>
            <MonthYearSelect>
              <Select
                variant="normal"
                withClearValue={false}
                placeholder="Year"
                value={selectedYear}
                options={yearOptions}
                onChange={handleYearSelect}
              />
            </MonthYearSelect>
            {isActive && (
              <Button variant="empty" onClick={handleClearCalendar}>
                Clear calendar
              </Button>
            )}
          </ToolbarRow>
        </Toolbar>

        <CalendarGridWrapper ref={$calendarGridRef}>
          <CalendarGrid>
            <WeekHeader>
              {weekDays.map(day => (
                <WeekDay key={day}>{day}</WeekDay>
              ))}
            </WeekHeader>
            <DaysGrid>
              {range(fillerBefore).map(i => (
                <DayCell key={`before-${i}`} isFiller disabled />
              ))}
              {monthDays.map(date => {
                const dateKey = date.format('YYYY-MM-DD');
                const dayIssues = getIssuesForCalendarDay(issues, date, calendar);
                const isToday = moment().isSame(date, 'day');
                const isSelected = calendar.selectedDate === dateKey;

                return (
                  <DayCell
                    key={dateKey}
                    type="button"
                    isToday={isToday}
                    isSelected={isSelected}
                    onClick={() => handleDaySelect(date)}
                  >
                    <DayNumber isToday={isToday}>{date.format('D')}</DayNumber>
                    {dayIssues.length > 0 && (
                      <React.Fragment>
                        <IssueDots>
                          {dayIssues.slice(0, 4).map(issue => (
                            <IssueDot key={issue.id} title={issue.title} />
                          ))}
                        </IssueDots>
                        <IssueCount>
                          {dayIssues.length} issue{dayIssues.length !== 1 ? 's' : ''}
                        </IssueCount>
                      </React.Fragment>
                    )}
                  </DayCell>
                );
              })}
              {range(fillerAfter).map(i => (
                <DayCell key={`after-${i}`} isFiller disabled />
              ))}
            </DaysGrid>
          </CalendarGrid>
        </CalendarGridWrapper>

        <PanelFooter>
          <UnscheduledButton
            variant="empty"
            icon="calendar"
            isActive={calendar.unscheduledOnly}
            onClick={handleUnscheduled}
          >
            Unscheduled work
          </UnscheduledButton>
        </PanelFooter>
      </CalendarPanel>
    </div>
  );

  return (
    <CalendarFilterContainer ref={$triggerRef} data-testid="calendar-filter">
      <Button variant="empty" isActive={isActive} icon="calendar" onClick={togglePanel}>
        Calendar
      </Button>

      {isOpen && panelPosition && ReactDOM.createPortal(renderPanel(), document.body)}
    </CalendarFilterContainer>
  );
};

CalendarFilter.propTypes = propTypes;

export default CalendarFilter;
