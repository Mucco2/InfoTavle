document.addEventListener('DOMContentLoaded', function() {
    // Kør kun, hvis vi kan finde containeren til nyhederne
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        return; // Afslut, hvis elementet ikke findes på siden
    }

    const rssUrl = 'https://jyllands-posten.dk/tools/rss/senestenyt/';
    const proxyUrl = 'https://api.allorigins.win/get?url=';

    fetch(proxyUrl + encodeURIComponent(rssUrl))
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Netværksfejl.');
        })
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "application/xml");
            
            const items = xml.querySelectorAll("item");
            newsContainer.innerHTML = ''; // Ryd "Indlæser..." beskeden

            // Fallback billede, hvis en artikel mangler et
            const fallbackImage = 'https://via.placeholder.com/400x200.png?text=JP+Nyhed';

            let itemCount = 0;
            items.forEach(item => {
                if (itemCount >= 9) return; // Vis op til 9 nyheder

                const title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;
                const description = item.querySelector("description").textContent;
                
                // Prøv at finde billedet i feedet
                const mediaContent = item.querySelector("media\\:content, content");
                const imageUrl = mediaContent ? mediaContent.getAttribute("url") : fallbackImage;

                // Opret et nyt kort med den flotte HTML struktur
                const articleCard = document.createElement('div');
                articleCard.className = 'news-article-card';
                articleCard.innerHTML = `
                    <img src="${imageUrl}" alt="${title}" class="news-card-image">
                    <div class="news-card-content">
                        <h4 class="news-card-title">${title}</h4>
                        <p class="news-card-description">${description}</p>
                        <a href="${link}" target="_blank" class="news-card-link">Læs hele artiklen →</a>
                    </div>
                `;
                
                newsContainer.appendChild(articleCard);
                itemCount++;
            });
        })
        .catch(error => {
            console.error('Fejl ved hentning af RSS feed:', error);
            newsContainer.innerHTML = '<p>Kunne ikke indlæse nyheder. Prøv venligst igen senere.</p>';
        });
});