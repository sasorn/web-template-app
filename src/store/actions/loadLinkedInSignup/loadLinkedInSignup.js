import {
  LOAD_LINKEDIN_REQUEST,
  LOAD_LINKEDIN_FAILURE,
  LOAD_LINKEDIN_SUCCESS
} from "../../constants";
import { createAction, createErrorAction } from "../../utils";
import getErrorMessageByError from "../../../lib/errorHandler.js";

const loadLinkedinSignupRequest = createAction(LOAD_LINKEDIN_REQUEST);
const loadLinkedinSignupSuccess = createAction(LOAD_LINKEDIN_SUCCESS);
const loadLinkedinSignupFailure = createErrorAction(LOAD_LINKEDIN_FAILURE);

export const loadLinkedInSignup = () => {
  return (dispatch, getState, { api }) => {
    dispatch(loadLinkedinSignupRequest());

    return api.getLinkedInRedirectUrl().then(
      // Using the corrected API method
      data => {
        dispatch(loadLinkedinSignupSuccess(data));
        if (data && data.authorize_url) {
          window.location.href = data.authorize_url;
        }
        return { wasSuccessful: true, data };
      },
      error => {
        dispatch(loadLinkedinSignupFailure(error));
        return { wasSuccessful: false, error: getErrorMessageByError(error) };
      }
    );
  };
};
