describe('Fluxos de Troca/Devolução', () => {
    it('Fluxo de Troca Feliz Cliente', () => {
        cy.login_success(); // Realizando login com sucesso!
    
        cy.visit('http://localhost:3000/perfil/pedidos').wait(1000);
    
        cy.get('.tabelaPerfilPedidos_buttonAcoes__2Oc77').first().click().wait(1000);  // Acessando último pedido
    
        cy.get('.swal2-container').scrollTo('bottom').wait(500);
        cy.get('.swal2-confirm').click().wait(500); // Abrindo popup troca/devolução
    
        cy.get('#motivo').type("Itens com defeito!").wait(500); // Digitando motivo
        
        cy.get('.swal2-select__control').click().wait(500); // Selecionando dois itens
        cy.get('#react-select-3-option-0').click().wait(500);
        cy.get('#react-select-3-option-2').click().wait(500);
    
        cy.get(':nth-child(1) > .FormTrocaDevolucao_quantidadeSelect__3UltU > #quantidadeItens > .css-13cymwt-control > .css-1hb7zxy-IndicatorsContainer > .css-1xc3v61-indicatorContainer').click().wait(500);
        cy.get('#react-select-5-option-1').click(); // Alterando Quantidade
    
        cy.get('.FormTrocaDevolucao_confirmButton__1emkk').click(); // Submit solicitação de troca/devolução
        cy.contains('OK').click();
    });

    it('Fluxo de Troca Feliz Admin', () => {
        const selecionarSolicitacao = () => {
            cy.get('thead > tr > :nth-child(1)').click().wait(500); // Selecionando pedido mais recente
            cy.get('thead > tr > :nth-child(1)').click().wait(500);
    
            cy.get(':nth-child(1) > :nth-child(7) > .AdminSolicitacoesTrocaDevolucao_buttonAcoes__2BwCK').first().click().wait(500); // Acessando pedido
    
            cy.get('.swal2-container').scrollTo('bottom');
    
            cy.get('.swal2-confirm').click().wait(500); // Alterar Status
        }
        
        cy.login_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000/admin/solicitacoes_troca_devolucao').wait(1000);

        selecionarSolicitacao();
        cy.get('#swal2-html-container > div > .swal2-confirm').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500);

        selecionarSolicitacao();
        cy.get('#swal2-html-container > div > .swal2-deny').click().wait(500);
        cy.get('.swal2-container').scrollTo('bottom').wait(500);

        cy.get('#reporEstoque').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500);
        cy.get('.swal2-confirm').click();
    });
});
