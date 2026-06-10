import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { StyledInput, InputElement, StyledIcon } from './Styles';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  hasRightIcon: PropTypes.bool,
  rightIconCount: PropTypes.number,
  invalid: PropTypes.bool,
  filter: PropTypes.instanceOf(RegExp),
  onChange: PropTypes.func,
};

const defaultProps = {
  className: undefined,
  value: undefined,
  icon: undefined,
  hasRightIcon: false,
  rightIconCount: 1,
  invalid: false,
  filter: undefined,
  onChange: () => {},
};

const Input = forwardRef(
  ({ icon, hasRightIcon, rightIconCount, className, filter, onChange, ...inputProps }, ref) => {
    const handleChange = event => {
      if (!filter || filter.test(event.target.value)) {
        onChange(event.target.value, event);
      }
    };

    return (
      <StyledInput className={className}>
        {icon && <StyledIcon type={icon} size={15} />}
        <InputElement
          {...inputProps}
          onChange={handleChange}
          hasIcon={!!icon}
          hasRightIcon={hasRightIcon}
          rightIconCount={rightIconCount}
          ref={ref}
        />
      </StyledInput>
    );
  },
);

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
