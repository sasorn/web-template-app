import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import Messages from "./Messages";

describe("Messages", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const MessagesWithStore = withStore(Messages, initialState);

    expect(<MessagesWithStore />, "when mounted", "to have class", "Messages");
  });
});
