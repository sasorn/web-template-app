import { SET_ACTIVE_ROUTE } from "../../constants";
import { qualifySelector } from "../../utils";

const initialState = {
  pageName: "home",
  dataQuery: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_ROUTE:
      return {
        ...action.payload
      };
    default:
      return state;
  }
}

export const name = "routing";
export default { [name]: reducer };

export const getRouterParams = qualifySelector(name, state => state);
export const getPageName = qualifySelector(name, ({ pageName }) => pageName);
