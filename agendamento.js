document.addEventListener('DOMContentLoaded', function() {
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');
    const timeSlotsDiv = document.getElementById('timeSlots');
    const monthYearDisplay = document.getElementById('monthYearDisplay');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarDays = document.getElementById('calendarDays');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = currentDate;
    let selectedTime = null;

    // Máscara de telefone
    document.getElementById('telefone').addEventListener('input', function(e) {
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

    // Navegação entre meses
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    function renderCalendar(month, year) {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        monthYearDisplay.textContent = `${months[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let html = '';
        for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day disabled"></div>';

        const today = new Date(); today.setHours(0,0,0,0);

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const isPast = date < today;
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            html += `<div class="calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" data-day="${d}">${d}</div>`;
        }

        calendarDays.innerHTML = html;

        document.querySelectorAll('.calendar-day:not(.disabled)').forEach(day => {
            day.addEventListener('click', function() {
                const dayNum = this.getAttribute('data-day');
                selectedDate = new Date(year, month, dayNum);
                updateSelectedDateDisplay();
                dataInput.value = selectedDate.toISOString().split('T')[0];
                renderTimeSlots(selectedDate);
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    function updateSelectedDateDisplay() {
        if (selectedDate) {
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
            selectedDateDisplay.innerHTML = `<span class="day">${day}</span> / <span class="month">${month}</span> / <span class="year">${year}</span>`;
        }
    }

    function renderTimeSlots(date) {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        let html = '';
        slots.forEach(time => {
            html += `<div class="time-slot" data-time="${time}">${time}</div>`;
        });
        timeSlotsDiv.innerHTML = html;

        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', function() {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                selectedTime = this.getAttribute('data-time');
                horaInput.value = selectedTime;
            });
        });
    }

    updateSelectedDateDisplay();
    dataInput.value = selectedDate.toISOString().split('T')[0];
    renderCalendar(currentMonth, currentYear);
    renderTimeSlots(selectedDate);

    // Interceptar o envio do formulário
    document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Coletar dados
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servicos = Array.from(document.querySelectorAll('input[name="servicos"]:checked')).map(cb => cb.value).join(', ');
        const adicionais = Array.from(document.querySelectorAll('input[name="adicionais"]:checked')).map(cb => cb.value).join(', ') || 'Nenhum';
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const barbeiro = document.querySelector('input[name="barbeiro"]:checked').value;

        if (!nome || !telefone || !servicos || !data || !hora) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        // Validar data (não pode ser no passado)
        const hoje = new Date(); hoje.setHours(0,0,0,0);
        const dataSelecionada = new Date(data);
        if (dataSelecionada < hoje) {
            alert('A data não pode ser no passado.');
            return;
        }

        // Validar horário comercial
        const horaNum = parseInt(hora.split(':')[0]);
        if (horaNum < 8 || horaNum > 20) {
            alert('Horário permitido apenas das 08:00 às 20:00.');
            return;
        }

        // Gerar ID único
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

        const agendamento = {
            id,
            nome,
            telefone,
            servicos,
            adicionais,
            data,
            hora,
            barbeiro,
            status: 'pendente'
        };

        // Recuperar agendamentos existentes ou iniciar array vazio
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        agendamentos.push(agendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        // Redirecionar para confirmação com parâmetros na URL
        const params = new URLSearchParams({
            nome, telefone, servicos, adicionais, data, hora, barbeiro
        });
        window.location.href = `confirmacao.html?${params.toString()}`;
    });
});