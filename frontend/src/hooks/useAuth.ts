import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginUser, registerUser, logout } from '../store/slices/authSlice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    (credentials: { email: string; password: string }) => {
      return dispatch(loginUser(credentials) as any);
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: { email: string; password: string; firstName: string; lastName: string }) => {
      return dispatch(registerUser(userData) as any);
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: signOut,
  };
};

// Remove the useEvents export from this file - it should be in its own file