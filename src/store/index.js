import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialAuthUiSlice = {
  navIsShown: true,
  sideNavISMin: false,
  activeTab: 'garden',
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
      state.activeTab = 'garden';
    },
    setInventoryActive(state) {
      state.activeTab = 'inventory';
    },
    setNotesActive(state) {
      state.activeTab = 'notes';
    },
  },
});

const store = configureStore({
  reducer: { authUi: authUiSlice.reducer },
});

export const authUiActions = authUiSlice.actions;
export default store;
