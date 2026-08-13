document.addEventListener('DOMContentLoaded', () => {
    // 1. 저장된 다크모드 불러오기
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeButton(true);
    }

    // 2. 저장된 글로벌 답안 보기 불러오기
    const isGlobalShow = localStorage.getItem('showAnswers') === 'true';
    const checkbox = document.getElementById('globalAnswerToggle');
    if (checkbox) checkbox.checked = isGlobalShow;
    if (isGlobalShow) applyGlobalAnswerState(true);
});

// 사이드바 토글 (접기/펼치기)
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

// 다크모드 토글
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
    if (btn) {
        btn.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
    }
}

// 개별 답안 토글
function toggleAnswer(button) {
    const answerBox = button.nextElementSibling;
    answerBox.classList.toggle('show-answer');
    button.textContent = answerBox.classList.contains('show-answer') ? '답안 숨기기' : '답안 확인';
}

// 글로벌 답안 설정
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

// CSV 다운로드 유틸리티 함수 (블롭 생성)
function downloadCSVFile(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
