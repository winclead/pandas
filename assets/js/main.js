document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeButton(true);
    }

    const isGlobalShow = localStorage.getItem('showAnswers') === 'true';
    const checkbox = document.getElementById('globalAnswerToggle');
    if (checkbox) checkbox.checked = isGlobalShow;
    if (isGlobalShow) applyGlobalAnswerState(true);

    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.icon-btn[onclick="toggleSidebar()"]');
        if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-show')) {
            if (!sidebar.contains(event.target) && menuBtn && !menuBtn.contains(event.target)) {
                sidebar.classList.remove('mobile-show');
            }
        }
    });
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const wrapper = document.getElementById('mainWrapper');
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-show');
    } else {
        sidebar.classList.toggle('collapsed');
        wrapper.classList.toggle('expanded');
    }
}

// Phase (섹션) 접기/펴기 아코디언 기능
function togglePhase(btn) {
    btn.classList.toggle('collapsed');
    const items = btn.nextElementSibling;
    items.classList.toggle('collapsed');
}

function filterSidebar() {
    const query = document.getElementById('sidebarSearch').value.toLowerCase();
    const links = document.querySelectorAll('#navMenu a');
    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        link.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateThemeButton(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeButton(true);
    }
}

function updateThemeButton(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
}

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

function downloadCSVFile(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
