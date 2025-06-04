const citiesList = document.getElementById('cities-list');

export function renderCities(savedCities, onDelete, onSelect) {
    citiesList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li');

        // Nazwa miasta po lewej
        const nameSpan = document.createElement('span');
        nameSpan.className = 'city-name';
        nameSpan.textContent = city;
        li.appendChild(nameSpan);

        // Przyciski po prawej
        const actionsDiv = document.createElement('span');
        actionsDiv.className = 'city-actions';

        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Wybierz';
        selectBtn.onclick = () => onSelect(city);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.onclick = () => onDelete(idx);

        actionsDiv.appendChild(selectBtn);
        actionsDiv.appendChild(delBtn);
        li.appendChild(actionsDiv);

        citiesList.appendChild(li);
    });
}