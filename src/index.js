import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ServiceLocator from "./lib/ServiceLocator";

import * as actions from "./store/actions";

import PageRouter from "./views/PageRouter";
import {
  getPageByUrl,
  getDataQueryFromUrl,
  getUrlParameters
} from "./lib/routes";

import { ThemeProvider } from "./lib/ThemeContext";

import "./index.less";

const root = document.getElementById("web-template-app");
const reactRoot = createRoot(root);

function loadRouteFromQueryString() {
  const path = window.location.pathname.replace(/^\/|\/$/g, "/");

  return {
    pageName: getPageByUrl(path),
    dataQuery: getDataQueryFromUrl(path),
    searchParams: getUrlParameters(window.location.search)
  };
}

function initialize({ store }) {
  window.onpopstate = e => {
    const params = loadRouteFromQueryString();
    store.dispatch(actions.setActiveRoute(params));
  };

  const params = loadRouteFromQueryString();
  store.dispatch(actions.setActiveRoute(params));

  reactRoot.render(
    <Provider store={store}>
      <ThemeProvider>
        <PageRouter />
      </ThemeProvider>
    </Provider>
  );
}

const serviceLocator = new ServiceLocator();

// This code will run once when the application starts.
try {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if both the token and user data exist
  if (token && user) {
    // 1. Restore the API Authentication
    // Get the networkInterface instance and set the token for future API calls
    const networkInterface = serviceLocator.get("networkInterface");
    networkInterface.setAuthToken(token);

    // 2. Restore the UI State
    // Dispatch the setActiveUser action to update the Redux store
    serviceLocator.store.dispatch(actions.setActiveUser(user));
  }
} catch (error) {
  console.error("Failed to parse auth data from localStorage", error);
  // Clear potentially corrupted data
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

window.recruit = window.recruit || {};
window.recruit.serviceLocator = serviceLocator;

const { dispatch } = serviceLocator.store;

window.recruit.actions = Object.entries(actions).reduce(
  (actions, [actionName, action]) => {
    actions[actionName] = (...args) => dispatch(action(...args));
    return actions;
  },
  {}
);

initialize(serviceLocator);
