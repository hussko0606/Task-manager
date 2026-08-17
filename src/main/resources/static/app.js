const api = '/api/tasks';
const list = document.querySelector('#taskList');
const form = document.querySelector('#taskForm');
const filter = document.querySelector('#filter');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const priorityInput = document.querySelector('#priority');
const deadlineInput = document.querySelector('#deadline');
let tasks = [];

form.addEventListener('submit', async event => {
    event.preventDefault();

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
        alert('Uppgiften kunde inte skapas. Kontrollera uppgifterna och försök igen.');
        return;
    }

    form.reset();
    priorityInput.value = 'MEDIUM';
    await load();
});

filter.addEventListener('change', render);

async function load() {
    const response = await fetch(api);
    if (!response.ok) {
        list.innerHTML = '<p class="empty">Kunde inte hämta uppgifter.</p>';
        return;
    }
    tasks = await response.json();
    render();
}

function render() {
    const visible = filter.value === 'ALL' ? tasks : tasks.filter(task => task.status === filter.value);
    if (!visible.length) {
        list.innerHTML = '<p class="empty">Inga uppgifter här ännu.</p>';
        return;
    }

    list.innerHTML = visible.map(task => `
        <article class="task">
            <div>
                <h3>${esc(task.title)}</h3>
                <p>${esc(task.description || 'Ingen beskrivning')}</p>
                <div class="badges">
                    <span class="badge">${label(task.status)}</span>
                    <span class="badge">${label(task.priority)}</span>
                    ${task.deadline ? `<span class="badge">${task.deadline}</span>` : ''}
                </div>
            </div>
            <div class="actions">
                ${task.status !== 'IN_PROGRESS' ? `<button onclick="changeStatus(${task.id},'IN_PROGRESS')">Påbörja</button>` : ''}
                ${task.status !== 'DONE' ? `<button onclick="changeStatus(${task.id},'DONE')">Klar</button>` : ''}
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

function label(value) {
    return ({ TODO: 'ATT GÖRA', IN_PROGRESS: 'PÅGÅR', DONE: 'KLART', LOW: 'LÅG', MEDIUM: 'MEDEL', HIGH: 'HÖG' })[value] || value;
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
