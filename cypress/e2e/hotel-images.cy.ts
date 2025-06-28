/// <reference types="cypress" />

describe('Hotel Images', () => {
  beforeEach(() => {
    // Increase the timeout for this specific test
    Cypress.config('pageLoadTimeout', 180000)
    
    cy.visit('/hotels', { failOnStatusCode: false })
    // Wait for any initial animations or loading states
    cy.wait(2000)
  })

  it('should load all hotel images correctly', () => {
    // Take screenshot of the entire hotels page
    cy.screenshot('hotels-page-full')

    // Check for hotel cards
    cy.get('.grid').first()
      .should('be.visible')
      .find('div').first()
      .within(() => {
        cy.get('img')
          .should('be.visible')
          .and('have.prop', 'naturalWidth')
          .should('be.greaterThan', 0)
      })

    // Take screenshot of the first hotel card
    cy.get('.grid div').first().screenshot('first-hotel-card')

    // Take screenshot of the hotels grid
    cy.get('.grid').first().screenshot('hotels-grid')
  })

  it('should handle image loading errors gracefully', () => {
    // Check if any image has failed to load
    cy.get('img').each(($img, index) => {
      cy.wrap($img)
        .should('be.visible')
        .and('have.prop', 'naturalWidth')
        .should('be.greaterThan', 0)

      // Take screenshots of each hotel image
      if (index < 3) { // Limit to first 3 images to avoid too many screenshots
        cy.wrap($img).screenshot(`hotel-image-${index + 1}`)
      }
    })
  })
}) 