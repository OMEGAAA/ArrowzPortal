/* =========================================================
   ARROWZ Comparison - js/comparison.js
   ========================================================= */

/* 1) METRICS */
const METRICS = {
    vmax: { cat: "瞬発力", name: "最高速度", unit: "km/h", higherIsBetter: true, step: 0.01, desc: "トップスピード", coach: "20m全力×6本（休2分）。フォーム優先で速く走る日を作る。" },
    vdec: { cat: "瞬発力", name: "速度維持率", unit: "", higherIsBetter: true, step: 0.0001, desc: "速度の落ちにくさ（比率）", coach: "分割走（30m+30m）×4本（休2分）。前半を出し切り、後半は腕振りで維持。", hint: "比率（0〜1）で入力" },
    sprint_score: { cat: "瞬発力", name: "スプリントスコア", unit: "点", higherIsBetter: true, step: 1, desc: "走力の総合指標", coach: "加速・最高速・維持を分けて刺激。週2回の短時間でOK。" },
    pro: { cat: "瞬発力", name: "切り返し走", unit: "秒", higherIsBetter: false, step: 0.001, desc: "切り返しの速さ（小さいほど良い）", coach: "減速姿勢→切り返し→1歩目加速。止まる練習が先。" },
    dva: { cat: "視力", name: "動体視力", unit: "ランク", higherIsBetter: true, step: 0.01, desc: "動く物を捉える力", coach: "ボール落下キャッチ：10回×3セット（片手も混ぜる）。" },
    eye: { cat: "視力", name: "眼球運動", unit: "ランク", higherIsBetter: true, step: 0.01, desc: "視線移動（サッケード）の質", coach: "上下左右サッケード：各20回×2セット（頭固定）。" },
    peri: { cat: "視力", name: "周辺視", unit: "ランク", higherIsBetter: true, step: 0.01, desc: "周辺情報の処理", coach: "正面固定＋周辺刺激（指/カード）：30秒×4本。" },
    flash: { cat: "視力", name: "瞬間視", unit: "ランク", higherIsBetter: true, step: 0.01, desc: "一瞬で情報を読む力", coach: "フラッシュカード：10〜20枚×3セット（速さより正確さ）。" },
    arrowz_eye_total: { cat: "視力", name: "ArrowzEye合計値", unit: "", higherIsBetter: true, step: 0.01, desc: "視機能の合計（複合）", coach: "弱い視機能2つに絞り、1日3分を毎日。", hint: "合計値で入力" },
    hand_eye: { cat: "視力", name: "目と手の協応動作", unit: "秒", higherIsBetter: false, step: 0.01, desc: "見る→反応→手の操作（低いほど良い）", coach: "ナンバータッチ：30秒×4本（休60秒）。" },
    vj: { cat: "跳躍力", name: "垂直跳び", unit: "cm", higherIsBetter: true, step: 0.01, desc: "垂直方向のパワー", coach: "垂直跳び：3回×5セット（休60〜90秒）。着地は静かに。" },
    sj: { cat: "跳躍力", name: "スクワットジャンプ", unit: "cm", higherIsBetter: true, step: 0.01, desc: "反動なし出力", coach: "2秒止めてから跳ぶ：3回×5セット（休60〜90秒）。" },
    contact_time: { cat: "跳躍力", name: "接地時間", unit: "秒", higherIsBetter: false, step: 0.0001, desc: "接地が短いほど良い", coach: "ポゴジャンプ：10秒×6本（休60秒）。弾むを最優先。" },
    jump_height: { cat: "跳躍力", name: "跳躍高", unit: "cm", higherIsBetter: true, step: 0.01, desc: "反動ジャンプの高さ", coach: "CMJ：3回×5セット。沈み込みは浅く速く。" },
    rj_index: { cat: "跳躍力", name: "RJ-index", unit: "", higherIsBetter: true, step: 0.0001, desc: "反発効率（高いほど良い）", coach: "連続CMJ：5回×4セット（休90秒）。接地を短く。" },
    broad_jump: { cat: "跳躍力", name: "立ち幅跳び", unit: "cm", higherIsBetter: true, step: 0.01, desc: "水平パワー", coach: "立ち幅跳び：3回×5セット。腕振りと股関節で前へ。" },
    stepping: { cat: "跳躍力", name: "ステッピング", unit: "回", higherIsBetter: true, step: 1, desc: "脚回転・リズム", coach: "高速もも上げ：10秒×8本（休60秒）。姿勢を崩さない。" },
};

/* 2) Training DB */
const TRAINING_DB = {
    vmax: ["20m加速走：20m×6本（休2分）／前傾→3歩目まで強く。", "流し＋全力：60m（流し40m→全力20m）×4本（休2分）。", "フォーム：腕振りドリル30秒×4本（休30秒）。"],
    vdec: ["分割走：30m+30m×4本（休2分）／後半は腕振りで維持。", "テンポ走：100m×6本（70%・休45秒）／リズムを作る。", "体幹：プランク30秒×3セット（呼吸止めない）。"],
    sprint_score: ["加速（0-10m）：10m×8本（休60〜90秒）。", "最高速（フライング）：助走20m＋全力20m×5本（休2分）。", "維持（スプリント間欠）：20m×10本（休30秒）※フォーム崩れたら中止。"],
    pro: ["減速ドリル：5mで止まる×8回（左右）／腰を落とす前に胸を立てる。", "ミラードリル：15秒×6本（休45秒）／相手を見て反応。", "Run-Shuffle-Run：10m→シャッフル→10m×6本（休60秒）。"],
    dva: ["ボール落下キャッチ：10回×3セット（片手も）。", "指追い：左右30秒×3本（頭固定）。", "見る→反応：合図でタップ（音/合図）30秒×4本。"],
    eye: ["上下左右サッケード：各20回×2セット（頭固定）。", "遠近交代：近い点→遠い点を交互に30秒×4本。", "8の字追跡：30秒×3本（滑らかに）。"],
    peri: ["正面固定＋周辺カード読み：30秒×4本。", "両手親指トレ（視線固定）：30秒×4本。", "ボールキャッチ（周辺意識）：20回×2セット。"],
    flash: ["フラッシュカード：10〜20枚×3セット（正確さ優先）。", "ストップウォッチ瞬間読み：10回×3セット。", "数字列（3〜5桁）瞬間記憶：10回×2セット。"],
    arrowz_eye_total: ["弱い視機能2つを抽出して毎日3分。（例：周辺視＋瞬間視）", "観察→反応：30秒×4本（休45秒）を週3回。", "スポーツ観戦：見るポイントを決めて5分（目線移動を意識）。"],
    hand_eye: ["ナンバータッチ：30秒×4本／ミス0を狙う。", "ボール2個キャッチ：10回×3セット（落としてOK）。", "壁当てキャッチ：30秒×4本（休45秒）。"],
    vj: ["垂直跳び：3回×5セット（休60〜90秒）。", "ジャンプスクワット：5回×4セット（軽く）。", "ヒップヒンジ練習：10回×3セット（股関節主導）。"],
    sj: ["2秒止めSJ：3回×5セット（休60〜90秒）。", "スクワット：6回×3セット（フォーム最優先）。", "カーフレイズ：15回×3セット（膝伸ばし/曲げ）。"],
    contact_time: ["ポゴジャンプ：10秒×6本（休60秒）／接地短く。", "縄跳び：30秒×5本（休45秒）。", "ショートフット：20秒×3本（足裏アーチ）。"],
    jump_height: ["CMJ：3回×5セット（沈み込み浅く速く）。", "腕振りドリル：10回×3セット（タイミング）。", "ヒップスラスト：8回×3セット。"],
    rj_index: ["連続CMJ：5回×4セット（休90秒）。", "ポゴ→連続CMJ：10秒ポゴ→3回CMJ×4セット。", "片脚ポゴ：10秒×左右3本（休60秒）。"],
    broad_jump: ["立ち幅跳び：3回×5セット（休60秒）。", "バンザイ腸腰筋：左右10回×2セット（股関節を速く）。", "ヒップヒンジ：10回×3セット（前へ飛ぶ準備）。"],
    stepping: ["高速もも上げ：10秒×8本（休60秒）。", "Aスキップ（軽）：20m×6本（休60秒）。", "リズムジャンプ：20回×3セット（テンポ一定）。"],
};

/* 3) National DB */
const NATIONAL_DB_GRADE = { "M": { "小1": { "vmax": { "mean": 16.49, "sd": 1.86 }, "vdec": { "mean": 0.894, "sd": 0.044 }, "sprint_score": { "mean": 441.66, "sd": 87.28 }, "pro": { "mean": 8.39, "sd": 0.83 }, "dva": { "mean": 4.31, "sd": 1.82 }, "eye": { "mean": 6.74, "sd": 2.59 }, "peri": { "mean": 4.18, "sd": 2.31 }, "flash": { "mean": 3.73, "sd": 1.99 }, "arrowz_eye_total": { "mean": 18.81, "sd": 6.47 }, "hand_eye": { "mean": 58.94, "sd": 6.48 }, "vj": { "mean": 17.51, "sd": 3.82 }, "sj": { "mean": 16.21, "sd": 3.53 }, "contact_time": { "mean": 0.19, "sd": 0.032 }, "jump_height": { "mean": 14.55, "sd": 17.86 }, "rj_index": { "mean": 0.673, "sd": 0.218 }, "broad_jump": { "mean": 126.94, "sd": 18.79 }, "stepping": { "mean": 45.80, "sd": 7.00 } }, "小2": { "vmax": { "mean": 18.24, "sd": 1.98 }, "vdec": { "mean": 0.896, "sd": 0.032 }, "sprint_score": { "mean": 475.06, "sd": 78.62 }, "pro": { "mean": 7.73, "sd": 0.70 }, "dva": { "mean": 5.89, "sd": 1.84 }, "eye": { "mean": 7.77, "sd": 2.41 }, "peri": { "mean": 6.65, "sd": 2.10 }, "flash": { "mean": 5.47, "sd": 2.10 }, "arrowz_eye_total": { "mean": 25.63, "sd": 5.93 }, "hand_eye": { "mean": 52.44, "sd": 5.51 }, "vj": { "mean": 19.96, "sd": 3.88 }, "sj": { "mean": 18.80, "sd": 3.87 }, "contact_time": { "mean": 0.186, "sd": 0.027 }, "jump_height": { "mean": 14.99, "sd": 3.89 }, "rj_index": { "mean": 0.834, "sd": 0.281 }, "broad_jump": { "mean": 138.01, "sd": 16.08 }, "stepping": { "mean": 49.57, "sd": 5.70 } }, "小3": { "vmax": { "mean": 19.46, "sd": 1.94 }, "vdec": { "mean": 0.894, "sd": 0.034 }, "sprint_score": { "mean": 498.90, "sd": 79.94 }, "pro": { "mean": 7.56, "sd": 0.73 }, "dva": { "mean": 6.07, "sd": 1.73 }, "eye": { "mean": 8.59, "sd": 1.96 }, "peri": { "mean": 6.84, "sd": 2.31 }, "flash": { "mean": 5.78, "sd": 2.21 }, "arrowz_eye_total": { "mean": 27.16, "sd": 5.76 }, "hand_eye": { "mean": 50.51, "sd": 5.41 }, "vj": { "mean": 21.09, "sd": 4.22 }, "sj": { "mean": 19.92, "sd": 4.01 }, "contact_time": { "mean": 0.188, "sd": 0.032 }, "jump_height": { "mean": 15.58, "sd": 3.85 }, "rj_index": { "mean": 0.857, "sd": 0.296 }, "broad_jump": { "mean": 141.98, "sd": 17.66 }, "stepping": { "mean": 50.65, "sd": 6.62 } }, "小4": { "vmax": { "mean": 20.99, "sd": 1.97 }, "vdec": { "mean": 0.890, "sd": 0.035 }, "sprint_score": { "mean": 513.02, "sd": 83.13 }, "pro": { "mean": 7.23, "sd": 0.63 }, "dva": { "mean": 6.73, "sd": 1.73 }, "eye": { "mean": 9.14, "sd": 1.54 }, "peri": { "mean": 7.59, "sd": 1.96 }, "flash": { "mean": 6.73, "sd": 2.11 }, "arrowz_eye_total": { "mean": 30.26, "sd": 4.98 }, "hand_eye": { "mean": 46.75, "sd": 5.87 }, "vj": { "mean": 23.17, "sd": 4.50 }, "sj": { "mean": 21.94, "sd": 4.57 }, "contact_time": { "mean": 0.187, "sd": 0.034 }, "jump_height": { "mean": 17.57, "sd": 4.23 }, "rj_index": { "mean": 0.981, "sd": 0.320 }, "broad_jump": { "mean": 153.52, "sd": 18.14 }, "stepping": { "mean": 52.72, "sd": 6.86 } }, "小5": { "vmax": { "mean": 22.20, "sd": 2.03 }, "vdec": { "mean": 0.896, "sd": 0.031 }, "sprint_score": { "mean": 547.97, "sd": 78.60 }, "pro": { "mean": 7.06, "sd": 0.60 }, "dva": { "mean": 6.87, "sd": 1.71 }, "eye": { "mean": 9.24, "sd": 1.37 }, "peri": { "mean": 7.42, "sd": 2.28 }, "flash": { "mean": 6.80, "sd": 2.11 }, "arrowz_eye_total": { "mean": 30.31, "sd": 5.95 }, "hand_eye": { "mean": 44.79, "sd": 5.58 }, "vj": { "mean": 25.14, "sd": 4.90 }, "sj": { "mean": 23.56, "sd": 5.21 }, "contact_time": { "mean": 0.184, "sd": 0.025 }, "jump_height": { "mean": 19.04, "sd": 4.64 }, "rj_index": { "mean": 1.075, "sd": 0.354 }, "broad_jump": { "mean": 161.23, "sd": 19.90 }, "stepping": { "mean": 53.16, "sd": 8.04 } }, "小6": { "vmax": { "mean": 23.81, "sd": 2.29 }, "vdec": { "mean": 0.893, "sd": 0.045 }, "sprint_score": { "mean": 576.14, "sd": 93.87 }, "pro": { "mean": 6.85, "sd": 0.58 }, "dva": { "mean": 7.28, "sd": 1.66 }, "eye": { "mean": 9.43, "sd": 1.27 }, "peri": { "mean": 7.94, "sd": 1.98 }, "flash": { "mean": 7.51, "sd": 1.96 }, "arrowz_eye_total": { "mean": 32.35, "sd": 4.89 }, "hand_eye": { "mean": 42.29, "sd": 5.26 }, "vj": { "mean": 27.29, "sd": 5.38 }, "sj": { "mean": 25.74, "sd": 5.62 }, "contact_time": { "mean": 0.187, "sd": 0.029 }, "jump_height": { "mean": 21.22, "sd": 5.38 }, "rj_index": { "mean": 1.182, "sd": 0.374 }, "broad_jump": { "mean": 171.70, "sd": 20.41 }, "stepping": { "mean": 53.79, "sd": 8.12 } }, "中1": { "vmax": { "mean": 25.77, "sd": 2.58 }, "vdec": { "mean": 0.903, "sd": 0.029 }, "sprint_score": { "mean": 633.46, "sd": 82.92 }, "pro": { "mean": 6.59, "sd": 0.57 }, "dva": { "mean": 7.09, "sd": 1.68 }, "eye": { "mean": 9.31, "sd": 1.40 }, "peri": { "mean": 7.71, "sd": 2.12 }, "flash": { "mean": 7.52, "sd": 2.08 }, "arrowz_eye_total": { "mean": 31.33, "sd": 5.61 }, "hand_eye": { "mean": 41.62, "sd": 4.85 }, "vj": { "mean": 30.72, "sd": 5.79 }, "sj": { "mean": 29.01, "sd": 5.83 }, "contact_time": { "mean": 0.182, "sd": 0.027 }, "jump_height": { "mean": 23.53, "sd": 5.61 }, "rj_index": { "mean": 1.334, "sd": 0.405 }, "broad_jump": { "mean": 187.74, "sd": 22.95 }, "stepping": { "mean": 55.42, "sd": 9.09 } }, "中2": { "vmax": { "mean": 28.13, "sd": 2.84 }, "vdec": { "mean": 0.908, "sd": 0.027 }, "sprint_score": { "mean": 688.04, "sd": 70.25 }, "pro": { "mean": 6.31, "sd": 0.56 }, "dva": { "mean": 7.20, "sd": 1.52 }, "eye": { "mean": 9.36, "sd": 1.32 }, "peri": { "mean": 7.83, "sd": 2.03 }, "flash": { "mean": 7.65, "sd": 2.06 }, "arrowz_eye_total": { "mean": 31.89, "sd": 4.85 }, "hand_eye": { "mean": 39.89, "sd": 4.72 }, "vj": { "mean": 34.15, "sd": 6.46 }, "sj": { "mean": 32.22, "sd": 6.14 }, "contact_time": { "mean": 0.178, "sd": 0.020 }, "jump_height": { "mean": 26.55, "sd": 6.02 }, "rj_index": { "mean": 1.531, "sd": 0.440 }, "broad_jump": { "mean": 204.79, "sd": 24.56 }, "stepping": { "mean": 56.16, "sd": 8.61 } }, "中3": { "vmax": { "mean": 29.95, "sd": 2.24 }, "vdec": { "mean": 0.903, "sd": 0.027 }, "sprint_score": { "mean": 712.83, "sd": 66.54 }, "pro": { "mean": 6.10, "sd": 0.45 }, "dva": { "mean": 7.15, "sd": 1.54 }, "eye": { "mean": 9.44, "sd": 1.18 }, "peri": { "mean": 7.64, "sd": 2.01 }, "flash": { "mean": 7.73, "sd": 1.93 }, "arrowz_eye_total": { "mean": 32.10, "sd": 4.17 }, "hand_eye": { "mean": 40.13, "sd": 5.08 }, "vj": { "mean": 38.21, "sd": 6.39 }, "sj": { "mean": 36.58, "sd": 6.48 }, "contact_time": { "mean": 0.179, "sd": 0.019 }, "jump_height": { "mean": 28.88, "sd": 5.97 }, "rj_index": { "mean": 1.657, "sd": 0.444 }, "broad_jump": { "mean": 219.01, "sd": 21.48 }, "stepping": { "mean": 58.90, "sd": 9.24 } } }, "F": { "小1": { "vmax": { "mean": 15.60, "sd": 1.69 }, "vdec": { "mean": 0.896, "sd": 0.033 }, "sprint_score": { "mean": 441.75, "sd": 80.60 }, "pro": { "mean": 8.77, "sd": 1.00 }, "dva": { "mean": 4.09, "sd": 1.32 }, "eye": { "mean": 6.04, "sd": 2.60 }, "peri": { "mean": 4.22, "sd": 2.00 }, "flash": { "mean": 3.22, "sd": 1.64 }, "arrowz_eye_total": { "mean": 17.47, "sd": 5.57 }, "hand_eye": { "mean": 59.57, "sd": 6.25 }, "vj": { "mean": 16.82, "sd": 3.38 }, "sj": { "mean": 16.15, "sd": 3.48 }, "contact_time": { "mean": 0.192, "sd": 0.041 }, "jump_height": { "mean": 12.66, "sd": 3.50 }, "rj_index": { "mean": 0.700, "sd": 0.264 }, "broad_jump": { "mean": 120.55, "sd": 13.04 }, "stepping": { "mean": 45.77, "sd": 6.27 } }, "小2": { "vmax": { "mean": 17.40, "sd": 2.47 }, "vdec": { "mean": 0.894, "sd": 0.031 }, "sprint_score": { "mean": 468.46, "sd": 91.93 }, "pro": { "mean": 7.96, "sd": 0.67 }, "dva": { "mean": 5.51, "sd": 1.50 }, "eye": { "mean": 8.05, "sd": 2.02 }, "peri": { "mean": 6.93, "sd": 2.20 }, "flash": { "mean": 4.68, "sd": 2.19 }, "arrowz_eye_total": { "mean": 25.13, "sd": 4.68 }, "hand_eye": { "mean": 53.41, "sd": 5.72 }, "vj": { "mean": 19.17, "sd": 4.56 }, "sj": { "mean": 18.18, "sd": 4.50 }, "contact_time": { "mean": 0.189, "sd": 0.035 }, "jump_height": { "mean": 15.98, "sd": 4.34 }, "rj_index": { "mean": 0.898, "sd": 0.338 }, "broad_jump": { "mean": 133.46, "sd": 18.50 }, "stepping": { "mean": 49.98, "sd": 5.12 } }, "小3": { "vmax": { "mean": 18.74, "sd": 1.96 }, "vdec": { "mean": 0.896, "sd": 0.034 }, "sprint_score": { "mean": 501.66, "sd": 78.89 }, "pro": { "mean": 7.76, "sd": 0.73 }, "dva": { "mean": 6.05, "sd": 1.72 }, "eye": { "mean": 8.72, "sd": 1.84 }, "peri": { "mean": 6.90, "sd": 2.35 }, "flash": { "mean": 5.76, "sd": 2.23 }, "arrowz_eye_total": { "mean": 27.38, "sd": 6.57 }, "hand_eye": { "mean": 49.89, "sd": 4.98 }, "vj": { "mean": 21.37, "sd": 5.15 }, "sj": { "mean": 19.92, "sd": 4.88 }, "contact_time": { "mean": 0.188, "sd": 0.025 }, "jump_height": { "mean": 16.52, "sd": 4.75 }, "rj_index": { "mean": 0.913, "sd": 0.340 }, "broad_jump": { "mean": 141.59, "sd": 18.65 }, "stepping": { "mean": 51.07, "sd": 6.49 } }, "小4": { "vmax": { "mean": 20.30, "sd": 2.10 }, "vdec": { "mean": 0.892, "sd": 0.035 }, "sprint_score": { "mean": 527.70, "sd": 74.61 }, "pro": { "mean": 7.62, "sd": 0.57 }, "dva": { "mean": 6.42, "sd": 1.50 }, "eye": { "mean": 9.17, "sd": 1.38 }, "peri": { "mean": 7.35, "sd": 2.02 }, "flash": { "mean": 6.50, "sd": 2.22 }, "arrowz_eye_total": { "mean": 29.37, "sd": 6.12 }, "hand_eye": { "mean": 46.46, "sd": 4.84 }, "vj": { "mean": 22.34, "sd": 4.24 }, "sj": { "mean": 21.17, "sd": 4.22 }, "contact_time": { "mean": 3.067, "sd": 23.76 }, "jump_height": { "mean": 18.38, "sd": 3.94 }, "rj_index": { "mean": 1.016, "sd": 0.303 }, "broad_jump": { "mean": 147.07, "sd": 18.15 }, "stepping": { "mean": 53.07, "sd": 6.24 } }, "小5": { "vmax": { "mean": 21.46, "sd": 2.27 }, "vdec": { "mean": 0.896, "sd": 0.030 }, "sprint_score": { "mean": 562.54, "sd": 85.19 }, "pro": { "mean": 7.34, "sd": 0.56 }, "dva": { "mean": 6.64, "sd": 1.42 }, "eye": { "mean": 9.53, "sd": 0.98 }, "peri": { "mean": 7.83, "sd": 1.97 }, "flash": { "mean": 6.80, "sd": 2.05 }, "arrowz_eye_total": { "mean": 30.32, "sd": 5.92 }, "hand_eye": { "mean": 44.97, "sd": 6.46 }, "vj": { "mean": 23.73, "sd": 4.22 }, "sj": { "mean": 22.12, "sd": 3.87 }, "contact_time": { "mean": 0.188, "sd": 0.024 }, "jump_height": { "mean": 19.07, "sd": 4.03 }, "rj_index": { "mean": 1.038, "sd": 0.302 }, "broad_jump": { "mean": 156.49, "sd": 17.79 }, "stepping": { "mean": 51.84, "sd": 7.39 } }, "小6": { "vmax": { "mean": 23.63, "sd": 2.34 }, "vdec": { "mean": 0.898, "sd": 0.033 }, "sprint_score": { "mean": 604.73, "sd": 73.25 }, "pro": { "mean": 7.00, "sd": 0.55 }, "dva": { "mean": 6.66, "sd": 1.53 }, "eye": { "mean": 9.34, "sd": 1.35 }, "peri": { "mean": 7.56, "sd": 2.29 }, "flash": { "mean": 7.32, "sd": 2.00 }, "arrowz_eye_total": { "mean": 31.21, "sd": 4.86 }, "hand_eye": { "mean": 42.92, "sd": 5.58 }, "vj": { "mean": 26.12, "sd": 4.43 }, "sj": { "mean": 24.44, "sd": 4.40 }, "contact_time": { "mean": 0.188, "sd": 0.021 }, "jump_height": { "mean": 21.11, "sd": 4.02 }, "rj_index": { "mean": 1.153, "sd": 0.312 }, "broad_jump": { "mean": 167.60, "sd": 16.10 }, "stepping": { "mean": 53.92, "sd": 6.81 } }, "中1": { "vmax": { "mean": 24.87, "sd": 2.45 }, "vdec": { "mean": 0.899, "sd": 0.028 }, "sprint_score": { "mean": 635.71, "sd": 76.55 }, "pro": { "mean": 6.89, "sd": 0.46 }, "dva": { "mean": 6.91, "sd": 1.65 }, "eye": { "mean": 9.55, "sd": 1.01 }, "peri": { "mean": 7.82, "sd": 2.25 }, "flash": { "mean": 7.57, "sd": 2.43 }, "arrowz_eye_total": { "mean": 32.29, "sd": 5.10 }, "hand_eye": { "mean": 41.84, "sd": 5.81 }, "vj": { "mean": 28.32, "sd": 4.96 }, "sj": { "mean": 26.73, "sd": 5.01 }, "contact_time": { "mean": 0.178, "sd": 0.021 }, "jump_height": { "mean": 23.32, "sd": 5.22 }, "rj_index": { "mean": 1.342, "sd": 0.400 }, "broad_jump": { "mean": 178.21, "sd": 19.92 }, "stepping": { "mean": 55.81, "sd": 6.95 } }, "中2": { "vmax": { "mean": 25.25, "sd": 2.46 }, "vdec": { "mean": 0.906, "sd": 0.025 }, "sprint_score": { "mean": 660.39, "sd": 66.79 }, "pro": { "mean": 6.82, "sd": 0.61 }, "dva": { "mean": 6.85, "sd": 1.50 }, "eye": { "mean": 9.85, "sd": 0.35 }, "peri": { "mean": 8.55, "sd": 1.46 }, "flash": { "mean": 7.76, "sd": 1.44 }, "arrowz_eye_total": { "mean": 30.93, "sd": 7.15 }, "hand_eye": { "mean": 41.00, "sd": 5.13 }, "vj": { "mean": 29.20, "sd": 5.04 }, "sj": { "mean": 27.81, "sd": 4.99 }, "contact_time": { "mean": 0.178, "sd": 0.020 }, "jump_height": { "mean": 24.09, "sd": 4.50 }, "rj_index": { "mean": 1.388, "sd": 0.340 }, "broad_jump": { "mean": 182.25, "sd": 17.61 }, "stepping": { "mean": 56.22, "sd": 6.99 } }, "中3": { "vmax": { "mean": 25.77, "sd": 2.76 }, "vdec": { "mean": 0.902, "sd": 0.031 }, "sprint_score": { "mean": 662.00, "sd": 90.05 }, "pro": { "mean": 6.67, "sd": 0.56 }, "dva": { "mean": 6.00, "sd": 1.52 }, "eye": { "mean": 9.15, "sd": 1.53 }, "peri": { "mean": 7.85, "sd": 2.09 }, "flash": { "mean": 7.39, "sd": 2.27 }, "arrowz_eye_total": { "mean": 30.23, "sd": 4.84 }, "hand_eye": { "mean": 40.79, "sd": 5.34 }, "vj": { "mean": 28.98, "sd": 5.68 }, "sj": { "mean": 27.88, "sd": 5.29 }, "contact_time": { "mean": 0.183, "sd": 0.025 }, "jump_height": { "mean": 24.82, "sd": 5.78 }, "rj_index": { "mean": 1.410, "sd": 0.443 }, "broad_jump": { "mean": 186.64, "sd": 21.22 }, "stepping": { "mean": 56.57, "sd": 6.56 } } } };

/* 4) Math */
function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}
function normalCDF(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }
function fmt(n, d = 2) { return Number.isFinite(n) ? n.toFixed(d) : "—"; }
function fmtSigned(n, d = 2) {
    if (!Number.isFinite(n)) return "—";
    const s = n > 0 ? "+" : (n < 0 ? "−" : "±");
    return `${s}${Math.abs(n).toFixed(d)}`;
}
function unitSuffix(u) { return u ? ` ${u}` : ""; }

/* 5) UI */
const sexSel = document.getElementById("sex");
const gradeSel = document.getElementById("grade");
const filterCat = document.getElementById("filterCat");
const sortModeSel = document.getElementById("sortMode");
const inputList = document.getElementById("inputList");
const warnBox = document.getElementById("warnBox");
const bucketText = document.getElementById("bucketText");
const resultEmpty = document.getElementById("resultEmpty");
const resultList = document.getElementById("resultList");
const summaryTags = document.getElementById("summaryTags");
const radarWrap = document.getElementById("radarWrap");
const radarCanvas = document.getElementById("radar");
const radarHint = document.getElementById("radarHint");
const trainBox = document.getElementById("trainBox");
const trainListEl = document.getElementById("trainList");

const ALL_CATS = ["すべて", ...Array.from(new Set(Object.values(METRICS).map(m => m.cat)))];

function showWarn(msg) { warnBox.style.display = "block"; warnBox.textContent = msg; }
function hideWarn() { warnBox.style.display = "none"; warnBox.textContent = ""; }

function buildGradeOptionsBySex(sex) {
    gradeSel.innerHTML = "";
    const grades = Object.keys(NATIONAL_DB_GRADE?.[sex] || {});
    for (const g of grades) {
        const op = document.createElement("option");
        op.value = g; op.textContent = g;
        gradeSel.appendChild(op);
    }
}
function buildFilterCats() {
    filterCat.innerHTML = "";
    for (const c of ALL_CATS) {
        const op = document.createElement("option");
        op.value = c; op.textContent = c;
        filterCat.appendChild(op);
    }
}
function getActiveMetricKeys(sex, grade) {
    const row = NATIONAL_DB_GRADE?.[sex]?.[grade];
    if (!row) return [];
    const keys = Object.keys(row).filter(k => METRICS[k]);
    return Object.keys(METRICS).filter(k => keys.includes(k));
}
function buildInputList() {
    inputList.innerHTML = "";
    const sex = sexSel.value;
    const grade = gradeSel.value;
    const keys = getActiveMetricKeys(sex, grade);
    const catFilter = filterCat.value;
    const shownKeys = keys.filter(k => catFilter === "すべて" ? true : METRICS[k].cat === catFilter);
    if (shownKeys.length === 0) {
        inputList.innerHTML = `<div class="comp-mini">この条件に表示できる種目がありません。</div>`;
        return;
    }
    for (const key of shownKeys) {
        const m = METRICS[key];
        const item = document.createElement("div");
        item.className = "comp-item";
        item.dataset.key = key;
        item.innerHTML = `
      <div class="comp-itemTop">
        <div class="comp-itemName">${m.name}${m.unit ? ` <span style="color:var(--text-muted)">(${m.unit})</span>` : ""}</div>
        <div class="comp-itemMeta">${m.cat} ／ ${m.higherIsBetter ? "高いほど良い" : "低いほど良い"}${m.hint ? ` ／ ${m.hint}` : ""}</div>
      </div>
      <div class="comp-itemGrid">
        <div class="comp-mini">${m.desc || ""}</div>
        <input class="val" inputmode="decimal" type="number" step="${m.step ?? 0.01}" placeholder="数値" />
      </div>
    `;
        inputList.appendChild(item);
    }
}

function judgeByTop(top) {
    if (top <= 30) return { cls: "comp-good", txt: "良い（上位）" };
    if (top <= 60) return { cls: "comp-mid", txt: "標準域" };
    return { cls: "comp-low", txt: "要強化（下位）" };
}
function renderSummary(results) {
    summaryTags.innerHTML = "";
    const mk = (label, val) => {
        const t = document.createElement("div");
        t.className = "comp-tag";
        t.innerHTML = `${label}：<b>${val}</b>`;
        return t;
    };
    const n = results.length;
    const avgScore = n ? results.reduce((a, r) => a + r.score, 0) / n : 0;
    const worst = n ? [...results].sort((a, b) => a.score - b.score)[0] : null;
    const best = n ? [...results].sort((a, b) => b.score - a.score)[0] : null;
    summaryTags.appendChild(mk("入力数", `${n}`));
    summaryTags.appendChild(mk("平均スコア", `${fmt(avgScore, 1)}`));
    if (best) summaryTags.appendChild(mk("強み", best.name));
    if (worst) summaryTags.appendChild(mk("伸びしろ", worst.name));
}
function sortResults(results) {
    const mode = sortModeSel.value;
    const catOrder = (cat) => ALL_CATS.indexOf(cat);
    const arr = [...results];
    if (mode === "score_desc") return arr.sort((a, b) => b.score - a.score);
    if (mode === "top_asc") return arr.sort((a, b) => a.top - b.top);
    if (mode === "cat_then_score") return arr.sort((a, b) => {
        const ca = catOrder(a.cat), cb = catOrder(b.cat);
        if (ca !== cb) return ca - cb;
        return b.score - a.score;
    });
    return arr;
}
function renderResults(results) {
    resultList.innerHTML = "";
    if (results.length === 0) {
        resultEmpty.style.display = "block";
        resultList.style.display = "none";
        return;
    }
    resultEmpty.style.display = "none";
    resultList.style.display = "block";
    for (const r of results) {
        const judge = judgeByTop(r.top);
        const diffClass = r.diffRaw >= 0 ? "comp-deltaPos" : "comp-deltaNeg";
        const details = document.createElement("details");
        details.className = "comp-res";
        details.innerHTML = `
      <summary>
        <div class="comp-sumLeft">
          <div class="comp-sumName">${r.name}${r.unit ? ` <span style="color:var(--text-muted)">(${r.unit})</span>` : ""}</div>
          <div class="comp-sumSmall">${r.cat} ／ 上位％ ${fmt(r.top, 1)}% ／ Z ${fmt(r.z, 2)}</div>
          <div class="comp-bar"><div class="comp-barFill" style="width:${r.score}%;"></div></div>
        </div>
        <div class="comp-sumRight">
          <div class="comp-badge"><span class="comp-dot ${judge.cls}"></span><span>${judge.txt}</span></div>
          <div class="comp-scoreNum">スコア ${fmt(r.score, 1)}</div>
        </div>
      </summary>
      <div class="comp-tagRow">
        <div class="comp-tag">測定値：<b>${r.value}${unitSuffix(r.unit)}</b></div>
        <div class="comp-tag">全国平均：<b>${fmt(r.mean, 4)}${unitSuffix(r.unit)}</b></div>
        <div class="comp-tag">SD：<b>${fmt(r.sd, 4)}${unitSuffix(r.unit)}</b></div>
        <div class="comp-tag">方向：<b>${r.higherIsBetter ? "高いほど良い" : "低いほど良い"}</b></div>
      </div>
      <div class="comp-hr"></div>
      <div class="comp-tagRow">
        <div class="comp-tag">全国平均との差：<b class="${diffClass}">${fmtSigned(r.diffRaw, 4)}${unitSuffix(r.unit)}</b></div>
        <div class="comp-tag">上位％：<b>${fmt(r.top, 1)}%</b></div>
      </div>
      <div class="comp-note">
        <b>指標：</b>${r.desc || "—"}<br>
        <b>次の一手：</b>${r.coach || "—"}<br>
      </div>
    `;
        resultList.appendChild(details);
    }
}

/* 6) Radar */
function radarNormalize(value, mean, sd, higherIsBetter, fallbackScore) {
    const eps = 1e-9;
    if (!isFinite(mean) || !isFinite(sd) || sd <= eps) return clamp(fallbackScore, 0, 100);
    const lo = mean - 2 * sd;
    const hi = mean + 2 * sd;
    const denom = (hi - lo);
    if (!isFinite(denom) || Math.abs(denom) <= eps) return clamp(fallbackScore, 0, 100);
    const t = higherIsBetter ? ((value - lo) / denom) : ((hi - value) / denom);
    return clamp(t * 100, 0, 100);
}
function drawRadarMulti(canvas, labels, series) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) * 0.33;
    ctx.lineWidth = 1;
    for (let s = 1; s <= 5; s++) {
        const rr = r * (s / 5);
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
            const a = (Math.PI * 2 * i / labels.length) - Math.PI / 2;
            const x = cx + rr * Math.cos(a);
            const y = cy + rr * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.stroke();
    }
    for (let i = 0; i < labels.length; i++) {
        const a = (Math.PI * 2 * i / labels.length) - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
        ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.stroke();
        const tx = cx + (r + 34) * Math.cos(a);
        const ty = cy + (r + 34) * Math.sin(a);
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.font = "900 16px Oswald, Noto Sans JP, sans-serif";
        ctx.textAlign = (Math.cos(a) > 0.2) ? "left" : (Math.cos(a) < -0.2 ? "right" : "center");
        ctx.textBaseline = (Math.sin(a) > 0.2) ? "top" : (Math.sin(a) < -0.2 ? "bottom" : "middle");
        ctx.fillText(labels[i], tx, ty);
    }
    for (const s of series) {
        const values = s.values;
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
            const val = clamp(values[i], 0, 100);
            const rr = r * (val / 100);
            const a = (Math.PI * 2 * i / labels.length) - Math.PI / 2;
            const x = cx + rr * Math.cos(a);
            const y = cy + rr * Math.sin(a);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = s.fill;
        ctx.strokeStyle = s.stroke;
        ctx.lineWidth = s.width;
        if (s.fill) ctx.fill();
        ctx.stroke();
        if (s.point && s.point > 0) {
            for (let i = 0; i < labels.length; i++) {
                const val = clamp(values[i], 0, 100);
                const rr = r * (val / 100);
                const a = (Math.PI * 2 * i / labels.length) - Math.PI / 2;
                const x = cx + rr * Math.cos(a);
                const y = cy + rr * Math.sin(a);
                ctx.beginPath(); ctx.arc(x, y, s.point, 0, Math.PI * 2);
                ctx.fillStyle = s.stroke; ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.stroke();
            }
        }
    }
}

/* 7) Training */
function renderLow3Training(results) {
    const low3 = [...results].sort((a, b) => a.score - b.score).slice(0, 3);
    if (low3.length < 1) { trainBox.style.display = "none"; trainListEl.innerHTML = ""; return; }
    trainBox.style.display = "block";
    trainListEl.innerHTML = "";
    for (const r of low3) {
        const m = METRICS[r.key];
        const drills = TRAINING_DB[r.key] || [m?.coach || "まずはフォームと頻度を優先。"];
        const div = document.createElement("div");
        div.className = "comp-trainItem";
        div.innerHTML = `
      <div class="comp-trainName">${r.name}${r.unit ? ` <span style="color:var(--text-muted)">(${r.unit})</span>` : ""}</div>
      <div class="comp-trainMeta">${r.cat} ／ 上位％ ${fmt(r.top, 1)}% ／ スコア ${fmt(r.score, 1)}</div>
      <ul class="comp-trainUl">${drills.slice(0, 3).map(x => `<li>${x}</li>`).join("")}</ul>
      <div class="comp-mini" style="margin-top:8px">目安：週2〜4回。短時間で「質を落とさず継続」。</div>
    `;
        trainListEl.appendChild(div);
    }
}

/* 8) Calc */
function calcAll() {
    hideWarn();
    const sex = sexSel.value;
    const grade = gradeSel.value;
    const dbRow = NATIONAL_DB_GRADE?.[sex]?.[grade];
    if (!dbRow) { showWarn("この条件の全国DBがありません。"); return; }
    const keys = getActiveMetricKeys(sex, grade);
    const catFilter = filterCat.value;
    const shownKeys = keys.filter(k => catFilter === "すべて" ? true : METRICS[k].cat === catFilter);
    const inputs = new Map();
    for (const el of inputList.querySelectorAll(".comp-item")) {
        const key = el.dataset.key;
        const inp = el.querySelector("input.val");
        const raw = (inp?.value ?? "").trim();
        if (raw === "") continue;
        const v = Number(raw);
        if (!Number.isFinite(v)) continue;
        inputs.set(key, v);
    }
    if (inputs.size === 0) { showWarn("少なくとも1つの種目に数値を入力してください。"); return; }
    const results = [];
    for (const key of shownKeys) {
        if (!inputs.has(key)) continue;
        const m = METRICS[key];
        const row = dbRow[key];
        if (!m || !row || !Number.isFinite(row.mean) || !Number.isFinite(row.sd) || row.sd <= 0) continue;
        const v = inputs.get(key);
        const mean = row.mean;
        const sd = row.sd;
        const diffRaw = v - mean;
        const zRaw = diffRaw / sd;
        const z = m.higherIsBetter ? zRaw : -zRaw;
        let top = (1 - normalCDF(z)) * 100;
        top = clamp(top, 0, 100);
        const score = 100 - top;
        results.push({
            key, name: m.name, cat: m.cat, unit: m.unit, higherIsBetter: m.higherIsBetter,
            desc: m.desc, coach: m.coach, value: v, mean, sd, diffRaw, z, top, score
        });
    }
    bucketText.textContent = `比較条件：${sex === "M" ? "男性" : "女性"} × ${grade} ／ 表示カテゴリ：${filterCat.value} ／ 入力 ${results.length} 件`;
    renderSummary(results);
    renderResults(sortResults(results));
    const radarItems = results;
    if (radarItems.length >= 3) {
        radarWrap.style.display = "block";
        const labels = radarItems.map(r => r.name);
        const userVals = radarItems.map(r => {
            const m = METRICS[r.key] || {};
            return radarNormalize(r.value, r.mean, r.sd, !!m.higherIsBetter, r.score);
        });
        const avgVals = radarItems.map(_ => 50);
        drawRadarMulti(radarCanvas, labels, [
            { values: avgVals, stroke: "rgba(255,255,255,0.35)", fill: "rgba(255,255,255,0.04)", width: 2, point: 0 },
            { values: userVals, stroke: "rgba(204,255,0,0.85)", fill: "rgba(204,255,0,0.08)", width: 3, point: 5 },
        ]);
        radarHint.textContent = radarItems
            .map(r => `${r.name}: あなた ${fmt(r.value, 2)}${r.unit || ""} / 平均 ${fmt(r.mean, 2)}${r.unit || ""}`)
            .join(" / ");
    } else { radarWrap.style.display = "none"; }
    renderLow3Training(results);
    if (results.length === 0) { showWarn("入力値はありましたが、比較できる種目がありません。"); }
}

/* 9) Init */
buildGradeOptionsBySex(sexSel.value);
buildFilterCats();
buildInputList();

/* 10) Events */
sexSel.addEventListener("change", () => {
    buildGradeOptionsBySex(sexSel.value);
    buildInputList();
    bucketText.textContent = "—"; summaryTags.innerHTML = "";
    resultEmpty.style.display = "block"; resultList.style.display = "none";
    radarWrap.style.display = "none"; trainBox.style.display = "none";
});
gradeSel.addEventListener("change", () => {
    buildInputList();
    bucketText.textContent = "—"; summaryTags.innerHTML = "";
    resultEmpty.style.display = "block"; resultList.style.display = "none";
    radarWrap.style.display = "none"; trainBox.style.display = "none";
});
filterCat.addEventListener("change", () => {
    buildInputList();
    bucketText.textContent = "—"; summaryTags.innerHTML = "";
    resultEmpty.style.display = "block"; resultList.style.display = "none";
    radarWrap.style.display = "none"; trainBox.style.display = "none";
});
sortModeSel.addEventListener("change", () => { calcAll(); });
document.getElementById("calcAllBtn").addEventListener("click", calcAll);
document.getElementById("resetBtn").addEventListener("click", () => {
    hideWarn();
    for (const inp of document.querySelectorAll("input.val")) inp.value = "";
    bucketText.textContent = "—"; summaryTags.innerHTML = "";
    resultEmpty.style.display = "block"; resultList.style.display = "none";
    radarWrap.style.display = "none"; trainBox.style.display = "none";
});
document.getElementById("clearAllBtn").addEventListener("click", () => {
    hideWarn();
    for (const inp of document.querySelectorAll("input.val")) inp.value = "";
});
document.getElementById("fillDemoBtn").addEventListener("click", () => {
    const sex = sexSel.value, grade = gradeSel.value;
    const dbRow = NATIONAL_DB_GRADE?.[sex]?.[grade];
    if (!dbRow) { showWarn("デモ入力できません（DBなし）。"); return; }
    hideWarn();
    for (const el of inputList.querySelectorAll(".comp-item")) {
        const key = el.dataset.key;
        const m = METRICS[key];
        const row = dbRow[key];
        const inp = el.querySelector("input.val");
        if (!row || !inp) continue;
        const v = m.higherIsBetter ? (row.mean + row.sd * 0.3) : (row.mean - row.sd * 0.3);
        const step = m.step ?? 0.01;
        if (step >= 1) inp.value = String(Math.round(v));
        else inp.value = v.toFixed(step < 0.01 ? 4 : 2);
    }
});
