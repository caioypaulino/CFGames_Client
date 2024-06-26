// Função para remover máscara e mostrar apenas dígitos
export const removeMask = (value) => {
    value = value.replace(/\D/g, '');
    return value;
}

export const handleNumber = (event) => {
    let input = event.target;
    input.value = removeMask(input.value);
}

export const handleCep = (event) => {
    let input = event.target;
    input.value = cepMask(input.value);
}

// Função para aplicar máscara ao número de CEP
export const cepMask = (value) => {
    if (!value) return "";

    value = removeMask(value);
    value = value.replace(/(\d{5})(\d)/, '$1-$2');

    return value;
}

export const handleCreditCard = (event) => {
    let input = event.target;
    input.value = creditCardMask(input.value);
}

// Função para aplicar máscara de espaços ao número do cartão
export const creditCardMask = (number) => {
    // Colocar espaço a cada 4 dígitos
    if (!number) return "";

    number = removeMask(number);
    number = number.replace(/(\d{4})(?=\d)/g, '$1 ');

    return number;
}

// Função para aplicar máscara censura ao número do cartão
export const creditCardXXXXMask = (number) => {
    // Substituir todos os dígitos, exceto os últimos 4, por "X"
    const visibleDigits = number.slice(-4);
    const maskedDigits = number.slice(0, -4).replace(/\d/g, 'X');

    const maskedNumberWithSpaces = maskedDigits.replace(/(.{4})/g, '$1 ');

    return maskedNumberWithSpaces + visibleDigits;
}

export const handleCPF = (event) => {
    let input = event.target;
    input.value = cpfMask(input.value);
}

// Função para aplicar máscara ao número de CPF
export const cpfMask = (value) => {
    if (!value) return "";

    value = removeMask(value);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return value;
}

export const handleTelefone = (event) => {
    let input = event.target;
    input.value = telefoneMask(input.value);
}

// Função para aplicar máscara ao número de telefone
export const telefoneMask = (value) => {
    if (!value) return "";

    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Formatação para número de telefone com 8 ou 9 dígitos
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    return value;
};

// Função para aplicar máscara de datas (dd/MM/yyyy)
export const dataMaskBR = (value) => {
    const [ano, mes, dia] = value.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Função para aplicar máscara de datas (dd/MM/yyyy)
export const dataMaskBR2 = (value) => {
    const [dia, mes, ano] = value.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Função para aplicar máscara de data (dd/MM/yyyy HH:mm)
export const dataHoraMaskBR = (value) => {
    const [data, hora] = value.split(" ");
    const [dia, mes, ano] = data.split("-");
    return `${dia}/${mes}/${ano} (${hora})`;
}

// Função para aplicar máscara de data (dd/MM/yyyy HH:mm)
export const DateMask = (value) => {
    const [data, hora] = value.split(" ");
    const [dia, mes, ano] = data.split("-");
    const [horas, minutos] = hora.split(":");

    return new Date(ano, mes - 1, dia, horas, minutos);
}

// Função para aplicar máscara de datas (dd-MM-yyyy)
export const dataMaskEN = (value) => {
    const dataSplit = value.split("-");
    return `${dataSplit[2]}-${dataSplit[1]}-${dataSplit[0]}`;
};

// Função para aplicar máscara de datas (yyyy-MM-dd)
export const dataMaskEN2 = (value) => {
    const [dia, mes, ano] = value.split("-");
    return `${ano}-${mes}-${dia}`;
}

// Função para formatar data e hora (dd-MM-yyyy hh:mm)
export const dateTimeMask = (dateTimeString) => {

    const dateTime = new Date(dateTimeString);

    // Verificar se a data/hora é válida
    if (isNaN(dateTime.getTime())) {
        throw new Error('Por favor, insira uma data e hora válidas.');
    }

    const dia = String(dateTime.getDate()).padStart(2, '0');
    const mes = String(dateTime.getMonth() + 1).padStart(2, ' 0');
    const ano = dateTime.getFullYear();
    const horas = String(dateTime.getHours()).padStart(2, '0');
    const minutos = String(dateTime.getMinutes()).padStart(2, '0');

    return `${dia}-${mes}-${ano} ${horas}:${minutos}`;
};

// Função para formatar data e hora (dd-MM-yyyy hh:mm)
export const dateTimeMask2 = (date) => {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0"); // +1 porque os meses começam em 0
    const ano = String(date.getFullYear()).padStart(4, "0");
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");

    return `${dia}-${mes}-${ano} ${horas}:${minutos}`;
}

// Função para formatar data e hora (yyyy-MM-ddThh:mm)
export const dateTimeLocalMask = (data) => {
    var partes = data.split(' ');
    var dataPartes = partes[0].split('-');
    var horaPartes = partes[1].split(':');

    var novaData = dataPartes[2] + '-' + dataPartes[1] + '-' + dataPartes[0] + 'T' + horaPartes[0] + ':' + horaPartes[1];

    return novaData;
}

export const reverterDateTimeLocalMask = (data) => {
    var partes = data.split('T');
    var dataPartes = partes[0].split('-');
    var horaPartes = partes[1].split(':');

    var novaData = dataPartes[2] + '-' + dataPartes[1] + '-' + dataPartes[0] + ' ' + horaPartes[0] + ':' + horaPartes[1];

    return novaData;
}

export const dateTimeValido = (dateTimeString) => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    return dateTimeRegex.test(dateTimeString);
};

// Função para aplicar máscara de valores (ex: 13950,00 para 13950.00)
export const valueMaskEN = (value) => {
    return value.replace(",", ".");
}

// Função para aplicar máscara de valores (duas casas decimais)
export const valueMaskBR = (value) => {
    return value.toFixed(2);
}

// Função para lidar com a mudança no valor do input e aplicar a máscara de preço
export const handlePreco = (event) => {
    event.target.value = precoMask(event.target.value);
};

// Função para aplicar máscara de preço (R$ value)
export const precoMask = (value) => {
    // Se o valor não for uma string ou estiver vazio, retorne vazio
    if (typeof value !== 'string' || value === '') return '';

    // Remover "R$" e quaisquer caracteres não numéricos
    const numericValue = value.replace(/^R\s*\$/, '').replace(/[^\d]/g, '');

    // Se o valor não for numérico, retornar vazio
    if (isNaN(numericValue)) return '';

    // Formatando o valor como "R$ X,XX" apenas se houver valor numérico
    const floatValue = parseFloat(numericValue) / 100; // Dividir por 100 para obter o valor correto
    return `R$ ${floatValue.toFixed(2)}`; // Formatar para duas casas decimais
};

// Função para remover a máscara de preço (R$ value)
export const precoUnmask = (value) => {
    // Se o valor não for uma string ou estiver vazio, retorne vazio
    if (typeof value !== 'string' || value === '') return '';

    // Remover "R$" e quaisquer caracteres não numéricos
    const numericValue = value.replace(/^R\s*\$/, '').replace(/[^\d]/g, '');

    // Se o valor não for numérico, retornar vazio
    if (isNaN(numericValue)) return '';

    // Dividir por 100 para obter o valor correto
    return (parseFloat(numericValue) / 100).toFixed(2);
};

export const statusMask = (value) => {
    if (value === "EM_TRANSITO") {
        return "Em Trânsito";
    }
    else if (value === "CONCLUIDA") {
        return "Concluída";
    }
    else {
        const palavras = value.toLowerCase().split('_').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1));
        return palavras.join(' ');
    }
}

// Função para aplicar máscara ao gênero cliente
export const generoMask = (value) => {
    switch (value) {
        case "MASCULINO":
            return "Masculino";
        case "FEMININO":
            return "Feminino";
        case "OUTRO":
            return "Outro";
        case "NAO_INFORMAR":
            return "Não Informar";
        default:
            return "";
    }
};

// Função para aplicar máscara a plataforma produto
export const plataformaMask = (value) => {
    switch (value) {
        case "XBOX360":
            return "Xbox 360";
        case "XBOXONE":
            return "Xbox One";
        case "XBOXS":
            return "Xbox Series S";
        case "PS3":
            return "PlayStation 3";
        case "PS4":
            return "PlayStation 4";
        case "PS5":
            return "PlayStation 5";
        case "PSP":
            return "PSP";
        case "NINTENDOWII":
            return "Nintendo Wii";
        case "NINTENDODS":
            return "Nintendo DS";
        case "NINTENDOSWITCH":
            return "Nintendo Switch";
        default:
            return "";
    }
};