import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import NewMailTemplate from "./NewMailTemplate";

describe("NewMailTemplate", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const NewMailTemplateWithStore = withStore(NewMailTemplate, initialState);

    expect(
      <NewMailTemplateWithStore />,
      "when mounted",
      "to have class",
      "NewMailTemplate"
    );
  });
});
