import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import Themes from "./Themes";

describe("Themes", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const ThemesWithStore = withStore(Themes, initialState);

    expect(<ThemesWithStore />, "when mounted", "to have class", "Themes");
  });
});
