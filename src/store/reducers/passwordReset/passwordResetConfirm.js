import { qualifySelector } from "../../utils";
import {
  PASSWORD_RESET_CONFIRM_REQUEST,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAILURE
} from "../../constants";

const initialState = {
  loading: false,
  errored: false,
  data: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case PASSWORD_RESET_CONFIRM_REQUEST:
      return {
        ...state,
        loading: true,
        errored: false
      };
    case PASSWORD_RESET_CONFIRM_SUCCESS:
      return {
        ...state,
        loading: false,
        errored: false,
        data: action.payload
      };
    case PASSWORD_RESET_CONFIRM_FAILURE:
      return {
        ...state,
        loading: false,
        errored: true
      };
    default:
      return state;
  }
}

export const name = "passwordResetConfirm";
export default { [name]: reducer };

export const getPasswordResetConfirmLoading = qualifySelector(
  name,
  state => state.loading
);
export const getPasswordResetConfirmErrored = qualifySelector(
  name,
  state => state.errored
);
