import { SET_ACTIVE_ROUTE } from "../../constants";

export const setActiveRoute = params => ({
  type: SET_ACTIVE_ROUTE,
  payload: params
});
