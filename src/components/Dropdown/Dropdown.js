import React from "react";
import PropTypes from "prop-types";

import ".Dropdown.less";

const Dropdown = ({ children }) => {
  return (
    <div className="Dropdown">
      <div className="Dropdown"></div>
    </div>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired
};

export default Dropdown;
