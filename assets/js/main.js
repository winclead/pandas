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

    // 업그레이드된 네비게이션 자동 생성 실행
    setupAutoNavigation();
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

function togglePhase(btn) {
    btn.classList.toggle('collapsed');
    const items = btn.nextElementSibling;
    if (items && items.classList.contains('phase-items')) {
        items.classList.toggle('collapsed');
    }
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

// ==========================================
// [완벽 개선] 타이밍과 경로에 구애받지 않는 네비게이션
// ==========================================
function setupAutoNavigation() {
    // 약간의 지연(50ms)을 주어 HTML 하단의 스크립트가 사이드바에 파란불(active)을 켤 때까지 기다립니다.
    setTimeout(() => {
        // 현재 불이 들어온(active) 메뉴를 직접 찾습니다.
        const activeLink = document.querySelector('#navMenu a.active');
        if (!activeLink) return;
        
        const navLinks = Array.from(document.querySelectorAll('#navMenu a'));
        const activeIndex = navLinks.indexOf(activeLink);
        
        if (activeIndex === -1) return;
        
        const navLeft = document.querySelector('.nav-left');
        if (!navLeft) return;
        
        let pageNavBtns = document.querySelector('.page-nav-btns');
        if (!pageNavBtns) {
            pageNavBtns = document.createElement('div');
            pageNavBtns.className = 'page-nav-btns';
            navLeft.appendChild(pageNavBtns);
        }
        pageNavBtns.innerHTML = ''; // 기존 내용 초기화
        
        // 이전 버튼 생성
        if (activeIndex > 0) {
            const prevLink = navLinks[activeIndex - 1];
            const prevA = document.createElement('a');
            prevA.href = prevLink.getAttribute('href');
            prevA.textContent = '← 이전';
            pageNavBtns.appendChild(prevA);
        }
        
        // 다음 버튼 생성
        if (activeIndex < navLinks.length - 1) {
            const nextLink = navLinks[activeIndex + 1];
            const nextA = document.createElement('a');
            nextA.href = nextLink.getAttribute('href');
            nextA.textContent = '다음 →';
            pageNavBtns.appendChild(nextA);
        }
    }, 50);
}
