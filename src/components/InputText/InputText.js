import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./InputText.less";

export default function InputText({
  type = "text",
  label,
  setValue,
  validate,
  id,
  valid,
  value,
  size = "default",
  ...restProps
}) {
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [inputType, setInputType] = useState(type);
  const required = restProps.required || false;

  const onFocus = () => {
    setFocus(true);
  };

  const onBlur = event => {
    setFocus(false);
  };

  const onShow = () => {
    setShow(!show);
    type === "password" ? setInputType(show ? "password" : "text") : type;
  };

  const onChange = event => {
    setValue(event.target.value);
    validate(event.target.value);
  };

  return (
    <div
      className={classNames(
        "InputText",
        {
          focus: focus || value !== "",
          error: !valid,
          entry: value !== ""
        },
        size !== "default" && `${size}`
      )}
      {...restProps}
    >
      <input
        type={inputType}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        autoComplete={id}
        value={value}
        id={id}
      />
      <label htmlFor={id}>{label}</label>
      {type === "password" && (
        <div className="show" onClick={onShow}>
          {!show ? "Show" : "Hide"}
        </div>
      )}
    </div>
  );
}

InputText.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["default", "small"])
};
