describe('Media Cast Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('searches for Star Wars and visits Mark Hamill’s actor page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]', { timeout: 10000 })
      .scrollIntoView()
      .type('Star Wars');

    cy.contains('Star Wars', { timeout: 15000 }).should('be.visible').click();

    cy.url({ timeout: 10000 }).should('include', '/movie/');
    cy.contains('Star Wars', { timeout: 10000 }).should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Mark Hamill', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/person/');
    cy.contains('Mark Hamill', { timeout: 10000 }).should('exist');
    cy.contains('Biography', { timeout: 10000 }).should('exist');
    cy.contains('Known For', { timeout: 10000 }).should('exist');
  });

  it('searches for Breaking Bad and visits Bryan Cranston’s actor page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]', { timeout: 10000 })
      .scrollIntoView()
      .type('Breaking Bad');

    cy.contains('Breaking Bad', { timeout: 15000 }).should('be.visible').click();

    cy.url({ timeout: 10000 }).should('include', '/tv/');
    cy.contains('Breaking Bad', { timeout: 10000 }).should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Bryan Cranston', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/person/');
    cy.contains('Bryan Cranston', { timeout: 10000 }).should('exist');
    cy.contains('Biography', { timeout: 10000 }).should('exist');
    cy.contains('Known For', { timeout: 10000 }).should('exist');
  });
});
