import unexpected from "unexpected";
import { legacy_createStore as createStore, combineReducers } from "redux";

import dialog, {
  reducer as dialogReducer,
  getActiveDialog,
  getDialogPropsByName
} from "./dialog";
import { openDialog, closeDialog } from "../../actions";

const expect = unexpected.clone();

function createFakeStore(intialState) {
  return createStore(combineReducers(dialog), intialState);
}
let store;

describe("reducers/dialog", () => {
  let mockState;
  let mockAction;

  beforeEach(() => {
    mockState = {};
  });

  it("should not change for an unknown action type", () => {
    mockAction = {
      type: "foo",
      payload: { foo: "bar" }
    };

    return expect(
      dialogReducer(mockState, mockAction),
      "to be", // same object
      mockState
    );
  });

  describe("when receiving an openDialog action", () => {
    it("should add a new key {dialogName} in the state", () => {
      const mockAction = openDialog({
        dialogName: "FOO"
      });

      return expect(
        dialogReducer(mockState, mockAction),
        "to exhaustively satisfy",
        {
          FOO: expect.it("to be defined")
        }
      );
    });

    it("should set state[dialogName] to dialogProps", () => {
      const mockAction = openDialog({
        dialogName: "FOO",
        dialogProps: {
          foo: "bar"
        }
      });

      return expect(
        dialogReducer(mockState, mockAction),
        "to exhaustively satisfy",
        {
          FOO: { foo: "bar" }
        }
      );
    });
  });

  describe("when receiving a closeDialog action", () => {
    beforeEach(() => {
      mockState = {
        FOO: { foo: "bar" }
      };
    });

    it("should delete state[dialogName]", () => {
      const mockAction = closeDialog({
        dialogName: "FOO"
      });

      return expect(
        dialogReducer(mockState, mockAction),
        "to exhaustively satisfy",
        {}
      );
    });

    it("should not mutate the state", () => {
      const mockAction = closeDialog({
        dialogName: "FOO"
      });

      const newState = dialogReducer(mockState, mockAction);

      return expect(newState, "not to be", mockState);
    });
  });

  describe("selectors", () => {
    it("should getActiveDialog data", () => {
      store = createFakeStore({
        dialog: {
          FOO: {
            foo: "bar"
          }
        }
      });

      expect(getActiveDialog(store.getState()), "to exhaustively satisfy", {
        dialogName: "FOO",
        dialogProps: { foo: "bar" }
      });
    });

    it("should return null as a dialogName", () => {
      store = createFakeStore();

      expect(getActiveDialog(store.getState()), "to exhaustively satisfy", {
        dialogName: null
      });
    });

    it("should getDialogPropsByName", () => {
      store = createFakeStore({
        dialog: {
          FOO: {
            foo: "bar"
          }
        }
      });

      expect(
        getDialogPropsByName(store.getState(), "FOO"),
        "to exhaustively satisfy",
        { foo: "bar" }
      );
    });

    it("should return null for getDialogPropsByName", () => {
      store = createFakeStore();

      expect(
        getDialogPropsByName(store.getState(), "FOO"),
        "to exhaustively satisfy",
        null
      );
    });
  });
});
