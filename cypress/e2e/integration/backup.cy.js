it('Fluxo de Venda Feliz Cliente', () => {
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

        cy.contains('Confirmar Pedido').click().wait(500); // Mostrando erro ao não selecionar endereço
        cy.contains('OK').click().wait(1000);

        cy.get('#enderecosSelect').click().wait(500);
        cy.contains('GERAL').first().click().wait(500); // Seleciona o primeiro endereço de entrega de tipo GERAL
        cy.contains('OK').click().wait(1000);
    }

    const selecionarCartoes = () => {
        cy.contains('Confirmar Pedido').click().wait(500); // Mostrando erro ao não selecionar pagamento
        cy.contains('OK').click().wait(1000);

        cy.get('#cartoesSelect').click().wait(500);
        cy.contains('VISA').first().click().wait(500); // Seleciona o primeiro cartão de crédito VISA
        cy.contains('MASTERCARD').first().click().wait(500);  // Seleciona o segundo cartão de crédito MASTERCARD
    }

    const selecionarCupons = () => {
        cy.contains('Confirmar Pedido').click().wait(500); // Mostrando erro ao não selecionar pagamento suficiente
        cy.contains('OK').click().wait(1000);

        cy.get('#cuponsSelect').click().wait(500);
        cy.contains('10.00').first().click().wait(500); // Seleciona o primeiro cupom de R$ 10.00
        cy.contains('OK').click().wait(1000);

        cy.get('#cuponsSelect').click().wait(500);
        cy.contains('15.00').first().click().wait(500);  // Seleciona o primeiro cupom de R$ 15.00
        cy.contains('OK').click().wait(1000);
    }

    cy.login_success(); // Realizando login com sucesso!

    cy.visit('http://localhost:3000').wait(1000);

    adicionarProdutoCarrinho(0); // Adicionando o primeiro produto ao carrinho
    adicionarProdutoCarrinho(4, 2); // Adicionando o quinto produto ao carrinho
    adicionarProdutoCarrinho(2, 3); // Adicionando o terceiro produto ao carrinho
    comprarProduto(1); // Seleciona a opção comprar que leva direto ao carrinho de compras

    editarCarrinho(); // Demonstra edição de quantidade e remoção de itens do carrinho

    enderecoCheckout(); // Seleciona um endereço de entrega com tipo GERAL

    selecionarCupons(); // Seleciona dois cupons de troca

    selecionarCartoes(); // Seleciona dois cartões de crédito como forma de pagamento

    cy.get('.ResumoCheckout_btn__3h8yg').click().wait(500); // Mostrando erro ao não selecionar pagamento
    cy.get('.swal2-confirm').click().wait(1000);
    cy.get('.swal2-confirm').click().wait(1000);
});