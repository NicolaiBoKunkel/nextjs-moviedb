describe('Homepage Intro Content', () => {
  it('displays headline and sections for movies and TV shows', () => {
    cy.visit('/');

    // Wait for hydration to complete (i.e. React takes over)
    cy.get('h1', { timeout: 10000 }).should('have.text', 'TMDB with Next.js');
    cy.get('h2').contains('Fresh selection of Movies for you').should('be.visible');
    cy.get('h2').contains('Fresh selection of TV Shows for you').should('be.visible');
  });
});

describe('The Godfather Detail Page -> Actor Navigation', () => {
  it('visits The Godfather page and navigates to Marlon Brando', () => {
    cy.visit('/movie/238');

    // Wait for headline text after hydration
    cy.get('h1').contains('The Godfather', { timeout: 10000 }).should('exist');

    cy.contains('“Who\'s Your (God)Daddy?”').should('exist');
    cy.contains('Spanning the years 1945 to 1955').should('exist');
    cy.contains('Release Date: 1972-03-14').should('exist');
    cy.contains('Language: EN').should('exist');
    cy.contains('Genres: Drama, Crime').should('exist');
    cy.contains('☆ Add to Favorites').should('exist');
    cy.contains('▶️ Watch Trailer').should('exist');
    cy.contains('🎭 Cast').scrollIntoView().should('exist');

    cy.contains('Marlon Brando')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.url().should('include', '/person/3084');
    cy.contains('Marlon Brando').should('exist');
    cy.contains('Born: 1924-04-03').should('exist');
    cy.contains('Birthplace: Omaha, Nebraska, USA').should('exist');
    cy.contains('Died: 2004-07-01').should('exist');
  });
});

describe('Breaking Bad Detail Page -> Actor Navigation', () => {
  it('visits Breaking Bad page and navigates to Bryan Cranston', () => {
    cy.visit('/tv/1396');

    // Wait for hydration
    cy.get('h1').contains('Breaking Bad', { timeout: 10000 }).should('exist');

    cy.contains('“Change the equation.”').should('exist');
    cy.contains('Walter White').should('exist');
    cy.contains('First Air Date: 2008-01-20').should('exist');
    cy.contains('Language: EN').should('exist');
    cy.contains('Genres: Drama, Crime').should('exist');
    cy.contains('Seasons: 5').should('exist');
    cy.contains('Episodes: 62').should('exist');
    cy.contains('☆ Add to Favorites').should('exist');
    cy.contains('▶️ Watch Trailer').should('exist');
    cy.contains('🎭 Cast').scrollIntoView().should('exist');

    cy.contains('Bryan Cranston')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.url().should('include', '/person/17419');
    cy.contains('Bryan Cranston').should('exist');
    cy.contains('Born: 1956-03-07').should('exist');
    cy.contains('Birthplace: Hollywood, Los Angeles, California, USA').should('exist');
  });
});
