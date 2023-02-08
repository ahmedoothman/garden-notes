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

export { updateUserInfoService, setCookiesService };
