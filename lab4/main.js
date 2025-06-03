// Pobieramy elementy z HTML
const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

// Tworzy element HTML dla pojedynczej notatki
function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.style.background = note.color;

    // Nagłówek z tytułem, datą i ewentualną pinezką
    const headerDiv = document.createElement('div');
    headerDiv.className = 'note-header';
    headerDiv.innerHTML = `<strong>${note.title}</strong> <span class="note-date">${note.date}</span>`;
    if (note.pin) {
        const pin = document.createElement('span');
        pin.className = 'note-pin';
        pin.textContent = '📌';
        headerDiv.appendChild(pin);
    }

    // Treść notatki
    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';
    contentDiv.textContent = note.content;

    // Przycisk usuń
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'note-actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = () => deleteNote(note.id);
    actionsDiv.appendChild(deleteBtn);

    // Składamy całość
    noteDiv.appendChild(headerDiv);
    noteDiv.appendChild(contentDiv);
    noteDiv.appendChild(actionsDiv);
    return noteDiv;
}

// Pobiera notatki z localStorage
function getNotes() {
    try {
        return JSON.parse(localStorage.getItem('notes')) || [];
    } catch {
        return [];
    }
}

// Zapisuje notatki do localStorage
function saveNotes(notesArr) {
    localStorage.setItem('notes', JSON.stringify(notesArr));
}

// Wyświetla notatki na stronie (przypięte na górze)
function showNotes() {
    notesList.innerHTML = '';
    const notesArr = getNotes();
    // Nie modyfikujemy oryginalnej tablicy, sortujemy kopię
    notesArr.slice().sort((a, b) => b.pin - a.pin).forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

// Usuwa notatkę po id
function deleteNote(id) {
    const notesArr = getNotes().filter(note => note.id !== id);
    saveNotes(notesArr);
    showNotes();
}

// Resetuje formularz i kolor
function resetForm() {
    form.reset();
    document.getElementById('note-color').value = '#fff176';
}

// Obsługa formularza dodawania notatki
form.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    if (!title || !content) return; // nie dodawaj pustych
    const color = document.getElementById('note-color').value;
    const pin = document.getElementById('note-pin').checked;
    const date = new Date().toISOString().slice(0, 10);
    const note = { id: Date.now(), title, content, color, pin, date };
    const notesArr = getNotes();
    notesArr.push(note);
    saveNotes(notesArr);
    showNotes();
    resetForm();
};

// Na start wyświetl notatki
showNotes();