// Funktion der henter data fra din API og viser det på siden
async function hentOgVisData() {
    const api_url = 'http://localhost:3000/api/data';
    const container = document.getElementById('infotavle-container');

    // Tjek om container-elementet findes, før vi fortsætter
    if (!container) {
        console.error('Fejl: Kunne ikke finde element med id="infotavle-container" på siden.');
        return;
    }

    try {
        // Kald din API med fetch()
        const response = await fetch(api_url);
        const data = await response.json();

        // Tøm containeren for gammelt indhold (f.eks. en "Indlæser..." besked)
        container.innerHTML = '';

        // Gå igennem hver meddelelse ('row') i dataen og opret HTML for den
        data.forEach(meddelelse => {
            const beskedDiv = document.createElement('div');
            beskedDiv.className = 'meddelelse'; // Giver en CSS-klasse du kan style

            // Brug template literals (`) til nemt at bygge HTML-strengen
            beskedDiv.innerHTML = `
                <h2>${meddelelse.Overskrift}</h2>
                <p>${meddelelse.Tekst}</p>
                <div class="meta-info">
                    <span>Skrevet af: <strong>${meddelelse.Forfatter}</strong></span>
                    <span>Dato: ${new Date(meddelelse.OprettetDato).toLocaleString('da-DK')}</span>
                </div>
            `;

            // Tilføj det nye element til din container på hjemmesiden
            container.appendChild(beskedDiv);
        });

    } catch (error) {
        console.error('Fejl under hentning af data:', error);
        container.innerHTML = '<p class="fejl">Kunne ikke indlæse data fra serveren. Tjek at API-serveren kører, og prøv igen.</p>';
    }
}

// Sørg for at køre funktionen, når hele HTML-siden er klar
window.addEventListener('DOMContentLoaded', hentOgVisData);