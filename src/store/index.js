import { createSlice, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const initialAuthUiSlice = {
  navIsShown: true,
  sideNavISMin: false,
  activeTab: 'Garden',
  url_api: 'https://api.gardennotes.live',
};
const authUiSlice = createSlice({
  name: 'auth',
  initialState: initialAuthUiSlice,
  reducers: {
    setShown(state) {
      state.navIsShown = true;
    },
    setHidden(state) {
      state.navIsShown = false;
    },
    toggleSideNav(state) {
      state.sideNavISMin = !state.sideNavISMin;
    },
    setGardenActive(state) {
      state.activeTab = 'Garden';
    },
    setInventoryActive(state) {
      state.activeTab = 'Inventory';
    },
    setSettingsActive(state) {
      state.activeTab = 'Settings';
    },
    setNotesActive(state) {
      state.activeTab = 'Notes';
    },
  },
});
const initialUserInfoSlice = {
  name: Cookies.get('name'),
  photo: Cookies.get('photo'),
  email: Cookies.get('email'),
};
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: initialUserInfoSlice,
  reducers: {
    updateUserData(state, action) {
      state.name = action.payload.name;
      state.photo = action.payload.photo;
      state.email = action.payload.email;
    },
  },
});
const store = configureStore({
  reducer: { authUi: authUiSlice.reducer, userInfo: userInfoSlice.reducer },
});

export const authUiActions = authUiSlice.actions;
export const userInfoActions = userInfoSlice.actions;
export default store;
