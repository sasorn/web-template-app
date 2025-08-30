import React from "react";
import PropTypes from "prop-types";

import Button from "../Button/Button";

import close from "./close.svg";

import "./Warning.less";

const Warning = ({
  header,
  text,
  type,
  onBack,
  backText,
  onClose,
  closeText,
  children
}) => {
  return (
    <div className="Warning">
      <div className="Warning-wrapper">
        <div className="Warning-close" onClick={onBack}>
          <img src={close} />
        </div>
        <h2>{header}</h2>
        <p>{text}</p>
        {children}
        <div className="Warning-buttons">
          <Button type="secondary" onClick={onBack}>
            {backText}
          </Button>
          <Button type={"critical" || type} onClick={onClose} id="submit">
            {closeText}
          </Button>
        </div>
      </div>
    </div>
  );
};

Warning.propTypes = {
  header: PropTypes.string.isRequired,
  text: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  type: PropTypes.string,
  backText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired
};

export default Warning;
