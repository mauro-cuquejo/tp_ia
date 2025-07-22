const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleInput = document.getElementById('title');
    const title = titleInput.value.trim();

    const dueDateInput = document.getElementById('dueDate');

    const descriptionInput = document.getElementById('description');
    const description = descriptionInput.value.trim();

    const priorityBtn = document.querySelector('.priority-btn.active');


    const newTask = {
        title: title,
        description: description,
        dueDate: dueDateInput.value,
        priority: priorityBtn ? priorityBtn.getAttribute('data-priority') : 'Medium'
    };
    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    });
    loadTasks();
});

async function loadTasks() {
    const res = await fetch('http://localhost:3000/tasks');
    let tasks = await res.json();

    // Ordenar por fecha (ascendente)
    tasks = tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.status === 'Completed') {
            li.classList.add('completed');
        }

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.status === 'Completed';
        checkbox.className = 'task-checkbox';

        // Título + Fecha
        const titleRow = document.createElement('div');
        titleRow.className = 'task-title-row';

        const span = document.createElement('span');
        span.textContent = task.title;
        if (task.status === 'Completed') {
            span.classList.add('task-title-completed');
        }

        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            date.setDate(date.getDate() + 1);
            dateSpan.textContent = date.toLocaleDateString();
        } else {
            dateSpan.textContent = '';
        }
        titleRow.appendChild(checkbox);
        titleRow.appendChild(span);
        titleRow.appendChild(dateSpan);

        // Prioridad: círculo de color
        const priorityCircle = document.createElement('span');
        priorityCircle.className = 'task-priority-circle';
        if (task.priority === 'High') {
            priorityCircle.style.background = '#e53935';
        } else if (task.priority === 'Medium') {
            priorityCircle.style.background = '#ffd600';
        } else {
            priorityCircle.style.background = '#43ea7b';
        }
        priorityCircle.title = task.priority;

        // Insertar el círculo a la derecha del título y la fecha
        titleRow.appendChild(priorityCircle);

        // Descripción (desplegable)
        const desc = document.createElement('div');
        desc.className = 'task-desc';
        desc.textContent = task.description || '';
        if (!task.description) {
            desc.style.padding = 0; // Ocultar si no hay descripción
        }
        desc.style.display = 'none';

        // Flecha para desplegar
        const arrow = document.createElement('span');
        arrow.className = 'task-arrow';
        arrow.textContent = '▼';
        arrow.style.cursor = 'pointer';

        titleRow.appendChild(arrow);

        let expanded = false;
        arrow.addEventListener('click', () => {
            expanded = !expanded;
            desc.style.display = expanded ? 'block' : 'none';
            arrow.textContent = expanded ? '▲' : '▼';
        });

        checkbox.addEventListener('change', () => toggleStatus(task.id, task.status));


        li.appendChild(titleRow);
        li.appendChild(desc);

        // Delete label
        const deleteLabel = document.createElement('span');
        deleteLabel.className = 'delete-label';
        deleteLabel.textContent = 'Eliminar';

        // Swipe to delete logic
        let startX = null;
        let currentX = null;
        let threshold = 100; // px to trigger delete
        let dragging = false;

        li.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            dragging = true;
        });

        li.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            currentX = e.touches[0].clientX;
            let diff = startX - currentX;
            if (diff > 0) {
                li.style.transform = `translateX(${-Math.min(diff, threshold)}px)`;
                if (diff > 40) {
                    li.classList.add('show-delete');
                } else {
                    li.classList.remove('show-delete');
                }
                if (diff > threshold) {
                    li.classList.add('deleting');
                } else {
                    li.classList.remove('deleting');
                }
            }
        });

        li.addEventListener('touchend', async (e) => {
            if (!dragging) return;
            let diff = startX - (currentX || startX);
            if (diff > threshold) {
                // Eliminar tarea
                await fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'DELETE'
                });
                loadTasks();
            } else {
                li.style.transform = '';
                li.classList.remove('deleting', 'show-delete');
            }
            dragging = false;
            startX = null;
            currentX = null;
        });

        // Para escritorio (mouse)
        li.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            dragging = true;
        });
        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            currentX = e.clientX;
            let diff = startX - currentX;
            if (diff > 0) {
                li.style.transform = `translateX(${-Math.min(diff, threshold)}px)`;
                if (diff > 40) {
                    li.classList.add('show-delete');
                } else {
                    li.classList.remove('show-delete');
                }
                if (diff > threshold) {
                    li.classList.add('deleting');
                } else {
                    li.classList.remove('deleting');
                }
            }
        });
        document.addEventListener('mouseup', async (e) => {
            if (!dragging) return;
            let diff = startX - (currentX || startX);
            if (diff > threshold) {
                await fetch(`http://localhost:3000/tasks/${task.id}`, {
                    method: 'DELETE'
                });
                loadTasks();
            } else {
                li.style.transform = '';
                li.classList.remove('deleting', 'show-delete');
            }
            dragging = false;
            startX = null;
            currentX = null;
        });

        checkbox.addEventListener('change', () => toggleStatus(task.id, task.status));

        let pressTimer = null;

        li.addEventListener('mousedown', (e) => {
            pressTimer = setTimeout(() => {
                fillFormForEdit(task);
            }, 2000);
        });
        li.addEventListener('mouseup', (e) => clearTimeout(pressTimer));
        li.addEventListener('mouseleave', (e) => clearTimeout(pressTimer));

        // Para dispositivos táctiles
        li.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                fillFormForEdit(task);
            }, 2000);
        });
        li.addEventListener('touchend', (e) => clearTimeout(pressTimer));
        li.addEventListener('touchmove', (e) => clearTimeout(pressTimer));

        taskList.appendChild(li);
    });
}

async function toggleStatus(id, currentStatus) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'Pending' ? 'Completed' : 'Pending' })
    });
    loadTasks();
}

function fillFormForEdit(task) {
    document.getElementById('title').value = task.title || '';
    document.getElementById('description').value = task.description || '';
    document.getElementById('dueDate').value = task.dueDate || '';
    document.getElementById('taskId').value = task.id;

    // Prioridad
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.priority === task.priority);
    });

    // Cambia los botones
    const form = document.getElementById('task-form');
    let btns = document.getElementById('edit-btns');
    if (!btns) {
        btns = document.createElement('div');
        btns.id = 'edit-btns';
        btns.style.display = 'flex';
        btns.style.gap = '8px';

        const acceptBtn = document.createElement('button');
        acceptBtn.type = 'button';
        acceptBtn.textContent = 'Accept Changes';
        acceptBtn.className = 'submit-btn';

        const revertBtn = document.createElement('button');
        revertBtn.type = 'button';
        revertBtn.textContent = 'Revert';
        revertBtn.className = 'submit-btn';
        revertBtn.style.background = '#e53935'; // rojo

        acceptBtn.onclick = async () => {
            const id = document.getElementById('taskId').value;
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value;
            const dueDate = document.getElementById('dueDate').value;
            const priority = document.querySelector('.priority-btn.active').dataset.priority;
            await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate, priority })
            });
            resetForm();
            loadTasks();
        };

        revertBtn.onclick = () => {
            resetForm();
        };

        btns.appendChild(revertBtn);
        btns.appendChild(acceptBtn);
        form.appendChild(btns);
    }
    // Oculta el botón original
    document.querySelector('.submit-btn').style.display = 'none';
}

function resetForm() {
    document.getElementById('task-form').reset();
    document.getElementById('taskId').value = '';
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.priority === 'Medium');
    });
    // Elimina los botones de edición si existen
    const btns = document.getElementById('edit-btns');
    if (btns) btns.remove();
    // Muestra el botón original
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.style.display = '';
    submitBtn.textContent = 'Add Task';
}

loadTasks();

document.getElementById('nav-calendar').addEventListener('click', () => {
    window.location.href = 'calendar.html';
});
