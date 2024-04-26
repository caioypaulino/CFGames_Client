describe('Cadastro de Cliente', () => {
    it('Realizar cadastro de cliente com sucesso', () => {
        const cadastrarCliente = () => {

            cy.visit('http://localhost:3000/cadastro/cliente'); // Visitando a página de cadastro

            cy.get('input[type="text"]').eq(0).type('Caio Paulino'); // Preenchendo os campos do formulário com os dados fornecidos
            cy.get('input[type="text"]').eq(1).type('51915047803');
            cy.get('input[type="date"]').type('2002-12-20');
            cy.get('input[type="text"]').eq(2).type('11995852216');
            cy.get('input[type="text"]').eq(3).type('caio2@gmail.com');
            cy.get('input[type="password"]').eq(0).type('123456aC@');
            cy.get('input[type="password"]').eq(1).type('123456aC@');

            cy.get('input[type="submit"]').click(); // Submit do formulário
            cy.get('.swal2-confirm').click(); // Confirmando swal2

            cy.url().should('include', '/cadastro/endereco'); // Verificando se o cadastro foi realizado com sucesso redirecionando para a próxima página

            cy.window().its('localStorage').invoke('getItem', 'token').should('exist'); // Verificando se o token foi salvo no armazenamento local
        };

        const cadastrarEndereco = () => {
            cy.get('input[type="text"]').eq(0).type('08599490'); // Preenchendo o formulário de endereço
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
        }

        const cadastrarCartao = (numeroCartao) => {
            cy.get('[href="/perfil/cartoes"] > button').click(); // Visitando a página de cadastro

            cy.get('[testid="iconAdd"]').click(); // Adicionando cartão

            cy.get('#numeroCartao').type(numeroCartao) // Digitando informações
            cy.get('#nomeCartao').type("Caio H Paulino")
            cy.get('#mesVencimento').type(7)
            cy.get('#anoVencimento').type(2027)
            cy.get('#cvc').type(666)

            cy.get('.swal2-confirm').click(); // Submit
            cy.get('.swal2-confirm').click();
        };

        cadastrarCliente();
        cy.wait(1500);

        cadastrarEndereco();
        cy.wait(1500);
        
        cadastrarCartao("4556 9906 1596 1861");
        
    });
});