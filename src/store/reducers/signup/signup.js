import { qualifySelector } from "../../utils";
import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE
} from "../../constants";

const initialState = {
  loading: false,
  errored: false,
  changed: false,
  data: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
        errored: false
      };
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        errored: false,
        data: action.payload
      };
    case USER_SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        errored: true
      };
    default:
      return state;
  }
}

export const name = "signup";
export default { [name]: reducer };

export const getSignup = qualifySelector(name, state => state.data);

export const getSignupRequest = qualifySelector(name, state => state.loading);

export const getSignupErrored = qualifySelector(name, state => state.errored);
