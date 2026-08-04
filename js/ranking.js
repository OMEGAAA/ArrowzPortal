document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const tableBody = document.querySelector('.ranking-full-table tbody');
    const testSelect = document.getElementById('test-select');

    let currentCategory = 'OVERALL';
    let currentTest = 'vmax';

    const SORT_CONFIG = {
        vmax: { dir: 'desc', label: '\u6700\u9ad8\u901f\u5ea6 (km/h)' },
        vdec: { dir: 'desc', label: '\u901f\u5ea6\u7dad\u6301\u7387' },
        sprint_score: { dir: 'desc', label: '\u30b9\u30d7\u30ea\u30f3\u30c8\u30b9\u30b3\u30a2' },
        pro: { dir: 'asc', label: '\u5207\u308a\u8fd4\u3057\u8d70 (sec)' },
        dva: { dir: 'desc', label: '\u52d5\u4f53\u8996\u529b' },
        eye: { dir: 'desc', label: '\u773c\u7403\u904b\u52d5' },
        peri: { dir: 'desc', label: '\u5468\u8fba\u8996' },
        flash: { dir: 'desc', label: '\u77ac\u9593\u8996' },
        arrowz_eye_total: { dir: 'desc', label: 'ArrowzEye\u5408\u8a08\u5024' },
        hand_eye: { dir: 'asc', label: '\u773c\u3068\u624b\u306e\u5354\u5fdc\u52d5\u4f5c (sec)' },
        vj: { dir: 'desc', label: '\u5782\u76f4\u8df3\u3073 (cm)' },
        sj: { dir: 'desc', label: '\u30b9\u30af\u30ef\u30c3\u30c8\u30b8\u30e3\u30f3\u30d7 (cm)' },
        contact_time: { dir: 'asc', label: '\u63a5\u5730\u6642\u9593 (sec)' },
        jump_height: { dir: 'desc', label: '\u8df3\u8e8d\u9ad8 (cm)' },
        rj_index: { dir: 'desc', label: 'RJ-index' },
        broad_jump: { dir: 'desc', label: '\u7acb\u3061\u5e45\u8df3\u3073 (cm)' },
        stepping: { dir: 'desc', label: '\u30b9\u30c6\u30c3\u30d4\u30f3\u30b0 (\u56de)' }
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

    function hasValidScore(item, key) {
        const val = item.scores ? item.scores[key] : null;
        if (val === null || val === undefined) return false;
        if (typeof val === 'string' && (val.trim() === '' || val.trim() === '-')) return false;
        const num = Number(val);
        return Number.isFinite(num) && num !== 0;
    }

    function renderTable() {
        const fullRankingData = window.RANKING_DATA;
        if (!tableBody || !fullRankingData || fullRankingData.length === 0) return;

        let filteredData = fullRankingData;
        if (currentCategory !== 'OVERALL') {
            filteredData = fullRankingData.filter(item => item.category === currentCategory);
        }

        const config = SORT_CONFIG[currentTest] || SORT_CONFIG.sprint_score;
        const isDesc = config.dir === 'desc';

        filteredData = filteredData.filter(item => hasValidScore(item, currentTest));

        filteredData.sort((a, b) => {
            const valA = Number(a.scores[currentTest]);
            const valB = Number(b.scores[currentTest]);
            return isDesc ? valB - valA : valA - valB;
        });

        const thScore = document.querySelector('.ranking-full-table th:last-child');
        if (thScore) thScore.textContent = config.label;

        tableBody.innerHTML = '';

        filteredData.slice(0, 50).forEach((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const rankDisplay = rank.toString().padStart(2, '0');
            const displayValue = item.scores[currentTest];
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
        setTimeout(() => {
            if (window.RANKING_DATA) renderTable();
        }, 500);
    }
});