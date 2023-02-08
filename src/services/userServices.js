import axios from 'axios';

const updateUserInfoService = async (token, api_url, setCookiesHandler) => {
  const response = await axios.get(`${api_url}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setCookiesHandler(
    token,
    response.data.data.data.name,
    response.data.data.data.photo,
    response.data.data.data.email
  );
};

export { updateUserInfoService };
