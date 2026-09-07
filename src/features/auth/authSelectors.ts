import { RootState } from '@/store';

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsAuthLoading = (state: RootState) => state.auth.status === 'loading';
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === 'ADMIN' || state.auth.user?.role === 'SUPER_ADMIN';
export const selectIsSuperAdmin = (state: RootState) =>
  state.auth.user?.role === 'SUPER_ADMIN';
