describe('Fluxos de Venda', () => {
    it('Fluxo de Venda Feliz', () => {
        const adicionarProdutoCarrinho = (index, quantidade) => {
            cy.get('[testid="btnComprar"]').eq(index).click().wait(1000);
            cy.get('.swal2-deny').should('be.visible').click().wait(500);
            cy.get('#quantidadeSelect').select(quantidade || 1).wait(500);
            cy.get('.swal2-confirm').should('be.visible').click().wait(1000);
            cy.contains('OK').click().wait(1000);
        };

        const comprarProduto = (index) => {
            cy.get('[testid="btnComprar"]').eq(index).click().wait(1000);
            cy.get('.swal2-confirm').should('be.visible').click().wait(1000);
            cy.contains('OK').click().wait(1000);
        };

        const editarCarrinho = () => {
            cy.get('[testid="btnPlus"]').first().click().wait(500); // Adicionando quantidade ao primeiro item carrinho
            cy.get('[testid="btnPlus"]').first().click().wait(500); // Adicionando quantidade ao primeiro item carrinho
            cy.get('[testid="btnMinus"]').first().click().wait(1000); // Diminuindo quantidade ao primeiro item carrinho

            cy.contains('Remover').first().click().wait(100); // Removendo primeiro item carrinho
            cy.contains('OK').click().wait(1000);
        };

        const enderecoCheckout = () => {
            cy.contains('Finalizar Pedido').click().wait(1000);

            cy.get('#enderecosSelect').click().wait(500);
            cy.contains('GERAL').first().click().wait(500); // Seleciona o primeiro endereço de entrega de tipo GERAL
            cy.contains('OK').click().wait(1000);
        }

        const selecionarCartoes = () => {
            cy.get('#cartoesSelect').click().wait(500);
            cy.contains('X').first().click().wait(500); // Seleciona o primeiro cartão de crédito
            cy.contains('X').eq(2).click().wait(500);  // Seleciona o segundo cartão de crédito
        }

        cy.login_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000');
        cy.wait(1000);

        
        comprarProduto(1); // Seleciona a opção comprar que leva direto ao carrinho de compras

        editarCarrinho(); // Demonstra edição de quantidade e remoção de itens do carrinho

        enderecoCheckout(); // Seleciona um endereço de entrega com tipo GERAL

        selecionarCartoes(); // Seleciona dois cartões de crédito como forma de pagamento

    });
});
