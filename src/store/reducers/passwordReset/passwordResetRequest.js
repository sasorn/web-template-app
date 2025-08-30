import { qualifySelector } from "../../utils";
import {
  PASSWORD_RESET_REQUEST_REQUEST,
  PASSWORD_RESET_REQUEST_SUCCESS,
  PASSWORD_RESET_REQUEST_FAILURE
} from "../../constants";

const initialState = {
  loading: false,
  errored: false,
  data: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case PASSWORD_RESET_REQUEST_REQUEST:
      return {
        ...state,
        loading: true,
        errored: false
      };
    case PASSWORD_RESET_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        errored: false,
        data: action.payload
      };
    case PASSWORD_RESET_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        errored: true
      };
    default:
      return state;
  }
}

export const name = "passwordResetRequest";
export default { [name]: reducer };

export const getPasswordResetRequestLoading = qualifySelector(
  name,
  state => state.loading
);
export const getPasswordResetRequestErrored = qualifySelector(
  name,
  state => state.errored
);
