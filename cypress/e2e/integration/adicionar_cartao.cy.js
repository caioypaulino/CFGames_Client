describe('Adicionar Cartão', () => {
    it('Realizar cadastro de cartão com sucesso', () => {
        cy.login_success(); // Realizando login com sucesso!

        // Visitar a página de cadastro
        cy.get('[href="/perfil/cartoes"] > button').click();

        cy.get('.Cartoes_iconAdd__2PdnS').click();

        cy.get('#numeroCartao').type("5495414788852345")
        cy.get('#nomeCartao').type("Caio H Paulino")
        cy.get('#mesVencimento').type(7)
        cy.get('#anoVencimento').type(2027)
        cy.get('#cvc').type(666)

        cy.get('.swal2-confirm').click();
        cy.get('.swal2-confirm').click();
    });
});