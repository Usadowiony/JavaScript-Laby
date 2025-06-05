const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

// --- Funkcje pomocnicze do obsługi notatek ---

// Tworzy obiekt notatki na podstawie danych z formularza
function buildNoteFromForm() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const color = document.getElementById('note-color').value;
    const pin = document.getElementById('note-pin').checked;
    const date = new Date().toISOString().slice(0, 10);
    return { id: Date.now(), title, content, color, pin, date };
}

// Pobiera notatki z localStorage (zwraca tablicę obiektów)
function getNotes() {
    try {
        return JSON.parse(localStorage.getItem('notes')) || [];
    } catch {
        return [];
    }
}

// Zapisuje tablicę notatek do localStorage
function saveNotes(notesArr) {
    localStorage.setItem('notes', JSON.stringify(notesArr));
}

// Usuwa notatkę po id i odświeża widok
function deleteNote(id) {
    const notesArr = getNotes().filter(note => note.id !== id);
    saveNotes(notesArr);
    showNotes();
}

// Resetuje formularz i ustawia domyślny kolor
function resetForm() {
    form.reset();
    document.getElementById('note-color').value = '#fff176';
}

// Tworzy element HTML dla pojedynczej notatki na podstawie obiektu note
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

// Wyświetla notatki na stronie
function showNotes() {
    notesList.innerHTML = '';
    const notesArr = getNotes();
    // Sortujemy kopię tablicy, żeby przypięte były na górze
    notesArr.slice().sort((a, b) => b.pin - a.pin).forEach(note => {
        notesList.appendChild(createNoteElement(note));
    });
}

// --- Obsługa formularza i przycisków ---

// Obsługa wysyłania formularza (dodawanie nowej notatki)
form.onsubmit = function(e) {
    e.preventDefault();
    const note = buildNoteFromForm();
    // Nie dodawaj pustych notatek
    if (!note.title || !note.content) return;
    const notesArr = getNotes();
    notesArr.push(note);
    saveNotes(notesArr);
    showNotes();
    resetForm();
};

// Na start wyświetl notatki
showNotes();