const SELECTORS = {
  ingredient: '[data-testid=ingredient]',
  ingredientName: '[data-testid=ingredient-name]',
  bunFirst: '[data-testid=bun-first]',
  bunSecond: '[data-testid=bun-second]',
  filling: '[data-testid=filling]',
  modal: '[data-testid=modal]',
  modalTitle: '[data-testid=modal-title]',
  modalOverlay: '[data-testid=modal-overlay]',
  modalClose: '[data-testid=modal-close]',
  order: '[data-testid=order]',
} as const;

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
    cy.get(SELECTORS.ingredient).eq(0).find('button').click({ force: true });
    cy.get(SELECTORS.ingredient).eq(2).find('button').click({ force: true });
    cy.get(SELECTORS.ingredient).eq(12).find('button').click({ force: true });

    cy.get(SELECTORS.bunFirst).should('exist').and('contain', 'булка');
    cy.get(SELECTORS.filling).should('exist').and('contain', 'Биокотлета');
    cy.get(SELECTORS.filling).should('exist').and('contain', 'Соус');
    cy.get(SELECTORS.bunSecond).should('exist').and('contain', 'булка');
  });
});

describe('Модальное окно', () => {
  const testIngredients = [
    { index: 0, type: 'булка' },
    { index: 2, type: 'начинка' },
    { index: 12, type: 'соус' }
  ];

  testIngredients.forEach(({ index, type }) => {
    it(`Открытие модального окна для ${type} ингредиента`, () => {
      cy.get(SELECTORS.ingredient).eq(index)
        .find(SELECTORS.ingredientName)
        .invoke('text')
        .then((ingredientName) => {
          cy.get(SELECTORS.ingredient).eq(index).click({ force: true });
          cy.get(SELECTORS.modal).should('be.visible');
          cy.get(SELECTORS.modalTitle).should('have.text', ingredientName);
        });
    });
  });

  it('Закрытие по клику на оверлей', () => {
    cy.get(SELECTORS.ingredient).first()
      .find(SELECTORS.ingredientName)
      .invoke('text')
      .then((ingredientName) => {
        cy.get(SELECTORS.ingredient).first().click({ force: true });
        cy.get(SELECTORS.modal).should('be.visible');
        cy.get(SELECTORS.modalTitle).should('have.text', ingredientName);
        
        cy.get(SELECTORS.modalOverlay).click({ force: true });
        cy.get(SELECTORS.modal).should('not.exist');
      });
  });

  it('Закрытие по клику на крестик', () => {
    cy.get(SELECTORS.ingredient).eq(2)
      .find(SELECTORS.ingredientName)
      .invoke('text')
      .then((ingredientName) => {
        cy.get(SELECTORS.ingredient).eq(2).click({ force: true });
        cy.get(SELECTORS.modal).should('be.visible');
        cy.get(SELECTORS.modalTitle).should('have.text', ingredientName);
        
        cy.get(SELECTORS.modalClose).click({ force: true });
        cy.get(SELECTORS.modal).should('not.exist');
      });
  });
});

describe('Создание заказа', () => {
  it('Заказ успешно создан', () => {
    cy.setCookie('accessToken', 'test-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    const pick = (index: number) =>
      cy.get(SELECTORS.ingredient).eq(index).find('button').click({ force: true });

    [0, 2, 12].forEach(pick);

    cy.contains('button', 'Оформить заказ').click({ force: true });
    cy.get(SELECTORS.modal).should('be.visible');

    cy.fixture('order.json').then((data) => {
      cy.get(SELECTORS.order).should('contain', String(data.order.number));
    });

    cy.get(SELECTORS.modalClose).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
    cy.get(SELECTORS.filling).should('not.contain', 'Биокотлета');
    cy.get(SELECTORS.filling).should('not.contain', 'Соус');
    cy.get(SELECTORS.bunFirst).should('not.contain', 'булка');
    cy.get(SELECTORS.bunSecond).should('not.contain', 'булка');
  });
});