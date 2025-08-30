import { createAction, createErrorAction } from "../../utils.js";
import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE
} from "../../constants.js";

import getErrorMessageByError from "../../../lib/errorHandler.js";

const userSignupRequest = createAction(USER_SIGNUP_REQUEST);
const userSignupSuccess = createAction(USER_SIGNUP_SUCCESS);
const userSignupFailure = createErrorAction(USER_SIGNUP_FAILURE);

export const userSignup = payload => {
  return (dispatch, getState, { api }) => {
    dispatch(userSignupRequest());

    return api.userSignup(payload).then(
      data => {
        dispatch(userSignupSuccess(data));

        return { wasSuccessful: true, data };
      },
      error => {
        dispatch(userSignupFailure(error));

        return { wasSuccessful: false, error: getErrorMessageByError(error) };
      }
    );
  };
};
