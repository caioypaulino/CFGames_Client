import Swal from "sweetalert2";
import { getToken, limparToken } from "../utils/storage";

async function buscarConta(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/conta', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        return await response.json();
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar dados da conta.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
}

async function buscarPerfisConta(token) {
    try {
        const response = await fetch('http://localhost:8080/perfil/conta', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        const conta = await response.json();

        return conta.perfis;
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
};

async function buscarPessoais(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/pessoal', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        return await response.json();
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar dados pessoais.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
}

async function editarEmail(email, navigate) {
    try {
        const token = getToken();

        let url = "http://localhost:8080/perfil/update/email";

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                email: email
            })
        });

        if (response.ok) {
            limparToken();
            Swal.fire({ title: "Sucesso!", text: `E-mail atualizado com sucesso.`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login") });
        }
        else {
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error(`Erro ao atualizar email:`, error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar E-mail.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
}

async function editarSenha(senhaAtual, novaSenha, confirmaSenha, navigate) {
    try {
        const token = getToken();
        const url = "http://localhost:8080/perfil/update/senha";

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                senhaAtual,
                senha: novaSenha,
                confirmaSenha: confirmaSenha
            })
        });

        if (response.ok) {
            limparToken();
            Swal.fire({ title: "Sucesso!", text: "Senha atualizada com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login") });
        }
        else {
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao atualizar senha:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar a senha.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
}

async function editarDadosPessoais(nome, cpf, genero, dataNascimento, telefone) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/update/pessoal", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                nome,
                cpf: cpf,
                genero,
                dataNascimento,
                telefone
            })
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Dados pessoais atualizados com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); }); // Recarregar a página após o update
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao atualizar dados pessoais:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar os dados pessoais.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const ClienteService = {
    buscarConta,
    buscarPerfisConta,
    buscarPessoais,
    editarEmail,
    editarSenha,
    editarDadosPessoais
}

export default ClienteService;