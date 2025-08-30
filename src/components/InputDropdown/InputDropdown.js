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
        className={classNames("InputDropdown-select", {
          focus: focus,
          entry: !!value,
          error: !valid
        })}
        {...restProps}
      >
        <div className="InputDropdown-label">{label}</div>
        <div
          className="InputDropdown-select-option"
          onClick={handleOpenList}
          ref={refDropdown}
        >
          {!!value && <span>{value}</span>}
        </div>
        {focus && (
          <div className="InputDropdown-select-list">
            {options.map((optionValue, index) => (
              <div
                className="InputDropdown-select-list-option"
                onMouseDown={() => onChange(optionValue, index)}
                key={index}
              >
                <span>{optionValue}</span>
              </div>
            ))}
          </div>
        )}
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
  value: PropTypes.any.isRequired
};

export default InputDropdown;
