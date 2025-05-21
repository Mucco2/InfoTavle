// Toggle for navigation
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};

// Kalender-opsætning
let calendarInitialized = false;
let calendar;

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".navigation ul li");
    const sections = document.querySelectorAll(".info-section");

    const sectionMap = {
        "Vejret": "weather-section",
        "Trafik": "traffic-section",
        "Kalender": "calendar-section"
    };

    let activeSectionId = "weather-section";

    // Navigation klik
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

                // Init kalender hvis nødvendigt
                if (sectionId === "calendar-section" && !calendarInitialized) {
                    const calendarEl = document.getElementById('calendar');
                    calendar = new FullCalendar.Calendar(calendarEl, {
                        initialView: 'dayGridMonth',
                        locale: 'da',
                        headerToolbar: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,listWeek'
                        },
                        events: [
                            { title: 'Eksamensdag', start: '2025-05-27' },
                            { title: 'Fredagsbar', start: '2025-05-30' },
                            { title: 'Sommerferie', start: '2025-06-25' }
                        ]
                    });
                    calendar.render();
                    calendarInitialized = true;
                }
            }
        });
    });

    // Søgefunktion
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

    // Initial visning
    document.getElementById(activeSectionId).style.display = "block";
    navItems.forEach(li => {
        const title = li.querySelector(".title")?.textContent.trim();
        if (sectionMap[title] === activeSectionId) {
            li.classList.add("active");
        }
    });
});
