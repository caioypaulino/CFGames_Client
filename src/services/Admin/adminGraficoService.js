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
        limparToken();
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
        limparToken();
        console.error('Erro ao carregar dados:', error);
        Swal.fire({ title: "Erro!", html: `Erro ao carregar painel de administrador.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    }
};

// Função para converter os dados de stats em um formato aceito pelo gráfico
async function adequarDadosGrafico(dados, isProduto) {
    let dadosGrafico = [];

    // Adicionando a linha do cabeçalho
    if (isProduto) {
        dadosGrafico = [["Mês/Ano", ...dados.map(item => item.produto.titulo)]];
    } 
    else {
        dadosGrafico = [["Mês/Ano", ...dados.map(item => item.categoria.nome)]];
    }

    // Obtendo todos os períodos únicos nos dados
    const periodoStats = [...new Set(dados.flatMap(item => item.stats.map(stat => `${stat.mes}/${stat.ano}`)))];

    // Ordenando os períodos em ordem cronológica
    const periodosOrdenados = periodoStats.sort((a, b) => {
        const [mesA, anoA] = a.split('/').map(Number);
        const [mesB, anoB] = b.split('/').map(Number);

        return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });

    // Construindo linhas para cada período ordenado
    periodosOrdenados.forEach(periodo => {
        const linhaStats = [periodo];

        dados.forEach(item => {
            const matchPeriodo = item.stats.find(stat => `${stat.mes}/${stat.ano}` === periodo);
            
            linhaStats.push(matchPeriodo ? matchPeriodo.valorTotal : 0); // Use 0 em vez de null para valores ausentes
        });

        dadosGrafico.push(linhaStats);
    });

    return dadosGrafico;
}


async function buscarProdutosIniciais(statsProdutos) {
    if (statsProdutos.length > 0) {
        const produtosIniciais = statsProdutos.map((stats) => ({
            value: stats.produto.id,
            label: stats.produto.titulo
        }));

        return produtosIniciais;
    }
    else {
        return [];
    }
};

async function buscarCategoriasIniciais(statsCategorias) {
    if (statsCategorias.length > 0) {
        const categoriasIniciais = statsCategorias.map((stats) => ({
            value: stats.categoria.id,
            label: stats.categoria.nome
        }));

        return categoriasIniciais;
    }
    else {
        return [];
    }
};

const filtrarGrafico = async (produtos, categorias, isProduto, filtro, setStatsProdutosFiltrados, setStatsCategoriasFiltradas) => {
    if (isProduto) {
        const produtosFiltrados = produtos.filter(produto => {
            // Verifica se há produtos selecionados no filtro
            const filtroProdutos = filtro.produtos && filtro.produtos.length > 0;
            // Verifica se o produto corresponde aos produtos selecionados no filtro
            const correspondeProdutos = filtroProdutos
                ? filtro.produtos.some(produtoFiltro => produtoFiltro.value === produto.produto.id) : false; 
            return correspondeProdutos;
        });

        return setStatsProdutosFiltrados(produtosFiltrados);
    }
    else {
        const categoriasFiltradas = categorias.filter(categoria => {
            // Verificando se o produto match aos produtos selecionados no filtro
            const filtroCategorias = filtro.categorias && filtro.categorias.length > 0;
            const matchCategorias = filtroCategorias ? filtro.categorias.some(categoriaFiltro => categoriaFiltro.value === categoria.categoria.id) : false;

            return matchCategorias;
        });
        
        return setStatsCategoriasFiltradas(categoriasFiltradas);
    }
};

const AdminGraficoService = {
    buscarStatsProdutos,
    buscarStatsCategorias,
    adequarDadosGrafico,
    buscarProdutosIniciais,
    buscarCategoriasIniciais,
    filtrarGrafico
}

export default AdminGraficoService;