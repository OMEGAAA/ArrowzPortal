# お知らせの更新方法 (How to Update News)

このシステムでは、管理画面 (`news_admin.html`) を使って記事を作成し、生成されたファイルを GitHub にプッシュすることで、公開ページ (`index.html`, `news.html`) を更新します。

## 手順

### 1. 記事を作成・編集する
1. `news_admin.html` をブラウザで開きます。
2. **DATE, CATEGORY, TITLE, EXCERPT** などの各項目を入力します。
    - **IMAGE STYLE** で画像のパターンを選択できます。
3. **「POST ARTICLE」** ボタンを押して記事を追加します。
    - 追加した記事は画面右側の「CURRENT POSTS」に表示されます。
    - 不要な記事などの「DELETE」ボタンで削除できます。

### 2. 更新データをダウンロードする
1. 記事の編集が終わったら、右上の **「DOWNLOAD news_data.js」** ボタンを押します。
2. `news_data.js` というファイルがダウンロードされます。

### 3. ファイルを上書きする
1. ダウンロードした `news_data.js` を、プロジェクトフォルダ内の `js/news_data.js` に**上書き保存**します。
    - 場所: `c:\AntigravityAPP\toukou\js\news_data.js`

### 4. GitHub にプッシュする
1. VS Code などで変更（`js/news_data.js` の更新）を確認します。
2. GitHub に変更をプッシュします。
3. 公開ページに反映されます。

---

## 注意事項
- **ブラウザのキャッシュ**: ブラウザには LocalStorage という機能でデータが一時保存されています。他のPCやスマホで見るためには、必ず **手順2〜4** を行ってファイルを更新してください。
- **画像の変更**: 画像自体を変更したい場合は、CSS (`style.css`) の `.news-1` などのクラスを編集するか、新しいクラスを追加する必要があります。
