// ///////////////////////////////////////////
// foreget password states reducer
// ///////////////////////////////////////////
const forgetPssswordStatesIntialStates = {
  success: false,
  error: false,
  errorMessage: '',
  pending: false,
};
const forgetPssswordStatesReducer = (state, action) => {
  if (action.type === 'SUCCESS') {
    return {
      success: true,
      error: false,
      errorMessage: '',
      pending: false,
    };
  }
  if (action.type === 'ERROR') {
    return {
      success: false,
      error: true,
      errorMessage: action.errorMessage,
      pending: false,
    };
  }
  if (action.type === 'PENDING') {
    return {
      success: false,
      error: false,
      errorMessage: '',
      pending: true,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      success: state.success,
      error: state.error,
      errorMessage: state.errorMessage,
      pending: false,
    };
  }
  return forgetPssswordStatesIntialStates;
};

export { forgetPssswordStatesIntialStates, forgetPssswordStatesReducer };
