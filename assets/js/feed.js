const feedbackForm = document.getElementById('feedback-form');
const feedbackList = document.getElementById('feedback-list');
const commentInput = document.getElementById('comment');

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const comment = commentInput.value.trim();
    const wordCount = comment.split(/\s+/).filter(Boolean).length;

    if (wordCount > 100) {
        alert(`Din kommentar må maksimalt være 100 ord. Din nuværende kommentar er på ${wordCount} ord.`);
        return;
    }

    const date = new Date().toLocaleString('da-DK');

    // Tilføj til feedbacks-arrayet
    feedbacks.push({
        name: name,
        rating: rating,
        comment: comment,
        date: date
    });

    // Gem hele arrayet i localStorage
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    // Opdater visningen
    renderFeedbacks();
    feedbackForm.reset();
});



const wordCountDisplay = document.getElementById('word-count');

commentInput.addEventListener('input', function() {
    const wordCount = commentInput.value.trim().split(/\s+/).filter(Boolean).length;
    wordCountDisplay.textContent = `${wordCount}/100 ord`;
});


// Gem kommentarer i localStorage
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

function renderFeedbacks() {
  feedbackList.innerHTML = '';
  feedbacks.forEach(feedback => {
    const feedbackItem = document.createElement('div');
    feedbackItem.classList.add('feedback-item');
    feedbackItem.innerHTML = `
      <p><strong>${feedback.name}</strong> - ${feedback.date}</p>
      <p>Rating: ${feedback.rating}/5</p>
      <p>${feedback.comment}</p>
      <hr>
    `;
    feedbackList.prepend(feedbackItem);
  });
}

renderFeedbacks();

// Tilføj denne linje når feedback bliver sendt:
localStorage.setItem('feedbacks', JSON.stringify(feedbacks));