export const qualifySelector =
  (name, selector) =>
  (state, ...args) => {
    const reduxStateEntry = state[name];

    if (!reduxStateEntry) {
      throw new Error(
        `Redux state does not contain data at key "${name}". ` +
          "Did you forget to add a reducer in combineReducers?"
      );
    }

    return selector(reduxStateEntry, ...args);
  };

export const createAction =
  (type, payloadFactory = x => x) =>
  (...args) => ({
    type,
    payload: payloadFactory(...args)
  });

export const createErrorAction = type => error => ({
  type,
  error,
  errorAction: true
});
