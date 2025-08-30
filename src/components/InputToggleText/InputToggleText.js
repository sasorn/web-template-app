import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import InputToggle from "../InputToggle/InputToggle";
import InputText from "../InputText/InputText";

import "./InputToggleText.less";

export default function InputToggleText({
  type = "text",
  label,
  setValue,
  validate,
  id,
  valid,
  value,
  labelNext,
  setValueNext,
  validateNext,
  idNext,
  validNext,
  valueNext,
  setChecked,
  checked,
  disabled = false,
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

  const onToggleChange = event => {
    setChecked(event.target.checked);
  };

  return (
    <div className="InputToggleText">
      <InputToggle checked={checked} setChecked={setChecked} id="toggleCheck" />

      {!checked ? (
        <InputText
          label={label}
          setValue={setValue}
          validate={validate}
          value={value}
          valid={valid}
          id={id}
        />
      ) : (
        <InputText
          type="tel"
          label={labelNext}
          setValue={setValueNext}
          validate={validateNext}
          value={valueNext}
          valid={validNext}
          id={idNext}
        />
      )}
    </div>
  );
}

InputToggleText.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired
};
