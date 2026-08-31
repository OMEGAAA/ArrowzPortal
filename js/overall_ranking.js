(function () {
    'use strict';

    // The 17 events available on the OVERALL tab of ranking.html.
    // Lower values are better only for the three timed events.
    const EVENTS = [
        { key: 'vmax', direction: 'desc' },
        { key: 'vdec', direction: 'desc' },
        { key: 'sprint_score', direction: 'desc' },
        { key: 'pro', direction: 'asc' },
        { key: 'dva', direction: 'desc' },
        { key: 'eye', direction: 'desc' },
        { key: 'peri', direction: 'desc' },
        { key: 'flash', direction: 'desc' },
        { key: 'arrowz_eye_total', direction: 'desc' },
        { key: 'hand_eye', direction: 'asc' },
        { key: 'vj', direction: 'desc' },
        { key: 'sj', direction: 'desc' },
        { key: 'contact_time', direction: 'asc' },
        { key: 'jump_height', direction: 'desc' },
        { key: 'rj_index', direction: 'desc' },
        { key: 'broad_jump', direction: 'desc' },
        { key: 'stepping', direction: 'desc' }
    ];

    function hasValidScore(item, key) {
        const value = item && item.scores && Number(item.scores[key]);
        return Number.isFinite(value) && value !== 0;
    }

    function calculate(data) {
        if (!Array.isArray(data)) return [];

        // Only compare athletes with results for every event.
        const eligible = data.filter(item =>
            EVENTS.every(event => hasValidScore(item, event.key))
        );
        const rankTotals = new Map(eligible.map(item => [item, 0]));

        EVENTS.forEach(event => {
            const eventRanking = [...eligible].sort((a, b) => {
                const valueA = Number(a.scores[event.key]);
                const valueB = Number(b.scores[event.key]);
                return event.direction === 'desc' ? valueB - valueA : valueA - valueB;
            });

            // Tied values receive the same competition rank (1, 2, 2, 4).
            let eventRank = 0;
            let previousValue = null;
            eventRanking.forEach((item, index) => {
                const value = Number(item.scores[event.key]);
                if (index === 0 || value !== previousValue) eventRank = index + 1;
                rankTotals.set(item, rankTotals.get(item) + eventRank);
                previousValue = value;
            });
        });

        return eligible.map(item => ({
            item,
            rankTotal: rankTotals.get(item),
            averageRank: rankTotals.get(item) / EVENTS.length
        })).sort((a, b) =>
            a.rankTotal - b.rankTotal || a.item.name.localeCompare(b.item.name, 'ja')
        );
    }

    window.OverallRanking = { calculate };
})();
