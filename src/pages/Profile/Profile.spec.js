import React from "react";
import expect, { withStore } from "../../testUtils/unexpected-react";

import Profile from "./Profile";

describe("Profile", () => {
  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const ProfileWithStore = withStore(Profile, initialState);

    expect(<ProfileWithStore />, "when mounted", "to have class", "Profile");
  });
});
