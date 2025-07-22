document.getElementById('nav-tasks').addEventListener('click', () => {
    window.location.href = 'index.html';
});

const calendarDiv = document.getElementById('calendar');

function getMonthDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay, lastDay };
}

function getWeekday(date) {
    // Sunday = 0, Monday = 1, ..., Saturday = 6
    return date.getDay();
}

function renderCalendar(tasks, year, month) {
    calendarDiv.innerHTML = '';

    // Header: Month and navigation
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.className = 'calendar-nav-btn';
    prevBtn.onclick = () => renderCalendar(tasks, year, month - 1);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.className = 'calendar-nav-btn';
    nextBtn.onclick = () => renderCalendar(tasks, year, month + 1);

    const title = document.createElement('span');
    title.textContent = `${monthNames[month]} ${year}`;
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.1em';

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    calendarDiv.appendChild(header);

    // Days of week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header';
    daysOfWeek.forEach(day => {
        const cell = document.createElement('div');
        cell.textContent = day;
        headerRow.appendChild(cell);
    });
    calendarDiv.appendChild(headerRow);

    // Days grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    const { firstDay, lastDay } = getMonthDays(year, month);
    let startDay = getWeekday(firstDay);
    let totalDays = lastDay.getDate();

    // Fill empty cells before the first day
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell';
        grid.appendChild(emptyCell);
    }

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';

        // Highlight today
        const today = new Date();
        if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        ) {
            cell.classList.add('today');
        }

        // Date number
        const dateSpan = document.createElement('div');
        dateSpan.className = 'cell-date';
        dateSpan.textContent = day;
        cell.appendChild(dateSpan);

        // Tasks for this day
        const dateStr = date.toISOString().slice(0, 10);
        const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr));

        // Solo tareas no completadas
        const pendingTasks = dayTasks.filter(t => t.status !== 'Completed');

        // Determina si hay tareas de cada prioridad
        if (pendingTasks.length > 0) {
            const trafficLightColumn = document.createElement('span');
            trafficLightColumn.className = 'traffic-light-column';

            const priorities = [
                { key: 'High', class: 'traffic-high' },
                { key: 'Medium', class: 'traffic-medium' },
                { key: 'Low', class: 'traffic-low' }
            ];

            let lastTooltipBottom = 4; // Empieza en 4px desde arriba

            priorities.forEach(priority => {
                const tasksForPriority = pendingTasks.filter(t => t.priority === priority.key);
                if (tasksForPriority.length > 0) {
                    // Círculo
                    const circle = document.createElement('span');
                    circle.className = `calendar-traffic-light ${priority.class}`;
                    trafficLightColumn.appendChild(circle);

                    // Tooltip para esta prioridad
                    const tooltip = document.createElement('div');
                    tooltip.className = `calendar-tooltip ${priority.class}`;
                    tooltip.innerHTML = tasksForPriority.map(t => `<div>📋${t.title}</div>`).join('');
                    tooltip.style.top = `${lastTooltipBottom}px`;
                    tooltip.style.right = '32px';
                    tooltip.style.left = 'auto';
                    tooltip.style.position = 'absolute';

                    cell.appendChild(tooltip);

                    // Medir el alto real del tooltip después de insertarlo
                    // y sumar 2px de separación para el siguiente
                    const tooltipHeight = tooltip.offsetHeight || 100; // fallback si aún no está renderizado
                    lastTooltipBottom += tooltipHeight + 2;
                } else {
                    // Espacio vacío para mantener la posición
                    const empty = document.createElement('span');
                    empty.style.height = '12px';
                    empty.style.display = 'block';
                    trafficLightColumn.appendChild(empty);
                }
            });

            cell.appendChild(trafficLightColumn);
        }

        grid.appendChild(cell);
    }

    // Fill empty cells after the last day
    const totalCells = startDay + totalDays;
    for (let i = totalCells; i < 42; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-cell';
        grid.appendChild(emptyCell);
    }

    calendarDiv.appendChild(grid);
}

// Fetch tasks and render calendar
async function loadCalendar(monthOffset = 0) {
    const res = await fetch('http://localhost:3000/tasks');
    const tasks = await res.json();

    // Get current month/year, apply offset for navigation
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + monthOffset;

    // Adjust year/month if out of bounds
    while (month < 0) { month += 12; year--; }
    while (month > 11) { month -= 12; year++; }

    renderCalendar(tasks, year, month);
}

loadCalendar();