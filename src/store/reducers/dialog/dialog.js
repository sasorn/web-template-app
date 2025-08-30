import { qualifySelector } from "../../utils";

import omit from "lodash/omit";

import { DIALOG_CLOSE, DIALOG_OPEN, DIALOG_ALL_CLOSE } from "../../constants";

const name = "dialog";

export function reducer(state = {}, action) {
  switch (action.type) {
    case DIALOG_OPEN:
      return {
        ...state,
        [action.payload.dialogName]: action.payload.dialogProps || {}
      };

    case DIALOG_CLOSE:
      return omit(state, action.payload.dialogName);

    case DIALOG_ALL_CLOSE:
      return {};

    default:
      return state;
  }
}

export default { [name]: reducer };

export const getActiveDialog = qualifySelector(name, state => {
  const dialogKeys = Object.keys(state);

  if (dialogKeys.length === 1) {
    const dialogName = dialogKeys[0];
    const dialogProps = state[dialogName] || {};

    return { dialogName, dialogProps };
  } else {
    return { dialogName: null };
  }
});

export const getDialogPropsByName = qualifySelector(
  name,
  (state, dialogName) => state[dialogName] || null
);
