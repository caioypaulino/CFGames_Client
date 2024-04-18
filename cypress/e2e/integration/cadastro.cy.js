describe('Cadastro de Cliente', () => {
    it('Realizar cadastro de cliente com sucesso', () => {
        // Visitar a página de cadastro
        cy.visit('http://localhost:3000/cadastro/cliente');

        // Preenchendo os campos do formulário com os dados fornecidos
        cy.get('input[type="text"]').eq(0).type('Caio Paulino');
        cy.get('input[type="text"]').eq(1).type('51915047803');
        cy.get('input[type="date"]').type('2002-12-20');
        cy.get('input[type="text"]').eq(2).type('11995852216');
        cy.get('input[type="text"]').eq(3).type('caio@gmail.com');
        cy.get('input[type="password"]').eq(0).type('123456aC@');
        cy.get('input[type="password"]').eq(1).type('123456aC@');

        // Submit do formulário
        cy.get('input[type="submit"]').click();
        // Confirmando swal2
        cy.get('.swal2-confirm').click();

        // Verificando se o cadastro foi realizado com sucesso redirecionando para a próxima página
        cy.url().should('include', '/cadastro/endereco');

        // Verificando se o token foi salvo no armazenamento local
        cy.window().its('localStorage').invoke('getItem', 'token').should('exist');

        // Aguardando 1 segundo.
        cy.wait(1000);

        // Preenchendo o formulário de endereço
        cy.get('input[type="text"]').eq(0).type('08599490');
        cy.get('input[type="text"]').eq(1).type('53');
        cy.get('input[type="text"]').eq(2).type('Casa');
        cy.get('#estadoSelect').select('SP');
        cy.get('input[type="text"]').eq(3).type('Rua Santa Helena');
        cy.get('input[type="text"]').eq(4).type('Campo da Venda');
        cy.get('input[type="text"]').eq(5).type('Itaquaquecetuba');
        cy.get('input[type="text"]').last().type('Casa do Osvaldo');
        cy.get('input[type="text"]').eq(7).type('Tocar campainha.');
        cy.get('input[type="text"]').eq(6).type('Brasil');

        // Submit do formulário
        cy.wait(1000).contains('Confirmar').click();
        // Confirmando swal2
        cy.get('.swal2-confirm').click();

        // Verificando se o redirecionamento ocorreu para a página do perfil pessoal
        cy.url().should('include', '/perfil/pessoal');

        // Verificando se a mensagem de sucesso é exibida
        cy.contains('Endereço(s) adicionado(s) com sucesso.').should('be.visible');
    });
});