import React from "react";

export const defaultBackendContext = {
  get: (...args) => {
    const err = new Error("No networkInterface available");

    err.data = {
      args,
    };

    throw err;
  },
};

export const BackendContext = React.createContext(defaultBackendContext);

export const BackendProvider = BackendContext.Provider;
