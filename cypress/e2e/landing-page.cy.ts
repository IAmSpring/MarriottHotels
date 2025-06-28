/// <reference types="cypress" />

describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
    // Wait for any initial animations or loading states
    cy.wait(1000)
  })

  it('should load hero section correctly', () => {
    // Check hero section exists and is visible
    cy.get('#hero-section')
      .should('be.visible')
      .within(() => {
        // Check for background image
        cy.get('img[alt="Luxury hotel view"]').should('be.visible')
        
        // Check for hero content
        cy.get('h1')
          .should('be.visible')
          .and('contain', 'Extraordinary Experiences')
        
        cy.get('p')
          .should('be.visible')
          .and('contain', 'Discover exceptional hotels')
      })

    // Take screenshot of hero section
    cy.get('#hero-section').screenshot('hero-section', {
      capture: 'viewport',
      blackout: ['.bg-white'] // Blackout the search form to avoid date picker state
    })

    // Check search form
    cy.get('#hero-section .bg-white')
      .should('be.visible')
      .within(() => {
        // Destination input
        cy.get('input[placeholder="City, hotel, or landmark"]').should('be.visible')
        
        // Date pickers
        cy.get('input[placeholder="mm/dd/yyyy"]').should('have.length', 2)
        
        // Guests selector
        cy.get('select').should('be.visible')
        
        // Search button
        cy.get('button')
          .should('be.visible')
          .and('contain', 'Find Hotels')
      })

    // Take screenshot of search form
    cy.get('#hero-section .bg-white').screenshot('search-form')
  })

  it('should display navigation elements correctly', () => {
    // Check navbar
    cy.get('nav')
      .should('be.visible')
      .within(() => {
        // Logo
        cy.get('.w-8.h-8').should('be.visible')
        cy.get('span').contains('Marriott').should('be.visible')
      })

    // Take screenshot of navbar
    cy.get('nav').screenshot('navbar')

    // Navigation links (desktop)
    cy.get('.hidden.md\\:flex').first()
      .should('be.visible')
      .within(() => {
        cy.contains('Home').should('be.visible')
        cy.contains('Search Hotels').should('be.visible')
        cy.contains('Deals').should('be.visible')
        cy.contains('My Bookings').should('be.visible')
      })

    // Take screenshot of desktop navigation
    cy.get('.hidden.md\\:flex').first().screenshot('desktop-navigation')
  })

  it('should load featured sections', () => {
    // Wait for content to load
    cy.wait(2000)
    
    // Scroll down to ensure content is loaded
    cy.scrollTo(0, 500)
    
    // Look for any section with hotel cards
    cy.get('.grid').first()
      .should('be.visible')
      .find('div').first()
      .within(() => {
        cy.get('img').should('be.visible')
        cy.get('h3').should('exist')
      })

    // Take screenshot of featured section
    cy.get('.grid').first().screenshot('featured-hotels')
  })

  it('should handle responsive design', () => {
    // Test mobile viewport
    cy.viewport('iphone-x')
    cy.get('#hero-section').should('be.visible')
    cy.get('nav').should('be.visible')
    cy.get('.md\\:hidden').should('be.visible') // Mobile menu button
    cy.screenshot('mobile-viewport')
    
    // Test tablet viewport
    cy.viewport('ipad-2')
    cy.get('#hero-section').should('be.visible')
    cy.get('nav').should('be.visible')
    cy.screenshot('tablet-viewport')
    
    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('#hero-section').should('be.visible')
    cy.get('nav').should('be.visible')
    cy.get('.hidden.md\\:flex').should('be.visible') // Desktop menu
    cy.screenshot('desktop-viewport')
  })

  it('should have working search functionality', () => {
    // Fill out search form
    cy.get('input[placeholder="City, hotel, or landmark"]')
      .type('New York')
    
    // Open date picker
    cy.get('input[placeholder="mm/dd/yyyy"]').first()
      .click()
    
    // Take screenshot of date picker open
    cy.screenshot('date-picker-open')
    
    // Select guests
    cy.get('select').select('2')
    
    // Click search
    cy.get('button')
      .contains('Find Hotels')
      .click()

    // Take screenshot of filled search form
    cy.get('#hero-section .bg-white').screenshot('filled-search-form')
  })

  it('should load footer content', () => {
    // Check footer
    cy.get('footer')
      .should('be.visible')
      .within(() => {
        // Footer sections
        cy.contains('About Us').should('be.visible')
        cy.contains('Contact').should('be.visible')
        cy.contains('Follow Us').should('be.visible')
        
        // Social links
        cy.get('a[href*="facebook"], a[href*="twitter"], a[href*="instagram"]')
          .should('have.length.at.least', 1)
      })
  })

  it('should handle animations and transitions', () => {
    // Check for smooth scroll behavior
    cy.get('html').should('have.css', 'scroll-behavior', 'smooth')
    
    // Verify hover states on interactive elements
    cy.get('[data-testid="hotel-card"]')
      .first()
      .realHover()
      .should('have.css', 'transform')
  })
}) 