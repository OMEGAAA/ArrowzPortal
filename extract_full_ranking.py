import pandas as pd
import json
import re

file_path = 'フィールドテストデータ 毎月更新.xlsm'
sheet = 'データ'

# Student data starts from row 3 (rows 0-2 are headers)
df = pd.read_excel(file_path, sheet_name=sheet, header=None, skiprows=3)

# CORRECT MEASURED VALUE COLUMNS
VALUE_COLS = {
    'vmax':              44,   # 最高速度 (km/h)
    'vdec':              46,   # 速度維持率
    'sprint_score':      48,   # スプリントスコア (回)
    'pro':               52,   # 切り返し走 (sec)
    'dva':               54,   # 動体視力 (ランク)
    'eye':               56,   # 眼球運動 (ランク)
    'peri':              58,   # 周辺視 (ランク)
    'flash':             60,   # 瞬間視 (ランク)
    'arrowz_eye_total':  62,   # ArrowzEye合計値
    'hand_eye':          66,   # 眼と手の協応動作 (sec)
    'height':            68,   # 身長 (cm)
    'weight':            70,   # 体重 (kg)
    'bmi':               72,   # BMI
    'vj':                74,   # 垂直跳び (cm)
    'sj':                76,   # スクワットジャンプ (cm)
    'contact_time':      78,   # 接地時間 (sec)
    'jump_height':       80,   # 跳躍高 (cm)
    'rj_index':          82,   # RJ-index
    'broad_jump':        84,   # 立ち幅跳び (cm)
    'stepping':          86,   # ステッピング (回)
}

TOTAL_SCORE_COL = 68 # Use Height as legacy Total Score for now since Grade cols are empty

def parse_date(val):
    if pd.isna(val):
        return None
    if isinstance(val, pd.Timestamp):
        return val
    s = str(val).strip()
    try:
        return pd.Timestamp(s)
    except:
        return None

all_records = []

for index, row in df.iterrows():
    name = row[0]
    if pd.isna(name):
        continue
    if not isinstance(name, str) or len(name.strip()) == 0:
        continue
    if re.match(r'\d{4}/', str(name)):
        continue

    test_date = parse_date(row[6])
    grade = str(row[2]) if pd.notna(row[2]) else ""
    gender = str(row[3]) if pd.notna(row[3]) else ""
    class_name = str(row[8]) if pd.notna(row[8]) else ""

    category = "U-12"
    if "小" in grade:
        try:
            g = int(re.search(r'\d+', grade).group())
            category = "U-9" if g <= 3 else "U-12"
        except:
            pass
    elif "中" in grade:
        category = "U-15"
    elif "高" in grade:
        category = "U-18"

    scores = {}
    has_data = False
    
    # Extract Measurements
    for key, idx in VALUE_COLS.items():
        try:
            val_raw = row[idx]
            if pd.isna(val_raw):
                continue
            val_str = str(val_raw).replace(',', '').strip()
            val = float(val_str)
            scores[key] = round(val, 4)
            has_data = True
        except:
            pass

    # Total Score (Legacy: Use Height)
    total_score = scores.get('height', 0)
    scores['TOTAL'] = total_score
    
    if has_data and total_score > 0:
        all_records.append({
            "name": name.strip(),
            "class": class_name.strip() if class_name else grade.strip(),
            "category": category,
            "grade": grade.strip(),
            "gender": gender.strip(),
            "test_date": test_date,
            "score": total_score,
            "scores": scores
        })

# Keep latest logic
latest = {}
for rec in all_records:
    name = rec["name"]
    if name not in latest:
        latest[name] = rec
    else:
        existing_date = latest[name].get("test_date")
        new_date = rec.get("test_date")
        if new_date is not None and (existing_date is None or new_date > existing_date):
            latest[name] = rec

ranking_data = list(latest.values())

for item in ranking_data:
    item.pop("test_date", None)
    item.pop("grade", None)
    item.pop("gender", None)

ranking_data.sort(key=lambda x: x['score'], reverse=True)

json_str = json.dumps(ranking_data, ensure_ascii=False)
js_content = f"window.RANKING_DATA = {json_str};"

with open('js/ranking_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Total records found: {len(all_records)}")
print(f"Unique students: {len(ranking_data)}")
if ranking_data:
    top = ranking_data[0]
    print(f"Top: {top['name']} = {top['score']}")
