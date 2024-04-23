import React, { useEffect, useState } from "react";
import iconAdd from "../../../assets/buttons/add.svg";
import styles from "./AdminCupons.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { dataHoraMaskBR, valueMaskBR, valueMaskEN, dataMaskBR, dateTimeMask, cpfMask, telefoneMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";

const AdminCupons = () => {
    const [cupons, setCupons] = useState([]);

    const [paginaAtual, setPaginaAtual] = useState(1);
    const [cuponsPorPagina] = useState(9);

    const [colunaClassificada, setColunaClassificada] = useState(null);
    const [ordemClassificacao, setOrdemClassificacao] = useState('asc');

    const navigate = useNavigate();

    useEffect(() => {
        carregarCupons();
    }, []);

    const carregarCupons = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/admin/cupons', {
                headers: { Authorization: "Bearer " + token }
            });

            if (response.ok) {
                const json = await response.json()
                const sortedCupons = json.sort((a, b) => new Date(a.data) - new Date(b.data)); // Ordena os cupons por Data

                setCupons(sortedCupons);
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

    // Abre um modal com os detalhes do cupom usando o SweetAlert2
    const abrirPopupInfo = (cupom) => {
        const detalhesCupom = `
            <div class=${styles.justifyText}>
                <hr>
                <h2>Geral</h2>
                <p><strong>Código do Cupom:</strong> ${cupom.codigoCupom}</p>
                <p><strong>Valor de Desconto:</strong>R$ ${valueMaskBR(cupom.valorDesconto)}</p>
                <p><strong>Data de Emissão:</strong> ${dataHoraMaskBR(cupom.data)}</p>
                <p><strong>Data de Validade:</strong> ${dataHoraMaskBR(cupom.validade)}</p>
                <p><strong>Disponível:</strong> ${cupom.disponivel ? 'Sim' : 'Não'}</p>
                <br>
                <hr>
                <h2>Cliente</h2>
                <p><strong>ID:</strong> ${cupom.cliente.id}</p>
                <p><strong>Nome:</strong> ${cupom.cliente.nome}</p>
                <p><strong>CPF:</strong> ${cpfMask(cupom.cliente.cpf)}</p>
                <p><strong>Email:</strong> ${cupom.cliente.email}</p>
                <p><strong>Data de Nascimento:</strong> ${dataMaskBR(cupom.cliente.dataNascimento)}</p>
                <p><strong>Telefone:</strong> ${telefoneMask(cupom.cliente.telefone)}</p>
                <br>
                <hr>
            </div>
        `;

        Swal.fire({
            title: `<h3 style='color:#011640;'>Cupom</h3>`,
            html: detalhesCupom,
            showCancelButton: true,
            confirmButtonText: "Editar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            showDenyButton: true,
            denyButtonText: "Deletar",
            width: '40%',
        }).then((result) => {
            if (result.isConfirmed) { // Se o botão "Editar" for clicado
                Swal.fire({
                    title: 'Editar Cupom',
                    text: 'Selecione uma opção:',
                    showCancelButton: true,
                    confirmButtonText: "Alterar",
                    confirmButtonColor: "#6085FF",
                    cancelButtonText: "Fechar",
                    showDenyButton: true,
                    denyButtonText: "Desativar",
                    icon: 'info',
                    width: '35%',
                }).then((result) => {
                    if (result.isConfirmed) {
                        abrirPopupUpdate(cupom);
                    }
                    else if (result.isDenied) {
                        desativarCupom(cupom.codigoCupom);
                    }
                });
            }
            else if (result.isDenied) { // Se o botão "Deletar" for clicado
                abrirPopupDelete(cupom);
            }
        });
    };

    // Função para abrir o modal de atualização do cupom
    const abrirPopupUpdate = (cupom) => {
        Swal.fire({
            title: 'Atualizar Cupom',
            html: `
                <input id="valorDesconto" type="number" placeholder="R$ 1,00" class="swal2-input min="1.0" step="0.01" defaultValue=${cupom.valorDesconto}">
                <input id="validade" type="datetime-local" class="swal2-input" placeholder="Data de Validade" defaultValue=${cupom.validade} style={ width: '16.3rem' } />
            `,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                // Obter valores dos campos atualizados
                const valorDesconto = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#valorDesconto').value));
                const validade = Swal.getPopup().querySelector('#validade').value;

                try {
                    if (validade) {
                        atualizarCupom(cupom.codigoCupom, valorDesconto, dateTimeMask(validade));
                    }
                    else {
                        // Chamando a função para atualizar o cupom
                        atualizarCupom(cupom.codigoCupom, valorDesconto, validade);
                    }
                }
                catch (error) {
                    console.error("Erro ao atualizar cupom:", error);
                    Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao atualizar o cupom.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" });
                }
            }
        }).then((result) => {
            if (result.isDismissed) { // Se o usuário clicar em cancelar, volte para abrirPopupInfo
                abrirPopupInfo(cupom);
            }
        });
    };

    const atualizarCupom = async (codigoCupom, valorDesconto, validade) => {
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
    const desativarCupom = async (codigoCupom) => {
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

    // Função para solicitar confirmação da deleção do cupom
    const abrirPopupDelete = (cupom) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    deletarCupom(cupom.codigoCupom);
                }
                else if (result.isDismissed) {
                    abrirPopupInfo(cupom);
                }
            });
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

    const handleSort = (coluna) => {
        if (coluna === colunaClassificada) {
            setOrdemClassificacao(ordem => (ordem === 'asc' ? 'desc' : 'asc'));
        }
        else {
            setColunaClassificada(coluna);
            setOrdemClassificacao('asc');
        }
    };

    const abrirPopupAdd = () => {
        Swal.fire({
            title: "Adicionar Cupom",
            html: `
                <input id="valorDesconto" type="number" placeholder="R$ 1,00" min="1.0" step="0.01" class="swal2-input">
                <input id="clienteId" type="number" placeholder="Cliente ID" class="swal2-input">
            `,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const valorDesconto = parseFloat(valueMaskEN(Swal.getPopup().querySelector('#valorDesconto').value));
                const clienteId = parseInt(Swal.getPopup().querySelector('#clienteId').value);

                adicionarCupom(valorDesconto, clienteId);
            },
        });
    };

    // Função para adicionar o produto
    const adicionarCupom = async (valorDesconto, clienteId) => {
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

    const indexUltimoCupom = paginaAtual * cuponsPorPagina;
    const indexPrimeiroCupom = indexUltimoCupom - cuponsPorPagina;

    // Condicionais para ordenar os cupons com base na coluna selecionada
    const sortedCupons = [...cupons].sort((a, b) => {
        switch (colunaClassificada) {
            case 'Código Cupom':
                return ordemClassificacao === 'asc' ? a.codigoCupom.localeCompare(b.codigoCupom) : b.codigoCupom.localeCompare(a.codigoCupom);
            case 'Valor Desconto':
                return ordemClassificacao === 'asc' ? a.valorDesconto - b.valorDesconto : b.valorDesconto - a.valorDesconto;
            case 'Emissão':
                return ordemClassificacao === 'asc' ? new Date(a.data) - new Date(b.data) : new Date(b.data) - new Date(a.data);
            case 'Validade':
                return ordemClassificacao === 'asc' ? new Date(a.validade) - new Date(b.validade) : new Date(b.validade) - new Date(a.validade);
            case 'Cliente ID':
                return ordemClassificacao === 'asc' ? a.cliente.id - b.cliente.id : b.cliente.id - a.cliente.id;
            case 'Disponível':
                return ordemClassificacao === 'asc' ? a.disponivel - b.disponivel : b.disponivel - a.disponivel;
            default:
                return 0;
        }
    });

    const cuponsAtuais = sortedCupons.slice(indexPrimeiroCupom, indexUltimoCupom);
    const totalPaginas = Math.ceil(cupons.length / cuponsPorPagina);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div className={styles.container}>z
            <div className={styles.tbInfo}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('Código Cupom')}>
                                Código Cupom
                                {colunaClassificada === 'Código Cupom' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Valor Desconto')}>
                                Valor Desconto
                                {colunaClassificada === 'Valor Desconto' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Emissão')}>
                                Emissão
                                {colunaClassificada === 'Emissão' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Validade')}>
                                Validade
                                {colunaClassificada === 'Validade' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Cliente ID')}>
                                Cliente ID
                                {colunaClassificada === 'Cliente ID' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('Disponível')}>
                                Disponível
                                {colunaClassificada === 'Disponível' && (
                                    <span>{ordemClassificacao === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuponsAtuais.map(cupom => (
                            <tr key={cupom.codigoCupom}>
                                <td>{cupom.codigoCupom}</td>
                                <td>{'R$ ' + valueMaskBR(cupom.valorDesconto)}</td>
                                <td>{dataHoraMaskBR(cupom.data)}</td>
                                <td>{dataHoraMaskBR(cupom.validade)}</td>
                                <td>{cupom.cliente.id}</td>
                                <td>{cupom.disponivel ? 'Sim' : 'Não'}</td>
                                <td>
                                    <button className={styles.buttonAcoes} onClick={() => abrirPopupInfo(cupom)}>. . .</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                    <span className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                    <button onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
                </div>
                <div className={styles.btnIconAdd}>
                    <button className={styles.btnIcon} onClick={abrirPopupAdd}>
                        <img className={styles.iconAdd} src={iconAdd} alt="Adicionar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCupons;