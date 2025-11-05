import { createSlice } from '@reduxjs/toolkit';
import { getUser, setUser, removeUser, setToken, removeToken } from '../../utils/api';

const initialState = {
  user: getUser(),
  token: null,
  isAuthenticated: !!getUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      setUser(user);
      setToken(token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeUser();
      removeToken();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserCountry = (state) => state.auth.user?.country;

