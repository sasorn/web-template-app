import expect, { getInstance } from "../../../../testUtils/unexpected-react";
import React, { Component } from "react";
import PropTypes from "prop-types";

import { DialogManager, mapStateToProps } from "./DialogManager";

class MockDialog extends Component {
  render() {
    return <div>{this.props.foo}</div>;
  }
}

MockDialog.propTypes = {
  foo: PropTypes.string
};

describe("DialogManager", () => {
  it("should render a specific dialog with the corresponding props", () => {
    const dialogProps = { foo: "bar" };

    expect(
      <DialogManager
        dialogComponents={{
          FOO: MockDialog
        }}
        dialogName={"FOO"}
        dialogProps={dialogProps}
      />,
      "when mounted",
      "to satisfy",
      <div>bar</div>
    );
  });

  // the following would be better done as 'to contain' null - see:
  // https://github.com/bruderstein/unexpected-react/issues/16
  it("should not render an unknown dialog name", () => {
    const { subject } = getInstance(
      <DialogManager dialogComponents={{}} dialogName={"BAR"} />
    );

    expect(subject, "to be null");
  });

  // the following would be better done as 'to contain' null - see:
  // https://github.com/bruderstein/unexpected-react/issues/16
  it("should not render an empty dialog name", () => {
    const { subject } = getInstance(
      <DialogManager dialogComponents={{}} dialogName={""} />
    );

    expect(subject, "to be null");
  });

  // the following would be better done as 'to contain' null - see:
  // https://github.com/bruderstein/unexpected-react/issues/16
  it("should not render a missing dialog name", () => {
    const { subject } = getInstance(<DialogManager dialogComponents={{}} />);

    expect(subject, "to be null");
  });

  describe("mapStateToProps", () => {
    it("should find a dialog", () => {
      const state = {
        dialog: {
          FOO: { baz: true }
        }
      };

      expect(mapStateToProps(state), "to equal", {
        dialogName: "FOO",
        dialogProps: { baz: true }
      });
    });

    it("should find a dialog even when missing its props", () => {
      const state = {
        dialog: {
          FOO: null
        }
      };

      expect(mapStateToProps(state), "to equal", {
        dialogName: "FOO",
        dialogProps: {}
      });
    });

    it("should return null with no dialogs", () => {
      const state = {
        dialog: {}
      };

      expect(mapStateToProps(state), "to equal", { dialogName: null });
    });

    it("should return null with more than one dialog", () => {
      const state = {
        dialog: {
          FOO: null,
          BAR: null
        }
      };

      expect(mapStateToProps(state), "to equal", { dialogName: null });
    });
  });
});
