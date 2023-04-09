import Cookies from 'js-cookie';
// account info reducer
const accountInfoInitialState = {
  pending: false,
  success: false,
  successMessage: '',
  error: false,
  errorMessage: '',
};
const accountInfoReducer = (state, action) => {
  if (action.type === 'UPDATING') {
    return {
      pending: true,
      success: false,
      successMessage: '',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'SUCCESS') {
    return {
      pending: false,
      success: true,
      successMessage: 'Updated successfully',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'ERROR') {
    return {
      pending: false,
      success: false,
      successMessage: '',
      error: true,
      errorMessage: action.errorMessage,
    };
  }
  if ((action.type = 'CLEAR')) {
    return {
      pending: false,
      success: false,
      successMessage: '',
      error: false,
      errorMessage: '',
    };
  }
  return accountInfoInitialState;
};
// user info reducer
const userInfoInitialState = {
  name: Cookies.get('name'),
  email: Cookies.get('email'),
  photo: Cookies.get('photo'),
  token: Cookies.get('token'),
};
const userInfoReducer = (state, action) => {
  if (action.type === 'UPDATE') {
    return {
      name: action.data.name,
      email: action.data.email,
      photo: action.data.photo,
    };
  }
  if (action.type === 'UPDATE-COOKIES') {
    return {
      name: Cookies.get('name'),
      email: Cookies.get('email'),
      photo: Cookies.get('photo'),
    };
  }

  return userInfoInitialState;
};
// password reducer
const passwordInitialState = {
  pending: false,
  success: false,
  successMessage: '',
  error: false,
  errorMessage: '',
};
const passwordReducer = (state, action) => {
  if (action.type === 'UPDATING') {
    return {
      pending: true,
      success: false,
      successMessage: '',
      error: false,
      errorMessage: '',
    };
  }
  if (action.type === 'SUCCESS') {
    return {
      pending: false,
      success: true,
      successMessage: 'Updated successfully',
      error: false,
      errorMessage: '',
    };
  }

  if (action.type === 'ERROR') {
    return {
      pending: false,
      success: false,
      successMessage: '',
      error: true,
      errorMessage: action.errorMessage,
    };
  }
};

export {
  accountInfoInitialState,
  accountInfoReducer,
  userInfoInitialState,
  userInfoReducer,
  passwordInitialState,
  passwordReducer,
};
