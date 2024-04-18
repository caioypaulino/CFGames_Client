describe('Fluxos de Venda', () => {
    it('Fluxo de Venda Feliz Admin', () => {
        cy.login_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000/admin/pedidos').wait(1000);
    });

    
});
