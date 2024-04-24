// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.Commands.add('login_success', () => {
    cy.visit('http://localhost:3000/login'); // Substitua pela URL do seu aplicativo
    cy.get('input[type="text"]').type('caio2@gmail.com'); // Insira o e-mail de teste
    cy.get('input[type="password"]').type('123456aC@'); // Insira a senha de teste
    cy.get('input[type="submit"]').click(); // Submeta o formulário de login
    cy.contains('Seja Bem-vindo(a)').should('be.visible'); // Verifique se a mensagem de boas-vindas é exibida
    cy.get('.swal2-confirm').should('be.visible').click(); // Selecione o botão de confirmação e clique nele
    cy.url().should('include', '/perfil/pessoal'); // Verifique se a URL mudou para a página de perfil após o login
});

Cypress.Commands.add('login_admin_success', () => {
    cy.visit('http://localhost:3000/login'); // Substitua pela URL do seu aplicativo
    cy.get('input[type="text"]').type('caio@gmail.com'); // Insira o e-mail de teste
    cy.get('input[type="password"]').type('123456aC@'); // Insira a senha de teste
    cy.get('input[type="submit"]').click(); // Submeta o formulário de login
    cy.contains('Seja Bem-vindo(a)').should('be.visible'); // Verifique se a mensagem de boas-vindas é exibida
    cy.get('.swal2-confirm').should('be.visible').click(); // Selecione o botão de confirmação e clique nele
    cy.url().should('include', '/perfil/pessoal'); // Verifique se a URL mudou para a página de perfil após o login
});
// Alternatively you can use CommonJS syntax:
// require('./commands')