import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";

async function buscarClientes(navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/admin/clientes', {
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            const json = await response.json();
            const sortedClientes = json.sort((a, b) => a.id - b.id); // Ordena os clientes por ID

            return sortedClientes;
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

// Função para deletar um cliente
async function deletarCliente(clienteId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:8080/admin/clientes/delete/${clienteId}`, {
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
        console.error("Erro ao deletar cliente:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao deletar o cliente.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

async function filtrarClientes(clientes, filtro) {
    // Lógica para filtrar os clientes com base nos filtros
    const clientesFiltrados = clientes.filter(cliente => {
        // Verifica se há filtros de gênero
        const filtroGenero = filtro.generos && filtro.generos.length > 0;
        
        // Verifica se o cliente match aos filtros de gênero
        const matchGenero = filtroGenero ? filtro.generos.includes(cliente.genero) : true;

        // Verificando se a data de nascimento do cliente match ao filtro
        const matchDataNascimento =
            (!filtro.anoNascimento || cliente.dataNascimento.startsWith(filtro.anoNascimento)) &&
            (!filtro.mesNascimento || cliente.dataNascimento.includes(filtro.mesNascimento)) &&
            (!filtro.diaNascimento || cliente.dataNascimento.endsWith(filtro.diaNascimento));

        return (
            cliente.id.toString().includes(filtro.id) &&
            cliente.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
            cliente.cpf.includes(filtro.cpf) &&
            cliente.telefone.includes(filtro.telefone) &&
            cliente.email.toLowerCase().includes(filtro.email.toLowerCase()) &&
            matchDataNascimento &&
            matchGenero // Verifica se match ao filtro de gênero
        );
    });

    return clientesFiltrados;
}


const AdminClienteService = {
    buscarClientes,
    deletarCliente,
    filtrarClientes
}

export default AdminClienteService;