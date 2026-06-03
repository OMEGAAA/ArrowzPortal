# -*- coding: utf-8 -*-
import pandas as pd
import json
import re
import openpyxl
import os

# 正となるファイル（プロジェクト直下のランキングExcel）を最優先で読み込む
legacy_path = 'フィールドテストデータ ランキング.xlsm'
# フォールバック用（新Ver.シート）
default_path = r"C:\Users\山﨑元気\Downloads\FTシート_新Ver._氏名 毎月更新.xlsm"
alt_path = 'FTシート_新Ver._氏名 毎月更新.xlsm'

if os.path.exists(legacy_path):
    file_path = legacy_path
elif os.path.exists(default_path):
    file_path = default_path
elif os.path.exists(alt_path):
    file_path = alt_path
else:
    raise FileNotFoundError(f"Excelファイルが見つかりません。 (探索パス: {default_path}, {alt_path}, {legacy_path})")

print(f"Reading file: {file_path}")

wb = openpyxl.load_workbook(file_path, read_only=True)
sheet_names = wb.sheetnames
wb.close()

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

# 自動判定
if 'データ' in sheet_names:
    print("Detected format: Legacy (Single Sheet)")
    
    # ヘッダー行は1行目のみ。データは2行目以降なので skiprows=1。
    df = pd.read_excel(file_path, sheet_name='データ', header=None, skiprows=1)

    # 「データ」シートは各測定項目が2列1組（ラベル列＋値列）で構成され、
    # 実際の数値は組の右側（奇数列インデックス）に入っている。
    VALUE_COLS = {
        'vmax':              41,   # 最高速度 (km/h)
        'vdec':              43,   # 速度維持率
        'sprint_score':      45,   # スプリントスコア (回)
        'pro':               49,   # 切り返し走 (sec)
        'dva':               51,   # 動体視力 (ランク)
        'eye':               53,   # 眼球運動 (ランク)
        'peri':              55,   # 周辺視 (ランク)
        'flash':             57,   # 瞬間視 (ランク)
        'arrowz_eye_total':  59,   # ArrowzEye合計値
        'hand_eye':          63,   # 眼と手の協応動作 (sec)
        'height':            65,   # 身長 (cm)
        'weight':            67,   # 体重 (kg)
        'bmi':               69,   # BMI
        'vj':                71,   # 垂直跳び (cm)
        'sj':                73,   # スクワットジャンプ (cm)
        'contact_time':      75,   # 接地時間 (sec)
        'jump_height':       77,   # 跳躍高 (cm)
        'rj_index':          79,   # RJ-index
        'broad_jump':        81,   # 立ち幅跳び (cm)
        'stepping':          83,   # ステッピング (回)
    }

    for index, row in df.iterrows():
        name = row[0]
        if pd.isna(name) or not isinstance(name, str) or len(name.strip()) == 0:
            continue
        if re.match(r'\d{4}/', str(name)):
            continue

        test_date = parse_date(row[3])                                  # 測定日
        grade = str(row[10]) if pd.notna(row[10]) else ""               # 学年 (小1〜高3)
        gender = str(row[9]) if pd.notna(row[9]) else ""                # 男子/女子
        class_name = str(row[8]) if pd.notna(row[8]) else ""            # クラス時間帯

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
        
        for key, idx in VALUE_COLS.items():
            try:
                val_raw = row[idx]
                if pd.isna(val_raw) or str(val_raw).strip() in ['', '-']:
                    continue
                val_str = str(val_raw).replace(',', '').strip()
                val = float(val_str)
                scores[key] = round(val, 4)
                has_data = True
            except:
                pass

        main_score = scores.get('vmax', 0)

        if has_data:
            all_records.append({
                "name": name.strip(),
                "class": class_name.strip() if class_name else grade.strip(),
                "category": category,
                "grade": grade.strip(),
                "gender": gender.strip(),
                "test_date": test_date,
                "score": main_score,
                "scores": scores
            })

else:
    print("Detected format: New (Multiple Sheets per student)")
    
    EXCLUDE_SHEETS = [
        '引点克服TR', 'データ貼り付け', '男性', '女性', '結果シート', 
        '個人シート', 'プルダウン', 'CheckList', 'TransferLog'
    ]

    NEW_VALUE_COLS = {
        'vmax':              22,   # 最高速度 (km/h)
        'vdec':              23,   # 速度維持率
        'sprint_score':      24,   # スプリントスコア (回)
        'pro':               26,   # 切り返し走 (sec)
        'dva':               27,   # 動体視力 (ランク)
        'eye':               28,   # 眼球運動 (ランク)
        'peri':              29,   # 周辺視 (ランク)
        'flash':             30,   # 瞬間視 (ランク)
        'arrowz_eye_total':  31,   # ArrowzEye合計値
        'hand_eye':          33,   # 眼と手の協応動作 (sec)
        'height':            34,   # 身長 (cm)
        'weight':            35,   # 体重 (kg)
        'bmi':               36,   # BMI
        'vj':                37,   # 垂直跳び (cm)
        'sj':                38,   # スクワットジャンプ (cm)
        'contact_time':      39,   # 接地時間 (sec)
        'jump_height':       40,   # 跳躍高 (cm)
        'rj_index':          41,   # RJ-index
        'broad_jump':        42,   # 立ち幅跳び (cm)
        'stepping':          43,   # ステッピング (回)
    }

    for s_name in sheet_names:
        # 文字エンコーディングの違いに対応するため、シート名の部分一致や除外キーワードでも判定
        is_exclude = False
        for ex in EXCLUDE_SHEETS:
            if ex in s_name or s_name in ex:
                is_exclude = True
                break
        if is_exclude:
            continue

        df = pd.read_excel(file_path, sheet_name=s_name, header=None)
        
        # 安全対策: 列数が少ないシート（管理シート等）はスキップ
        if df.shape[1] < 20:
            continue

        # データは4行目（インデックス4）以降
        for index, row in df.iloc[4:].iterrows():
            # 列数が足りない行はスキップ
            if len(row) < 44:
                continue

            # 年(列0)と月(列1)から測定日を合成
            year_val = row[0]
            month_val = row[1]
            test_date = None
            try:
                if pd.notna(year_val) and pd.notna(month_val):
                    test_date = pd.Timestamp(year=int(year_val), month=int(month_val), day=1)
            except:
                pass
            
            if test_date is None:
                test_date = parse_date(row[6])

            if test_date is None:
                continue

            grade = str(row[3]).strip() if pd.notna(row[3]) else ""
            gender = str(row[4]).strip() if pd.notna(row[4]) else ""
            class_name = str(row[7]).strip() if pd.notna(row[7]) else ""

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

            for key, idx in NEW_VALUE_COLS.items():
                try:
                    val_raw = row[idx]
                    if pd.isna(val_raw) or str(val_raw).strip() in ['', '-']:
                        continue
                    val_str = str(val_raw).replace(',', '').strip()
                    val = float(val_str)
                    scores[key] = round(val, 4)
                    has_data = True
                except:
                    pass

            main_score = scores.get('vmax', 0)

            if has_data:
                all_records.append({
                    "name": s_name.strip(),
                    "class": class_name if class_name else grade,
                    "category": category,
                    "grade": grade,
                    "gender": gender,
                    "test_date": test_date,
                    "score": main_score,
                    "scores": scores
                })

# 最新判定
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
