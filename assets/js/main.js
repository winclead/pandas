document.addEventListener('DOMContentLoaded', () => {
    // 1. 다크모드 설정 불러오기
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeButton(true);
    }

    // 2. 글로벌 답안 보기 설정 불러오기
    const isGlobalShow = localStorage.getItem('showAnswers') === 'true';
    const checkbox = document.getElementById('globalAnswerToggle');
    if (checkbox) checkbox.checked = isGlobalShow;
    if (isGlobalShow) applyGlobalAnswerState(true);

    // 3. 모바일에서 바깥 영역 클릭 시 사이드바 닫기
    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.icon-btn[onclick="toggleSidebar()"]');
        if (window.innerWidth <= 768 && sidebar.classList.contains('mobile-show')) {
            if (!sidebar.contains(event.target) && menuBtn && !menuBtn.contains(event.target)) {
                sidebar.classList.remove('mobile-show');
            }
        }
    });

    // 4. [신규] 이전/다음 페이지 자동 생성 기능 실행
    setupAutoNavigation();
});

// 사이드바 토글
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

// Phase 아코디언 토글
function togglePhase(btn) {
    btn.classList.toggle('collapsed');
    const items = btn.nextElementSibling;
    if (items && items.classList.contains('phase-items')) {
        items.classList.toggle('collapsed');
    }
}

// 검색 필터
function filterSidebar() {
    const query = document.getElementById('sidebarSearch').value.toLowerCase();
    const links = document.querySelectorAll('#navMenu a');
    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        link.style.display = text.includes(query) ? 'block' : 'none';
    });
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
    if (btn) btn.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
}

// 답안 토글
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

// CSV 다운로드 유틸리티
function downloadCSVFile(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// ==========================================
// [신규] 이전/다음 페이지 버튼 자동 생성 로직
// ==========================================
function setupAutoNavigation() {
    // 사이드바의 모든 링크 <a> 태그를 가져옵니다.
    const navLinks = Array.from(document.querySelectorAll('#navMenu a'));
    // 현재 접속중인 페이지(active 클래스가 붙은 요소)의 인덱스를 찾습니다.
    const activeIndex = navLinks.findIndex(link => link.classList.contains('active'));
    
    if (activeIndex === -1) return;

    // 상단 네비게이션 좌측 영역을 찾습니다.
    const navLeft = document.querySelector('.nav-left');
    if (!navLeft) return;

    // page-nav-btns 컨테이너가 없으면 만듭니다. (자동화 스크립트로 누락된 부분 해결)
    let pageNavBtns = document.querySelector('.page-nav-btns');
    if (!pageNavBtns) {
        pageNavBtns = document.createElement('div');
        pageNavBtns.className = 'page-nav-btns';
        navLeft.appendChild(pageNavBtns);
    }
    pageNavBtns.innerHTML = ''; // 초기화

    // 첫 페이지가 아니라면 '이전' 버튼 생성
    if (activeIndex > 0) {
        const prevLink = navLinks[activeIndex - 1];
        const prevA = document.createElement('a');
        prevA.href = prevLink.href;
        prevA.textContent = '← 이전';
        pageNavBtns.appendChild(prevA);
    }

    // 마지막 페이지가 아니라면 '다음' 버튼 생성
    if (activeIndex < navLinks.length - 1) {
        const nextLink = navLinks[activeIndex + 1];
        const nextA = document.createElement('a');
        nextA.href = nextLink.href;
        nextA.textContent = '다음 →';
        pageNavBtns.appendChild(nextA);
    }
}
