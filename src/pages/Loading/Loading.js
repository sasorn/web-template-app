import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Loader from "../../components/Loader/Loader";

import "./Loading.less";

const Loading = ({ className }) => {
  return (
    <div className={classNames("Loading", className)}>
      <Loader />
    </div>
  );
};

Loading.propTypes = {
  className: PropTypes.string
};

export default Loading;
