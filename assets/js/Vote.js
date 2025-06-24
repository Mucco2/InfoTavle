// Vent på, at hele HTML-dokumentet er indlæst, før scriptet kører
document.addEventListener('DOMContentLoaded', function () {

    // ======================================================
    // TRIN 1: INDSÆT DIN FIREBASE KONFIGURATION HER
    // ======================================================
    const firebaseConfig = {
  apiKey: "AIzaSyC7hVyTYWu8AMHewk5p4ZLrWD0KtmXMOEI",
  authDomain: "database-1a316.firebaseapp.com",
  projectId: "database-1a316",
  storageBucket: "database-1a316.firebasestorage.app",
  messagingSenderId: "910486984180",
  appId: "1:910486984180:web:14696cda9f285cd9bc15a1",
  measurementId: "G-VT195KT0RH"
};

    // ======================================================
    // TRIN 2: INITIALISER FIREBASE & FIRESTORE
    // ======================================================
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // ======================================================
    // TRIN 3: HENT HTML ELEMENTER
    // ======================================================
    const pollContainer = document.querySelector('.poll-content');
    const pollForm = document.getElementById('poll-form');
    const pollResults = document.getElementById('poll-results');

    // ======================================================
    // FUNKTION: NULSTIL AFSTEMNINGEN TIL START
    // ======================================================
    function resetPoll() {
        console.log("Nulstiller afstemning...");
        // Gør resultaterne tomme igen
        pollResults.innerHTML = '';
        // Vis spørgsmålet og formularen igen
        pollContainer.querySelector('p').style.display = 'block';
        pollForm.style.display = 'block';
        // Nulstil formularen (fjerner valgte radio-knapper)
        pollForm.reset();
        // Genaktiver "Stem"-knappen
        const submitButton = pollForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
    }


    // ======================================================
    // FUNKTION: HENT OG VIS RESULTATER
    // ======================================================
    async function showResults() {
        // Skjul formularen og vis en loading-besked
        pollForm.style.display = 'none';
        pollContainer.querySelector('p').style.display = 'none';
        pollResults.innerHTML = 'Henter resultater...';

        const snapshot = await db.collection("votes").get();

        const voteCounts = {};
        let totalVotes = 0;

        snapshot.forEach(doc => {
            const option = doc.data().option;
            if (voteCounts[option]) {
                voteCounts[option]++;
            } else {
                voteCounts[option] = 1;
            }
            totalVotes++;
        });

        let resultsHtml = `<h4>Resultat (${totalVotes} stemmer i alt)</h4>`;
        const labels = pollForm.querySelectorAll('label');
        const optionTexts = {};
        labels.forEach(label => {
            const input = label.querySelector('input');
            optionTexts[input.value] = label.innerText;
        });
        
        resultsHtml += '<ul style="list-style-type: none; padding: 0; margin: 0;">';

        for (const optionValue in optionTexts) {
            const count = voteCounts[optionValue] || 0;
            const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;
            const text = optionTexts[optionValue];

            resultsHtml += `
                <li style="margin-bottom: 10px;">
                    <strong>${text}</strong> (${count} stemmer)<br>
                    <div style="background-color: #e9ecef; border-radius: 5px; overflow: hidden;">
                        <div style="background-color: #007bff; color: white; width: ${percentage}%; padding: 5px; text-align: center; white-space: nowrap;">
                            ${percentage}%
                        </div>
                    </div>
                </li>
            `;
        }
        resultsHtml += '</ul>';
        
        pollResults.innerHTML = resultsHtml;

        // ***** NYT: NULSTIL EFTER 7 SEKUNDER *****
        setTimeout(resetPoll, 7000); // 7000 millisekunder = 7 sekunder
    }

    // ======================================================
    // LYT EFTER FORMULARAFSENDELSE
    // ======================================================
    pollForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const submitButton = pollForm.querySelector('button[type="submit"]');
        const selectedOption = pollForm.querySelector('input[name="poll-option"]:checked');

        if (selectedOption) {
            submitButton.disabled = true;
            const voteValue = selectedOption.value;

            db.collection("votes").add({
                option: voteValue,
                question: "Hvad glæder du dig mest til i dag?",
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log("Stemme gemt!");
                showResults();
            })
            .catch((error) => {
                console.error("Fejl ved lagring af stemme: ", error);
                pollResults.textContent = "Hov, der skete en fejl. Prøv igen.";
                submitButton.disabled = false;
            });
        } else {
            pollResults.textContent = "Vælg venligst en mulighed for at stemme.";
        }
    });
});