/* ============================================
   TFL作成アカデミー - 図（Figures）一覧 JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  renderFigureCards();
  handleFigureHash();
  window.addEventListener("hashchange", handleFigureHash);
});

/* --- 図カード描画 --- */
function renderFigureCards() {
  var container = document.getElementById("figure-cards");
  if (!container || typeof FIGURE_TYPES === "undefined") return;

  var html = "";
  FIGURE_TYPES.forEach(function (fig) {
    html +=
      '<div class="card" style="cursor:pointer;" onclick="showFigureDetail(\'' + fig.id + '\')">' +
        '<div class="figure-art ' + fig.cssArt + '" id="art-' + fig.id + '"></div>' +
        '<h3 class="card-title" style="font-size:1rem;margin-top:0.75rem;">' + escapeHtml(fig.name) + '</h3>' +
        '<p class="card-text">' + escapeHtml(fig.description.substring(0, 80)) + '...</p>' +
        '<span class="card-link">詳細を見る &rarr;</span>' +
      '</div>';
  });

  container.innerHTML = html;
  renderAllCSSArt();
}

/* --- CSS Art 描画 --- */
function renderAllCSSArt() {
  FIGURE_TYPES.forEach(function (fig) {
    var el = document.getElementById("art-" + fig.id);
    if (!el) return;

    switch (fig.cssArt) {
      case "bar-chart":
        renderBarChartArt(el);
        break;
      case "line-chart":
        renderLineChartArt(el);
        break;
      case "km-curve":
        renderKMCurveArt(el);
        break;
      case "forest-plot":
        renderForestPlotArt(el);
        break;
      case "waterfall":
        renderWaterfallArt(el);
        break;
      case "box-plot":
        renderBoxPlotArt(el);
        break;
      case "swimmer-plot":
        renderSwimmerPlotArt(el);
        break;
    }
  });
}

function renderBarChartArt(el) {
  var heights = [70, 45, 90, 55, 80, 35, 65, 50, 75, 40];
  var html = "";
  for (var i = 0; i < heights.length; i++) {
    var cls = i % 2 === 0 ? "group-a" : "group-b";
    html += '<div class="bar ' + cls + '" style="height:' + heights[i] + 'px;"></div>';
  }
  el.innerHTML = html;
}

function renderLineChartArt(el) {
  el.innerHTML =
    '<svg viewBox="0 0 200 100" preserveAspectRatio="none">' +
      '<polyline class="line-a" points="10,80 40,70 70,55 100,45 130,35 160,25 190,20" />' +
      '<polyline class="line-b" points="10,75 40,72 70,68 100,65 130,60 160,58 190,55" />' +
    '</svg>';
}

function renderKMCurveArt(el) {
  el.innerHTML =
    '<svg viewBox="0 0 200 100" preserveAspectRatio="none">' +
      '<polyline class="line-a" points="10,10 30,10 30,18 50,18 50,25 70,25 70,38 100,38 100,50 130,50 130,62 160,62 160,75 190,75" />' +
      '<polyline class="line-b" points="10,10 25,10 25,20 45,20 45,35 60,35 60,50 80,50 80,65 110,65 110,78 140,78 140,88 190,88" />' +
    '</svg>';
}

function renderForestPlotArt(el) {
  var data = [
    { label: "Overall", point: 52, ciLeft: 40, ciRight: 62 },
    { label: "Male", point: 48, ciLeft: 35, ciRight: 60 },
    { label: "Female", point: 55, ciLeft: 38, ciRight: 70 },
    { label: "Age<65", point: 45, ciLeft: 32, ciRight: 58 },
    { label: "Age>=65", point: 58, ciLeft: 42, ciRight: 72 }
  ];

  var html = '<div class="forest-null-line"></div>';
  data.forEach(function (d) {
    html +=
      '<div class="forest-row">' +
        '<span class="forest-label">' + d.label + '</span>' +
        '<div class="forest-bar-area">' +
          '<div class="forest-ci" style="left:' + d.ciLeft + '%;width:' + (d.ciRight - d.ciLeft) + '%;"></div>' +
          '<div class="forest-point" style="left:calc(' + d.point + '% - 4px);"></div>' +
        '</div>' +
      '</div>';
  });

  el.innerHTML = html;
}

function renderWaterfallArt(el) {
  var values = [-80, -65, -55, -50, -42, -35, -30, -25, -20, -15, -12, -8, -5, 0, 5, 10, 15, 22, 30];
  var html = '<div class="wf-zero-line"></div>';
  values.forEach(function (v) {
    var height = Math.abs(v) * 0.8 + 2;
    var cls = v >= 0 ? "positive" : "negative";
    var style = "height:" + height + "px;";
    html += '<div class="wf-bar ' + cls + '" style="' + style + '"></div>';
  });
  el.innerHTML = html;
}

function renderBoxPlotArt(el) {
  var groups = [
    { whiskerTop: 15, boxTop: 30, median: 50, boxBottom: 65, whiskerBottom: 80 },
    { whiskerTop: 25, boxTop: 38, median: 55, boxBottom: 70, whiskerBottom: 85 }
  ];

  var html = "";
  groups.forEach(function (g, i) {
    var boxH = g.boxBottom - g.boxTop;
    var medianPos = ((g.median - g.boxTop) / boxH) * 100;
    html +=
      '<div class="box-group">' +
        '<div class="box-whisker" style="height:' + (g.boxTop - g.whiskerTop) + 'px;"></div>' +
        '<div class="box-body" style="height:' + boxH + 'px;background-color:' + (i === 0 ? "rgba(26,54,93,0.15)" : "rgba(214,158,46,0.15)") + ';border-color:' + (i === 0 ? "var(--color-primary)" : "var(--color-accent)") + ';">' +
          '<div class="box-median" style="top:' + medianPos + '%;"></div>' +
        '</div>' +
        '<div class="box-whisker" style="height:' + (g.whiskerBottom - g.boxBottom) + 'px;"></div>' +
      '</div>';
  });

  el.innerHTML = html;
}

function renderSwimmerPlotArt(el) {
  var patients = [
    { id: "Pt1", bars: [{ start: 0, width: 90, cls: "ongoing" }, { start: 20, width: 60, cls: "response" }] },
    { id: "Pt2", bars: [{ start: 0, width: 70, cls: "ongoing" }, { start: 15, width: 30, cls: "response" }] },
    { id: "Pt3", bars: [{ start: 0, width: 55, cls: "ongoing" }] },
    { id: "Pt4", bars: [{ start: 0, width: 85, cls: "ongoing" }, { start: 25, width: 50, cls: "response" }] },
    { id: "Pt5", bars: [{ start: 0, width: 40, cls: "progression" }] },
    { id: "Pt6", bars: [{ start: 0, width: 95, cls: "ongoing" }, { start: 30, width: 55, cls: "response" }] }
  ];

  var html = "";
  patients.forEach(function (p) {
    html += '<div class="swimmer-row"><span class="swimmer-label">' + p.id + '</span><div class="swimmer-bar-area">';
    p.bars.forEach(function (b) {
      html += '<div class="swimmer-bar ' + b.cls + '" style="left:' + b.start + '%;width:' + b.width + '%;"></div>';
    });
    html += '</div></div>';
  });

  el.innerHTML = html;
}

/* --- 詳細表示 --- */
function showFigureDetail(figId) {
  window.location.hash = figId;
}

function handleFigureHash() {
  var hash = window.location.hash.replace("#", "");
  if (!hash) {
    document.getElementById("figure-cards").style.display = "";
    document.getElementById("figure-detail").style.display = "none";
    renderAllCSSArt();
    return;
  }

  if (typeof FIGURE_TYPES === "undefined") return;

  var fig = FIGURE_TYPES.find(function (f) { return f.id === hash; });
  if (!fig) {
    document.getElementById("figure-cards").style.display = "";
    document.getElementById("figure-detail").style.display = "none";
    return;
  }

  document.getElementById("figure-cards").style.display = "none";
  var detailPanel = document.getElementById("figure-detail");
  detailPanel.style.display = "block";

  var html =
    '<a href="#" class="back-link" onclick="goBackToFigureList(event)">&larr; 図の一覧に戻る</a>' +
    '<div class="detail-panel">' +
      '<h2>' + escapeHtml(fig.name) + '</h2>' +
      '<p>' + escapeHtml(fig.description) + '</p>' +

      '<div class="figure-art ' + fig.cssArt + '" id="detail-art-' + fig.id + '" style="margin-bottom:1.5rem;min-height:200px;"></div>' +

      '<div class="detail-section">' +
        '<h3>使用場面</h3>' +
        '<p style="font-size:0.875rem;">' + escapeHtml(fig.useCase) + '</p>' +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>データソース</h3>' +
        '<div class="code-block" style="margin-bottom:1rem;">' +
          '<span class="code-label">ADaM</span>' +
          '<span class="code-string">' + escapeHtml(fig.dataSource) + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="detail-section">' +
        '<h3>SASプログラミング</h3>' +
        '<div class="code-block">' +
          '<span class="code-label">SAS</span>' +
          '<span class="code-keyword">' + escapeHtml(fig.sasProc) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  detailPanel.innerHTML = html;

  // 詳細ページのCSS Art描画
  var artEl = document.getElementById("detail-art-" + fig.id);
  if (artEl) {
    switch (fig.cssArt) {
      case "bar-chart": renderBarChartArt(artEl); break;
      case "line-chart": renderLineChartArt(artEl); break;
      case "km-curve": renderKMCurveArt(artEl); break;
      case "forest-plot": renderForestPlotArt(artEl); break;
      case "waterfall": renderWaterfallArt(artEl); break;
      case "box-plot": renderBoxPlotArt(artEl); break;
      case "swimmer-plot": renderSwimmerPlotArt(artEl); break;
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBackToFigureList(e) {
  e.preventDefault();
  window.location.hash = "";
}
