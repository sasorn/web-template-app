window.scroll = () => {};

import React from "react";
import expect, { withIntl } from "../testUtils/unexpected-react";
import sinon from "sinon";

import { PageRouter as PageRouter_ } from "./PageRouter";

const PageRouter = withIntl(PageRouter_);
let props;

describe("PageRouter", () => {
  beforeEach(() => {
    props = {
      order: {},
      activeDomain: "embol.com",
      routerParams: { pageName: "unknownpage" },
      isMobileView: false,
      goToRouteAction: () => {},
      setViewportWidthAction: sinon.stub().named("setViewportWidthAction")
    };
  });

  it("should be a function", () => {
    expect(PageRouter, "to be a function");
  });

  it("should be a function", () => {
    expect(<PageRouter {...props} />, "when mounted", "to be", null);
  });
});
