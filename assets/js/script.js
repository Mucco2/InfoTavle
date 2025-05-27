const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=55.643&longitude=12.4771&daily=temperature_2m_max,temperature_2m_min,uv_index_max&hourly=temperature_2m,precipitation,rain,showers,snowfall,snow_depth,cloud_cover,wind_speed_10m&current=temperature_2m,rain,showers,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin";

async function fetchWeather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Dagens vejr
    const current = data.current;
    setBackgroundImage(current.cloud_cover, current.rain, current.snowfall);

    const skyText = getSkyDescription(current.cloud_cover);
    document.getElementById("today-date").textContent = `I dag`;
    document.getElementById("today-temp").textContent = `Temperatur: ${current.temperature_2m}°C`;
    document.getElementById("today-desc").textContent = `${skyText} | Vind: ${current.wind_speed_10m} m/s`;

    // Ugeprognose
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
    image = "Sne.avif";
  } else if (rain > 0) {
    image = "Regn.jpg";
  } else if (cloudCover < 10) {
    image = "Fuld_sol.avif";
  } else if (cloudCover < 60) {
    image = "Delvist_skyet.jpg";
  } else {
    image = "Skyet.jpg";
  }

  document.body.style.backgroundImage = `url('${image}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" });
}

fetchWeather();

document.getElementById("today-date").textContent = `I dag`;
document.getElementById("today-temp").textContent = `${current.temperature_2m}°C`;
document.getElementById("today-desc").textContent = `${skyText}`;
document.getElementById("weather-wind").innerHTML = `<strong>Vind:</strong> ${current.wind_speed_10m} m/s`;
document.getElementById("weather-humidity").innerHTML = `<strong>Fugtighed:</strong> ${data.hourly.relative_humidity_2m?.[0] || '--'}%`;

async function fetchDSBDepartures() {
  try {
    const response = await fetch('https://api.dataforsyningen.dk/DSBDepartures', {
      headers: {
        'Authorization': 'Bearer 34ad0ed7-6596-47c6-9b09-c3e9ad52c0b0'
      }
    });

    if (!response.ok) {
      throw new Error("Fejl ved hentning af DSB-data");
    }

    const data = await response.json();
    const container = document.getElementById("dsb-results");
    container.innerHTML = "<h3>Afgange fra nærmeste station</h3>";

    data.departures.slice(0, 5).forEach(dep => {
      const div = document.createElement("div");
      div.className = "info-card weather-card";
      div.innerHTML = `
        <div><strong>Tog mod:</strong> ${dep.destination}</div>
        <div><strong>Planlagt:</strong> ${dep.plannedDepartureTime}</div>
        <div><strong>Aktuel:</strong> ${dep.expectedDepartureTime || "Ingen ændring"}</div>
        <div><strong>Spor:</strong> ${dep.track || "Ukendt"}</div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    document.getElementById("dsb-results").innerHTML = `<p>Kunne ikke hente DSB-data: ${err.message}</p>`;
    console.error(err);
  }
}

fetchDSBDepartures();
