import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import NewProfileTemplate from "./NewProfileTemplate";

describe("NewProfileTemplate", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const NewProfileTemplateWithStore = withStore(
      NewProfileTemplate,
      initialState
    );

    expect(
      <NewProfileTemplateWithStore />,
      "when mounted",
      "to have class",
      "NewProfileTemplate"
    );
  });
});
