// Pobieramy elementy z HTML
const form = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

// Funkcja do tworzenia HTML notatki
function createNoteElement(note) {
    // Tworzymy główny div notatki
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.style.background = note.color;

    // Nagłówek notatki
    const headerDiv = document.createElement('div');
    headerDiv.className = 'note-header';

    const title = document.createElement('strong');
    title.textContent = note.title;

    const date = document.createElement('span');
    date.className = 'note-date';
    date.textContent = note.date;

    headerDiv.appendChild(title);
    headerDiv.appendChild(date);

    // Jeśli przypięta, dodaj ikonkę
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

    // Akcje (usuń)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'note-actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = function() {
        deleteNote(note.id);
    };
    actionsDiv.appendChild(deleteBtn);

    // Składamy całość
    noteDiv.appendChild(headerDiv);
    noteDiv.appendChild(contentDiv);
    noteDiv.appendChild(actionsDiv);

    return noteDiv;
}

// Pobieranie notatek z localStorage
function getNotes() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

// Zapisywanie notatek do localStorage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Wyświetlanie notatek na stronie
function showNotes() {
    notesList.innerHTML = '';
    let notes = getNotes();

    // Przypięte na górze
    notes.sort((a, b) => b.pin - a.pin);

    notes.forEach(note => {
        const noteElem = createNoteElement(note);
        notesList.appendChild(noteElem);
    });
}

// Usuwanie notatki
function deleteNote(id) {
    let notes = getNotes();
    notes = notes.filter(note => note.id !== id);
    saveNotes(notes);
    showNotes();
}

// Obsługa formularza dodawania notatki
form.onsubmit = function(e) {
    e.preventDefault();

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const color = document.getElementById('note-color').value;
    const pin = document.getElementById('note-pin').checked;
    const date = new Date().toISOString().slice(0, 10);

    const note = {
        id: Date.now(),
        title,
        content,
        color,
        pin,
        date
    };

    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);
    showNotes();

    form.reset();
    document.getElementById('note-color').value = '#fff176'; // reset koloru
};

// Na start wyświetl notatki
showNotes();