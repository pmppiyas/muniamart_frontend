import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, CustomerUser } from './authTypes';
import { authApi } from '@/services/api/authApi';
import { customerApi } from '@/services/api/customerApi';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CustomerUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'unauthenticated';
    },

    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload.data.user) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.status = 'authenticated';
        }
      })
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        if (state.status === 'idle') {
          state.status = 'loading';
        }
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.status = 'authenticated';
      })
      .addMatcher(customerApi.endpoints.updateProfile.matchFulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        if (!state.isAuthenticated) {
          state.user = null;
          state.isAuthenticated = false;
          state.status = 'unauthenticated';
        }
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'unauthenticated';
      });
  },
});

export const { setUser, clearAuth, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;
