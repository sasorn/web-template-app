import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import Templates from "./Templates";

describe("Templates", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const TemplatesWithStore = withStore(Templates, initialState);

    expect(
      <TemplatesWithStore />,
      "when mounted",
      "to have class",
      "Templates"
    );
  });
});
