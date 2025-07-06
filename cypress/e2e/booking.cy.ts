describe('Hotel Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('POST', '/api/chat', { fixture: 'chatResponse.json' }).as('chatRequest');
    cy.intercept('GET', '/api/hotels/search', { fixture: 'hotelSearch.json' }).as('hotelSearch');
  });

  it('completes a hotel booking flow', () => {
    // Search for a hotel
    cy.get('[data-testid="location-input"]').type('Miami Beach');
    cy.get('[data-testid="date-picker-check-in"]').type('2025-08-01');
    cy.get('[data-testid="date-picker-check-out"]').type('2025-08-05');
    cy.get('[data-testid="guests-input"]').type('2');
    cy.get('[data-testid="search-button"]').click();

    // Wait for search results
    cy.wait('@hotelSearch');
    
    // Select a hotel
    cy.get('[data-testid="hotel-card"]').first().click();
    
    // View hotel details
    cy.url().should('include', '/hotels/');
    cy.get('[data-testid="hotel-name"]').should('be.visible');
    
    // Select a room
    cy.get('[data-testid="room-selection"]').first().click();
    
    // Fill booking details
    cy.get('[data-testid="booking-form"]').within(() => {
      cy.get('[name="firstName"]').type('John');
      cy.get('[name="lastName"]').type('Doe');
      cy.get('[name="email"]').type('john.doe@example.com');
      cy.get('[name="phone"]').type('1234567890');
      cy.get('[type="submit"]').click();
    });
    
    // Verify booking confirmation
    cy.url().should('include', '/booking/confirmation');
    cy.get('[data-testid="booking-confirmation"]').should('be.visible');
    cy.get('[data-testid="booking-reference"]').should('be.visible');
  });

  it('handles AI concierge interaction', () => {
    // Open AI concierge
    cy.get('[data-testid="ai-concierge-button"]').click();
    
    // Type a message
    cy.get('[data-testid="chat-input"]')
      .type('I need a hotel in Miami with a beach view{enter}');
    
    // Wait for response
    cy.wait('@chatRequest');
    
    // Verify response
    cy.get('[data-testid="chat-messages"]')
      .should('contain', 'Here are some beachfront hotels in Miami');
    
    // Click on suggested hotel
    cy.get('[data-testid="chat-suggestion-link"]').first().click();
    
    // Verify navigation to hotel page
    cy.url().should('include', '/hotels/');
  });

  it('validates form inputs', () => {
    cy.get('[data-testid="location-input"]').type(' ');
    cy.get('[data-testid="search-button"]').click();
    cy.get('[data-testid="location-error"]')
      .should('be.visible')
      .and('contain', 'Please enter a valid location');
    
    cy.get('[data-testid="date-picker-check-in"]').type('2024-01-01');
    cy.get('[data-testid="date-picker-check-out"]').type('2024-01-05');
    cy.get('[data-testid="date-error"]')
      .should('be.visible')
      .and('contain', 'Please select future dates');
  });
}); 