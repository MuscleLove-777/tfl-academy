/* ============================================
   TFL作成アカデミー - 作成ガイド JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  renderGuideSteps();
  renderGuideSidebar();
  initScrollSpy();
});

/* --- ガイドステップ描画 --- */
function renderGuideSteps() {
  var container = document.getElementById("guide-content");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<div class="guide-step fade-in" id="step-' + step.id + '">' +
        '<div class="step-header">' +
          '<span class="step-number">' + step.id + '</span>' +
          '<h2>Step ' + step.id + ': ' + escapeHtml(step.title) + '</h2>' +
        '</div>' +
        '<p>' + escapeHtml(step.description) + '</p>' +

        '<div class="detail-section">' +
          '<h3>主要なアクティビティ</h3>' +
          '<ul>' +
            step.details.map(function (d) {
              return '<li>' + escapeHtml(d) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>' +

        '<div class="tip-box">' +
          '<h4>TIPS</h4>' +
          '<p style="margin-bottom:0;font-size:0.875rem;">' + escapeHtml(step.tips) + '</p>' +
        '</div>' +

        '<div class="pitfall-box">' +
          '<h4>よくある落とし穴</h4>' +
          '<ul>' +
            step.pitfalls.map(function (p) {
              return '<li>' + escapeHtml(p) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  // フェードインアニメーションを再初期化
  initFadeInAnimation();
}

/* --- サイドバー描画 --- */
function renderGuideSidebar() {
  var sidebar = document.getElementById("guide-sidebar-nav");
  if (!sidebar || typeof GUIDE_STEPS === "undefined") return;

  var html = '<h3>ステップ一覧</h3>';
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<a href="#step-' + step.id + '" data-step="' + step.id + '">' +
        'Step ' + step.id + ': ' + escapeHtml(step.title) +
      '</a>';
  });

  sidebar.innerHTML = html;
}

/* --- スクロール追従（Intersection Observer） --- */
function initScrollSpy() {
  if (typeof GUIDE_STEPS === "undefined") return;

  var stepElements = [];
  GUIDE_STEPS.forEach(function (step) {
    var el = document.getElementById("step-" + step.id);
    if (el) stepElements.push(el);
  });

  if (stepElements.length === 0) return;

  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var stepId = entry.target.id;
          updateSidebarActive(stepId);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-80px 0px -60% 0px"
    }
  );

  stepElements.forEach(function (el) {
    observer.observe(el);
  });
}

function updateSidebarActive(stepId) {
  var sidebar = document.getElementById("guide-sidebar-nav");
  if (!sidebar) return;

  var links = sidebar.querySelectorAll("a");
  links.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + stepId) {
      link.classList.add("active");
    }
  });
}
