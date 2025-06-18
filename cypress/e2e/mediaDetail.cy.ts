describe('Media Cast Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('searches for Star Wars and visits Mark Hamill’s actor page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]',)
      .scrollIntoView()
      .type('Star Wars');

    cy.contains('Star Wars',).should('be.visible').click();

    cy.url().should('include', '/movie/');
    cy.contains('Star Wars',).should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Mark Hamill',).should('be.visible').click();
    cy.url().should('include', '/person/');
    cy.contains('Mark Hamill',).should('exist');
    cy.contains('Biography',).should('exist');
    cy.contains('Known For',).should('exist');
  });

  it('searches for Breaking Bad and visits Bryan Cranston’s actor page', () => {
    cy.get('input[placeholder="Search for Movies or TV Shows..."]',)
      .scrollIntoView()
      .type('Breaking Bad');

    cy.contains('Breaking Bad',).should('be.visible').click();

    cy.url().should('include', '/tv/');
    cy.contains('Breaking Bad',).should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Bryan Cranston',).should('be.visible').click();
    cy.url().should('include', '/person/');
    cy.contains('Bryan Cranston',).should('exist');
    cy.contains('Biography',).should('exist');
    cy.contains('Known For',).should('exist');
  });
});
