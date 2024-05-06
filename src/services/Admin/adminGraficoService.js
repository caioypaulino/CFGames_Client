import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";

async function buscarStatsProdutos(dataInicio, dataFim, navigate) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/admin/grafico/produto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                dataInicio,
                dataFim,
            }),
        });

        if (response.ok) {
            return await response.json();
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
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function buscarStatsCategorias(dataInicio, dataFim, navigate) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/admin/grafico/categoria", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                dataInicio,
                dataFim,
            }),
        });

        if (response.ok) {
            return await response.json();
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
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

async function filtrarClientes(clientes, filtro) {
    // Lógica para filtrar os clientes com base nos filtros
    const clientesFiltrados = clientes.filter(cliente => {
        // Verifica se há filtros de gênero
        const filtroGenero = filtro.generos && filtro.generos.length > 0;

        // Verifica se o cliente corresponde aos filtros de gênero
        const correspondeGenero = filtroGenero ? filtro.generos.includes(cliente.genero) : true;

        // Verificando se a data de nascimento do cliente corresponde ao filtro
        const correspondeDataNascimento =
            (!filtro.anoNascimento || cliente.dataNascimento.startsWith(filtro.anoNascimento)) &&
            (!filtro.mesNascimento || cliente.dataNascimento.includes(filtro.mesNascimento)) &&
            (!filtro.diaNascimento || cliente.dataNascimento.endsWith(filtro.diaNascimento));

        return (
            cliente.id.toString().includes(filtro.id) &&
            cliente.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
            cliente.cpf.includes(filtro.cpf) &&
            cliente.telefone.includes(filtro.telefone) &&
            cliente.email.toLowerCase().includes(filtro.email.toLowerCase()) &&
            correspondeDataNascimento &&
            correspondeGenero // Verifica se corresponde ao filtro de gênero
        );
    });

    return clientesFiltrados;
}


const AdminGraficoService = {
    buscarStatsProdutos,
    buscarStatsCategorias,
}

export default AdminGraficoService;