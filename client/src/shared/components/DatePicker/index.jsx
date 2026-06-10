import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
  formatDate,
  formatDateTime,
  formatDateForAPI,
  parseDisplayDate,
} from 'shared/utils/dateTime';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import Input from 'shared/components/Input';
import Icon from 'shared/components/Icon';

import DateSection from './DateSection';
import TimeSection from './TimeSection';
import {
  StyledDatePicker,
  Dropdown,
  InputActions,
  InputActionButton,
  ClearDateFooter,
} from './Styles';

const propTypes = {
  className: PropTypes.string,
  withTime: PropTypes.bool,
  withClearValue: PropTypes.bool,
  displayFormat: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  className: undefined,
  withTime: true,
  withClearValue: false,
  displayFormat: undefined,
  value: undefined,
};

const DatePicker = ({
  className,
  withTime,
  withClearValue,
  displayFormat,
  value,
  onChange,
  ...inputProps
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const $containerRef = useRef();
  const $dropdownRef = useRef();

  const hasValue = Boolean(value);
  const showClearButton = withClearValue && hasValue;
  const rightIconCount = showClearButton ? 2 : 1;
  const allowManualInput = !withTime && Boolean(displayFormat);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(getFormattedInputValue(value, withTime, displayFormat));
    }
  }, [value, withTime, displayFormat, isEditing]);

  useOnOutsideClick([$containerRef, $dropdownRef], isDropdownOpen, () => setDropdownOpen(false));

  const openDropdown = () => {
    if ($containerRef.current) {
      const rect = $containerRef.current.getBoundingClientRect();
      const dropdownWidth = withTime ? 360 : 270;
      const top = rect.bottom + 4;
      const left = Math.max(8, rect.right - dropdownWidth);

      setDropdownPosition({ top, left });
    }
    setDropdownOpen(true);
  };

  const handleClear = event => {
    event.stopPropagation();
    setIsEditing(false);
    setInputValue('');
    onChange(null);
    setDropdownOpen(false);
  };

  const handleInputChange = newValue => {
    if (!allowManualInput) return;

    setIsEditing(true);
    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    if (!allowManualInput) return;

    setIsEditing(false);

    if (!inputValue.trim()) {
      onChange(null);
      return;
    }

    const parsed = parseDisplayDate(inputValue, displayFormat);
    if (parsed) {
      onChange(formatDateForAPI(parsed));
    } else {
      setInputValue(getFormattedInputValue(value, withTime, displayFormat));
    }
  };

  const renderDropdown = () => (
    <div ref={$dropdownRef}>
      <Dropdown
        withTime={withTime}
        isPortaled
        top={dropdownPosition.top}
        left={dropdownPosition.left}
      >
        <DateSection
          withTime={withTime}
          value={value}
          onChange={onChange}
          setDropdownOpen={setDropdownOpen}
        />
        {withTime && (
          <TimeSection value={value} onChange={onChange} setDropdownOpen={setDropdownOpen} />
        )}
        {showClearButton && (
          <ClearDateFooter type="button" onClick={handleClear}>
            Clear date
          </ClearDateFooter>
        )}
      </Dropdown>
    </div>
  );

  return (
    <StyledDatePicker ref={$containerRef}>
      <Input
        icon="calendar"
        hasRightIcon
        rightIconCount={rightIconCount}
        {...inputProps}
        className={className}
        autoComplete="off"
        readOnly={!allowManualInput}
        value={
          allowManualInput ? inputValue : getFormattedInputValue(value, withTime, displayFormat)
        }
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onClick={allowManualInput ? undefined : openDropdown}
        onFocus={allowManualInput ? undefined : openDropdown}
      />
      <InputActions>
        {showClearButton && (
          <InputActionButton type="button" aria-label="Clear date" onClick={handleClear}>
            <Icon type="close" size={14} />
          </InputActionButton>
        )}
        <InputActionButton type="button" aria-label="Open calendar" onClick={openDropdown}>
          <Icon type="calendar" size={15} />
        </InputActionButton>
      </InputActions>
      {isDropdownOpen && dropdownPosition && ReactDOM.createPortal(renderDropdown(), document.body)}
    </StyledDatePicker>
  );
};

const getFormattedInputValue = (dateValue, withTime, displayFormat) => {
  if (!dateValue) return '';
  if (displayFormat) return formatDate(dateValue, displayFormat);
  return withTime ? formatDateTime(dateValue) : formatDate(dateValue);
};

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
