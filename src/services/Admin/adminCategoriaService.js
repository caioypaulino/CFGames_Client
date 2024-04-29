import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";

async function buscarCategorias(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/categorias', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json();
            const sortedCategorias = json.sort((a, b) => a.id - b.id);

            return sortedCategorias; // Definindo categorias
        }
        else {
            if (response.status === 500) {
                throw new Error('Token Inválido!');
            }
            else if (response.status === 400) {
                Swal.fire({ title: "Erro!", html: `Erro ao carregar categorias!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
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

// Função para adicionar categoria
async function adicionarCategoria (nome) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/admin/categorias/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                nome
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Categoria adicionada com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao adicionar categoria:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

// Função para atualizar a categoria
async function atualizarCategoria (categoriaId, nome) {
    try {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/admin/categorias/update/${categoriaId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                nome
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
        console.error("Erro ao atualizar categoria:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
    }
};

// Função para deletar uma categoria
async function deletarCategoria (categoriaId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/categorias/delete/${categoriaId}`, {
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
        console.error("Erro ao deletar categoria:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar a categoria.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const AdminCategoriaService = {
    buscarCategorias,
    adicionarCategoria,
    atualizarCategoria,
    deletarCategoria
}

export default AdminCategoriaService;