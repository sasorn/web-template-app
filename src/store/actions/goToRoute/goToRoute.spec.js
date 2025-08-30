import unexpected from "unexpected";
import sinon from "sinon";
import unexpectedSinon from "unexpected-sinon";

import { SET_ACTIVE_ROUTE } from "../../constants";

import { goToRoute } from "./goToRoute";

const expect = unexpected.clone().use(unexpectedSinon);

describe("goToRoute", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.stub().named("dispatch");
  });

  // If no route is passed to the goToRoute function, just set the same route as the current page
  it("Should set route to the same as the pageName, if no route is provided", () => {
    goToRoute()(dispatch);

    expect(dispatch, "to have a call satisfying", [
      {
        type: SET_ACTIVE_ROUTE,
        payload: { pageName: "loading" }
      }
    ]);
  });

  it("Should set route to the pageName and dataQuery when provided", () => {
    goToRoute({
      pageName: "domain",
      dataQuery: "bakery.dk"
    })(dispatch);

    expect(dispatch, "to have a call exhaustively satisfying", [
      {
        type: SET_ACTIVE_ROUTE,
        payload: {
          pageName: "domain",
          dataQuery: "bakery.dk"
        }
      }
    ]);
  });
});
