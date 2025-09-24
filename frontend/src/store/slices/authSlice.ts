import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { authService } from '../../services/api';



export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // THIS IS THE CHANGED PART - We now call the real API
      const response = await authService.login(credentials);
      return response.data; // { user: User, token: string }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    try {
      // THIS IS THE CHANGED PART - We now call the real API
      const response = await authService.register(userData);
      return response.data; // { user: User, token: string }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);


const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
};

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       // Static authentication - accept any credentials
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Return mock user data
//       return {
//         user: {
//           id: 1,
//           email: credentials.email,
//           firstName: 'Demo',
//           lastName: 'User',
//           createdAt: new Date().toISOString(),
//         },
//         token: 'demo-token-' + Date.now(),
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Login failed');
//     }
//   }
// );


// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
//     try {
//       // Static authentication - accept any registration
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Return mock user data
//       return {
//         user: {
//           id: Date.now(),
//           email: userData.email,
//           firstName: userData.firstName,
//           lastName: userData.lastName,
//           createdAt: new Date().toISOString(),
//         },
//         token: 'demo-token-' + Date.now(),
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );


// ADDED: Thunk to fetch user profile if authenticated
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    // ADDED: Reducer to set user from getProfile
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      // ADDED: Handle getProfile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;