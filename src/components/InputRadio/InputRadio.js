import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./InputRadio.less";

// [
//   { label: "Is this a useful example?", radio: ["Yes", "No", "Maybe"] },
//   { label: "Choose a letter", radio: ["A", "B", "C"] }
// ]

const InputRadio = ({
  id,
  label,
  options,
  selectedValue,
  onChange,
  valid = true,
  disabled = false
}) => {
  // Remove the local checked state - we'll use selectedValue instead
  const groupName = label.replace(/\s+/g, "-").toLowerCase();

  const handleOnChange = e => {
    onChange(e.target.value);
  };

  // Check if any option is selected
  const hasSelection = !!selectedValue;

  return (
    <div
      className={classNames("InputRadio", {
        checked: hasSelection, // Use hasSelection instead of local checked state
        "InputRadio-disabled": disabled,
        error: hasSelection && !valid
      })}
    >
      {label && <div className="InputRadio-label">{label}</div>}

      <div className="InputRadio-option">
        {options.map(option => {
          const isSelected = selectedValue === option;
          return (
            <label key={option} className={classNames({ checked: isSelected })}>
              <input
                type="radio"
                id={option}
                name={groupName}
                value={option}
                checked={isSelected}
                onChange={handleOnChange}
                disabled={disabled}
              />

              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
};

InputRadio.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  valid: PropTypes.bool,
  id: PropTypes.string.isRequired
};

export default InputRadio;
