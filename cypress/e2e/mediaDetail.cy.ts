let token: string;

describe('Realistic Media Favorite Flow', () => {
  before(() => {
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').type('test@test.dk');
    cy.get('input[placeholder="Password"]').type('test');
    cy.get('button[type="submit"]').click();

    // ✅ Wait for correct redirect and profile render
    cy.url({ timeout: 10000 }).should('include', '/user/');
    cy.contains('👤 Profile: test', { timeout: 10000 }).should('exist');

    cy.window().then((win) => {
      token = win.localStorage.getItem('token')!;
    });
  });


  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('token', token);
    });
  });

  it('searches for a movie and favorites it from the detail page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]').type('Star Wars');
    cy.contains('Star Wars').click();
    cy.url().should('include', '/movie/');
    cy.contains('Star Wars').should('exist');

    cy.get('button')
      .contains(/Add to Favorites|Remove from Favorites/)
      .then(($btn) => {
        cy.wrap($btn).click();
        cy.get('button').should('contain.text', '★ Remove from Favorites');
      });
  });

  it('searches for a TV show and favorites it from the detail page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]').type('Breaking Bad');
    cy.contains('Breaking Bad').click();
    cy.url().should('include', '/tv/');
    cy.contains('Breaking Bad').should('exist');

    cy.get('button')
      .contains(/Add to Favorites|Remove from Favorites/)
      .then(($btn) => {
        cy.wrap($btn).click();
        cy.get('button').should('contain.text', '★ Remove from Favorites');
      });
  });

  it('shows favorited media on the user profile page via header link', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', token);
      },
    });

    cy.contains('Welcome, test!').click();
    cy.url().should('include', '/user/test');
    cy.contains('👤 Profile: test').should('exist');
    cy.contains('test@test.dk').should('exist');
    cy.contains('Star Wars').should('exist');
    cy.contains('Breaking Bad').should('exist');

    cy.contains('Star Wars').click();
    cy.url().should('include', '/movie/');
    cy.go('back');

    cy.contains('Breaking Bad').click();
    cy.url().should('include', '/tv/');
  });
});
