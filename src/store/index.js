import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialAuthUiSlice = {
  navIsShown: true,
  sideNavISMin: false,
  activeTab: 'Garden',
  url_api: 'https://beautiful-tan-boot.cyclic.app',
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
      state.activeTab = '';
    },
    setNotesActive(state) {
      state.activeTab = 'Notes';
    },
  },
});

const store = configureStore({
  reducer: { authUi: authUiSlice.reducer },
});

export const authUiActions = authUiSlice.actions;
export default store;
