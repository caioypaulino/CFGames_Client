import Swal from "sweetalert2";

// Função para buscar descrição/curiosidades através da I.A Gemini do jogo digitado
async function buscarGemini(nomeJogo, styles) {
    try {
        Swal.fire({
            title: `<h3 style='color:#011640; margin-bottom:-1%'>Buscando...</h3>`,
            html: `
                <div class=${styles.centerText}>
                    <p>Por favor, aguarde enquanto o Gemini busca as informações.</p>
                </div>
            `,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const response = await fetch("http://localhost:8080/home/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeJogo
            }),
        });

        if (response.ok) {
            const json = await response.json();
            const text = json.candidates[0].content.parts[0].text;
            
            Swal.fire({
                title: `<h3 style='color:#011640; margin-bottom:-1%; margin-top:-1%'>Descrição/Curiosidades!</h3>`, 
                html: `
                    <div class=${styles.justifyText}>
                        <p>${text}</p>
                    </div>
                `, 
                icon: "info", 
                confirmButtonColor: "#6085FF",
                confirmButtonText: "Obrigado!", 
                showCloseButton: true,
                width:'40%'
            });
        }
        else {
            // Buscando mensagem de erro que não é JSON
            const errorMessage = await response.text();

            throw new Error(errorMessage);
        }
    }
    catch (error) {
        // Tratando mensagem de erro
        console.error("Erro ao buscar resultados da I.A:", error);
        Swal.fire({ 
            title: `<h3 style='color:#011640; margin-bottom:-1%; margin-top:-1%'>Erro!</h3>`,
            html:  `
                <div class=${styles.centerText}>
                    <p>Ocorreu um erro ao perguntar para o Gemini.<br><br>Campo não informado, por favor insira o nome de um jogo!</p>
                </div>
            `, 
            icon: "error", 
            confirmButtonColor: "#6085FF"
        })
    }
};

const GeminiService = {
    buscarGemini
}

export default GeminiService;