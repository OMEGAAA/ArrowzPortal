/**
 * ARROWZ ポータルサイト共通レイアウトスクリプト
 * ヘッダー、フッターの動的挿入と、ナビゲーション制御を行います。
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. ヘッダーの挿入
    const headerPlaceholder = document.getElementById("common-header");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <header class="header">
                <div class="logo">
                    <a href="index.html">
                        <img src="images/arrowz_logo13.png" alt="ARROWZ" class="logo-img">
                    </a>
                </div>
                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-item"><a href="index.html" class="nav-link" data-hover="ホーム" data-page="home">ホーム</a></li>
                        <li class="nav-item"><a href="news.html" class="nav-link" data-hover="お知らせ" data-page="news">お知らせ</a></li>
                        <li class="nav-item"><a href="homework.html" class="nav-link" data-hover="宿題動画" data-page="homework">宿題動画</a></li>
                        <li class="nav-item"><a href="results.html" class="nav-link" data-hover="フィールドテスト" data-page="results">フィールドテスト</a></li>
                        <li class="nav-item"><a href="weekly.html" class="nav-link" data-hover="今週のアローズジム" data-page="weekly">今週のアローズジム</a></li>
                    </ul>
                </nav>
                <div class="menu-toggle">
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </header>
        `;
        
        // モバイルメニューのトグルイベント登録
        const menuToggle = headerPlaceholder.querySelector(".menu-toggle");
        if (menuToggle) {
            menuToggle.addEventListener("click", () => {
                const nav = headerPlaceholder.querySelector(".nav");
                nav.classList.toggle("nav-active");
                menuToggle.classList.toggle("active");
            });
        }

        // アクティブなリンクの判定
        highlightActiveLink(headerPlaceholder);
    }

    // 2. フッターの挿入
    const footerPlaceholder = document.getElementById("common-footer");
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer">
                <div class="container footer-content">
                    <div class="footer-logo">
                        <a href="https://www.sports-science.co.jp/facility/tochigi/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnA0qM_hiKRR2bV2FCewG_8KCj-2P1WLxekZuYS_LkNXkv36WaadTpXSyxyW0_aem_r9qsksJPKb-rXfjTjhn6wQ" target="_blank" style="text-decoration: none; color: inherit;">ARROWZ</a><span class="dot">.</span>
                    </div>
                    <div class="footer-links">
                        <a href="https://line.me/R/ti/p/@322ctrff?ts=03251611&oat_content=url" target="_blank">LINE</a>
                        <a href="https://www.instagram.com/arrowz_tochigi/" target="_blank">INSTAGRAM</a>
                        <a href="https://www.youtube.com/@%E3%82%A2%E3%83%AD%E3%83%BC%E3%82%BA%E6%A0%83%E6%9C%A8" target="_blank">YOUTUBE</a>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2026 ARROWZ. ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
            </footer>
        `;
    }
});

/**
 * 現在のURLを解析し、ナビゲーションのアクティブ状態を設定します。
 */
function highlightActiveLink(container) {
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf("/") + 1) || "index.html";
    
    let activePage = "home";
    
    if (pageName === "index.html" || pageName === "") {
        activePage = "home";
    } else if (pageName.startsWith("news.html") || pageName.startsWith("news_detail.html")) {
        activePage = "news";
    } else if (pageName.startsWith("homework.html")) {
        activePage = "homework";
    } else if (pageName.startsWith("results.html") || pageName.startsWith("comparison.html") || pageName.startsWith("ranking.html")) {
        activePage = "results";
    } else if (pageName.startsWith("weekly.html") || pageName.startsWith("menu.html") || pageName.startsWith("theme.html") || pageName.startsWith("schedule.html")) {
        activePage = "weekly";
    }

    const activeLink = container.querySelector(`.nav-link[data-page="${activePage}"]`);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}
