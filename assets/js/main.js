// Hover-effekt
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
    "Feedback": "feedback-section"
};


let activeSectionId = "infotavle-section"; // Set this as the new default


    // Klik på menu-knapper
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const title = item.querySelector(".title").textContent.trim();

            // Fjern aktiv klasse fra alle navigationselementer
            navItems.forEach(nav => nav.classList.remove("active"));

            // Tilføj aktiv klasse til det klikkede element
            item.classList.add("active");

            // Skjul alle sektioner
            sections.forEach(section => section.style.display = "none");

            // Vis den valgte sektion og gem aktiv ID
            const sectionId = sectionMap[title];
            if (sectionId) {
                document.getElementById(sectionId).style.display = "block";
                activeSectionId = sectionId;
            }
        });
    });

    // Søgefunktion
    document.querySelector(".search input").addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        let foundMatch = false;

        if (searchValue === "") {
            // Vis kun aktiv sektion
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

                    // Opdater aktiv navigation
                    navItems.forEach(item => {
                        const title = item.querySelector(".title").textContent.trim();
                        const expectedSection = sectionMap[title];
                        if (expectedSection === section.id) {
                            item.classList.add("active");
                        } else {
                            item.classList.remove("active");
                        }
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




