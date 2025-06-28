/// <reference types="cypress" />

// Add any custom commands here
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Example of a custom command for checking image loading
Cypress.Commands.add('checkImageLoading', (selector: string) => {
  cy.get(selector)
    .should('be.visible')
    .and('have.prop', 'naturalWidth')
    .should('be.greaterThan', 0)
}) 