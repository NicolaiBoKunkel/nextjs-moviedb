describe('Media Cast Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('searches for Star Wars and visits Mark Hamill’s actor page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]', { timeout: 10000 }).should('exist').type('Star Wars');

    // Wait for and click search result
    cy.contains('Star Wars', { timeout: 15000 }).should('be.visible').click();

    // Wait for navigation
    cy.url({ timeout: 10000 }).should('include', '/movie/');
    cy.contains('Star Wars', { timeout: 10000 }).should('exist');
    cy.contains('Cast', { timeout: 10000 }).scrollIntoView();

    cy.contains('Mark Hamill', { timeout: 15000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/person/');
    cy.contains('Mark Hamill', { timeout: 10000 }).should('exist');
    cy.contains('Biography').should('exist');
    cy.contains('Known For').should('exist');
  });
});
