describe('MovieList View', () => {
  beforeEach(() => {
    // Mock the API response for the initial movie load
    cy.intercept('GET', '**/api/movies/search/*', {
      statusCode: 200,
      body: {
        data: [
          { Title: 'Movie 1', Year: '2021', imdbID: '1' },
          { Title: 'Movie 2', Year: '2022', imdbID: '2' },
        ],
        total_pages: 5,
      },
    }).as('getMovies');

    // Visit the MovieList view
    cy.visit('/');
    cy.wait('@getMovies'); // Wait for the initial API call to complete
  });

  it('should display the movie list on page load', () => {
    // Check if the MovieGrid component renders the movies
    cy.get('[class="movie-grid"]').should('exist');
    cy.get('[class="movie-card"]').should('have.length', 2);

    // Verify the content of the first movie
    cy.get('[class="movie-card"]')
        .first()
        .within(() => {
          cy.contains('Movie 1').should('exist');
          cy.contains('2021').should('exist');
        });

    // Verify the content of the second movie
    cy.get('[class="movie-card"]')
        .eq(1)
        .within(() => {
          cy.contains('Movie 2').should('exist');
          cy.contains('2022').should('exist');
        });
  });

  it('should update the movie list when searching', () => {
    // Mock the API response for a search query
    cy.intercept('GET', '**/api/movies/search/*', {
      statusCode: 200,
      body: {
        data: [
          { Title: 'Test Movie 1', Year: '2023', imdbID: '3' },
          { Title: 'Test Movie 2', Year: '2023', imdbID: '4' },
        ],
        total_pages: 2,
      },
    }).as('searchMovies');

    // Type a search query and submit
    cy.get('[class="search-bar"] input').type('test');
    cy.get('[class="search-bar"] button').click();

    // Wait for the search API call to complete
    cy.wait('@searchMovies');

    // Check if the MovieGrid updates with the new movies
    cy.get('[class="movie-card"]').should('have.length', 2);
    cy.contains('Test Movie 1').should('exist');
    cy.contains('Test Movie 2').should('exist');
  });

  it('should paginate through the movie list', () => {
    // Mock the API response for the next page
    cy.intercept('GET', '**/movies/search/?Title=&page=2', {
      statusCode: 200,
      body: {
        data: [
          { Title: 'Movie 3', Year: '2023', imdbID: '5' },
          { Title: 'Movie 4', Year: '2023', imdbID: '6' },
        ],
        total_pages: 5,
      },
    }).as('getNextPage');

    // Click the "Next" button in the Pagination component
    cy.get('[class="pagination"] [class="nextBtn"]').click();

    // Wait for the next page API call to complete
    cy.wait('@getNextPage');

    // Check if the MovieGrid updates with the new movies
    cy.get('[class="movie-card"]').should('have.length', 2);
    cy.contains('Movie 3').should('exist');
    cy.contains('Movie 4').should('exist');
  });
});