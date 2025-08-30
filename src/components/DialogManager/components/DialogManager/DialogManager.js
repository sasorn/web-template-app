import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getActiveDialog } from "../../../../store/reducers/dialog/dialog";

class DialogManager extends PureComponent {
  constructor(props) {
    super(props);

    this.dialogComponents = props.dialogComponents;
  }

  render() {
    const { dialogName, dialogProps } = this.props;

    if (!dialogName) {
      return null;
    }

    const SpecificDialog = this.dialogComponents[dialogName];

    if (!SpecificDialog) {
      return null;
    }

    return <SpecificDialog {...dialogProps} />;
  }
}

DialogManager.propTypes = {
  dialogComponents: PropTypes.object.isRequired,
  dialogName: PropTypes.string,
  dialogProps: PropTypes.object
};

export { DialogManager };

export const mapStateToProps = state => {
  return {
    ...getActiveDialog(state)
  };
};

export default connect(mapStateToProps)(DialogManager);
