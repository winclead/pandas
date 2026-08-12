document.addEventListener('DOMContentLoaded', () => {
    const isGlobalShow = localStorage.getItem('showAnswers') === 'true';
    const checkbox = document.getElementById('globalAnswerToggle');
    if (checkbox) checkbox.checked = isGlobalShow;
    if (isGlobalShow) applyGlobalAnswerState(true);
});

function toggleAnswer(button) {
    const answerBox = button.nextElementSibling;
    answerBox.classList.toggle('show-answer');
    button.textContent = answerBox.classList.contains('show-answer') ? '답안 숨기기' : '답안 확인';
}

function setGlobalToggle(checkbox) {
    localStorage.setItem('showAnswers', checkbox.checked);
    applyGlobalAnswerState(checkbox.checked);
}

function applyGlobalAnswerState(show) {
    document.querySelectorAll('.answer-content').forEach(ans => {
        show ? ans.classList.add('show-answer') : ans.classList.remove('show-answer');
    });
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = show ? '답안 숨기기' : '답안 확인';
    });
}
