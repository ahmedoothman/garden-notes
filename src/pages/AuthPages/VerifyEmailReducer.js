// verify email states reducer
const verifyEmailStatesInitialState = {
  error: false,
  success: false,
  errorMessage: '',
  pending: false,
};
const verifyEmailStatesReducer = (state, action) => {
  if (action.type === 'SUCCESS') {
    return {
      error: false,
      success: true,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'ERROR') {
    return {
      error: true,
      success: false,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      error: false,
      success: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      error: state.error,
      success: state.success,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return verifyEmailStatesInitialState;
};

export { verifyEmailStatesInitialState, verifyEmailStatesReducer };
