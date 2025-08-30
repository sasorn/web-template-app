import { qualifySelector } from "../../utils";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE
} from "../../constants";

const initialState = {
  loading: false,
  errored: false,
  changed: false,
  data: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        errored: false
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        errored: false,
        data: action.payload
      };
    case USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        errored: true
      };
    default:
      return state;
  }
}

export const name = "userLogin";
export default { [name]: reducer };

export const getUserLogin = qualifySelector(name, state => state.data);

export const getUserLoginRequest = qualifySelector(
  name,
  state => state.loading
);

export const getUserLoginErrored = qualifySelector(
  name,
  state => state.errored
);
