import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeDialog } from "../../store/actions";

import Modal from "../Modal/Modal";
import Button from "../Button/Button";

import "./SuccessDialog.less";

export function SuccessDialog({
  headerText,
  bodyText,
  buttonText,
  closeSuccessDialogAction
}) {
  const handleClose = () => {
    closeSuccessDialogAction();
  };

  const handleSubmit = () => {
    console.log("this is submitting login");
  };

  return (
    <section className="SuccessDialog">
      <Modal onClose={handleClose}>
        <h2>{headerText}</h2>
        <p>{bodyText}</p>
        <div className="UserLogin-button">
          <div onClick={handleClose}>Cancel</div>
          <Button onClick={handleSubmit}>{buttonText}</Button>
        </div>
      </Modal>
    </section>
  );
}

SuccessDialog.propTypes = {
  headerText: PropTypes.string,
  bodyText: PropTypes.string,
  buttonText: PropTypes.string,
  closeSuccessDialogAction: PropTypes.func.isRequired
};

export default connect(null, {
  closeSuccessDialogAction: () => closeDialog({ dialogName: "SUCCESS_DIALOG" })
})(SuccessDialog);
