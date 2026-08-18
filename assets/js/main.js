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

    // 4. [핵심] 현재 URL 기반으로 이전/다음 버튼 자동 생성!
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
// [개선] URL을 직접 읽어서 확실하게 네비게이션 생성
// ==========================================
function setupAutoNavigation() {
    const navLinks = Array.from(document.querySelectorAll('#navMenu a'));
    
    // 현재 브라우저 URL에서 파일명만 추출 (예: '01_read_csv_advanced.html')
    let currentFileName = window.location.pathname.split('/').pop();
    if (!currentFileName || currentFileName === '') {
        currentFileName = 'index.html'; // 파일명이 없으면 메인홈으로 간주
    }

    // 사이드바 링크 중 href의 파일명이 현재 파일명과 일치하는 위치 찾기
    let activeIndex = navLinks.findIndex(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return false;
        const linkFileName = linkHref.split('/').pop();
        return linkFileName === currentFileName;
    });

    if (activeIndex === -1) return; // 위치를 못 찾으면 종료

    // [중요] JS가 직접 현재 메뉴에 불을 켜주고, 소속된 아코디언 폴더를 펼칩니다.
    const activeLink = navLinks[activeIndex];
    activeLink.classList.add('active');
    
    const parentPhase = activeLink.closest('.phase-items');
    if (parentPhase) {
        parentPhase.classList.remove('collapsed');
        if (parentPhase.previousElementSibling) {
            parentPhase.previousElementSibling.classList.remove('collapsed');
        }
    }

    // 상단에 버튼을 넣을 공간 찾기
    const navLeft = document.querySelector('.nav-left');
    if (!navLeft) return;

    let pageNavBtns = document.querySelector('.page-nav-btns');
    if (!pageNavBtns) {
        pageNavBtns = document.createElement('div');
        pageNavBtns.className = 'page-nav-btns';
        navLeft.appendChild(pageNavBtns);
    }
    pageNavBtns.innerHTML = ''; // 초기화

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
}
