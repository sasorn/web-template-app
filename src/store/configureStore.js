import {
  combineReducers,
  legacy_createStore as createStore,
  applyMiddleware
} from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import routingReducerMixin from "./reducers/routing/routing";
import dialogReducerMixin from "./reducers/dialog/dialog";
import userAuthMixin from "./reducers/userAuth/userAuth";
import signupMixin from "./reducers/signup/signup";
import passwordResetRequestMixin from "./reducers/passwordReset/passwordResetRequest";
import passwordResetConfirmMixin from "./reducers/passwordReset/passwordResetConfirm";
import userLoginMixin from "./reducers/userLogin/userLogin";
import socialLoginMixin from "./reducers/socialLogin/socialLogin";

export default function configureStore(serviceLocator) {
  const rootReducer = combineReducers({
    ...routingReducerMixin,
    ...dialogReducerMixin,
    ...userAuthMixin,
    ...signupMixin,
    ...passwordResetConfirmMixin,
    ...passwordResetRequestMixin,
    ...userLoginMixin,
    ...socialLoginMixin
  });

  const logger = createLogger({
    collapsed: true
  });

  return createStore(
    rootReducer,
    applyMiddleware(thunk.withExtraArgument(serviceLocator), logger)
  );
}
