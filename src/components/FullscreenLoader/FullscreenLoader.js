import React from "react";
import loading from "./loading.svg";
import "./FullscreenLoader.less";

export default function FullscreenLoader() {
  return (
    <div className="FullscreenLoader">
      <img src={loading} />
    </div>
  );
}
