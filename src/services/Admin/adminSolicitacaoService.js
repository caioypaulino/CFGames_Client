import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";

async function buscarSolicitacoes(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/solicitacoestroca', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json()
            const sortedSolicitacoes = json.sort((a, b) => a.id - b.id); // Ordena os solicitacoes por ID

            return sortedSolicitacoes;
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar solicitações de troca e devolução!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
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

// Função para atualizar o status solicitação para APROVADA
async function aprovarSolicitacao(solicitacaoId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/solicitacoestroca/aprovar/${solicitacaoId}`, {
            method: "PUT",
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
        console.error("Erro ao atualizar status solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao aprovar a solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para atualizar o status solicitação para REPROVADA
async function reprovarSolicitacao(solicitacaoId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/solicitacoestroca/reprovar/${solicitacaoId}`, {
            method: "PUT",
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
        console.error("Erro ao atualizar status solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao reprovar a solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para concluir Solicitação Troca/Devolução
async function concluirSolicitacao(solicitacaoId, itensReposicao, reporEstoque) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/solicitacoestroca/concluir/${solicitacaoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                itensReposicao,
                reporEstoque
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
        console.error("Erro ao atualizar status da solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao concluir solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

async function atualizarStatusSolicitacao(solicitacaoId, novoStatus) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/solicitacoestroca/update/${solicitacaoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                statusSolicitacao: novoStatus
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
        console.error("Erro ao atualizar status da solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o status da solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar uma solicitação
async function deletarSolicitacao(solicitacaoId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/solicitacoestroca/delete/${solicitacaoId}`, {
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
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao deletar solicitação de troca/devolução:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar a solicitação de troca/devolução.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const AdminSolicitacaoService = {
    buscarSolicitacoes,
    aprovarSolicitacao,
    reprovarSolicitacao,
    concluirSolicitacao,
    atualizarStatusSolicitacao,
    deletarSolicitacao
}

export default AdminSolicitacaoService;