import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";

async function buscarEnderecos(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/enderecos', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json();
            const sortedEnderecos = json.sort((a, b) => a.cep.localeCompare(b.cep)); // Ordena os endereços por CEP

            return sortedEnderecos;
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar endereços!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else if (response.status === 403) {
                Swal.fire({ title: "Erro!", html: `Você não possui permissão para acessar o painel de administrador.<br><br> Por favor, entre em contato com o administrador do sistema para mais informações.`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal"); });
            }
        }
    }
    catch (error) {
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// Função para adicionar endereço
async function adicionarEndereco(cep) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/admin/enderecos/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                cep
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Endereço adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao adicionar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

// Função para atualizar o endereço
async function atualizarEndereco(cep, rua, bairro, cidade, estado, pais) {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/admin/enderecos/update/${cep}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                cep,
                rua,
                bairro,
                cidade,
                estado,
                pais
            }),
        });

        if (response.ok) {
            const successMessage = await response.text();
            Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar um endereço
async function deletarEndereco(cep) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/enderecos/delete/${cep}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            },
        });


        if (response.ok) {
            const successMessage = await response.text();

            Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao deletar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const AdminEnderecoService = {
    buscarEnderecos,
    adicionarEndereco,
    atualizarEndereco,
    deletarEndereco
}

export default AdminEnderecoService;