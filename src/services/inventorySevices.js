import axios from 'axios';
import Cookies from 'js-cookie';
import FormData from 'form-data';
import store from '../store';
const api_url = store.getState().authUi.url_api;
const token = Cookies.get('token');
const fetchInventory = async () => {
  try {
    const response = await axios.get(`${api_url}/api/inventory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: 'success', dataArray: response.data.data.data };
  } catch (error) {
    return { status: 'error', message: error.response.data.message };
  }
};
const createInventoryItem = async (data) => {
  let formData = new FormData();
  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.quantity) {
    formData.append('quantity', data.quantity);
  }
  if (data.type) {
    formData.append('Type', data.type);
  }
  if (data.available) {
    formData.append('available', data.available === 'true');
  }
  if (data.photo) {
    formData.append('photo', data.photo);
  }
  try {
    const response = await axios.post(`${api_url}/api/inventory`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: 'success', dataArray: response.data.data.data };
  } catch (error) {
    return { status: 'error', message: error.response.data.message };
  }
};
const updateInventoryItem = async (data, id) => {
  let formData = new FormData();
  if (data.name) {
    formData.append('name', data.name);
  }
  if (data.quantity) {
    formData.append('quantity', data.quantity);
  }
  if (data.type) {
    formData.append('Type', data.type);
  }
  if (data.available) {
    formData.append('available', data.available === 'true');
  }
  if (data.photo) {
    formData.append('photo', data.photo);
  }
  try {
    const response = await axios.patch(
      `${api_url}/api/inventory/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', dataArray: response.data.data.data };
  } catch (error) {
    return { status: 'error', message: error.response.data.message };
  }
};
const deleteInventoryItem = async (id) => {
  try {
    const response = await axios.delete(`${api_url}/api/inventory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: 'success' };
  } catch (error) {
    return { status: 'error', message: error.response.data.message };
  }
};
const getItemInventory = async (id) => {
  try {
    const response = await axios.get(`${api_url}/api/inventory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { status: 'success', data: response.data.data.data };
  } catch (error) {
    return { status: 'error', message: error.response.data.message };
  }
};
export {
  fetchInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getItemInventory,
};
