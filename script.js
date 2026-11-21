const tickets = [
    { title: 'Проектор не включается', room: '203', category: 'Оборудование', done: false },
    { title: 'Не закрывается окно', room: '105', category: 'Аудитория', done: false },
    { title: 'В коридоре не горит свет', room: 'Коридор, 2-й этаж', category: 'Другое', done: true }
];

const titleInput = document.getElementById('title-input');
const roomInput = document.getElementById('room-input');
const categorySelect = document.getElementById('category-select');
const addBtn = document.getElementById('add-btn');
const messageEl = document.getElementById('message');
const ticketsList = document.getElementById('tickets-list');
const onlyOpenCheckbox = document.getElementById('only-open-checkbox');
const filterCategorySelect = document.getElementById('filter-category');

function renderTickets() {
    ticketsList.innerHTML = '';

    const onlyOpen = onlyOpenCheckbox.checked;
    const filterCategory = filterCategorySelect.value;

    if (tickets.length === 0) {
        ticketsList.innerHTML = '<div class="empty-message>Заявок пока нет.</div>"'
        return;
    }

    const visible = []

    for (let i = 0; i < tickets.length; i++) {
        const t = tickets[i];
        if (onlyOpen && t.done !== false) continue;
        if (filterCategory && t.category !== filterCategory) continue;
        visible.push({ ticket: t, index: i });
    }

    if (visible.length === 0) {
        if (tickets.length > 0) {
            if (onlyOpen && !filterCategory) {
                ticketsList.innerHTML = '<div class="empty-message">Открытых заявок нет</div>';
            } else {
                ticketsList.innerHTML = '<div class="empty-message">Нет заявок по выбранным фильтрам</div>';
            }
        } else {
            ticketsList.innerHTML = '<div class="empty-message">Заявок пока нет</div>';
        }
        return;
    }

    for (const { ticket, index } of visible) {
        const row = document.createElement('div');
        row.className = 'ticket';

        const info = document.createElement('div');
        info.className = 'ticket-info';

        const details = document.createElement('div');
        details.className = 'ticket-details'

        const title = document.createElement('div');
        title.className = 'ticket-title';
        title.textContent = ticket.title;

        const room = document.createElement('span');
        room.className = 'ticket-room';
        room.textContent = ticket.room;

        const category = document.createElement('span');
        category.className = 'ticket-category';
        category.textContent = ticket.category;

        const status = document.createElement('span');
        status.className = 'ticket-status ' + (ticket.done ? 'status-done' : 'status-open');
        status.textContent = ticket.done ? 'Выполнена' : 'Открыта';

        details.append(room, category, status)
        info.append(details, title)

        const actions = document.createElement('div')
        actions.className = 'title-actions';

        if (!ticket.done) {
            const btnDone = document.createElement('button');
            btnDone.className = 'btn-done';
            btnDone.textContent = 'Выполнить';
            btnDone.addEventListener('click', () => {
                tickets[index].done = true;
                renderTickets();
            });
            actions.append(btnDone);
        }

        const btnDel = document.createElement('button');
        btnDel.className = 'btn-delete';
        btnDel.textContent = 'Удалить';
        btnDel.addEventListener('click', () => {
            tickets.splice(index, 1);
            renderTickets();
        });
        actions.append(btnDel);


        row.append(info, actions);
        ticketsList.append(row)
    }
}

addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const room = roomInput.value.trim();
    const category = categorySelect.value;


    if (!title || !room || !category) {
        messageEl.textContent = 'Заполните все поля и выберите категорию.';
        return;
    }

    messageEl.textContent = '';

    const newTicket = {
        title: title,
        room: room,
        category: category,
        done: false
    };
    tickets.push(newTicket);

    titleInput.value = '';
    roomInput.value = '';
    categorySelect.value = '';

    renderTickets();
});

onlyOpenCheckbox.addEventListener('change', renderTickets);
filterCategorySelect.addEventListener('change', renderTickets);

renderTickets();