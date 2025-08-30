import React, { Component } from "react";

import Loading from "./loading.svg";
import "./Loader.less";

export default class Loader extends Component {
  render() {
    return (
      <div className="Loader">
        <span>
          <img src={Loading} alt="Loading..." />
        </span>
      </div>
    );
  }
}
