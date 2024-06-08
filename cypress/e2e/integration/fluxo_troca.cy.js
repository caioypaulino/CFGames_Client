describe('Fluxos de Troca/Devolução', () => {
    it('Fluxo de Troca Feliz Cliente Solicitação', () => {
        cy.login_success(); // Realizando login com sucesso!
    
        cy.visit('http://localhost:3000/perfil/pedidos').wait(1000);
    
        cy.contains('. . .').first().click().wait(1000);  // Acessando último pedido
    
        cy.get('.swal2-container').scrollTo('bottom').wait(500);
        cy.get('.swal2-confirm').click().wait(500); // Abrindo popup troca/devolução
    
        cy.get('#motivo').type("Itens com defeito!").wait(500); // Digitando motivo
        
        cy.get('.swal2-select__control').click().wait(500); // Selecionando dois itens
        cy.get('#react-select-3-option-0').click().wait(500);
        cy.get('#react-select-3-option-2').click().wait(500);
    
        cy.get('[id="quantidadeItens"]').first().click().wait(500);
        cy.get('#react-select-5-option-1').click(); // Alterando Quantidade
    
        cy.contains('Confirmar').click(); // Submit solicitação de troca/devolução
        cy.contains('OK').click();
    });

    it('Fluxo de Troca Feliz Admin Aprovação', () => {
        const selecionarSolicitacao = () => {
            cy.get('thead > tr > :nth-child(1)').click().wait(500); // Selecionando pedido mais recente
            cy.get('thead > tr > :nth-child(1)').click().wait(500);
    
            cy.contains('. . .').first().click().wait(500); // Acessando pedido
    
            cy.get('.swal2-container').scrollTo('bottom');
    
            cy.get('.swal2-confirm').click().wait(500); // Alterar Status
        }
        
        cy.login_admin_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000/admin/solicitacoes_troca_devolucao').wait(1000);

        selecionarSolicitacao();
        cy.get('#swal2-html-container > div > .swal2-confirm').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500);
    });

    it('Fluxo de Troca Feliz Admin Reprovação', () => {
        const selecionarSolicitacao = () => {
            cy.get('thead > tr > :nth-child(1)').click().wait(500); // Selecionando pedido mais recente
            cy.get('thead > tr > :nth-child(1)').click().wait(500);
    
            cy.contains('. . .').first().click().wait(500); // Acessando pedido
    
            cy.get('.swal2-container').scrollTo('bottom');
    
            cy.get('.swal2-confirm').click().wait(500); // Alterar Status
        }
        
        cy.login_admin_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000/admin/solicitacoes_troca_devolucao').wait(1000);

        selecionarSolicitacao();
        cy.contains('Reprovar').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500);
    });

    it('Fluxo de Troca Feliz Cliente Confirmar Envio', () => {
        cy.login_success(); // Realizando login com sucesso!
    
        cy.visit('http://localhost:3000/perfil/solicitacoes_troca_devolucao').wait(1000);
    
        cy.contains('. . .').first().click().wait(1000);  // Acessando último pedido
    
        cy.get('.swal2-container').scrollTo('bottom').wait(500);
        cy.get('.swal2-confirm').click().wait(500); // Confirmar envio do(s) item(ns)

        cy.contains('OK').click();
    });

    it('Fluxo de Troca Cancelada Cliente', () => {
        cy.login_success(); // Realizando login com sucesso!
    
        cy.visit('http://localhost:3000/perfil/solicitacoes_troca_devolucao').wait(1000);
    
        cy.contains('. . .').first().click().wait(1000);  // Acessando último pedido

        cy.get('.swal2-deny').click().wait(500); // Confirmar envio do(s) item(ns)
        cy.contains('Sim, cancelar!').click().wait(500);
        cy.contains('OK').click().wait(1000);
    });

    it('Fluxo de Troca Feliz Admin Conclusão', () => {
        const selecionarSolicitacao = () => {
            cy.get('thead > tr > :nth-child(1)').click().wait(500); // Selecionando pedido mais recente
            cy.get('thead > tr > :nth-child(1)').click().wait(500);
    
            cy.contains('. . .').first().click().wait(500); // Acessando pedido
    
            cy.get('.swal2-container').scrollTo('bottom');
    
            cy.get('.swal2-confirm').click().wait(500); // Alterar Status
        }
        
        cy.login_admin_success(); // Realizando login com sucesso!

        cy.visit('http://localhost:3000/admin/solicitacoes_troca_devolucao').wait(1000);

        selecionarSolicitacao();
        cy.get('#swal2-html-container > div > .swal2-deny').click().wait(500);
        cy.get('.swal2-container').scrollTo('bottom').wait(500);

        cy.get('#reporEstoque').click().wait(500);
        cy.get('.swal2-confirm').click().wait(500);
        cy.get('.swal2-confirm').click();
    });

    it('Fluxo de Troca Feliz Cliente Cupom Gerado', () => {
        cy.login_success(); // Realizando login com sucesso!
    
        cy.visit('http://localhost:3000/perfil/cupons').wait(1000);
    });
});