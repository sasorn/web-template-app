import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import "./InputDropdown.less";

interface InputDropdownProps {
  id: string;
  value: string;
  setValue: (val: string) => void;
  validate: (val: { value: string }) => void;
  valid: boolean;
  options: string[];
  size?: "default" | "small";
  label?: string; // 👈 optional
}

const InputDropdown: React.FC<InputDropdownProps> = ({
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
  const refDropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refDropdown.current &&
        !refDropdown.current.contains(event.target as Node)
      ) {
        setFocus(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenList = () => setFocus(!focus);

  const onChange = (val: string, index: number) => {
    setValue(val);
    setFocus(false);
    validate({ value: val });
  };

  return (
    <div className="InputDropdown">
      <div
        className={classNames(
          "InputDropdown-select",
          { focus, entry: !!value, error: !valid },
          size !== "default" && `${size}`
        )}
        {...restProps}
      >
        {label && <div className="InputDropdown-label">{label}</div>}
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

export default InputDropdown;
