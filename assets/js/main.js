console.log("main.js er indlæst korrekt!");

document.addEventListener("DOMContentLoaded", function () {
    // Menu Toggle
    const toggle = document.querySelector(".toggle");
    const navigation = document.querySelector(".navigation");
    const main = document.querySelector(".main");

    if (toggle) {
        toggle.onclick = function () {
            navigation.classList.toggle("active");
            main.classList.toggle("active");
        };
    }

    // Sektions-navigation
    const navItems = document.querySelectorAll(".navigation ul li");
    const sections = document.querySelectorAll(".info-section");

    const sectionMap = {
        "Infotavle": "infotavle-section",
        "Vejret": "weather-section",
        "Trafik": "traffic-section",
        "DSB Rejseplanen": "rejseplanen-section",
        "Kalender": "kalender-section",
        "Feedback": "feedback-section",
        "APIKald": "feedback-section1",
        "Nyheder": "nyheder-section",
    };

    let activeSectionId = "infotavle-section"; // Startside

    // Klik på menu-knapper
    navItems.forEach(item => {
        const titleElement = item.querySelector(".title");
        if (!titleElement) return; // Spring over hvis der ikke er en titel (f.eks. logoet)
        
        const title = titleElement.textContent.trim();

        item.addEventListener("click", () => {
            // Opdater 'active' klassen på menupunkter
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            // Skjul alle sektioner
            sections.forEach(section => section.style.display = "none");

            // Vis den valgte sektion
            const sectionId = sectionMap[title];
            if (sectionId) {
                const targetSection = document.getElementById(sectionId);
                if(targetSection) {
                    targetSection.style.display = "block";
                    activeSectionId = sectionId;
                }
            
                // Hvis det er "Apikald"-sektionen, så kald funktionen til at hente data
                if (title === "APIKald" && typeof hentOgVisData === 'function') {
                    hentOgVisData();
                }
            }
        });
    });

    // Ur i toppen
    function updateTopbarClock() {
        const clockElement = document.getElementById('clock-topbar');
        if(clockElement) {
            const now = new Date();
            clockElement.textContent = now.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
        }
    }
    setInterval(updateTopbarClock, 1000);
    updateTopbarClock();
});