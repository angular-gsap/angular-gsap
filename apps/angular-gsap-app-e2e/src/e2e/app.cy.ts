// cypress/integration/demo.component.spec.ts

describe('Demo Angular GSAP', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 3000 }); // replace with the actual route to the demo component
  });

  describe('Circle animation To', () => {
    it('should animate on mouseover', () => {
      // Find the circle element
      cy.get('[data-cy=demo-circle]').then(($circle) => {
        // Trigger mouseover event
        cy.wrap($circle).trigger('mouseover');
        //wait for the animation to finish without cy.wait()
        cy.wrap($circle, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1.2, 0, 0, 1.2, 150, 0)'
        );
      });
    });
  });

  describe('Animate using To by clicking the button', () => {
    it('should animate the target element', () => {
      // Find the button element
      cy.get('[data-cy=demo-button]').then(($button) => {
        // Trigger click event
        cy.wrap($button).click();
        //wait for the animation to finish without cy.wait()
        cy.get('[data-cy=demo-target]', { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1.2, 0, 0, 1.2, 150, 0)'
        );
      });
    });
  });

  describe('Animate using From', () => {
    it('should animate the square when hovering', () => {
      //navigate to the from demo by clicking from menu
      cy.get('[data-cy=demo-from]').click();
      // Find the square element
      cy.get('[data-cy=demo-from-square]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1, 0, 0, 1, 0, 0)'
        );
      });
    });
  });

  describe('Animate using FromTo', () => {
    it('should animate the square when hovering', () => {
      //navigate to the from demo by clicking from menu
      cy.get('[data-cy=demo-fromTo]').click();
      // Find the square element
      cy.get('[data-cy=demo-from-to-square]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'opacity',
          '0.8'
        );
      });
    });
  });

  describe('Animate more than one element using Timeline', () => {
    it('should animate the squares when page is loaded', () => {
      //navigate to the from demo by clicking from menu
      cy.get('[data-cy=demo-timeline]').click();
      // Find the square element
      cy.get('[data-cy=demo-timeline-1]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1.2, 0, 0, 1.2, 15, 0)'
        );
      });

      cy.get('[data-cy=demo-timeline-2]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1, 0, 0, 1, 0, 0)'
        );
      });

      cy.get('[data-cy=demo-timeline-3]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'opacity',
          '0.8'
        );
      });
    });

    it('should animate the squares in reverse when clicking the reverse button', () => {
      cy.get('[data-cy=demo-timeline]').click();
      // Find the square element
      cy.get('[data-cy=demo-timeline-1]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1.2, 0, 0, 1.2, 15, 0)'
        );
      });

      cy.get('[data-cy=demo-timeline-2]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1, 0, 0, 1, 0, 0)'
        );
      });

      cy.get('[data-cy=demo-timeline-3]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'opacity',
          '0.8'
        );
      });

      cy.get('[data-cy=demo-timeline-button]').click();

      cy.get('[data-cy=demo-timeline-3]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should('have.css', 'opacity', '0');
      });

      cy.get('[data-cy=demo-timeline-2]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1.2, 0, 0, 1.2, 150, 0)'
        );
      });

      cy.get('[data-cy=demo-timeline-1]').then(($square) => {
        //wait for the animation to finish without cy.wait()
        cy.wrap($square, { timeout: 6000 }).should(
          'have.css',
          'transform',
          'matrix(1, 0, 0, 1, 0, 0)'
        );
      });
    });
  });
});
