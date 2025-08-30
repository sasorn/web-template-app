import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import close from "./assets/close.svg";

import "./Modal.less";

const Modal = ({ children, onClose }) => {
  const modalWrapperRef = useRef();

  const handleClose = () => {
    onClose();
  };

  const handleMouseDown = event => {
    if (
      modalWrapperRef.current &&
      !modalWrapperRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <section className="Modal">
      <div>
        <div className="Modal-close" onClick={handleClose}>
          <img src={close} alt="Close" />
        </div>

        <div className="Modal-wrapper" ref={modalWrapperRef}>
          {children}
        </div>
      </div>
    </section>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;
