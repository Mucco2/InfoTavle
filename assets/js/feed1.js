document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        console.error("Fejl: Kunne ikke finde #news-container i HTML.");
        return; 
    }

    // Vi bruger en simpel proxy, der kun videresender data.
    const proxyUrl = 'https://corsproxy.io/?';
    
    // ===== NYT LINK: DR's RSS-feed =====
    const newsSourceUrl = 'https://www.dr.dk/nyheder/service/feeds/allenyheder';
    // ===================================

    console.log("Henter nyheder fra DR...");

    fetch(proxyUrl + encodeURIComponent(newsSourceUrl))
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error(`Netværksfejl. Proxyen svarede med status: ${response.status}`);
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");
            
            const parseError = xml.querySelector("parsererror");
            if (parseError) {
                console.error("Fejl i XML-parsing:", parseError);
                throw new Error("Kunne ikke læse det modtagne data som et gyldigt RSS-feed.");
            }

            const items = xml.querySelectorAll("item");
            console.log(`Success! Fandt ${items.length} nyhedsartikler fra DR.`);

            if (items.length === 0) {
                newsContainer.innerHTML = '<p>Feedet blev hentet, men indeholdt ingen artikler.</p>';
                return;
            }

            newsContainer.innerHTML = ''; // Ryd containeren

            // Nyt fallback-billede, der passer til DR
            const fallbackImage = 'https://www.dr.dk/assets/img/logo/dr-logo-blaa.svg';

            Array.from(items).slice(0, 8).forEach(item => {
                const title = item.querySelector("title")?.textContent || "Ingen overskrift";
                const link = item.querySelector("link")?.textContent || "#";
                
                // DR's feed har ikke et <description> tag for hver nyhed, så vi udelader det.
                
                const mediaContent = item.querySelector("media\\:content, content");
                const imageUrl = mediaContent ? mediaContent.getAttribute("url") : fallbackImage;

                const articleCard = document.createElement('div');
                articleCard.className = 'news-article-card';
                // HTML-skabelonen er opdateret: <p> med beskrivelse er fjernet.
                articleCard.innerHTML = `
                    <img src="${imageUrl}" alt="" class="news-card-image" onerror="this.onerror=null;this.src='${fallbackImage}';">
                    <div class="news-card-content">
                        <h4 class="news-card-title">${title}</h4>
                        <a href="${link}" target="_blank" class="news-card-link">Læs på dr.dk →</a>
                    </div>
                `;
                newsContainer.appendChild(articleCard);
            });
        })
        .catch(error => {
            console.error('Kritisk fejl under hentning eller parsing:', error);
            newsContainer.innerHTML = `<p style="color: red; font-weight: bold;">Fejl: Kunne ikke indlæse nyheder fra DR. (${error.message})</p>`;
        });
});