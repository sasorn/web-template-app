import React, { Component, act } from "react";
import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
import unexpectedReaction from "unexpected-reaction";
import unexpectedSinon from "unexpected-sinon";
import PropTypes from "prop-types";
import { Ignore, simulate } from "react-dom-testing";
import { createRoot } from "react-dom/client";

export { Ignore, simulate, mount } from "react-dom-testing";
export { render, screen, fireEvent, within } from "@testing-library/react";

import FakeReduxProvider from "./FakeReduxProvider";
import FakeIntlProvider from "./FakeIntlProvider";

const expect = unexpected
  .clone()
  .use(unexpectedDom)
  .use(unexpectedReaction)
  .use(unexpectedSinon);

class MonkeyPatchingIntlProvider extends React.Component {
  getChildContext() {
    return { intl: { ...this.context.intl, formatMessage: ({ id }) => id } };
  }

  render() {
    return this.props.children;
  }
}

MonkeyPatchingIntlProvider.contextTypes = { intl: PropTypes.object };

MonkeyPatchingIntlProvider.childContextTypes = { intl: PropTypes.object };

MonkeyPatchingIntlProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export function withIntl(Component) {
  return props => (
    <FakeIntlProvider locale="en" messages={{}}>
      <Component {...props} />
    </FakeIntlProvider>
  );
}

export function MockIntlProvider({ children }) {
  return (
    <FakeIntlProvider defaultLocale="en-US" locale="en-US">
      <MonkeyPatchingIntlProvider>{children}</MonkeyPatchingIntlProvider>
    </FakeIntlProvider>
  );
}

MockIntlProvider.propTypes = {
  children: PropTypes.node
};

export class Mounter extends Component {
  render() {
    return <div className="Mounter">{this.props.children}</div>;
  }
}

Mounter.propTypes = {
  children: PropTypes.node
};

export function getInstance(reactElement, tagName = "div") {
  const div = document.createElement(tagName);
  const root = createRoot(div);
  root.render(reactElement);

  const result = {
    instance: null,
    subject: div.firstChild
  };

  if (reactElement.type === PropUpdater) {
    result.applyPropsUpdate = () =>
      simulate(result.subject.firstChild, { type: "click" });
  }

  return result;
}

export function withStore(Component, initialState, mockApi, reducer) {
  return props => (
    <FakeReduxProvider
      initialState={initialState}
      mockApi={mockApi}
      reducer={reducer}
    >
      <Component {...props} />
    </FakeReduxProvider>
  );
}

export class PropUpdater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isClicked: false
    };
  }

  render() {
    const { children, propsUpdate } = this.props;
    const { isClicked } = this.state;

    let child;
    if (isClicked) {
      child = React.cloneElement(children, propsUpdate);
    } else {
      child = children;
    }

    return (
      <div onClick={() => this.setState({ isClicked: true })}>{child}</div>
    );
  }
}

PropUpdater.propTypes = {
  children: PropTypes.element.isRequired,
  propsUpdate: PropTypes.object.isRequired
};

export { act };

export default expect;

expect.addAssertion("<any> to be renderable", (expect, Subject) => {
  expect.errorMode = "bubble";
  return expect(
    <MockIntlProvider>
      <Subject />
    </MockIntlProvider>,
    "when mounted",
    "to satisfy",
    <Ignore />
  );
});
