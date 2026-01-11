import rootReducer from './rootReducer';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedsSlice';

describe('rootReducer', () => {
  it('Проверка инициализации rootReducer', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const expectedState = {
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction)
    };

    const actualState = rootReducer(undefined, unknownAction);
    expect(actualState).toEqual(expectedState);
  });
});