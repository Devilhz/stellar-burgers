beforeEach(() => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'ingredients'
  );
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('user');
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('order');
  cy.visit('/');
  cy.wait('@ingredients');
});

afterEach('Очистка localStorage, cookies', () => {
  cy.clearLocalStorage();
  cy.clearCookie('accessToken');
});

describe('Конструктор бургера', () => {
  it('Добавление булки, начинки и соуса в конструктор', () => {
    cy.get('[data-testid=ingredient]').eq(0).find('button').click();
    cy.get('[data-testid=ingredient]').eq(2).find('button').click();
    cy.get('[data-testid=ingredient]').eq(12).find('button').click();

    cy.get('[data-testid=bun-first]').should('exist').and('contain', 'булка');
    cy.get('[data-testid=filling]')
      .should('exist')
      .and('contain', 'Биокотлета');
    cy.get('[data-testid=filling]').should('exist').and('contain', 'Соус');
    cy.get('[data-testid=bun-second]').should('exist').and('contain', 'булка');
  });
});

describe('Модальное окно', () => {
  it('Открытие модального окна ингредиента', () => {
    cy.get('[data-testid=ingredient]').first().click();
    cy.get('[data-testid=modal]').should('be.visible').and('contain', 'булка');
  });
  it('Закрытие по клику на оверлей', () => {
    cy.get('[data-testid=ingredient]').first().click();
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });
  it('Закрытие по клику на крестик', () => {
    cy.get('[data-testid=ingredient]').first().click();
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  it('Заказ успешно создан', () => {
    // Авторизация (моковые токены)
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    // Собираем бургер (кликаем на несколько карточек)
    const pick = (index: number) =>
      cy
        .get('[data-testid=ingredient]')
        .eq(index)
        .find('button')
        .click();

    [0, 2, 12].forEach(pick);

    // Оформляем заказ, проверяем модалку
    cy.contains('button', 'Оформить заказ').click();
    cy.get('[data-testid=modal]').should('be.visible');

    // Проверяем номер заказа
    cy.fixture('order.json').then((data) => {
      cy.get('[data-testid=order]').should(
        'contain',
        String(data.order.number)
      );
    });

    // Закрываем модалку
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    cy.get('[data-testid=filling]').should('not.contain', 'Биокотлета');
    cy.get('[data-testid=filling]').should('not.contain', 'Соус');
    cy.get('[data-testid=bun-first]').should('not.contain', 'булка');
    cy.get('[data-testid=bun-second]').should('not.contain', 'булка');
  });
});