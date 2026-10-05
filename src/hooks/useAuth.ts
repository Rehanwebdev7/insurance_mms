import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setUser, switchDemoRole, logout } from '../store/auth/authSlice';
import { RoleCode } from '../types/permission.types';
import { User } from '../types/auth.types';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const changeDemoRole = (role: RoleCode) => {
    dispatch(switchDemoRole(role));
  };

  const loginUser = (user: User) => {
    dispatch(setUser(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    changeDemoRole,
    loginUser,
    logoutUser,
  };
}
