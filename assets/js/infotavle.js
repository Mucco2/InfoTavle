console.log("infotavle.js er indlæst korrekt!");
// Funktion der henter data fra API'en på din VM og viser det på siden
async function hentOgVisData() {
    
    // ** VIGTIGT: Her bruger vi din VM's IP-adresse **
    const api_url = 'http://10.0.1.243:3000/api/data';

    const container = document.getElementById('infotavle-container');

    // Tjek om container-elementet findes, før vi fortsætter
    if (!container) {
        console.error('Fejl: Kunne ikke finde element med id="infotavle-container" på siden.');
        return;
    }

    try {
        // Vi logger den URL, vi prøver at kalde, for at gøre fejlsøgning nemmere
        console.log(`Forsøger at hente data fra: ${api_url}`);

        // Kald din API med fetch()
        const response = await fetch(api_url);

        // Tjek om serveren svarede med en fejl (f.eks. 404 Not Found eller 500 Internal Server Error)
        if (!response.ok) {
            throw new Error(`Serveren svarede med status: ${response.status}`);
        }

        const data = await response.json();

        // Tøm containeren for gammelt indhold (f.eks. en "Indlæser..." besked)
        container.innerHTML = '';

        // Gå igennem hver meddelelse og opret HTML
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
        container.innerHTML = '<p class="fejl">Kunne ikke indlæse data. Tjek at API-serveren kører på VM\'en, at din firewall er åben på port 3000, og at IP-adressen er korrekt.</p>';
    }
}

// Kør funktionen, når hele HTML-siden er klar
window.addEventListener('DOMContentLoaded', hentOgVisData);