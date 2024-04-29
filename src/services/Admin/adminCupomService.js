import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";

async function buscarCupons(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/cupons', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json()
            const sortedCupons = json.sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordena os cupons por Data

            return sortedCupons;
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar cupons!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else if (response.status === 403) {
                Swal.fire({ title: "Erro!", html: `Você não possui permissão para acessar o painel de administrador.<br><br> Por favor, entre em contato com o administrador do sistema para mais informações.`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal"); });
            }
        }
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// Função para adicionar o produto
async function adicionarCupom(valorDesconto, clienteId) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/admin/cupons/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                valorDesconto,
                clienteId
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Cupom adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao adicionar cupom:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o cupom.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

async function atualizarCupom(codigoCupom, valorDesconto, validade) {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/admin/cupons/update/${codigoCupom}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                valorDesconto,
                validade
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
        console.error("Erro ao atualizar cupom:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o cupom.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para desativar cupom
async function desativarCupom(codigoCupom) {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/admin/cupons/desativar/${codigoCupom}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            }
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
        console.error("Erro ao desativar cupom:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao desativar cupom.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar um cupom
const deletarCupom = async (codigoCupom) => {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/cupons/delete/${codigoCupom}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            },
        });

        if (response.ok) {
            const successMessage = await response.text();

            Swal.fire({ title: "Sucesso!", html: `${successMessage}`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao deletar cupom:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o cupom.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const AdminCupomService = {
    buscarCupons,
    adicionarCupom,
    atualizarCupom,
    desativarCupom,
    deletarCupom
}

export default AdminCupomService;