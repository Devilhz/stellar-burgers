import orderReducer, { fetchOrderByNumber, initialState } from './orderSlice';
import type { OrderState } from './orderSlice';
import type { TOrder } from '@utils-types';

describe('работа с текущим заказом', () => {
  // Мок одного заказа
  const mockOrder: TOrder = {
    _id: 'order_user_1',
    status: 'done',
    name: 'User order #1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    number: 101,
    ingredients: ['bun_1', 'main_1']
  };

  it('должен возвращать initialState при неизвестном action', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('clearCurrentOrder: очищает заказ и сбрасывает loading и error', () => {
    const prevState: OrderState = {
      order: mockOrder,
      loading: true,
      error: 'Some error'
    };

    const action = { type: 'order/clearCurrentOrder' };

    expect(orderReducer(prevState, action)).toEqual(initialState);
  });

  it('pending: включает loading и очищает error', () => {
    const prevState: OrderState = {
      order: mockOrder,
      loading: false,
      error: 'Old error'
    };

    const action = fetchOrderByNumber.pending('requestId', 12345);

    expect(orderReducer(prevState, action)).toEqual({
      order: mockOrder,
      loading: true,
      error: null
    });
  });

  it('fulfilled: сохраняет заказ и выключает loading', () => {
    const prevState: OrderState = {
      order: null,
      loading: true,
      error: null
    };

    const action = fetchOrderByNumber.fulfilled(mockOrder, 'requestId', 12345);

    expect(orderReducer(prevState, action)).toEqual({
      order: mockOrder,
      loading: false,
      error: null
    });
  });

  it('rejected: выключает loading и записывает сообщение об ошибке', () => {
    const prevState: OrderState = {
      order: null,
      loading: true,
      error: null
    };

    const action = fetchOrderByNumber.rejected(
      new Error('fail'),
      'requestId',
      12345
    );

    expect(orderReducer(prevState, action)).toEqual({
      order: null,
      loading: false,
      error: 'fail'
    });
  });
});