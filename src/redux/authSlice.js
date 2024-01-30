import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    registerId: null,
    registerOpen: 0,
    userData: null,
    grandTotalPrice: 0,
    isLoggedIn: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    setRegisterId: (state, action) => {
      state.registerId = action.payload;
    },
    setRegisterOpen: (state, action) => {
      state.registerOpen = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setGrandTotalPrice: (state, action) => {
      state.grandTotalPrice = action.payload;
    },
    clearToken: state => {
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const {
  setToken,
  clearToken,
  setRegisterId,
  setRegisterOpen,
  setUserData,
  setGrandTotalPrice,
} = authSlice.actions;
export const selectToken = state => state.auth.token;
export const selectRegisterId = state => state.auth.registerId;
export const selectRegisterOpen = state => state.auth.registerOpen;
export const selectUserData = state => state.auth.userData;
export const selectGrandTotalPrice = state => state.auth.grandTotalPrice;
export const selectIsLoggedIn = state => state.auth.isLoggedIn;
export default authSlice.reducer;
