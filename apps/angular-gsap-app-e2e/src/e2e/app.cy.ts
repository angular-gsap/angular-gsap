// cypress/integration/demo.component.spec.ts

describe('Demo Component', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 3000 }); // replace with the actual route to the demo component
  });

  it('should open the menu when the button is clicked', () => {
    cy.get('button[aria-controls="mobile-menu"]').click();
    cy.get(
      'svg[ngClass="{ hidden: menuClosed(), block: !menuClosed() }"]'
    ).should('be.visible');
  });

  it('should close the menu when the button is clicked again', () => {
    cy.get('button[aria-controls="mobile-menu"]').click();
    cy.get(
      'svg[ngClass="{ block: menuClosed(), hidden: !menuClosed() }"]'
    ).should('be.visible');
  });
});
