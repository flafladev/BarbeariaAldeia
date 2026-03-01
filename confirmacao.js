document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (!urlParams.has('nome')) {
        window.location.href = 'agendamento.html';
        return;
    }

    const dados = {
        nome: urlParams.get('nome') || '',
        telefone: urlParams.get('telefone') || '',
        servicos: urlParams.get('servicos') || '',
        adicionais: urlParams.get('adicionais') || 'Nenhum',
        data: urlParams.get('data') || '',
        hora: urlParams.get('hora') || '',
        barbeiro: urlParams.get('barbeiro') || 'Indiferente'
    };

    const detalhesDiv = document.getElementById('detalhes');
    if (detalhesDiv) {
        detalhesDiv.innerHTML = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Telefone:</strong> ${dados.telefone}</p>
            <p><strong>Serviços:</strong> ${dados.servicos}</p>
            <p><strong>Adicionais:</strong> ${dados.adicionais}</p>
            <p><strong>Data:</strong> ${dados.data}</p>
            <p><strong>Hora:</strong> ${dados.hora}</p>
            <p><strong>Barbeiro:</strong> ${dados.barbeiro}</p>
        `;
    }

    const mensagem = encodeURIComponent(`Olá, gostaria de confirmar meu agendamento:\nNome: ${dados.nome}\nData: ${dados.data}\nHora: ${dados.hora}\nServiços: ${dados.servicos}\nAdicionais: ${dados.adicionais}`);
    const barbeiros = [
        { nome: 'Roger', numero: '5511954774166' },
        { nome: 'Carlos', numero: '5511888888888' }
    ];

    const whatsappDiv = document.getElementById('whatsapp-links');
    if (whatsappDiv) {
        let linksHtml = '';
        barbeiros.forEach(b => {
            linksHtml += `<a href="https://wa.me/${b.numero}?text=${mensagem}" target="_blank" class="whatsapp-btn"><i class="fab fa-whatsapp"></i> Falar com ${b.nome}</a>`;
        });
        whatsappDiv.innerHTML = linksHtml;
    }

    const linkHistorico = document.getElementById('link-historico');
    if (linkHistorico) {
        const telefoneLimpo = dados.telefone.replace(/\D/g, '');
        linkHistorico.href = `historico.html?telefone=${telefoneLimpo}`;
    }
});