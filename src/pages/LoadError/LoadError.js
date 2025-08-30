import React, { Component } from "react";

const LoadError = () => {
  return (
    <div className="LoadError">
      <h1>{"The app failed to load"}</h1>
      <p>
        {"Please contact our"}
        <a href="#" target="_blank">
          {"support"}
        </a>
        .
      </p>
    </div>
  );
};

export default LoadError;
