import React, { FC } from "react";
import classNames from "classnames";
import { connect } from "react-redux";

import { closeDialog, goToRoute } from "../../store/actions";

import Modal from "../Modal/Modal";

import mail from "./assets/mail.svg";
import bolt from "./assets/bolt.svg";
import diamond from "./assets/diamond.svg";
import chevronDown from "./assets/chevronDown.svg";

import "./CreateTemplateModal.less";

interface CreateTemplateProps {
  closeCreateTemplateAction: Function;
  goToRouteAction: Function;
}

const buttons = [
  { label: "Mail template", icon: mail, pageName: "newMailTemplate" },
  { label: "Profile type", icon: bolt, pageName: "newProfileTemplate" },
  { label: "Header text", icon: diamond, pageName: "" }
];

const CreateTemplateModal: React.FC<CreateTemplateProps> = ({
  closeCreateTemplateAction,
  goToRouteAction
}) => {
  const handleClose = () => {
    closeCreateTemplateAction();
  };

  const handleClick = (pageName: string) => {
    goToRouteAction({ pageName: pageName });
    closeCreateTemplateAction();
  };

  return (
    <div className="CreateTemplateModal">
      <Modal onClose={handleClose}>
        <div className="CreateTemplateModal-container">
          <h3>Create new template</h3>
        </div>

        <div className="CreateTemplateModal-buttons">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="CreateTemplateModal-button"
              onClick={() => handleClick(button.pageName)}
            >
              <div>
                <img src={button.icon} alt={button.label} />

                <p>{button.label}</p>
              </div>

              <span>
                <img src={chevronDown} alt={button.label} />
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default connect(null, {
  closeCreateTemplateAction: () =>
    closeDialog({ dialogName: "CREATE_TEMPLATE" }),
  goToRouteAction: goToRoute
})(CreateTemplateModal);
