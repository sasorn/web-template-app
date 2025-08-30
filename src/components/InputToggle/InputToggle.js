import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./InputToggle.less";

const InputToggle = ({
  setChecked,
  checked,
  valid = true,
  id,
  disabled = false
}) => {
  const onChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <div
      className={classNames("InputToggle", {
        checked,
        "InputToggle--disabled": disabled,
        error: !valid
      })}
    >
      <label>
        <input type="checkbox" onChange={onChange} checked={checked} id={id} />
        <span />
      </label>
    </div>
  );
};

InputToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  valid: PropTypes.bool,
  id: PropTypes.string.isRequired
};

export default InputToggle;
