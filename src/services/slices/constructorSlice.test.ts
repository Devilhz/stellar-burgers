import reducer, {
  addIngredient,
  removeIngredient,
  repositIngredient
} from './constructorSlice';

describe('управление ингредиентами бургера', () => {
  it('должен добавлять, перемещать и удалять ингредиенты', () => {
    // Моки ингредиентов
    const bun = {
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
    };

    const sauce = {
      _id: '2',
      name: 'Соус',
      type: 'sauce',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 10,
      price: 10,
      image: 'image.png',
      image_large: 'image-large.png',
      image_mobile: 'image-mobile.png'
    };

    const main = {
      _id: '3',
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
    };

    // Инициализация стора
    let state = reducer(undefined, { type: 'INIT' });
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);

    // Добавление булки
    state = reducer(state, addIngredient(bun));
    expect(state.bun).not.toBeNull();
    expect(state.bun?.type).toBe('bun');

    // Добавление соуса и начинки
    state = reducer(state, addIngredient(sauce));
    state = reducer(state, addIngredient(main));

    expect(state.ingredients).toHaveLength(2);
    expect(typeof state.ingredients[0].id).toBe('string');
    expect(typeof state.ingredients[1].id).toBe('string');

    const firstId = state.ingredients[0].id;

    // Перемещение ингредиента вверх
    const before = state.ingredients.map((i) => i._id);

    state = reducer(state, repositIngredient({ index: 1, to: 'up' }));

    const after = state.ingredients.map((i) => i._id);
    expect(after).toEqual([before[1], before[0]]);

    // Удаление ингредиента по id
    state = reducer(state, removeIngredient(firstId));

    expect(state.ingredients).toHaveLength(1);
    expect(
      state.ingredients.find((i) => i.id === firstId)
    ).toBeUndefined();
  });
});