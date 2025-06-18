describe('Media Cast Navigation Flow (Direct IDs)', () => {
  it('visits Star Wars (movie ID 11) and Mark Hamill’s actor page (person ID 2)', () => {
    cy.visit('/movie/11');

    cy.contains('Star Wars').should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Mark Hamill').should('be.visible').click();
    cy.url().should('include', '/person/2');
    cy.contains('Mark Hamill').should('exist');
    cy.contains('Biography').should('exist');
    cy.contains('Known For').should('exist');
  });

  it('visits Breaking Bad (TV ID 1396) and Bryan Cranston’s actor page (person ID 17419)', () => {
    cy.visit('/tv/1396');

    cy.contains('Breaking Bad').should('exist');
    cy.contains('Cast').scrollIntoView();

    cy.contains('Bryan Cranston').should('be.visible').click();
    cy.url().should('include', '/person/17419');
    cy.contains('Bryan Cranston').should('exist');
    cy.contains('Biography').should('exist');
    cy.contains('Known For').should('exist');
  });
});
