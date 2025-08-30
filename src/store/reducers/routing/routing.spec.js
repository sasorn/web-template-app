import expect from "../../../testUtils/unexpectedRedux";

import { legacy_createStore as createStore, combineReducers } from "redux";
import { SET_ACTIVE_ROUTE } from "../../constants";

import routing, { getRouterParams, getPageName } from "./routing";

function createFakeStore(intialState) {
  return createStore(combineReducers(routing), intialState);
}
let store;
describe("routing", () => {
  it("should initialize with default values", () => {
    store = createFakeStore();

    expect(store, "to have state", {
      routing: {
        pageName: "home",
        dataQuery: null
      }
    });
  });

  it(`should handle ${SET_ACTIVE_ROUTE}`, () => {
    store = createFakeStore();

    store.dispatch({
      type: SET_ACTIVE_ROUTE,
      payload: { pageName: "loading" }
    });

    expect(store, "to have state", {
      routing: { pageName: "loading" }
    });
  });

  describe("selectors", () => {
    it("should getRouterParams", () => {
      store = createFakeStore({
        routing: {
          pageName: "loading",
          dataQuery: null
        }
      });

      expect(getRouterParams(store.getState()), "to equal", {
        pageName: "loading",
        dataQuery: null
      });
    });

    it("should getPageName", () => {
      store = createFakeStore({
        routing: {
          pageName: "loading",
          dataQuery: null
        }
      });

      expect(getPageName(store.getState()), "to equal", "loading");
    });
  });
});
