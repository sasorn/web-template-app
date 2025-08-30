import expect, { withIntl, withStore } from "../../testUtils/unexpected-react";
import React from "react";

import SuccessDialog_ from "./SuccessDialog";
const SuccessDialog = withStore(withIntl(SuccessDialog_), {
  routing: {
    pageName: "home",
    dataQuery: null
  }
});

describe("SuccessDialog", () => {
  it("should render default ", () => {
    expect(<SuccessDialog />, "when mounted", "to have class", "SuccessDialog");
  });
});
