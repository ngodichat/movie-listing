describe('Favorites View', () => {
    beforeEach(() => {
        // Mock localStorage with favorite movies
        cy.window().then((win) => {
            win.localStorage.setItem(
                'favorites',
                JSON.stringify([
                    { Title: 'Favorite Movie 1', Year: '2020', imdbID: '101' },
                    { Title: 'Favorite Movie 2', Year: '2021', imdbID: '102' },
                ])
            );
        });

        // Visit the Favorites page
        cy.visit('/favorites');
    });

    it('should display favorite movies if available', () => {
        cy.get('.movies-grid').should('exist');
        cy.get('.movie-card').should('have.length', 2);

        cy.get('.movie-card').first().within(() => {
            cy.contains('Favorite Movie 1').should('exist');
            cy.contains('2020').should('exist');
        });

        cy.get('.movie-card').eq(1).within(() => {
            cy.contains('Favorite Movie 2').should('exist');
            cy.contains('2021').should('exist');
        });
    });

    it('should show empty state if there are no favorite movies', () => {
        cy.window().then((win) => {
            win.localStorage.setItem('favorites', JSON.stringify([]));
        });

        cy.visit('/favorites');

        cy.get('.empty-state').should('contain', 'No favorite movies yet');
        cy.get('.movies-grid').should('not.exist');
    });

    it('should paginate favorite movies', () => {
        cy.window().then((win) => {
            win.localStorage.setItem(
                'favorites',
                JSON.stringify([
                    { Title: 'Favorite Movie 1', Year: '2020', imdbID: '101' },
                    { Title: 'Favorite Movie 2', Year: '2021', imdbID: '102' },
                    { Title: 'Favorite Movie 3', Year: '2022', imdbID: '103' },
                    { Title: 'Favorite Movie 4', Year: '2023', imdbID: '104' },
                    { Title: 'Favorite Movie 5', Year: '2023', imdbID: '105' },
                    { Title: 'Favorite Movie 6', Year: '2023', imdbID: '106' },
                    { Title: 'Favorite Movie 7', Year: '2023', imdbID: '107' },
                    { Title: 'Favorite Movie 8', Year: '2023', imdbID: '108' },
                    { Title: 'Favorite Movie 9', Year: '2023', imdbID: '109' },
                    { Title: 'Favorite Movie 10', Year: '2023', imdbID: '110' },
                    { Title: 'Favorite Movie 11', Year: '2023', imdbID: '111' },
                ])
            );
        });

        cy.visit('/favorites');

        cy.get('.pagination .nextBtn').click();
        cy.get('.movie-card').should('have.length', 1);
        cy.contains('Favorite Movie 11').should('exist');

        cy.get('.pagination .prevBtn').click();
        cy.get('.movie-card').should('have.length', 10);
        cy.contains('Favorite Movie 10').should('exist');
    });
});
