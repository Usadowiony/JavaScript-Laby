export function loadCities() {
    const cities = localStorage.getItem('cities');
    
    // Jeśli nie ma wartości lub jest "undefined", zwróć pustą tablicę
    if (!cities || cities === "undefined") return [];
    try {
        return JSON.parse(cities);
    } catch (e) {
        return [];
    }
}
export function saveCities(cities) {
    localStorage.setItem('cities', JSON.stringify(cities));
}