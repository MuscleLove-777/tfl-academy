/* ============================================
   TFL作成アカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initNavDropdown();
  initSmoothScroll();
  initFadeInAnimation();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    var isOpen = mobileMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- デスクトップナビ ドロップダウン --- */
function initNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });

    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.add("active");
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove("active");
      }
    });
  });

  document.addEventListener("click", function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  });
}

/* --- スムーズスクロール --- */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

/* --- フェードインアニメーション（Intersection Observer） --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* --- ユーティリティ: カテゴリバッジクラス取得 --- */
function getCategoryBadgeClass(category) {
  var classMap = {
    safety: "badge-safety",
    efficacy: "badge-efficacy",
    demographics: "badge-demographics",
    disposition: "badge-disposition"
  };
  return classMap[category] || "badge-safety";
}

/* --- ユーティリティ: カテゴリ名取得 --- */
function getCategoryName(category) {
  var nameMap = {
    safety: "安全性",
    efficacy: "有効性",
    demographics: "人口統計",
    disposition: "被験者の内訳"
  };
  return nameMap[category] || category;
}

/* --- ユーティリティ: テーブルプレビュー生成 --- */
function generateTablePreview(tableType) {
  if (!tableType.sampleColumns || !tableType.sampleData) return "";

  var html = '<div class="table-wrapper"><table class="tfl-preview-table"><thead><tr>';
  tableType.sampleColumns.forEach(function (col) {
    html += "<th>" + escapeHtml(col) + "</th>";
  });
  html += "</tr></thead><tbody>";

  tableType.sampleData.forEach(function (row) {
    html += "<tr>";
    row.forEach(function (cell) {
      html += "<td>" + escapeHtml(cell) + "</td>";
    });
    html += "</tr>";
  });

  html += "</tbody></table></div>";
  return html;
}

/* --- ユーティリティ: リスティングプレビュー生成 --- */
function generateListingPreview(listingType) {
  if (!listingType.keyColumns || !listingType.sampleData) return "";

  var html = '<div class="table-wrapper"><table class="listing-preview-table"><thead><tr>';
  listingType.keyColumns.forEach(function (col) {
    html += "<th>" + escapeHtml(col) + "</th>";
  });
  html += "</tr></thead><tbody>";

  listingType.sampleData.forEach(function (row) {
    html += "<tr>";
    row.forEach(function (cell) {
      html += "<td>" + escapeHtml(cell) + "</td>";
    });
    html += "</tr>";
  });

  html += "</tbody></table></div>";
  return html;
}
