const api = '/api/tasks';
const form = document.querySelector('#taskForm');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const priorityInput = document.querySelector('#priority');
const deadlineInput = document.querySelector('#deadline');
const formMessage = document.querySelector('#formMessage');
const composer = document.querySelector('#composer');
const toggleFormButton = document.querySelector('#toggleForm');
const todoList = document.querySelector('#todoList');
const progressList = document.querySelector('#progressList');
const doneList = document.querySelector('#doneList');
let tasks = [];

toggleFormButton.addEventListener('click', () => {
    composer.classList.toggle('is-open');
});

form.addEventListener('submit', async event => {
    event.preventDefault();
    formMessage.textContent = 'Sparar...';

    const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            priority: priorityInput.value,
            status: 'TODO',
            deadline: deadlineInput.value || null
        })
    });

    if (!response.ok) {
        formMessage.textContent = 'Kunde inte skapa uppgiften.';
        return;
    }

    form.reset();
    priorityInput.value = 'MEDIUM';
    formMessage.textContent = 'Uppgiften lades till.';
    await load();
});

async function load() {
    const response = await fetch(api);
    if (!response.ok) {
        const error = '<p class="empty">Kunde inte hämta uppgifter.</p>';
        todoList.innerHTML = error;
        progressList.innerHTML = error;
        doneList.innerHTML = error;
        return;
    }

    tasks = await response.json();
    render();
}

function render() {
    const todo = tasks.filter(task => task.status === 'TODO');
    const progress = tasks.filter(task => task.status === 'IN_PROGRESS');
    const done = tasks.filter(task => task.status === 'DONE');

    todoList.innerHTML = renderColumn(todo, 'TODO');
    progressList.innerHTML = renderColumn(progress, 'IN_PROGRESS');
    doneList.innerHTML = renderColumn(done, 'DONE');

    document.querySelector('#todoCount').textContent = todo.length;
    document.querySelector('#inProgressCount').textContent = progress.length;
    document.querySelector('#completedCount').textContent = done.length;
    document.querySelector('#totalCount').textContent = tasks.length;
    document.querySelector('#progressCount').textContent = progress.length;
    document.querySelector('#doneCount').textContent = done.length;
}

function renderColumn(items, status) {
    if (!items.length) {
        return `<p class="empty">${emptyText(status)}</p>`;
    }

    return items.map(task => `
        <article class="task-card">
            <h3>${esc(task.title)}</h3>
            <p class="description">${esc(task.description || 'Ingen beskrivning')}</p>
            <div class="meta">
                <span class="pill priority-${task.priority}">${priorityLabel(task.priority)}</span>
                ${task.deadline ? `<span class="pill deadline">${formatDate(task.deadline)}</span>` : ''}
            </div>
            <div class="task-actions">
                ${task.status === 'TODO' ? `<button class="primary" onclick="changeStatus(${task.id}, 'IN_PROGRESS')">Påbörja</button>` : ''}
                ${task.status === 'IN_PROGRESS' ? `<button onclick="changeStatus(${task.id}, 'TODO')">Tillbaka</button><button class="done-action" onclick="changeStatus(${task.id}, 'DONE')">Markera klar</button>` : ''}
                ${task.status === 'DONE' ? `<button onclick="changeStatus(${task.id}, 'IN_PROGRESS')">Öppna igen</button>` : ''}
                <button class="delete" onclick="removeTask(${task.id})">Ta bort</button>
            </div>
        </article>
    `).join('');
}

async function changeStatus(id, status) {
    const response = await fetch(`${api}/${id}/status?status=${status}`, { method: 'PATCH' });
    if (response.ok) await load();
}

async function removeTask(id) {
    const response = await fetch(`${api}/${id}`, { method: 'DELETE' });
    if (response.ok) await load();
}

function priorityLabel(value) {
    return ({ LOW: 'LÅG PRIORITET', MEDIUM: 'MEDEL', HIGH: 'HÖG PRIORITET' })[value] || value;
}

function emptyText(status) {
    return ({ TODO: 'Inget väntar på dig.', IN_PROGRESS: 'Inget pågår just nu.', DONE: 'Inget färdigt ännu.' })[status];
}

function formatDate(value) {
    return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(`${value}T12:00:00`));
}

function esc(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

load();
