// ///////////////////////////////////////////
// sign up states reducer
// ///////////////////////////////////////////
const signUpStatesInitialState = {
  valid: false,
  invalid: false,
  errorMessage: '',
  pending: false,
};
const signUpStatesReducer = (state, action) => {
  if (action.type === 'VALID') {
    return {
      valid: true,
      invalid: false,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'INVALID') {
    return {
      valid: false,
      invalid: true,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      valid: false,
      invalid: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      valid: state.valid,
      invalid: state.invalid,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return signUpStatesInitialState;
};
export { signUpStatesInitialState, signUpStatesReducer };
