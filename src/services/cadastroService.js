import Swal from "sweetalert2";
import { getToken, salvarToken } from "../utils/storage";

export async function cadastrarCliente({
    nome,
    cpf,
    dataNascimento,
    genero,
    telefone,
    email,
    senha,
    confirmaSenha,
    navigate
}) {
    try {
        const response = await fetch("http://localhost:8080/cadastro/cliente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome,
                cpf,
                dataNascimento,
                genero,
                telefone,
                email,
                senha,
                confirmaSenha
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Cadastro realizado com sucesso!", text: "Cliente cadastrado.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => {
                loginAutomatico(email, senha, navigate);
            });
        }
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao cadastrar o cliente:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao cadastrar o cliente.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
}

async function loginAutomatico(email, senha, navigate) {
    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const data = await response.json();

            salvarToken(data.token);

            navigate("/cadastro/endereco");
        }
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } 
    catch (error) {
        console.error("Erro ao fazer login automaticamente:", error);
        Swal.fire({ title: "Erro!", text: "Não foi possível fazer login automaticamente após o cadastro.", icon: "error", confirmButtonColor: "#6085FF" });
    }
}

export async function cadastrarEndereco({enderecosRequest, navigate}) {
    try {
        const token = getToken();

        // Submissão do(s) endereço(s)
        const response = await fetch("http://localhost:8080/cadastro/endereco", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(enderecosRequest),
        });

        // Verificação e tratamento da resposta
        if (response.ok) {
            // Exibição de mensagem de sucesso
            Swal.fire({ title: "Sucesso!", text: "Endereço(s) adicionado(s) com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal") });

        } 
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } 
    catch (error) {
        console.error("Erro ao adicionar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o(s) endereço(s).<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
}