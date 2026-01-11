import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type UserState = {
  user: TUser | null;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
};

export const initialState: UserState = {
  user: null,
  authChecked: false,
  loading: false,
  error: null
};

// Регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Вход
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Получить данные пользователя
export const fetchUser = createAsyncThunk('auth/fetchUser', getUserApi);

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'auth/update',
  async (userData: { name: string; email: string; password?: string }) => {
    const res = await updateUserApi(userData);
    return res.user;
  }
);

// Выход
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    markAuthChecked(state) {
      state.authChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login error';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Register error';
      })
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.authChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.authChecked = true;
      })
      // Update Profile
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update error';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.authChecked = true;
      });
  }
});

export default userSlice.reducer;