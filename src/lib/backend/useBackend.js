import { useEffect, useContext, useReducer } from "react";
import { BackendContext } from "./BackendContext";

const initialState = {
  loading: false,
  errored: false,
  data: null,
  error: null,
};

const actionTypes = {
  REQUEST: "REQ",
  SUCCESS: "SUC",
  FAILURE: "FAI",
};

function reducer(state = { ...initialState }, action) {
  switch (action.type) {
    case actionTypes.REQUEST:
      return { ...state, loading: true, errored: false };
    case actionTypes.SUCCESS:
      return {
        loading: false,
        errored: false,
        error: null,
        data: action.payload,
      };
    case actionTypes.FAILURE:
      return { ...state, loading: false, errored: true, error: action.payload };
  }
  return state;
}

const requestAction = () => ({ type: actionTypes.REQUEST });
const successAction = (payload) => ({ type: actionTypes.SUCCESS, payload });
const failureAction = (payload) => ({ type: actionTypes.FAILURE, payload });

/**
 * @typedef {object} BackendReturnValue - creates a new type named 'SpecialType'
 * @property {boolean} loading - is the resource loading
 * @property {boolean} errored - did we fail attempting to load the resource
 * @property {any=} data - The loaded data
 * @property {Error=} error - An optional error
 */

function reportError(err) {
  if (err.data) {
    console.error("useBackend:", err, err.data);
  } else {
    console.error("useBackend:", err);
  }
}

/**
 * useBackend hook
 *
 * @param {function} backendHandler Will be called to fetch data.
 * @param {...any} args
 * @returns {{ loading: boolean, errored: boolean, data?: any, error?: Error }}
 */
export function useBackend(fn, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
  // The reason we don't use ...rest to collect the args into an array is
  // because the dependencies are compared using the shallow-strategy from
  // React. For arrays this means that it is an identify check (x === y). This
  // will never be the case, as every time the useBackend function is called, we
  // will get a new array instance. 7 arguments seem like it should be enough,
  // but apologies in advance, should you ever find this comment after debuggin
  // why your 8th argument never made it through...

  const backend = useContext(BackendContext);
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  useEffect(() => {
    dispatch(requestAction());

    fn(backend, arg1, arg2, arg3, arg4, arg5, arg6, arg7).then(
      (data) => dispatch(successAction(data)),
      (err) => {
        reportError(err);
        dispatch(failureAction(err));
      }
    );
  }, [backend, fn, arg1, arg2, arg3, arg4, arg5, arg6, arg7]);

  return state;
}
