import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, getFeedsApi } from '@api';

export interface FeedsState {
  userOrders: TOrder[];
  feedOrders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  loading: boolean;
  error: string | null;
}

export const initialState: FeedsState = {
  userOrders: [],
  feedOrders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};
export const fetchUserOrders = createAsyncThunk(
  'feeds/fetchUserOrders',
  getOrdersApi
);

export const fetchFeed = createAsyncThunk('feeds/fetchFeed', getFeedsApi);

const ordersSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User orders
      .addCase(fetchUserOrders.pending, (state) => {
        console.log('[User orders] Загрузка начата');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log('[User orders] Успешный ответ');
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        console.log('[User orders] Ошибка');
        state.loading = false;
        state.error = action.error.message || 'User orders error';
      })
      // Feed
      .addCase(fetchFeed.pending, (state) => {
        console.log('[Feed] Запрос отправлен');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        console.log('[Feed] Успешный ответ');
        state.feedOrders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        console.log('[Feed] Ошибка');
        state.loading = false;
        state.error = action.error.message || 'Feed error';
      });
  }
});

export default ordersSlice.reducer;
