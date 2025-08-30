import { createAction, createErrorAction } from "../../utils";
import {
  SOCIAL_LOGIN_REQUEST,
  SOCIAL_LOGIN_SUCCESS,
  SOCIAL_LOGIN_FAILURE
} from "../../constants";

const socialLoginRequest = createAction(SOCIAL_LOGIN_REQUEST);
const socialLoginSuccess = createAction(SOCIAL_LOGIN_SUCCESS);
const socialLoginFailure = createErrorAction(SOCIAL_LOGIN_FAILURE);

export const socialLogin = () => {
  return (dispatch, getState, { api }) => {
    dispatch(socialLoginRequest());

    // This calls the backend to get the special LinkedIn URL
    return api.socialLogin().then(
      data => {
        dispatch(socialLoginSuccess(data));

        if (data && data.authorize_url) {
          window.location.href = data.authorize_url;
        } else {
          dispatch(socialLoginFailure(new Error("No authorize_url received")));
        }
      },
      error => {
        dispatch(socialLoginFailure(error));
      }
    );
  };
};
