import reducer, {
  fetchFeed,
  fetchUserOrders,
  initialState
} from './feedsSlice';
import { getFeedsApi } from '@api';
import type { FeedsState } from './feedsSlice';
import type { TOrder } from '@utils-types';

// Тип payload, который возвращает API ленты заказов
type TFeedPayload = Awaited<ReturnType<typeof getFeedsApi>>;

describe('feedsSlice', () => {
  // Мок заказов пользователя
  const userOrdersMock: TOrder[] = [
    {
      _id: 'order_user_1',
      status: 'done',
      name: 'User order #1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      number: 101,
      ingredients: ['bun_1', 'main_1']
    }
  ];

  // Мок ответа API для общей ленты заказов
  const feedMock: TFeedPayload = {
    success: true,
    orders: [
      {
        _id: 'order_feed_1',
        status: 'pending',
        name: 'Feed order #1',
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        number: 202,
        ingredients: ['bun_2', 'sauce_1', 'main_2']
      }
    ],
    total: 999,
    totalToday: 25
  };

  it('должен возвращать initialState при неизвестном action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  describe('fetchUserOrders — получение заказов пользователя', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, error: 'prev error' },
        fetchUserOrders.pending('req1')
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: выключает loading и сохраняет заказы пользователя', () => {
      const state = reducer(
        { ...initialState, loading: true, error: 'prev error' },
        fetchUserOrders.fulfilled(userOrdersMock, 'req1', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(userOrdersMock);
    });

    it('rejected: выключает loading и сохраняет текст ошибки', () => {
      const state = reducer(
        { ...initialState, loading: true },
        fetchUserOrders.rejected(
          new Error('User orders failed'),
          'req1',
          undefined
        )
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('User orders failed');
    });
  });

  describe('fetchFeed — получение общей ленты заказов', () => {
    it('pending: включает loading и очищает ошибку', () => {
      const state = reducer(
        { ...initialState, error: 'prev error' },
        fetchFeed.pending('req2')
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: сохраняет заказы ленты и общую статистику', () => {
      const state = reducer(
        { ...initialState, loading: true, error: 'prev error' },
        fetchFeed.fulfilled(feedMock, 'req2', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.feedOrders).toEqual(feedMock.orders);
      expect(state.feed).toEqual({
        total: feedMock.total,
        totalToday: feedMock.totalToday
      });
    });

    it('rejected: выключает loading и записывает ошибку', () => {
      const state = reducer(
        { ...initialState, loading: true },
        fetchFeed.rejected(new Error('Feed failed'), 'req2', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Feed failed');
    });
  });
});
