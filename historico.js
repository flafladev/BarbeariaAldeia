document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefoneBusca');
    const btnBuscar = document.getElementById('btnBuscar');
    const resultadoDiv = document.getElementById('resultadoBusca');

    // Máscara
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d+)/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/(\d+)/, '($1');
        }
        e.target.value = value;
    });

    // Verificar se tem telefone na URL
    const urlParams = new URLSearchParams(window.location.search);
    const telefoneUrl = urlParams.get('telefone');
    if (telefoneUrl) {
        let tel = telefoneUrl.replace(/\D/g, '');
        if (tel.length === 11) {
            tel = tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        telefoneInput.value = tel;
        buscarAgendamentos(tel.replace(/\D/g, ''));
    }

    btnBuscar.addEventListener('click', function() {
        const telefone = telefoneInput.value.replace(/\D/g, '');
        if (telefone.length < 10 || telefone.length > 11) {
            alert('Por favor, insira um telefone válido com DDD.');
            return;
        }
        buscarAgendamentos(telefone);
    });

    function buscarAgendamentos(telefone) {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        const filtrados = agendamentos.filter(a => a.telefone.replace(/\D/g, '').includes(telefone));

        if (filtrados.length === 0) {
            resultadoDiv.innerHTML = '<div class="alert info" style="background-color: #2196F3;">Nenhum agendamento encontrado para este telefone.</div>';
        } else {
            let tabela = `
                <div class="table-responsive">
                    <table class="historico-tabela">
                        <thead><tr><th>Data</th><th>Hora</th><th>Serviços</th><th>Adicionais</th><th>Barbeiro</th><th>Status</th></tr></thead>
                        <tbody>
            `;
            filtrados.sort((a,b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
            filtrados.forEach(item => {
                let statusClass = '';
                if (item.status === 'pendente') statusClass = 'status-pendente';
                else if (item.status === 'confirmado') statusClass = 'status-confirmado';
                else if (item.status === 'cancelado') statusClass = 'status-cancelado';

                tabela += `
                    <tr>
                        <td>${item.data}</td><td>${item.hora}</td><td>${item.servicos}</td>
                        <td>${item.adicionais || 'Nenhum'}</td><td>${item.barbeiro}</td>
                        <td class="${statusClass}">${item.status}</td>
                    </tr>
                `;
            });
            tabela += '</tbody></table></div>';
            resultadoDiv.innerHTML = tabela;
        }
    }
});