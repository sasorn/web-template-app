import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./InputDropdown.less";

/*
Example:
options: ["option1", "option2", "option3"]
*/

const InputDropdown = ({
  label,
  setValue,
  validate,
  id,
  valid,
  value,
  options,
  size = "default",
  ...restProps
}) => {
  const [focus, setFocus] = useState(false);
  const refDropdown = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (refDropdown.current && !refDropdown.current.contains(event.target)) {
        setFocus(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenList = () => {
    setFocus(!focus);
  };

  const onChange = (value, index) => {
    setValue(value);
    setFocus(false);
    validate({ value });
  };

  return (
    <div className="InputDropdown">
      <div
        className={classNames(
          "InputDropdown-select",
          {
            focus: focus,
            entry: !!value,
            error: !valid
          },
          size !== "default" && `${size}`
        )}
        {...restProps}
      >
        <div className="InputDropdown-label">{label}</div>
        <div
          className="InputDropdown-select-option"
          onClick={handleOpenList}
          ref={refDropdown}
        >
          {!!value && <span className="noselect">{value}</span>}
        </div>
        {focus && (
          <div className="InputDropdown-select-list">
            {options.map((optionValue, index) => (
              <div
                className={classNames("InputDropdown-select-list-option", {
                  selected: value === optionValue
                })}
                onMouseDown={() => onChange(optionValue, index)}
                key={index}
              >
                <span className="noselect">{optionValue}</span>
              </div>
            ))}
          </div>
        )}

        <div className="chevron-wrapper">
          <svg
            className="chevron"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="chevron-path"
              d="M1 1L7 7L13 1"
              fill="transparent"
              stroke="rgba(189, 184, 178, 1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

InputDropdown.propTypes = {
  valid: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  validate: PropTypes.func.isRequired,
  setValue: PropTypes.any.isRequired,
  id: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  size: PropTypes.oneOf(["default", "small"])
};

export default InputDropdown;
