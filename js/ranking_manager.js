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
    /**
     * Generates JS content for exporting.
     * @param {Array} data 
     * @returns {string} content for ranking_data.js
     */
    static getExportJS(data) {
        return `window.RANKING_DATA = ${JSON.stringify(data, null, 4)};\n`;
    }

    /**
     * Parses Excel (arrayBuffer) to JSON data.
     * @param {ArrayBuffer} arrayBuffer Excel file content
     * @param {string} sheetName Sheet name to read (default: 'データ')
     * @param {number} skiprows Number of rows to skip (default: 0)
     * @returns {Object} Object containing the parsed ranking data and the version string
     */
    static parseExcel(arrayBuffer, sheetName = 'データ', skiprows = 0) {
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS (XLSX) ライブラリが読み込まれていません。');
        }

        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
        
        // 「データ」などの特定シートが存在するかどうかで従来型（1シート構成）か新Ver.型（生徒別複数シート）かを判定
        const hasSingleDataSheet = workbook.SheetNames.includes(sheetName);
        
        if (hasSingleDataSheet) {
            const data = this.parseExcelSingleSheet(workbook, sheetName, skiprows);
            return { data: data, version: '従来Ver. (全員分1シート)' };
        } else {
            const data = this.parseExcelMultiSheets(workbook);
            return { data: data, version: '新Ver. (生徒別複数シート)' };
        }
    }

    /**
     * Parses a single data sheet Excel (traditional format).
     */
    static parseExcelSingleSheet(workbook, sheetName, skiprows) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`シート「${sheetName}」が見つかりません。`);
        }

        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // 「データ」シートは各測定項目が2列1組（ラベル列＋値列）で、
        // 実際の数値は組の右側（奇数列インデックス）に入っている。
        const VALUE_COLS = {
            'vmax':              41,   // 最高速度 (km/h)
            'vdec':              43,   // 速度維持率
            'sprint_score':      45,   // スプリントスコア (回)
            'pro':               49,   // 切り返し走 (sec)
            'dva':               51,   // 動体視力 (ランク)
            'eye':               53,   // 眼球運動 (ランク)
            'peri':              55,   // 周辺視 (ランク)
            'flash':             57,   // 瞬間視 (ランク)
            'arrowz_eye_total':  59,   // ArrowzEye合計値
            'hand_eye':          63,   // 眼と手の協応動作 (sec)
            'height':            65,   // 身長 (cm)
            'weight':            67,   // 体重 (kg)
            'bmi':               69,   // BMI
            'vj':                71,   // 垂直跳び (cm)
            'sj':                73,   // スクワットジャンプ (cm)
            'contact_time':      75,   // 接地時間 (sec)
            'jump_height':       77,   // 跳躍高 (cm)
            'rj_index':          79,   // RJ-index
            'broad_jump':        81,   // 立ち幅跳び (cm)
            'stepping':          83,   // ステッピング (回)
        };

        const parseDate = (val) => {
            if (val === undefined || val === null || val === '') return null;
            if (val instanceof Date) return val;
            if (typeof val === 'number') {
                return new Date((val - (25567 + 2)) * 86400 * 1000);
            }
            const s = String(val).trim();
            const d = new Date(s);
            return isNaN(d.getTime()) ? null : d;
        };

        const allRecords = [];

        for (let i = skiprows; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const name = row[0];
            if (name === undefined || name === null) continue;
            
            const nameStr = String(name).trim();
            if (nameStr.length === 0) continue;
            
            if (/^\d{4}\//.test(nameStr)) continue;

            const testDate = parseDate(row[3]);                                                       // 測定日
            const grade = row[10] !== undefined && row[10] !== null ? String(row[10]).trim() : "";     // 学年 (小1〜高3)
            const gender = row[9] !== undefined && row[9] !== null ? String(row[9]).trim() : "";       // 男子/女子
            const className = row[8] !== undefined && row[8] !== null ? String(row[8]).trim() : "";    // クラス時間帯

            let category = "U-12";
            if (grade.includes("小")) {
                try {
                    const match = grade.match(/\d+/);
                    if (match) {
                        const g = parseInt(match[0], 10);
                        category = g <= 3 ? "U-9" : "U-12";
                    }
                } catch (e) {}
            } else if (grade.includes("中")) {
                category = "U-15";
            } else if (grade.includes("高")) {
                category = "U-18";
            }

            const scores = {};
            let hasData = false;

            for (const [key, idx] of Object.entries(VALUE_COLS)) {
                try {
                    const valRaw = row[idx];
                    if (valRaw === undefined || valRaw === null || valRaw === '') continue;

                    const valStr = String(valRaw).replace(/,/g, '').trim();
                    if (valStr === '' || valStr === '-') continue;

                    const val = parseFloat(valStr);
                    if (!isNaN(val)) {
                        scores[key] = Math.round(val * 10000) / 10000;
                        hasData = true;
                    }
                } catch (e) {}
            }

            const mainScore = scores['vmax'] || 0;

            if (hasData) {
                allRecords.push({
                    name: nameStr,
                    class: className || grade,
                    category: category,
                    grade: grade,
                    gender: gender,
                    test_date: testDate,
                    score: mainScore,
                    scores: scores
                });
            }
        }

        return this.filterLatestAndSort(allRecords);
    }

    /**
     * Parses Excel with multiple student sheets (new format).
     */
    static parseExcelMultiSheets(workbook) {
        // 管理用または無効なシートの除外リスト
        const EXCLUDE_SHEETS = [
            '引点克服TR', 'データ貼り付け', '男性', '女性', '結果シート', 
            '個人シート', 'プルダウン', 'CheckList', 'TransferLog'
        ];

        // 新Ver.用の列インデックス定義 (個人シート内)
        const NEW_VALUE_COLS = {
            'vmax':              22,   // 最高速度 (km/h)
            'vdec':              23,   // 速度維持率
            'sprint_score':      24,   // スプリントスコア (回)
            'pro':               26,   // 切り返し走 (sec)
            'dva':               27,   // 動体視力 (ランク)
            'eye':               28,   // 眼球運動 (ランク)
            'peri':              29,   // 周辺視 (ランク)
            'flash':             30,   // 瞬間視 (ランク)
            'arrowz_eye_total':  31,   // ArrowzEye合計値
            'hand_eye':          33,   // 眼と手の協応動作 (sec)
            'height':            34,   // 身長 (cm)
            'weight':            35,   // 体重 (kg)
            'bmi':               36,   // BMI
            'vj':                37,   // 垂直跳び (cm)
            'sj':                38,   // スクワットジャンプ (cm)
            'contact_time':      39,   // 接地時間 (sec)
            'jump_height':       40,   // 跳躍高 (cm)
            'rj_index':          41,   // RJ-index
            'broad_jump':        42,   // 立ち幅跳び (cm)
            'stepping':          43,   // ステッピング (回)
        };

        const parseDate = (val) => {
            if (val === undefined || val === null || val === '') return null;
            if (val instanceof Date) return val;
            if (typeof val === 'number') {
                return new Date((val - (25567 + 2)) * 86400 * 1000);
            }
            const s = String(val).trim();
            const d = new Date(s);
            return isNaN(d.getTime()) ? null : d;
        };

        const allRecords = [];

        // 生徒名になっているすべてのシートをループ
        for (const sName of workbook.SheetNames) {
            let isExclude = false;
            for (const ex of EXCLUDE_SHEETS) {
                if (sName.includes(ex) || ex.includes(sName)) {
                    isExclude = true;
                    break;
                }
            }
            if (isExclude) continue;

            const sheet = workbook.Sheets[sName];
            if (!sheet) continue;

            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            
            // 安全対策: 行数不足や、列数が極端に少ないシート（管理用など）はスキップ
            if (rows.length < 5) continue;
            let maxCols = 0;
            for (let rIdx = 0; rIdx < Math.min(5, rows.length); rIdx++) {
                if (rows[rIdx] && rows[rIdx].length > maxCols) {
                    maxCols = rows[rIdx].length;
                }
            }
            if (maxCols < 20) continue;

            const nameStr = sName.trim();

            // データは4行目（インデックス4）以降
            for (let i = 4; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;
                if (row.length < 44) continue; // 列数が足りない行はスキップ

                // 年(列0)と月(列1)から日付オブジェクトを合成
                const yearVal = parseInt(row[0], 10);
                const monthVal = parseInt(row[1], 10);
                let testDate = null;
                if (!isNaN(yearVal) && !isNaN(monthVal)) {
                    testDate = new Date(yearVal, monthVal - 1, 1);
                } else {
                    testDate = parseDate(row[6]);
                }

                if (!testDate) continue;

                const grade = row[3] !== undefined && row[3] !== null ? String(row[3]).trim() : "";
                const gender = row[4] !== undefined && row[4] !== null ? String(row[4]).trim() : "";
                const className = row[7] !== undefined && row[7] !== null ? String(row[7]).trim() : "";

                let category = "U-12";
                if (grade.includes("小")) {
                    try {
                        const match = grade.match(/\d+/);
                        if (match) {
                            const g = parseInt(match[0], 10);
                            category = g <= 3 ? "U-9" : "U-12";
                        }
                    } catch (e) {}
                } else if (grade.includes("中")) {
                    category = "U-15";
                } else if (grade.includes("高")) {
                    category = "U-18";
                }

                const scores = {};
                let hasData = false;

                // スコア抽出
                for (const [key, idx] of Object.entries(NEW_VALUE_COLS)) {
                    try {
                        const valRaw = row[idx];
                        if (valRaw === undefined || valRaw === null || valRaw === '') continue;

                        const valStr = String(valRaw).replace(/,/g, '').trim();
                        if (valStr === '' || valStr === '-') continue;

                        const val = parseFloat(valStr);
                        if (!isNaN(val)) {
                            scores[key] = Math.round(val * 10000) / 10000;
                            hasData = true;
                        }
                    } catch (e) {}
                }

                const mainScore = scores['vmax'] || 0;

                if (hasData) {
                    allRecords.push({
                        name: nameStr,
                        class: className || grade,
                        category: category,
                        grade: grade,
                        gender: gender,
                        test_date: testDate,
                        score: mainScore,
                        scores: scores
                    });
                }
            }
        }

        return this.filterLatestAndSort(allRecords);
    }

    /**
     * Helper to filter records to keep only the latest per student, and sort by score desc.
     */
    static filterLatestAndSort(allRecords) {
        const latest = {};
        for (const rec of allRecords) {
            const name = rec.name;
            if (!latest[name]) {
                latest[name] = rec;
            } else {
                const existingDate = latest[name].test_date;
                const newDate = rec.test_date;
                if (newDate !== null) {
                    if (existingDate === null || newDate > existingDate) {
                        latest[name] = rec;
                    }
                }
            }
        }

        const rankingData = Object.values(latest);

        for (const item of rankingData) {
            delete item.test_date;
            delete item.grade;
            delete item.gender;
        }

        rankingData.sort((a, b) => b.score - a.score);

        return rankingData;
    }
}


