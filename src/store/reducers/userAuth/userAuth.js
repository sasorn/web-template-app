import { qualifySelector } from "../../utils";
import { SET_ACTIVE_USER, CLEAR_ACTIVE_USER } from "../../constants";

const initialState = {
  isAuth: false,
  data: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return {
        ...state,
        isAuth: true,
        data: action.payload
      };

    case CLEAR_ACTIVE_USER:
      return {
        ...state,
        isAuth: false,
        data: null
      };

    default:
      return state;
  }
}

export const name = "userAuth";
export default { [name]: reducer };

export const getIsUserAuth = qualifySelector(name, state => !!state.data);

export const getUser = qualifySelector(name, state => state.data);
