import React from "react";
import PropTypes from "prop-types";

import FakeIntlProvider from "./FakeIntlProvider";
import FakeReduxProvider from "./FakeReduxProvider";

class FakeEnvironment extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = props.initialState || {};

    this.mockApi = {
      failRaft: {
        getErrorHandler: () => null
      },
      trackEvent: (...args) => console.log(...args)
    };
  }

  render() {
    const { children } = this.props;

    return (
      <FakeReduxProvider mockApi={this.mockApi}>
        <FakeIntlProvider initialState={this.initialState}>
          {children}
        </FakeIntlProvider>
      </FakeReduxProvider>
    );
  }
}

FakeEnvironment.propTypes = {
  children: PropTypes.element,
  initialState: PropTypes.object
};

export default FakeEnvironment;
