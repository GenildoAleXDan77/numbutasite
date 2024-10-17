// Inicializa os pontos quando o usuário entra no app pela primeira vez
function inicializarPontos() {
    let pontos = parseInt(localStorage.getItem('pontos'), 10);
    let jaRecebeuPontosIniciais = localStorage.getItem('jaRecebeuPontosIniciais');

    // Verifica se os pontos não foram inicializados anteriormente e se o usuário ainda não recebeu os pontos iniciais
    if (isNaN(pontos) && !jaRecebeuPontosIniciais) {
        localStorage.setItem('pontos', '5'); // Usuário começa com 5 pontos
        localStorage.setItem('jaRecebeuPontosIniciais', 'true'); // Marca que o usuário já recebeu os pontos iniciais
        alert("Bem-vindo! Você recebeu 5 pontos iniciais.");
    } else if (isNaN(pontos)) {
        localStorage.setItem('pontos', '0'); // Se os pontos não forem válidos, inicializa como 0
        alert("Você não possui pontos. Comece a relatar ATMs para ganhar pontos!");
    } else {
        alert(`Você tem ${pontos} ponto(s).`);
    }
}

// Função para verificar se o usuário tem pontos suficientes para pesquisar
function verificarPontos() {
    let pontos = parseInt(localStorage.getItem('pontos'), 10);
    if (isNaN(pontos) || pontos <= 0) {
        alert("Você precisa de pelo menos 1 ponto para pesquisar ATMs.");
        return false; // Impede a pesquisa se os pontos forem insuficientes
    }
    return true; // Prossegue com a pesquisa se o usuário tiver pontos
}

// Função para reduzir pontos após uma pesquisa
function gastarPontos() {
    let pontos = parseInt(localStorage.getItem('pontos'), 10);
    if (pontos > 0) {
        pontos--; // Subtrai 1 ponto
        localStorage.setItem('pontos', pontos.toString());
        alert(`Você gastou 1 ponto. Agora você tem ${pontos} ponto(s) restante(s).`);
    } else {
        alert("Você não tem pontos suficientes para gastar.");
    }
}

// Função para ganhar pontos ao relatar algo
function ganharPontos() {
    let pontos = parseInt(localStorage.getItem('pontos'), 10);
    if (isNaN(pontos)) {
        pontos = 0; // Se os pontos não forem válidos, define como 0
    }
    pontos += 2; // Ganha 2 pontos ao relatar algo
    localStorage.setItem('pontos', pontos.toString());
    alert(`Obrigado por relatar! Você ganhou 2 pontos. Agora você tem ${pontos} ponto(s).`);
}

// Função para obter a localização do usuário
function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                error => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocalização não é suportada por este navegador."));
        }
    });
}

// Função para determinar a cor do ATM com base no seu status
function obterCorATM(atm) {
    if (atm.volumePessoas === 'Baixo') {
        return 'green'; // Verde para disponível
    } else if (atm.status === 'Fora de Serviço') {
        return 'red'; // Vermelho para fora de serviço
    } else if (atm.volumePessoas === 'Alto') {
        return 'yellow'; // Amarelo para muito movimento
    } else {
        return 'gray'; // Cinza para outros casos
    }
}

// Função para renderizar a lista de ATMs
function renderizarATMs(atms) {
    const atmContainer = document.getElementById('atmContainer'); // Supondo que você tenha um container para exibir os ATMs
    atmContainer.innerHTML = ''; // Limpa o container antes de adicionar novos ATMs

    atms.forEach(atm => {
        const atmDiv = document.createElement('div');
        atmDiv.textContent = `Banco: ${atm.nomeBanco}, Status: ${atm.status}, Disponibilidade: ${atm.infoAdicional}, Volume: ${atm.volumePessoas}`;
        atmDiv.style.backgroundColor = obterCorATM(atm); // Define a cor com base na disponibilidade/status
        atmDiv.style.color = 'white'; // Texto em branco para melhor contraste
        atmDiv.style.padding = '10px'; // Estilo para adicionar algum espaçamento
        atmDiv.style.margin = '5px'; // Margem entre os ATMs
        atmContainer.appendChild(atmDiv); // Adiciona o ATM ao container
    });
}

// Função para realizar a pesquisa
async function pesquisarATMs() {
    if (verificarPontos()) {
        gastarPontos(); // Deduz 1 ponto se a pesquisa for bem-sucedida
        const atms = []; // Aqui você deve substituir por sua lógica de pesquisa para obter os ATMs

        // Simulação de ATMs para exemplo
        atms.push({
            nomeBanco: "Banco A",
            status: "Em Serviço",
            infoAdicional: "Com Dinheiro",
            volumePessoas: "Baixo"
        });
        atms.push({
            nomeBanco: "Banco B",
            status: "Fora de Serviço",
            infoAdicional: "Sem Dinheiro",
            volumePessoas: "Alto"
        });
        renderizarATMs(atms); // Chama a função de renderização após a pesquisa
        alert("Pesquisando ATMs...");
    }
}

// Função para iniciar o countdown
function iniciarCountdown(segundos) {
    const countdownElement = document.getElementById('countdownTimer');
    countdownElement.style.display = 'block'; // Mostra o elemento do countdown

    let tempo = segundos;
    countdownElement.textContent = `Tempo restante para relatar: ${tempo} segundos`;

    const intervalo = setInterval(() => {
        tempo--;
        countdownElement.textContent = `Tempo restante para relatar: ${tempo} segundos`;

        if (tempo <= 0) {
            clearInterval(intervalo);
            countdownElement.style.display = 'none'; // Esconde o countdown quando acabar
            alert("Você pode relatar novamente agora!");
        }
    }, 1000);
}

// Função para processar o relatório e ganhar pontos
async function relatarATM() {
    const tempoRelatoMinimo = 5 * 60 * 1000; // 5 minutos em milissegundos
    const ultimoRelato = parseInt(localStorage.getItem('ultimoRelato'), 10);

    if (ultimoRelato && Date.now() - ultimoRelato < tempoRelatoMinimo) {
        const tempoRestante = Math.ceil((tempoRelatoMinimo - (Date.now() - ultimoRelato)) / 1000);
        alert(`Você só pode relatar um ATM a cada 5 minutos. Tempo restante: ${tempoRestante} segundos.`);
        iniciarCountdown(tempoRestante); // Inicia o countdown
        return;
    }

    try {
        const { latitude, longitude } = await obterLocalizacao();
        ganharPontos(); // Ganha 2 pontos por relatar um ATM
        
        // Criação do objeto atmData com todos os campos necessários
        const atmData = {
            bairro: "kilamba", // Adicione o valor do bairro
            cidade: "luanda",  // Adicione o valor da cidade
            infoAdicional: "Status do Serviço: Em Serviço, Dinheiro: Com Dinheiro, Volume de Pessoas: Baixo", // Adicione as informações adicionais
            latitude: latitude,
            longitude: longitude,
            nomeBanco: "keve", // Adicione o nome do banco (ou outro método para obter)
            rua: "2737+QGM, Kilamba", // Adicione a rua (ou outro método para obter)
            status: "Em Serviço", // Adicione o status
            volumePessoas: "Baixo" // Adicione o volume de pessoas
        };

        // Aqui você deve adicionar a lógica para enviar `atmData` para o Firestore
        await adicionarATM(atmData); // Chame a função que adiciona os dados ao Firestore

        localStorage.setItem('ultimoRelato', Date.now().toString()); // Atualiza o último relato
        alert("Relatório enviado com sucesso!");
    } catch (error) {
        alert("Erro ao obter localização: " + error.message);
    }
}

// Função para adicionar ATM ao Firestore
async function adicionarATM(atmData) {
    const atmRef = doc(db, "ATMs", `atm-${Date.now()}`); // Gera um ID único baseado no timestamp
    try {
        await setDoc(atmRef, atmData);
    } catch (error) {
        console.error("Erro ao adicionar ATM: ", error);
        alert("Erro ao adicionar ATM. Tente novamente mais tarde.");
    }
}

// Adiciona os eventos aos botões de pesquisa e relatório
document.addEventListener('DOMContentLoaded', function () {
    inicializarPontos(); // Inicializa os pontos quando a página carrega

    // Botão de pesquisa
    const botaoPesquisar = document.getElementById('botaoPesquisar');
    botaoPesquisar.addEventListener('click', pesquisarATMs);

    // Botão de relatar
    const botaoRelatar = document.getElementById('botaoRelatar');
    botaoRelatar.addEventListener('click', relatarATM);
});
