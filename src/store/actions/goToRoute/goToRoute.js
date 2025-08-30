import { setActiveRoute } from "../setActiveRoute/setActiveRoute";
import { buildUrlFrom } from "../../../lib/routes";

export const goToRoute = params => {
  return dispatch => {
    // If no params is provided
    if (!params) {
      return dispatch(setActiveRoute({ pageName: "loading" }));
    }

    const { pageName, dataQuery } = params;
    window.history.pushState(
      null,
      "", // pageName,
      buildUrlFrom({ pageName, dataQuery })
    );

    dispatch(setActiveRoute({ pageName, dataQuery }));
  };
};
