console.log("main.js er indlæst korrekt!");
// main.js

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};

document.addEventListener("DOMContentLoaded", function () {
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
    };

    let activeSectionId = "infotavle-section";

    // Klik på menu-knapper
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const title = item.querySelector(".title").textContent.trim();

            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            sections.forEach(section => section.style.display = "none");

            const sectionId = sectionMap[title];
            if (sectionId) {
                document.getElementById(sectionId).style.display = "block";
                activeSectionId = sectionId;

                // ============== NY KODE START ==============
                // Hvis det er "Apikald"-sektionen, der lige er blevet vist,
                // så kald funktionen, der henter data.
                if (title === "Apikald") {
                    if (typeof hentOgVisData === 'function') {
                        hentOgVisData();
                    } else {
                        console.error("Funktionen 'hentOgVisData' blev ikke fundet. Sørg for at scriptet (f.eks. 'infotavle.js') er indlæst korrekt i din HTML.");
                    }
                }
                // ============== NY KODE SLUT ==============
            }
        });
    });

    // Søgefunktion (din eksisterende kode - ingen ændringer her)
    document.querySelector(".search input").addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        let foundMatch = false;

        if (searchValue === "") {
            sections.forEach(section => {
                section.style.display = (section.id === activeSectionId) ? "block" : "none";
            });
        } else {
            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                const matches = text.includes(searchValue);
                section.style.display = matches ? "block" : "none";

                if (matches && !foundMatch) {
                    foundMatch = true;
                    activeSectionId = section.id;
                    navItems.forEach(item => {
                        const title = item.querySelector(".title").textContent.trim();
                        const expectedSection = sectionMap[title];
                        item.classList.toggle("active", expectedSection === section.id);
                    });
                }
            });
        }
    });

    // Initial markering
    navItems.forEach(li => {
        const title = li.querySelector(".title")?.textContent.trim();
        if (sectionMap[title] === activeSectionId) {
            li.classList.add("active");
        }
    });
});

function updateTopbarClock() {
    const now = new Date();
    document.getElementById('clock-topbar').textContent =
        now.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTopbarClock, 1000);
updateTopbarClock();

// Uddrag fra din main.js fil, inde i item.addEventListener("click", ... )

const sectionId = sectionMap[title];
if (sectionId) {
    document.getElementById(sectionId).style.display = "block";
    activeSectionId = sectionId;

    // Dette er den afgørende trigger
    if (title === "Apikald") {
        if (typeof hentOgVisData === 'function') {
            hentOgVisData();
        }
    }
}