import reducer, { fetchIngredients, initialState } from './ingredientsSlice';

describe('загрузка ингредиентов', () => {

  // Мок данных ингредиентов
  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png'
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      price: 50,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png'
    }
  ];

  it('должен возвращать initialState при неизвестном action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('pending: включает loading и очищает error', () => {
    const prevState = {
      ...initialState,
      error: 'Some error'
    };

    const nextState = reducer(
      prevState,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.ingredients).toEqual([]);
  });

  it('fulfilled: выключает loading и сохраняет список ингредиентов', () => {
    const prevState = {
      ...initialState,
      loading: true
    };

    const nextState = reducer(
      prevState,
      fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.ingredients).toEqual(mockIngredients);
  });

  it('rejected: выключает loading и сохраняет сообщение об ошибке', () => {
    const prevState = {
      ...initialState,
      loading: true
    };

    const nextState = reducer(
      prevState,
      fetchIngredients.rejected(
        new Error('Network error'),
        'requestId',
        undefined
      )
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Network error');
  });

  it(
    "rejected без error.message: записывает дефолтную ошибку 'Loading ingredients error'",
    () => {
      const prevState = {
        ...initialState,
        loading: true
      };
      
      const rejectedWithoutMessage = {
        type: fetchIngredients.rejected.type,
        error: { message: undefined }
      };

      const nextState = reducer(prevState, rejectedWithoutMessage);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Loading ingredients error');
    }
  );
});