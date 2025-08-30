import { useContext, useReducer } from "react";
import { BackendContext } from "./BackendContext";

const initialState = {
  loading: false,
  done: false,
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
      return {
        ...initialState, // resetting the state
        loading: true,
      };

    case actionTypes.SUCCESS:
      return {
        ...initialState, // resetting the state
        data: action.payload,
        done: true,
      };

    case actionTypes.FAILURE:
      return {
        ...initialState, // resetting the state
        error: action.payload,
        done: true,
      };
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
    console.error("useMutation:", err, err.data);
  } else {
    console.error("useMutation:", err);
  }
}

const noop = () => {};

/**
 *
 */
export function useMutation(
  fn,
  { onSuccessCallback = noop, onErrorCallback = noop }
) {
  const backend = useContext(BackendContext);
  const [state, dispatch] = useReducer(reducer, { ...initialState });
  const runMutation = (...args) => {
    if (state.loading) {
      reportError(
        new Error("useMutation: mutation has already been started once")
      );
      return;
    }

    dispatch(requestAction());

    fn(backend, ...args).then(
      (data) => {
        dispatch(successAction(data));
        onSuccessCallback(data);
      },
      (err) => {
        reportError(err);
        dispatch(failureAction(err));
        onErrorCallback(err);
      }
    );
  };

  return [runMutation, state];
}
