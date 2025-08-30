import React, { Component } from "react";
import { IntlProvider } from "react-intl";
import PropTypes from "prop-types";

class FakeIntlProvider extends Component {
  render() {
    return (
      <IntlProvider locale="en" messages={{}} textComponent="span">
        {this.props.children}
      </IntlProvider>
    );
  }
}

FakeIntlProvider.propTypes = {
  children: PropTypes.node
};

export default FakeIntlProvider;
