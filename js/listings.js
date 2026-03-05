/* ============================================
   TFL作成アカデミー - 一覧表（Listings） JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  renderListingCards();
  handleListingHash();
  window.addEventListener("hashchange", handleListingHash);
});

/* --- リスティングカード描画 --- */
function renderListingCards() {
  var container = document.getElementById("listing-cards");
  if (!container || typeof LISTING_TYPES === "undefined") return;

  var html = "";
  LISTING_TYPES.forEach(function (listing) {
    html +=
      '<div class="card" style="cursor:pointer;" onclick="showListingDetail(\'' + listing.id + '\')">' +
        '<h3 class="card-title" style="font-size:1rem;">' + escapeHtml(listing.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(listing.description.substring(0, 100)) + '...</p>' +
        '<div class="text-sm text-light mt-2">' +
          '<strong>ソート順:</strong> ' + escapeHtml(listing.sortOrder) +
        '</div>' +
        '<span class="card-link">詳細を見る &rarr;</span>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 詳細表示 --- */
function showListingDetail(listingId) {
  window.location.hash = listingId;
}

function handleListingHash() {
  var hash = window.location.hash.replace("#", "");
  if (!hash) {
    document.getElementById("listing-cards").style.display = "";
    document.getElementById("listing-detail").style.display = "none";
    return;
  }

  if (typeof LISTING_TYPES === "undefined") return;

  var listing = LISTING_TYPES.find(function (l) { return l.id === hash; });
  if (!listing) {
    document.getElementById("listing-cards").style.display = "";
    document.getElementById("listing-detail").style.display = "none";
    return;
  }

  document.getElementById("listing-cards").style.display = "none";
  var detailPanel = document.getElementById("listing-detail");
  detailPanel.style.display = "block";

  var columnsHtml = '<ul>';
  listing.keyColumns.forEach(function (col) {
    columnsHtml += '<li>' + escapeHtml(col) + '</li>';
  });
  columnsHtml += '</ul>';

  var html =
    '<a href="#" class="back-link" onclick="goBackToListingList(event)">&larr; 一覧表に戻る</a>' +
    '<div class="detail-panel">' +
      '<h2>' + escapeHtml(listing.name) + '</h2>' +
      '<p>' + escapeHtml(listing.description) + '</p>' +

      '<div class="detail-section">' +
        '<h3>主要カラム</h3>' +
        columnsHtml +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>ソート順</h3>' +
        '<p style="font-size:0.875rem;">' + escapeHtml(listing.sortOrder) + '</p>' +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>サンプルデータプレビュー</h3>' +
        generateListingPreview(listing) +
      '</div>' +
    '</div>';

  detailPanel.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBackToListingList(e) {
  e.preventDefault();
  window.location.hash = "";
}
