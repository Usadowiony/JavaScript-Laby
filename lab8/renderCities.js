const citiesList = document.getElementById('cities-list');

export function renderCities(savedCities, onDelete, onSelect) {
    citiesList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li');
        li.textContent = city + ' ';

        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Wybierz';
        selectBtn.onclick = () => onSelect(city);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.onclick = () => onDelete(idx);

        li.appendChild(selectBtn);
        li.appendChild(delBtn);
        citiesList.appendChild(li);
    });
}