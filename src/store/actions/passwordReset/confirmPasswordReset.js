import { createAction, createErrorAction } from "../../utils";
import {
  PASSWORD_RESET_CONFIRM_REQUEST,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_CONFIRM_FAILURE
} from "../../constants";

import getErrorMessageByError from "../../../lib/errorHandler.js";

const request = createAction(PASSWORD_RESET_CONFIRM_REQUEST);
const success = createAction(PASSWORD_RESET_CONFIRM_SUCCESS);
const failure = createErrorAction(PASSWORD_RESET_CONFIRM_FAILURE);

export const confirmPasswordReset = payload => {
  return (dispatch, getState, { api }) => {
    dispatch(request());

    return api.confirmPasswordReset(payload).then(
      data => {
        dispatch(success(data));
        return { wasSuccessful: true, data };
      },
      error => {
        dispatch(failure(error));
        return { wasSuccessful: false, error: getErrorMessageByError(error) };
      }
    );
  };
};
