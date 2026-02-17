/**
 * RankingManager
 * Handles CSV import/export and data management for Ranking.
 */
class RankingManager {
    // Define the column order for CSV
    static COLUMNS = [
        'name', 'class', 'category', 'score',
        'vmax', 'vdec', 'sprint_score', 'pro',
        'dva', 'eye', 'peri', 'flash', 'arrowz_eye_total', 'hand_eye',
        'height', 'weight', 'bmi',
        'vj', 'sj', 'contact_time', 'jump_height', 'rj_index', 'broad_jump', 'stepping'
    ];

    static LABELS = {
        'name': '名前', 'class': 'クラス', 'category': 'カテゴリー', 'score': '総合スコア',
        'vmax': '最高速度', 'vdec': '速度維持率', 'sprint_score': 'スプリントスコア', 'pro': 'プロアジリティ',
        'dva': '動体視力', 'eye': '眼球運動', 'peri': '周辺視', 'flash': '瞬間視', 'arrowz_eye_total': 'ArrowzEye合計', 'hand_eye': '目と手の協応',
        'height': '身長', 'weight': '体重', 'bmi': 'BMI',
        'vj': '垂直跳び', 'sj': 'スクワットジャンプ', 'contact_time': '接地時間', 'jump_height': '跳躍高', 'rj_index': 'RJ指数', 'broad_jump': '立ち幅跳び', 'stepping': 'ステッピング'
    };

    /**
     * Converts JSON data to CSV string.
     * @param {Array} data Ranking data array
     * @returns {string} CSV string
     */
    static toCSV(data) {
        // Header row
        const header = this.COLUMNS.map(col => this.LABELS[col] || col).join(',');

        // Data rows
        const rows = data.map(item => {
            return this.COLUMNS.map(col => {
                let val = '';
                if (['name', 'class', 'category', 'score'].includes(col)) {
                    val = item[col];
                } else if (item.scores && item.scores[col] !== undefined) {
                    val = item.scores[col];
                }
                // Handle commas/quotes in value if needed (simple implementation)
                return `"${val === undefined || val === null ? '' : val}"`;
            }).join(',');
        });

        return [header, ...rows].join('\n');
    }

    /**
     * Parses CSV string to JSON data.
     * @param {string} csvText 
     * @returns {Array} Ranking data array
     */
    static parseCSV(csvText) {
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
        const data = [];

        // Map header labels back to keys
        const labelToKey = {};
        Object.entries(this.LABELS).forEach(([key, label]) => {
            labelToKey[label] = key;
        });

        const keys = headers.map(h => labelToKey[h] || h);

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => {
                const val = v.replace(/^"|"$/g, '').trim();
                return isNaN(val) || val === '' ? val : Number(val);
            });

            if (values.length < keys.length) continue;

            const item = { scores: {} };

            keys.forEach((key, index) => {
                const val = values[index];
                if (['name', 'class', 'category', 'score'].includes(key)) {
                    item[key] = val;
                } else {
                    // It's a score field
                    item.scores[key] = val;
                }
            });

            // Ensure TOTAL score is set in scores for compatibility
            if (item.score) {
                item.scores['TOTAL'] = item.score;
            }

            data.push(item);
        }

        return data;
    }

    /**
     * Generates JS content for exporting.
     * @param {Array} data 
     * @returns {string} content for ranking_data.js
     */
    static getExportJS(data) {
        return `window.RANKING_DATA = ${JSON.stringify(data, null, 4)};\n`;
    }
}
