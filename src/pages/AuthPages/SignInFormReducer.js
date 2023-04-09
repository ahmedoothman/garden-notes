// ///////////////////////////////////////////
// sign in states reducer
// ///////////////////////////////////////////
const signInStatesInitialState = {
  invalid: false,
  errorMessage: '',
  pending: false,
};
const signInStatesReducer = (state, action) => {
  if (action.type === 'VALID') {
    return {
      invalid: false,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'INVALID') {
    return {
      invalid: true,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      invalid: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      invalid: state.invalid,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return signInStatesInitialState;
};
export { signInStatesInitialState, signInStatesReducer };
