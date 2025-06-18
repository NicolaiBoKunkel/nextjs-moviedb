describe('Homepage Intro Content', () => {
  it('displays headline and sections for movies and TV shows', () => {
    cy.visit('/');

    cy.contains('h1', 'TMDB with Next.js').should('be.visible');

    cy.contains('h2', 'Fresh selection of Movies for you').should('be.visible');
    cy.contains('h2', 'Fresh selection of TV Shows for you').should('be.visible');
  });
});

describe('Top Rated Movie -> Detail Page -> Actor Navigation', () => {
  it('navigates to The Godfather, verifies details, and clicks Marlon Brando', () => {
    cy.visit('/');

    cy.contains('button', 'Movies').click();
    cy.contains('a', 'Top Rated').click();

    cy.url().should('include', '/highestRatedMovies');
    cy.contains('Highest Rated Movies').should('exist');

    cy.contains('.font-bold', 'The Godfather')
      .should('be.visible')
      .click();

    cy.url().should('include', '/movie/238');
    cy.contains('The Godfather').should('exist');
    cy.contains('“An offer you can\'t refuse.”').should('exist');
    cy.contains('Spanning the years 1945 to 1955').should('exist');
    cy.contains('Release Date: 1972-03-14').should('exist');
    cy.contains('⭐ 8.686').should('exist');
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

describe('Top Rated TV Show -> Detail Page -> Actor Navigation', () => {
  it('navigates to Breaking Bad, verifies details, and clicks Bryan Cranston', () => {
    cy.visit('/');

    cy.contains('button', 'TV Shows').click();
    cy.contains('a', 'Top Rated').click();

    cy.url().should('include', '/highestRatedTv');
    cy.contains('Highest Rated TV Shows').should('exist');

    cy.contains('.font-bold', 'Breaking Bad')
      .should('be.visible')
      .click();

    cy.url().should('include', '/tv/1396');
    cy.contains('Breaking Bad').should('exist');
    cy.contains('“Change the equation.”').should('exist');
    cy.contains('Walter White').should('exist');
    cy.contains('First Air Date: 2008-01-20').should('exist');
    cy.contains('⭐ 8.926').should('exist');
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
