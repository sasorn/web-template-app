import { createAction, createErrorAction } from "../../utils";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE
} from "../../constants";

import { setActiveUser } from "../setActiveUser/setActiveUser";
import getErrorMessageByError from "../../../lib/errorHandler.js";

const userLoginRequest = createAction(USER_LOGIN_REQUEST);
const userLoginSuccess = createAction(USER_LOGIN_SUCCESS);
const userLoginFailure = createErrorAction(USER_LOGIN_FAILURE);

export const userLogin = payload => {
  return (dispatch, getState, { api }) => {
    dispatch(userLoginRequest());

    return api.userLogin(payload).then(
      data => {
        dispatch(userLoginSuccess(data));

        if (data) {
          dispatch(setActiveUser(data));
        }

        console.log("action:", data);

        return { wasSuccessful: true, data };
      },
      error => {
        dispatch(userLoginFailure(error));

        return { wasSuccessful: false, error: getErrorMessageByError(error) };
      }
    );
  };
};
