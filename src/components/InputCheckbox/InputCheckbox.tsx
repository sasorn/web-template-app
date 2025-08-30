import React, { Dispatch, SetStateAction } from "react";
import classNames from "classnames";

import check from "./assets/check.svg";

import "./InputCheckbox.less";

interface InputCheckboxProps {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  id: string;
  type?: "tag" | string;
  valid?: boolean;
  disabled?: boolean;
  label?: string;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({
  setChecked,
  checked,
  type,
  valid = true,
  id,
  disabled = false,
  label
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div
      className={classNames("InputCheckbox", {
        checked,
        "InputCheckbox--disabled": disabled,
        [type || ""]: type,
        error: !valid
      })}
    >
      <label style={{ ["--check-icon" as any]: `url(${check})` }}>
        <input
          type="checkbox"
          onChange={onChange}
          checked={checked}
          id={id}
          disabled={disabled}
        />
        <span />
        {label}
      </label>
    </div>
  );
};

export default InputCheckbox;
