import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import Home from "./Home";

describe("Home", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const HomeWithStore = withStore(Home, initialState);

    expect(<HomeWithStore />, "when mounted", "to have class", "Home");
  });
});
