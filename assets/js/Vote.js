function showPollResults() {
    // Henter de samlede stemmer
    let votes = JSON.parse(localStorage.getItem('pollVotes')) || { kaffe: 0, frikvarter: 0 };
    const totalVotes = votes.kaffe + votes.frikvarter;
    
    // Beregn procenter
    const kaffePercent = totalVotes > 0 ? ((votes.kaffe / totalVotes) * 100) : 0;
    const frikvarterPercent = totalVotes > 0 ? ((votes.frikvarter / totalVotes) * 100) : 0;

    // Opdater tekst og visuelle bjælker i #poll-card
    document.getElementById('result-kaffe-txt').textContent = kaffePercent.toFixed(0) + '%';
    document.getElementById('bar-kaffe').style.width = kaffePercent + '%';
    document.getElementById('result-frikvarter-txt').textContent = frikvarterPercent.toFixed(0) + '%';
    document.getElementById('bar-frikvarter').style.width = frikvarterPercent + '%';
    document.getElementById('result-morgenmad-txt').textContent = morgenmadPercent.toFixed(0) + '%';
    document.getElementById('bar-morgenmad').style.width = morgenmadPercent + '%';


    // Henter og viser brugerens specifikke stemme i #uservote-card
    const userVoteText = localStorage.getItem('userVoteText');
    if (userVoteText) {
        document.getElementById('user-vote-display').textContent = userVoteText;
        
        // NYT: Gør det separate "Du stemte på"-kort synligt
        document.getElementById('uservote-card').style.display = 'block';
    }

    // Skjul afstemnings-knapper og vis resultaterne i #poll-card
    document.querySelector('#poll-card .poll-options').style.display = 'none';
    document.querySelector('#poll-card #poll-question').style.display = 'none';
    document.querySelector('#poll-card #poll-results').style.display = 'block';
}