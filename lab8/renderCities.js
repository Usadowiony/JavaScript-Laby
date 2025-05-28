const citiesList = document.getElementById('cities-list');

export function renderCities(savedCities, onDelete) {
    citiesList.innerHTML = '';
    savedCities.forEach((city, idx) => {
        const li = document.createElement('li');
        li.textContent = city + ' ';
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Usuń';
        delBtn.onclick = () => {
            onDelete(idx);
        };
        li.appendChild(delBtn);
        citiesList.appendChild(li);
    });
}

//dodac zapisywanie do localStorage