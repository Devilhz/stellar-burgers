import reducer, {
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logoutUser,
  initialState
} from './userSlice';

describe('авторизация и профиль пользователя', () => {
  const mockUser = { email: 'test@test.ru', name: 'Test' };

  it('должен возвращать initialState при неизвестном action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('вход пользователя', () => {
    const arg = { email: 'test@test.ru', password: '123' };

    it('pending: включает loading и очищает error', () => {
      const state = reducer(initialState, loginUser.pending('req1', arg));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: сохраняет user, выключает loading и выставляет authChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true },
        loginUser.fulfilled(mockUser, 'req1', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.authChecked).toBe(true);
    });

    it('rejected: выключает loading и записывает сообщение об ошибке', () => {
      const state = reducer(
        { ...initialState, loading: true, error: null },
        loginUser.rejected(new Error('Login failed'), 'req1', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });

  describe('регистрация пользователя', () => {
    const arg = { email: 'test@test.com', password: '123', name: 'Test' };

    it('pending: включает loading и очищает error', () => {
      const state = reducer(initialState, registerUser.pending('req2', arg));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: сохраняет user, выключает loading и выставляет authChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true },
        registerUser.fulfilled(mockUser, 'req2', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.authChecked).toBe(true);
    });

    it('rejected: выключает loading и записывает сообщение об ошибке', () => {
      const state = reducer(
        { ...initialState, loading: true, error: null },
        registerUser.rejected(new Error('Register failed'), 'req2', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Register failed');
    });
  });

  describe('проверка авторизации и загрузка пользователя', () => {
    it('pending: включает loading', () => {
      const state = reducer(initialState, fetchUser.pending('req3'));
      expect(state.loading).toBe(true);
    });

    it('fulfilled', () => {
      const payload = { user: mockUser };

      const state = reducer(
        { ...initialState, loading: true },
        fetchUser.fulfilled(payload as any, 'req3')
      );

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.authChecked).toBe(true);
    });

    it('rejected: выключает loading и всё равно выставляет authChecked=true', () => {
      const state = reducer(
        { ...initialState, loading: true, authChecked: false },
        fetchUser.rejected(new Error('Fetch failed'), 'req3')
      );

      expect(state.loading).toBe(false);
      expect(state.authChecked).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('обновление профиля', () => {
    const arg = { name: 'New Name', email: 'new@test.ru' };
    const updatedUser = { email: 'new@test.ru', name: 'New Name' };

    it('pending: включает loading и очищает error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        updateUser.pending('req4', arg)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled: выключает loading и обновляет user', () => {
      const state = reducer(
        { ...initialState, loading: true, user: mockUser },
        updateUser.fulfilled(updatedUser, 'req4', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });

    it('rejected: выключает loading и записывает сообщение об ошибке', () => {
      const state = reducer(
        { ...initialState, loading: true, error: null },
        updateUser.rejected(new Error('Update failed'), 'req4', arg)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Update failed');
    });
  });

  describe('выход из аккаунта', () => {
    it('fulfilled: очищает user и выставляет authChecked=true', () => {
      const state = reducer(
        { ...initialState, user: mockUser, authChecked: false },
        logoutUser.fulfilled(undefined, 'req5')
      );

      expect(state.user).toBeNull();
      expect(state.authChecked).toBe(true);
    });
  });
});
