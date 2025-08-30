import expect, {
  withStore,
  getInstance,
  simulate,
  render,
  screen,
  fireEvent
} from "../../testUtils/unexpected-react";
import React from "react";
import sinon from "sinon";

import Modal from "./Modal";

let props;

describe("Modal", () => {
  beforeEach(() => {
    props = {
      handleClickButton: sinon.stub().named("handleClickButton"),
      onClose: sinon.stub().named("onClose")
    };
  });

  it("should render default", () => {
    // The component needs a `routing` object in the state.
    // An empty object is usually enough to prevent the test from crashing.
    const initialState = {
      routing: {}
    };

    const ModalWithStore = withStore(Modal, initialState);

    expect(
      <ModalWithStore />,
      "when mounted",
      "to exhaustively satisfy",
      <section className="Modal">
        <div>
          <div className="Modal-close">
            <img src="close.svg" alt="Close" />
          </div>

          <div className="Modal-wrapper"></div>
        </div>
      </section>
    );
  });

  it.skip("should call onClose function on clicking close", () => {
    const initialState = { routing: {} };
    const ModalWithStore = withStore(Modal, initialState);

    const mounted = getInstance(<ModalWithStore {...props} />);

    simulate(mounted.subject, [
      {
        type: "click",
        target: ".Modal-close"
      }
    ]);

    expect(props.onClose, "to have a call exhaustively satisfying", [
      expect.it("to be an object")
    ]);
  });
});
