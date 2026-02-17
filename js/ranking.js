document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.category-tabs-wrapper .tab-btn');
    const tableBody = document.querySelector('.ranking-full-table tbody');
    const testSelect = document.getElementById('test-select');

    let currentCategory = 'OVERALL';
    let currentTest = 'TOTAL';

    // Sort: desc = higher is better, asc = lower is better
    const SORT_CONFIG = {
        'TOTAL': { dir: 'desc', label: 'TOTAL SCORE' },
        'vmax': { dir: 'desc', label: '最高速度 (km/h)' },
        'vdec': { dir: 'desc', label: '速度維持率' },
        'sprint_score': { dir: 'desc', label: 'スプリントスコア' },
        'pro': { dir: 'asc', label: '切り返し走 (sec)' },
        'dva': { dir: 'desc', label: '動体視力' },
        'eye': { dir: 'desc', label: '眼球運動' },
        'peri': { dir: 'desc', label: '周辺視' },
        'flash': { dir: 'desc', label: '瞬間視' },
        'arrowz_eye_total': { dir: 'desc', label: 'ArrowzEye合計値' },
        'hand_eye': { dir: 'asc', label: '目と手の協応動作 (sec)' },
        'vj': { dir: 'desc', label: '垂直跳び (cm)' },
        'sj': { dir: 'desc', label: 'スクワットジャンプ (cm)' },
        'contact_time': { dir: 'asc', label: '接地時間 (sec)' },
        'jump_height': { dir: 'desc', label: '跳躍高 (cm)' },
        'rj_index': { dir: 'desc', label: 'RJ-index' },
        'broad_jump': { dir: 'desc', label: '立ち幅跳び (cm)' },
        'stepping': { dir: 'desc', label: 'ステッピング (回)' }
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.textContent.trim();
            renderTable();
        });
    });

    if (testSelect) {
        testSelect.addEventListener('change', (e) => {
            currentTest = e.target.value;
            renderTable();
        });
    }

    function renderTable() {
        const fullRankingData = window.RANKING_DATA;
        if (!fullRankingData || fullRankingData.length === 0) return;

        let filteredData = fullRankingData;
        if (currentCategory !== 'OVERALL') {
            filteredData = fullRankingData.filter(item => item.category === currentCategory);
        }

        const config = SORT_CONFIG[currentTest] || SORT_CONFIG['TOTAL'];
        const isDesc = config.dir === 'desc';

        filteredData = filteredData.filter(item => {
            const val = item.scores ? item.scores[currentTest] : null;
            return val !== null && val !== undefined && val !== '-' && val !== 0;
        });

        filteredData.sort((a, b) => {
            let valA = a.scores ? a.scores[currentTest] : 0;
            let valB = b.scores ? b.scores[currentTest] : 0;
            return isDesc ? valB - valA : valA - valB;
        });

        const thScore = document.querySelector('.ranking-full-table th:last-child');
        if (thScore) thScore.textContent = config.label;

        tableBody.innerHTML = '';

        filteredData.slice(0, 50).forEach((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const rankDisplay = rank.toString().padStart(2, '0');
            const displayValue = item.scores ? item.scores[currentTest] : '-';
            const tr = document.createElement('tr');
            tr.className = rankClass;
            tr.innerHTML = `
                <td class="rank-num-cell" data-label="RANK">${rankDisplay}</td>
                <td data-label="NAME">${item.name}</td>
                <td data-label="CLASS">${item.class}</td>
                <td data-label="CATEGORY">${item.category}</td>
                <td class="score-cell" data-label="${config.label}">${displayValue}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    if (window.RANKING_DATA) {
        renderTable();
    } else {
        setTimeout(() => { if (window.RANKING_DATA) renderTable(); }, 500);
    }
});
