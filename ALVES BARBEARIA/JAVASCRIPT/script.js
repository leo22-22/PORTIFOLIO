function redirigirParaAgendamento(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // AQUI: Você pode adicionar validação de campos antes de redirecionar, se necessário

    // Redireciona para a página de agendamento após o cadastro
    window.location.href = "./HTML/home.html";
}

// Função que envia um agendamento via WhatsApp
function enviarAgendamento(horario) {
    var nome = prompt("Por favor, insira seu nome:"); // Inserir nome
    var telefone = prompt("Por favor, insira seu telefone:"); // Inserir telefone

    var data = document.getElementById('calendario').value; 
    if (!data || !nome || !telefone) { // Verificação para preenchimento de todos os campos
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Mensagem fixa que aparecerá ao entrar no WhatsApp
    var mensagem = `Olá Patrick Alves, gostaria de fazer um agendamento para o dia ${data} às ${horario}. Meu nome é ${nome} e meu telefone é ${telefone}.`;

    // Link para enviar o agendamento via WhatsApp
    var url = "https://api.whatsapp.com/send?phone=5518981421784&text=" + encodeURIComponent(mensagem);
    window.open(url, '_blank'); // Abre o WhatsApp com a mensagem

    // Marcar o horário como indisponível
    marcarHorarioIndisponivel(data, horario);
}

// Função que marca um horário como indisponível e armazena no LocalStorage
function marcarHorarioIndisponivel(data, horario) {
    let horariosOcupados = JSON.parse(localStorage.getItem("horariosOcupados")) || {};

    if (!horariosOcupados[data]) {
        horariosOcupados[data] = [];
    }

    if (!horariosOcupados[data].includes(horario)) { // Evita duplicatas
        horariosOcupados[data].push(horario);
    }

    localStorage.setItem("horariosOcupados", JSON.stringify(horariosOcupados));
    atualizarHora();
}

// Função que desativa os botões que já têm horário marcado
function atualizarHora() {
    const dataSelecionada = document.getElementById("calendario").value;
    if (!dataSelecionada) return;

    let horariosOcupados = JSON.parse(localStorage.getItem("horariosOcupados")) || {};
    let horariosIndisponiveis = horariosOcupados[dataSelecionada] || [];
    
    const botoes = document.querySelectorAll(".horarios button");

    botoes.forEach(botao => {
        if (horariosIndisponiveis.includes(botao.textContent)) {
            botao.classList.add("indisponivel");
            botao.disabled = true;
        } else {
            botao.classList.remove("indisponivel");
            botao.disabled = false;
        }
    });
}

// Ao carregar a página, define a data mínima e atualiza os horários indisponíveis
document.addEventListener("DOMContentLoaded", function () {
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("calendario").setAttribute("min", hoje);
    atualizarHora();
});

// Atualiza os horários disponíveis conforme o dia selecionado no calendário
document.getElementById("calendario").addEventListener("change", function () {
    atualizarHora();

    const dataSelecionada = new Date(this.value);
    const diaDaSemana = dataSelecionada.getDay();
    const botoes = document.querySelectorAll(".horarios button");
    const containerHorarios = document.querySelector(".horarios");

    // Remove qualquer mensagem de "sem horários disponíveis"
    const msgExistente = document.getElementById("mensagem-horario");
    if (msgExistente) msgExistente.remove();

    // Reseta visibilidade dos botões
    botoes.forEach(botao => {
        botao.style.display = "inline-block";
        botao.disabled = false;
    });

    if (diaDaSemana === 6 || diaDaSemana === 0) { // Domingo ou Segunda
        botoes.forEach(botao => botao.style.display = "none");

        // Exibe mensagem de indisponibilidade
        const mensagem = document.createElement("p");
        mensagem.id = "mensagem-horario";
        mensagem.textContent = "Não há horários disponíveis neste dia.";
        mensagem.style.color = "red";
        mensagem.style.fontWeight = "bold";
        mensagem.style.textAlign = "center";
        containerHorarios.appendChild(mensagem);
    } else if (diaDaSemana === 5) { // Sábado (09:00 - 14:00)
        botoes.forEach(botao => {
            const horario = botao.textContent;
            if (!["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"].includes(horario)) {
                botao.style.display = "none";
            }
        });
    }

    atualizarHora();
});0