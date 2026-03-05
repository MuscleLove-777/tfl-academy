/* ============================================
   TFL作成アカデミー - TFLシェルビルダー JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initShellBuilder();
  renderShellRules();
});

/* --- シェルビルダー初期化 --- */
function initShellBuilder() {
  var select = document.getElementById("shell-table-type");
  if (!select || typeof TABLE_TYPES === "undefined") return;

  TABLE_TYPES.forEach(function (table) {
    var option = document.createElement("option");
    option.value = table.id;
    option.textContent = table.name;
    select.appendChild(option);
  });

  // テーブルタイプ変更でデフォルト値をセット
  select.addEventListener("change", function () {
    var tableId = select.value;
    if (!tableId) return;

    var table = TABLE_TYPES.find(function (t) { return t.id === tableId; });
    if (!table) return;

    // タイトルをセット
    var titleInput = document.getElementById("shell-title");
    if (titleInput && !titleInput.value) {
      titleInput.value = table.name;
    }

    // カラムヘッダをセット
    var columnsInput = document.getElementById("shell-columns");
    if (columnsInput && !columnsInput.value && table.sampleColumns) {
      columnsInput.value = table.sampleColumns.join(", ");
    }

    // 脚注をセット
    var footnotesInput = document.getElementById("shell-footnotes");
    if (footnotesInput && !footnotesInput.value) {
      footnotesInput.value = "Source: ADaM Dataset\n" + table.notes;
    }

    // プログラム名をセット
    var programInput = document.getElementById("shell-program");
    if (programInput && !programInput.value) {
      programInput.value = "t_" + table.id.replace(/-/g, "_") + ".sas";
    }
  });
}

/* --- シェル生成 --- */
function generateShell() {
  var tableType = document.getElementById("shell-table-type").value;
  var tableNumber = document.getElementById("shell-table-number").value.trim();
  var title = document.getElementById("shell-title").value.trim();
  var population = document.getElementById("shell-population").value;
  var columns = document.getElementById("shell-columns").value.trim();
  var footnotes = document.getElementById("shell-footnotes").value.trim();
  var program = document.getElementById("shell-program").value.trim();

  if (!tableType || !title) {
    alert("テーブルタイプとタイトルは必須です。");
    return;
  }

  var table = TABLE_TYPES.find(function (t) { return t.id === tableType; });

  // コラムヘッダの整形
  var colArray = columns ? columns.split(",").map(function (c) { return c.trim(); }) : [];
  var colHeader = "";
  if (colArray.length > 0) {
    var firstColWidth = 30;
    var otherColWidth = Math.floor((70) / colArray.length);

    colHeader = padRight("", firstColWidth);
    colArray.forEach(function (col) {
      colHeader += padCenter(col, otherColWidth);
    });
  }

  // サンプルボディの生成
  var bodyLines = "";
  if (table && table.sampleData) {
    table.sampleData.forEach(function (row) {
      var line = padRight(row[0], 30);
      for (var i = 1; i < row.length; i++) {
        var w = colArray.length > 0 ? Math.floor(70 / colArray.length) : 15;
        line += padCenter(row[i], w);
      }
      bodyLines += line + "\n";
    });
  } else {
    bodyLines = padRight("  [Data rows will appear here]", 70) + "\n";
  }

  // 脚注の整形
  var footnoteLines = "";
  if (footnotes) {
    footnotes.split("\n").forEach(function (fn) {
      footnoteLines += fn.trim() + "\n";
    });
  }

  // 出力テキスト
  var now = new Date();
  var dateStr = now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");

  var output = "";
  output += tableNumber + "\n";
  output += title + "\n";
  output += population + "\n";
  output += "\n";
  output += repeatChar("-", 80) + "\n";
  if (colHeader) {
    output += colHeader + "\n";
  }
  output += repeatChar("-", 80) + "\n";
  output += "\n";
  output += bodyLines;
  output += "\n";
  output += repeatChar("-", 80) + "\n";
  output += "\n";
  output += footnoteLines;
  output += "\n";
  output += program + "    " + padRight("", 40) + "Page 1 of 1\n";
  output += dateStr + "\n";

  document.getElementById("shell-output").textContent = output;
}

/* --- コピー機能 --- */
function copyShellOutput() {
  var output = document.getElementById("shell-output").textContent;
  var btn = document.getElementById("copy-btn");

  if (navigator.clipboard) {
    navigator.clipboard.writeText(output).then(function () {
      btn.textContent = "コピーしました";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = "コピー";
        btn.classList.remove("copied");
      }, 2000);
    });
  } else {
    // フォールバック
    var textarea = document.createElement("textarea");
    textarea.value = output;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    btn.textContent = "コピーしました";
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = "コピー";
      btn.classList.remove("copied");
    }, 2000);
  }
}

/* --- シェル構成要素ルール --- */
function renderShellRules() {
  var container = document.getElementById("shell-rules");
  if (!container || typeof TFL_SHELLS === "undefined") return;

  var html = "";
  var keys = Object.keys(TFL_SHELLS);
  keys.forEach(function (key) {
    var shell = TFL_SHELLS[key];
    html +=
      '<div style="margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--color-border);">' +
        '<h4 style="font-size:0.875rem;color:var(--color-primary);margin-bottom:0.25rem;">' + escapeHtml(shell.label) + '</h4>' +
        '<p style="font-size:0.8rem;color:var(--color-text-light);margin-bottom:0.5rem;">' + escapeHtml(shell.description) + '</p>' +
        '<ul style="list-style:disc;padding-left:1.25rem;">' +
          shell.rules.map(function (r) {
            return '<li style="font-size:0.78rem;margin-bottom:0.15rem;">' + escapeHtml(r) + '</li>';
          }).join('') +
        '</ul>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- ユーティリティ --- */
function padRight(str, len) {
  while (str.length < len) str += " ";
  return str;
}

function padCenter(str, len) {
  var totalPad = len - str.length;
  if (totalPad <= 0) return str;
  var leftPad = Math.floor(totalPad / 2);
  var rightPad = totalPad - leftPad;
  return " ".repeat(leftPad) + str + " ".repeat(rightPad);
}

function repeatChar(ch, count) {
  return ch.repeat(count);
}
