import axios from 'axios';
import Cookies from 'js-cookie';
const setCookiesService = (token, name, photo, email) => {
  if (token) {
    Cookies.set('token', token, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  }
  if (name) {
    Cookies.set('name', name, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  }
  if (photo) {
    Cookies.set('photo', photo, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  }
  if (email) {
    Cookies.set('email', email, {
      path: '/',
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });
  }
  Cookies.set('navIsMin', false, {
    path: '/',
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
};
const updateUserInfoService = async (api_url) => {
  const token = Cookies.get('token');
  const response = await axios.get(`${api_url}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setCookiesService(
    token,
    response.data.data.data.name,
    response.data.data.data.photo,
    response.data.data.data.email
  );
};
const updateUserData = async (data, api_url, statesFunctions) => {
  const Token = Cookies.get('token');
  try {
    const response = await axios.patch(`${api_url}/api/users/updateMe`, data, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${Token}`,
      },
    });

    statesFunctions.setIsInfoUpdated(true);
    statesFunctions.setFirst(false);
    statesFunctions.setInfoUpdatedSuccessMessage(response.data.message);
    setCookiesService(
      null,
      response.data.data.user.name,
      response.data.data.user.photo,
      response.data.data.user.email
    );
  } catch (error) {
    /* Set Error Message */
    statesFunctions.setIsInfoUpdated(false);
    statesFunctions.setFirst(false);
    statesFunctions.setInfoUpdatedFailedMessage(error.response.data.message);
  }
};
export { updateUserInfoService, setCookiesService, updateUserData };
