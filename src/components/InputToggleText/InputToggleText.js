import React, { useEffect } from "react";
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
  typeNext = "tel",
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
  useEffect(() => {
    // Reset on toggle
    setValue("");
    setValueNext("");
  }, [checked, setValue, setValueNext]);

  return (
    <div className="InputToggleText">
      <InputToggle checked={checked} setChecked={setChecked} id="toggleCheck" />

      {!checked ? (
        <InputText
          type={type}
          label={label}
          setValue={setValue}
          validate={validate}
          value={value}
          valid={valid}
          id={id}
        />
      ) : (
        <InputText
          type={typeNext}
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
