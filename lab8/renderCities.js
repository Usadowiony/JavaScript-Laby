const citiesList = document.getElementById('cities-list');

// Funkcja renderująca listę zapisanych miast wraz z przyciskami akcji
// savedCities - tablica nazw miast
// onDelete - callback wywoływany po kliknięciu "Usuń" (przyjmuje indeks miasta)
// onSelect - callback wywoływany po kliknięciu "Wybierz" (przyjmuje nazwę miasta)
export function renderCities(savedCities, onDelete, onSelect) {
    citiesList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li'); // pojedynczy wiersz listy

        // Nazwa miasta
        const nameSpan = document.createElement('span');
        nameSpan.className = 'city-name';
        nameSpan.textContent = city;
        li.appendChild(nameSpan);

        // Kontener na przyciski
        const actionsDiv = document.createElement('span');
        actionsDiv.className = 'city-actions';

        // Przycisk wyboru miasta (wstawia do inputa i pobiera pogodę)
        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Wybierz';
        selectBtn.onclick = () => onSelect(city);

        // Przycisk usuwania miasta z listy
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.onclick = () => onDelete(idx);

        actionsDiv.appendChild(selectBtn);
        actionsDiv.appendChild(delBtn);
        li.appendChild(actionsDiv);

        citiesList.appendChild(li); // dodaj wiersz do listy
    });
}