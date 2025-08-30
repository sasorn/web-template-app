import {
  SOCIAL_LOGIN_REQUEST,
  SOCIAL_LOGIN_FAILURE,
  SOCIAL_LOGIN_SUCCESS
} from "../../constants";
import { qualifySelector } from "../../utils"; // Corrected import path

const initialState = {
  loading: false,
  loaded: false,
  errored: false,
  data: null // Changed from domains to data for consistency
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SOCIAL_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        errored: false
      };
    case SOCIAL_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        errored: true
      };
    case SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload // Changed from domains to data
      };
    default:
      return state;
  }
}

export const name = "socialLogin";
export default { [name]: reducer };

export const isSocialLoginLoading = qualifySelector(
  name,
  state => state.loading
);
export const isSocialLoginLoaded = qualifySelector(name, state => state.loaded);
export const isSocialLoginErrored = qualifySelector(
  name,
  state => state.errored
);
export const getSocialLoginData = qualifySelector(
  // Corrected selector name
  name,
  state => state.data
);
