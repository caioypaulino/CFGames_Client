import Swal from "sweetalert2";
import { salvarToken } from "../utils/storage";

export async function loginUsuario(email, senha, navigate) {
    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const data = await response.json();

            salvarToken(data.token);

            Swal.fire({ title: "Login realizado com sucesso!", text: "Seja Bem-vindo(a)", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal") });
        }
        else {
            // Lidar com um erro de autenticação
            Swal.fire({ title: "Email ou Senha inválidos!", text: "Digite novamente.", icon: "error", confirmButtonColor: "#6085FF" })
        }
    }
    catch (error) {
        console.error(error);
        Swal.fire(error, '', "error");
    }

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