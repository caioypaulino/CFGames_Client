async function buscarProdutos () {
    try {
        const response = await fetch('http://localhost:8080/home/');

        if (!response.ok) {
            throw new Error('Response error!');
        }

        return await response.json();
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
};

const buscarTitulo = async (termoBusca, carregarProdutos) => {
    try {
        if (termoBusca === "") {
            carregarProdutos();
        }
        else {
            const response = await fetch(`http://localhost:8080/home/buscar/titulo=${termoBusca}`);

            if (!response.ok) {
                throw new Error('Response error!');
            }

            return await response.json();
        }
    }
    catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
};

const ProdutoService = {
    buscarProdutos,
    buscarTitulo
}

export default ProdutoService;