describe('Fluxos de Venda', () => {
    const fluxoVendaFeliz = () => {
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

            cy.get('#react-select-3-listbox').then(($select) => {
                if ($select.find('#react-select-3-option-0').length > 0) {
                    cy.get('#react-select-3-option-0').click();

                    cy.get('.swal2-confirm').click().wait(500);
                }
                else {
                    cy.get('#enderecosSelect').click().wait(500);

                    cy.contains('Novo Endereço').click().wait(500); // Adicionando cartão

                    cy.get('#apelido').type("Casa do Valtencir").wait(500);
                    cy.get('#numero').type(51).wait(500);
                    cy.get('#complemento').type("Casa").wait(500);
                    cy.get('#tipo').select("Entrega").wait(500);
                    cy.get('#cep').type("08599490").wait(500);
                    cy.get('#observacao').type("Bater no portão.").wait(500);
                    cy.get('#salvarNoPerfil').click().wait(500);

                    cy.get('.swal2-confirm').click().wait(500);
                    cy.get('.swal2-confirm').click().wait(1000);

                    cy.get('.swal2-confirm').click().wait(500);
                }
            });
        }

        const selecionarCartoes = () => {
            cy.contains('Confirmar Pedido').click().wait(500); // Mostrando erro ao não selecionar pagamento
            cy.contains('OK').click().wait(1000);

            cy.get('#cartoesSelect').click().wait(500);

            // Verifica se há cartões
            cy.get('#react-select-5-listbox').then(($select) => {
                if ($select.find('#react-select-5-option-0').length > 0) {
                    cy.get('#react-select-5-option-0').click();
                }
                else {
                    cy.contains('Novo Cartão').click(); // Adicionando cartão

                    cy.get('#numeroCartao').type("4024 0071 5385 2685").wait(500);
                    cy.get('#nomeCartao').type("VALTENCIR V SILVA").wait(500);
                    cy.get('#mesVencimento').type(8).wait(500);
                    cy.get('#anoVencimento').type(2028).wait(500);
                    cy.get('#cvc').type(333).wait(500);

                    cy.get('.swal2-confirm').click().wait(500);
                    cy.get('.swal2-confirm').click().wait(500);

                    cy.get('#cartoesSelect').click().wait(500);
                    cy.get('#react-select-5-option-0').click();
                }
            });

            cy.get('#react-select-5-listbox').then(($select) => {
                if ($select.find('#react-select-5-option-1').length > 0) {
                    cy.get('#react-select-5-option-1').click();
                }
                else {
                    cy.contains('Novo Cartão').click(); // Adicionando cartão

                    cy.get('#numeroCartao').type("5495 4147 8885 2345").wait(500);
                    cy.get('#nomeCartao').type("CAIO H PAULINO").wait(500);
                    cy.get('#mesVencimento').type(7).wait(500);
                    cy.get('#anoVencimento').type(2027).wait(500);
                    cy.get('#cvc').type(666).wait(500);
                    cy.get('#salvarNoPerfil').click().wait(500);

                    cy.get('.swal2-confirm').click().wait(500);
                    cy.get('.swal2-confirm').click().wait(500);

                    cy.get('#cartoesSelect').click().wait(500);
                    cy.get('#react-select-5-option-1').click();
                }
            });
        }

        const selecionarCupons = () => {
            cy.contains('Confirmar Pedido').click().wait(500); // Mostrando erro ao não selecionar pagamento suficiente
            cy.contains('OK').click().wait(1000);

            cy.get('#cuponsSelect').click().wait(500);

            cy.get('#react-select-7-listbox').then(($select) => {
                if ($select.find('#react-select-7-option-0').length > 0 && $select.find('#react-select-7-option-1').length > 0) {
                    cy.get('#react-select-7-option-0').click();
                    cy.contains('OK').click().wait(1000);

                    cy.get('#cuponsSelect').click().wait(500);
                    cy.get('#react-select-7-option-1').click();
                    cy.contains('OK').click().wait(1000);
                }
                else if ($select.find('#react-select-7-option-0').length > 0 && $select.find('#react-select-7-option-1').length <= 0) {
                    cy.get('#react-select-7-option-0').click();
                    cy.contains('OK').click().wait(1000);
                }
                else {
                    console.log("Não há cupons")
                }
            });
        }

        cy.login_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000').wait(1000);

        adicionarProdutoCarrinho(0); // Adicionando o primeiro produto ao carrinho
        adicionarProdutoCarrinho(5, 2); // Adicionando o sexto produto ao carrinho
        adicionarProdutoCarrinho(2, 3); // Adicionando o terceiro produto ao carrinho

        cy.get('[testid="barrabusca"]').type("Zelda").wait(500);

        comprarProduto(0); // Seleciona a opção comprar que leva direto ao carrinho de compras

        editarCarrinho(); // Demonstra edição de quantidade e remoção de itens do carrinho

        enderecoCheckout(); // Seleciona um endereço de entrega com tipo GERAL

        selecionarCupons(); // Seleciona dois cupons de troca

        selecionarCartoes(); // Seleciona dois cartões de crédito como forma de pagamento

        cy.contains('Confirmar Pedido').click().wait(500); // Confirmando pedido
        cy.get('.swal2-confirm').click().wait(1000); // Submit pedido
        cy.get('.swal2-confirm').click().wait(1000); // OK
    }

    it('Fluxo de Venda Feliz Cliente', () => {
        fluxoVendaFeliz();
    });

    it('Fluxo de Venda Feliz Admin', () => {
        const selecionarPedido = () => {
            cy.get('thead > tr > :nth-child(1)').click().wait(500); // Selecionando pedido mais recente
            cy.get('thead > tr > :nth-child(1)').click().wait(500);

            cy.contains('. . .').first().click().wait(500); // Acessando pedido

            cy.get('.swal2-container').scrollTo('bottom');

            cy.get('.swal2-confirm').click().wait(500); // Alterar Status
        }

        cy.login_admin_success(); // Realizando login admin com sucesso!

        cy.visit('http://localhost:3000/admin/pedidos').wait(1000);

        selecionarPedido();
        cy.get('#swal2-html-container > div > .swal2-confirm').click().wait(500); // Em Trânsito
        cy.get('.swal2-confirm').click().wait(500); // OK

        selecionarPedido();
        cy.get('[testid="personalizado"]').click().wait(500); // Personalizado
        cy.get('#novoStatus').select("Entregue").wait(500);
        cy.get('.swal2-confirm').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500); // OK
    });

    it('Fluxo de Pedido Cancelado Cliente', () => {
        fluxoVendaFeliz();

        cy.visit('http://localhost:3000/perfil/pedidos').wait(1000);
        cy.contains('. . .').first().click().wait(500);
        cy.get('.swal2-deny').click().wait(1000);
        cy.contains('Sim, cancelar!').click().wait(500);
        cy.contains('OK').click().wait(1000);
    });
});
