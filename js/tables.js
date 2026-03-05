/* ============================================
   TFL作成アカデミー - テーブル一覧 JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initTableFilters();
  handleHash();
  window.addEventListener("hashchange", handleHash);
});

/* --- フィルター初期化 --- */
function initTableFilters() {
  var filterBar = document.getElementById("table-filters");
  if (!filterBar) return;

  var buttons = filterBar.querySelectorAll(".filter-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      renderTableCards(filter);
    });
  });

  renderTableCards("all");
}

/* --- テーブルカード描画 --- */
function renderTableCards(filter) {
  var container = document.getElementById("table-cards");
  var detailPanel = document.getElementById("table-detail");
  if (!container || typeof TABLE_TYPES === "undefined") return;

  // 詳細パネルを隠してカード一覧を表示
  container.style.display = "";
  detailPanel.style.display = "none";
  document.getElementById("table-filters").style.display = "";

  var filtered = TABLE_TYPES;
  if (filter !== "all") {
    filtered = TABLE_TYPES.filter(function (t) {
      return t.category === filter;
    });
  }

  var html = "";
  filtered.forEach(function (table) {
    var badgeClass = getCategoryBadgeClass(table.category);
    var categoryName = getCategoryName(table.category);

    html +=
      '<div class="card" style="cursor:pointer;" onclick="showTableDetail(\'' + table.id + '\')">' +
        '<div class="flex-between mb-2">' +
          '<span class="badge ' + badgeClass + '">' + escapeHtml(categoryName) + '</span>' +
        '</div>' +
        '<h3 class="card-title" style="font-size:1rem;">' + escapeHtml(table.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(table.description.substring(0, 80)) + '...</p>' +
        '<span class="card-link">詳細を見る &rarr;</span>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 詳細表示 --- */
function showTableDetail(tableId) {
  window.location.hash = tableId;
}

function handleHash() {
  var hash = window.location.hash.replace("#", "");
  if (!hash) {
    renderTableCards("all");
    return;
  }

  if (typeof TABLE_TYPES === "undefined") return;

  var table = TABLE_TYPES.find(function (t) { return t.id === hash; });
  if (!table) {
    renderTableCards("all");
    return;
  }

  var container = document.getElementById("table-cards");
  var detailPanel = document.getElementById("table-detail");
  var filterBar = document.getElementById("table-filters");

  container.style.display = "none";
  filterBar.style.display = "none";
  detailPanel.style.display = "block";

  var badgeClass = getCategoryBadgeClass(table.category);
  var categoryName = getCategoryName(table.category);

  var html =
    '<a href="#" class="back-link" onclick="goBackToList(event)">&larr; テーブル一覧に戻る</a>' +
    '<div class="detail-panel">' +
      '<div class="flex-between mb-3" style="flex-wrap:wrap;gap:0.5rem;">' +
        '<h2 style="margin-bottom:0;">' + escapeHtml(table.name) + '</h2>' +
        '<span class="badge ' + badgeClass + '">' + escapeHtml(categoryName) + '</span>' +
      '</div>' +
      '<p>' + escapeHtml(table.description) + '</p>' +

      '<div class="detail-section">' +
        '<h3>サンプルテーブルプレビュー</h3>' +
        generateTablePreview(table) +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>使用する SAS PROC</h3>' +
        '<div class="code-block">' +
          '<span class="code-label">SAS</span>' +
          '<span class="code-keyword">' + escapeHtml(table.sasProc) + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>注意点・書式ルール</h3>' +
        '<div class="tip-box">' +
          '<p style="margin-bottom:0;font-size:0.875rem;">' + escapeHtml(table.notes) + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';

  detailPanel.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBackToList(e) {
  e.preventDefault();
  window.location.hash = "";
}
