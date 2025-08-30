import { createAction, createErrorAction } from "../../utils";
import {
  PASSWORD_RESET_REQUEST_REQUEST,
  PASSWORD_RESET_REQUEST_SUCCESS,
  PASSWORD_RESET_REQUEST_FAILURE
} from "../../constants";

import getErrorMessageByError from "../../../lib/errorHandler.js";

const request = createAction(PASSWORD_RESET_REQUEST_REQUEST);
const success = createAction(PASSWORD_RESET_REQUEST_SUCCESS);
const failure = createErrorAction(PASSWORD_RESET_REQUEST_FAILURE);

export const requestPasswordReset = payload => {
  return (dispatch, getState, { api }) => {
    dispatch(request());

    return api.requestPasswordReset(payload).then(
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
