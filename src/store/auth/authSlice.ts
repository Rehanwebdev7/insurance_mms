import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/auth.types';
import { storageService } from '../../services/storage/storage.service';

const initialUser = storageService.getAuthUser() || storageService.getUsers()[0] || null;

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
  token: initialUser ? 'mock-jwt-token' : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = 'mock-jwt-token';
      storageService.saveAuthUser(action.payload);
    },
    switchDemoRole(state, action: PayloadAction<User['role']>) {
      const users = storageService.getUsers();
      const targetUser = users.find(u => u.role === action.payload);
      if (targetUser) {
        state.user = targetUser;
        state.isAuthenticated = true;
        storageService.saveAuthUser(targetUser);
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      storageService.saveAuthUser(null);
    },
  },
});

export const { setUser, switchDemoRole, logout } = authSlice.actions;
export default authSlice.reducer;
