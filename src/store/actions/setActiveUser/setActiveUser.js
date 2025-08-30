import { SET_ACTIVE_USER } from "../../constants";

export const setActiveUser = user => ({
  type: SET_ACTIVE_USER,
  payload: user
});
