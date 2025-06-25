const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=55.643&longitude=12.4771&daily=temperature_2m_max,temperature_2m_min,uv_index_max&hourly=temperature_2m,precipitation,rain,showers,snowfall,snow_depth,cloud_cover,wind_speed_10m,relative_humidity_2m&current=temperature_2m,rain,showers,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin";

async function fetchWeather() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // ------ KODEN ER FLYTTET HERIND ------
        const current = data.current;
        setBackgroundImage(current.cloud_cover, current.rain, current.snowfall);

        const skyText = getSkyDescription(current.cloud_cover);
        
        document.getElementById("today-date").textContent = `I dag`;
        document.getElementById("today-temp").textContent = `${current.temperature_2m}°C`;
        document.getElementById("today-desc").textContent = `${skyText}`;
        document.getElementById("weather-wind").innerHTML = `<strong>Vind:</strong> ${current.wind_speed_10m} m/s`;
        
        // Find den nuværende time for at få korrekt fugtighed
        const now = new Date();
        const currentHourIndex = now.getHours();
        const humidity = data.hourly.relative_humidity_2m[currentHourIndex];
        document.getElementById("weather-humidity").innerHTML = `<strong>Fugtighed:</strong> ${humidity || '--'}%`;
        // ------ SLUT PÅ FLYTTET KODE ------

        // Ugeprognose (fortsætter som før)
        const days = data.daily.time;
        const tempsMax = data.daily.temperature_2m_max;
        const tempsMin = data.daily.temperature_2m_min;

        const forecastContainer = document.getElementById("forecast-cards");
        forecastContainer.innerHTML = "";

        for (let i = 0; i < days.length; i++) {
            const card = document.createElement("div");
            card.className = "forecast-card";
            card.innerHTML = `
                <h4>${formatDate(days[i])}</h4>
                <p>🌡️ ${tempsMin[i]}°C - ${tempsMax[i]}°C</p>
            `;
            forecastContainer.appendChild(card);
        }

    } catch (error) {
        console.error("Fejl ved hentning af vejrdata:", error);
    }
}

function getSkyDescription(cloudCover) {
    if (cloudCover < 10) return "Skyfrit";
    if (cloudCover < 60) return "Delvist skyet";
    return "Overskyet";
}

function setBackgroundImage(cloudCover, rain, snowfall) {
    let image = "";

    if (snowfall > 0) {
        image = "assets/imgs/Sne.avif";
    } else if (rain > 0) {
        image = "assets/imgs/Regn.jpg";
    } else if (cloudCover < 10) {
        image = "assets/imgs/Fuld_sol.avif";
    } else if (cloudCover < 60) {
        image = "assets/imgs/Delvist_skyet.jpg";
    } else {
        image = "assets/imgs/Skyet.jpg";
    }

    // Opdaterer baggrundsbilledet på en måde der ikke påvirker hele siden
    const weatherSection = document.getElementById('weather-section');
    if (weatherSection) {
        weatherSection.style.backgroundImage = `url('${image}')`;
        weatherSection.style.backgroundSize = "cover";
        weatherSection.style.backgroundPosition = "center";
        weatherSection.style.backgroundRepeat = "no-repeat";
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" });
}

// Kald funktionen for at starte det hele
fetchWeather();