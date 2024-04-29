import Swal from "sweetalert2";
import { getToken } from "../utils/storage";
import { useAsync } from "react-select/async";

// função para buscar endereços
async function buscarEnderecos (navigate) {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:8080/perfil/enderecos', {
            headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error('Token Inválido!');
        }

        const enderecos = await response.json();

        // Função para ordenar os endereços por tipo na ordem específica
        const ordenarPorTipo = (endereco1, endereco2) => {
            const ordemTipo = {
                GERAL: 1,
                RESIDENCIAL: 2,
                ENTREGA: 3,
                COBRANCA: 4
            };

            return ordemTipo[endereco1.tipo] - ordemTipo[endereco2.tipo];
        };

        // Ordenando os endereços pela ordem especificada
        enderecos.sort(ordenarPorTipo);

        return enderecos;
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar endereços.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
}

// função para adicionar um novo endereço
async function adicionarEndereco (apelido, numero, complemento, tipo, cep, observacao) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/add/endereco", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                apelido,
                numero,
                complemento,
                tipo,
                endereco: {
                    cep,
                },
                observacao,
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Endereço adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao adicionar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
}

// função para adicionar um novo endereço
async function adicionarEnderecoCheckout (apelido, numero, complemento, tipo, cep, observacao) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/add/endereco", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                apelido,
                numero,
                complemento,
                tipo,
                endereco: {
                    cep,
                },
                observacao,
            }),
        });

        if (response.ok) {
            Swal.fire({ title: "Sucesso!", text: "Endereço adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" });

            return await response.json();
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao adicionar endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
}

// função request update endereço
async function editarEndereco (id, apelido, numero, complemento, tipo, cep, observacao) {
    try {
        const token = getToken();
        
        const response = await fetch(`http://localhost:8080/perfil/update/endereco/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization : "Bearer " + token
            },
            body: JSON.stringify({
                apelido,
                numero,
                complemento,
                tipo,
                endereco: {
                    cep
                },
                observacao
            })
        });

        if (response.ok) {
            Swal.fire({title:"Sucesso!", text:"Endereço atualizado com sucesso.", icon:"success", confirmButtonColor:"#6085FF"}).then(() => { window.location.reload(); }); // Recarregar a página após o update
        } 
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();
            
            throw new Error(errorMessage);
        }
    } 
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao atualizar endereço:", error);
        Swal.fire({title:"Erro!", html: `Ocorreu um erro ao atualizar o endereço.<br><br>${error.message}`, icon:"error", confirmButtonColor:"#6085FF"})
    }
}

// função request delete endereço
async function excluirEndereco (enderecoId) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/remove/endereco", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id: enderecoId,
            }),
        });

        if (response.ok) {
            // Exibindo mensagem de sucesso
            Swal.fire({title:"Removido!", text:"Endereço foi removido com sucesso.", icon:"success", confirmButtonColor:"#6085FF"}).then(() => { window.location.reload(); });
            // Recarregar a página ou atualizar os dados, conforme necessário
        } 
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();
            
            throw new Error(errorMessage);
        }
    } 
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao excluir endereço:", error);
        Swal.fire({title:"Erro!", html: `Ocorreu um erro ao excluir o endereço.<br><br>${error.message}`, icon:"error", confirmButtonColor:"#6085FF"})
    }
}

// função request delete endereço
async function excluirEnderecoCheckout (enderecoId, carregarEnderecosCliente) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:8080/perfil/remove/endereco", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                id: enderecoId,
            }),
        });

        if (response.ok) {
            carregarEnderecosCliente();
        }
        else {
            // buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // tratando mensagem de erro
        console.error("Erro ao excluir endereço:", error);
        Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao excluir o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
    }
};

const EnderecoService = {
    buscarEnderecos,
    adicionarEndereco,
    adicionarEnderecoCheckout,
    editarEndereco,
    excluirEndereco,
    excluirEnderecoCheckout
};

export default EnderecoService;