// Wczytuje listę miast z localStorage (zwraca tablicę stringów)
export function loadCities() {
    const cities = localStorage.getItem('cities');
    
    // Jeśli nie ma wartości lub jest "undefined", zwróć pustą tablicę
    if (!cities || cities === "undefined") return [];
    try {
        // Parsuje JSON z localStorage do tablicy
        return JSON.parse(cities);
    } catch (e) {
        // Jeśli błąd parsowania, zwróć pustą tablicę
        return [];
    }
}

// Zapisuje podaną tablicę miast do localStorage (jako JSON)
export function saveCities(cities) {
    localStorage.setItem('cities', JSON.stringify(cities));
}