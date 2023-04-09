/* ************************************* */
/* ********* Reducers Functions ******** */
/* ************************************* */
//Fetching Loading Reducer
const intialFetchingLoadingState = {
  state: false,
  success: false,
  successMessage: '',
  error: false,
  errorMessage: '',
};
const fetchingLoadingReducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return {
      state: true,
      success: state.success,
      successMessage: state.successMessage,
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-LOADING') {
    return {
      state: false,
      success: state.success,
      successMessage: state.successMessage,
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-DELETED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Deleted Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-CREATED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Created Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'DONE-UPDATED') {
    return {
      state: false,
      success: true,
      successMessage: 'Item Updated Successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'ERROR') {
    return {
      state: false,
      success: false,
      successMessage: '',
      error: true,
      errorMessage: action.errorMessage,
    };
  }
  if (action.type === 'CLEAR') {
    return {
      state: false,
      success: false,
      successMessage: '',
      error: false,
      errorMessage: '',
    };
  }
  return {
    state: false,
    success: false,
    successMessage: '',
    error: false,
    errorMessage: '',
  };
};
//Update Loading Reducer
const intialUpdateLoadingState = {
  state: false,
  error: false,
  errorMessage: '',
};
const updateLoadingReducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return { state: true, error: false, errorMessage: '' };
  }
  if (action.type === 'DONE') {
    return { state: false, error: false, errorMessage: '' };
  }
  if (action.type === 'CLEAR') {
    return { state: false, error: false, errorMessage: '' };
  }
  if (action.type === 'ERROR') {
    return {
      state: false,
      error: true,
      errorMessage: action.errorMessage,
    };
  }
  return { state: false, error: false, errorMessage: '' };
};

export {
  fetchingLoadingReducer,
  intialFetchingLoadingState,
  updateLoadingReducer,
  intialUpdateLoadingState,
};
