describe('Teste de Login', () => {
    it('Login com sucesso', () => {
        cy.visit('http://localhost:3000/login'); // Substitua pela URL do seu aplicativo
        cy.get('input[type="text"]').type('caio@gmail.com'); // Insira o e-mail de teste
        cy.get('input[type="password"]').type('123456aC@'); // Insira a senha de teste
        cy.get('input[type="submit"]').click(); // Submeta o formulário de login
        cy.contains('Seja Bem-vindo(a)').should('be.visible'); // Verifique se a mensagem de boas-vindas é exibida
        cy.get('.swal2-confirm').should('be.visible').click(); // Selecione o botão de confirmação e clique nele
        cy.url().should('include', '/perfil/pessoal'); // Verifique se a URL mudou para a página de perfil após o login
    });

    it('Login com credenciais inválidas', () => {
        cy.visit('http://localhost:3000/login'); // Substitua pela URL do seu aplicativo
        cy.get('input[type="text"]').type('email-invalido@teste.com'); // Insira um e-mail inválido
        cy.get('input[type="password"]').type('senha-invalida'); // Insira uma senha inválida
        cy.get('input[type="submit"]').click(); // Submeta o formulário de login
        cy.contains('Email ou Senha inválidos!').should('be.visible'); // Verifique se a mensagem de erro é exibida
    });
});