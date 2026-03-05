/* ============================================
   TFL作成アカデミー - クイズ JS
   ============================================ */

var quizState = {
  currentIndex: 0,
  answers: [],
  score: 0,
  answered: false
};

document.addEventListener("DOMContentLoaded", function () {
  startQuiz();
});

/* --- クイズ開始 --- */
function startQuiz() {
  quizState.currentIndex = 0;
  quizState.answers = [];
  quizState.score = 0;
  quizState.answered = false;
  renderQuestion();
}

/* --- 問題描画 --- */
function renderQuestion() {
  var container = document.getElementById("quiz-container");
  if (!container || typeof QUIZ_DATA === "undefined") return;

  var q = QUIZ_DATA[quizState.currentIndex];
  var total = QUIZ_DATA.length;
  var progress = ((quizState.currentIndex) / total) * 100;

  var html =
    '<div class="quiz-progress">' +
      '<div class="quiz-progress-bar" style="width:' + progress + '%;"></div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="quiz-question-number">Q' + (quizState.currentIndex + 1) + ' / ' + total + '</div>' +
      '<div class="quiz-question">' + escapeHtml(q.question) + '</div>' +
      '<div class="quiz-choices" id="quiz-choices">';

  q.choices.forEach(function (choice, i) {
    html +=
      '<div class="quiz-choice" data-index="' + i + '" onclick="selectAnswer(' + i + ')">' +
        '<strong>' + String.fromCharCode(65 + i) + '.</strong> ' + escapeHtml(choice) +
      '</div>';
  });

  html +=
      '</div>' +
      '<div id="quiz-feedback" style="display:none;"></div>' +
      '<div class="quiz-nav" id="quiz-nav" style="display:none;">' +
        '<button class="btn btn-primary" onclick="nextQuestion()">次の問題へ &rarr;</button>' +
      '</div>' +
    '</div>';

  container.innerHTML = html;
  quizState.answered = false;
}

/* --- 回答選択 --- */
function selectAnswer(index) {
  if (quizState.answered) return;
  quizState.answered = true;

  var q = QUIZ_DATA[quizState.currentIndex];
  var isCorrect = index === q.answer;
  if (isCorrect) quizState.score++;
  quizState.answers.push(index);

  // 選択肢のスタイル更新
  var choices = document.querySelectorAll(".quiz-choice");
  choices.forEach(function (choice, i) {
    choice.classList.add("disabled");
    if (i === q.answer) {
      choice.classList.add("correct");
    }
    if (i === index && !isCorrect) {
      choice.classList.add("incorrect");
    }
  });

  // フィードバック表示
  var feedback = document.getElementById("quiz-feedback");
  var resultText = isCorrect ? "正解!" : "不正解...";
  var resultClass = isCorrect ? "color:var(--color-success);" : "color:var(--color-warning);";

  feedback.style.display = "block";
  feedback.innerHTML =
    '<p style="font-weight:700;' + resultClass + 'margin-bottom:0.5rem;">' + resultText + '</p>' +
    '<div class="quiz-explanation">' + escapeHtml(q.explanation) + '</div>';

  // ナビボタン表示
  var nav = document.getElementById("quiz-nav");
  nav.style.display = "flex";

  if (quizState.currentIndex >= QUIZ_DATA.length - 1) {
    nav.innerHTML = '<button class="btn btn-primary btn-lg" onclick="showResults()">結果を見る</button>';
  }
}

/* --- 次の問題 --- */
function nextQuestion() {
  quizState.currentIndex++;
  renderQuestion();
}

/* --- 結果表示 --- */
function showResults() {
  var container = document.getElementById("quiz-container");
  if (!container || typeof QUIZ_RESULTS === "undefined") return;

  var total = QUIZ_DATA.length;
  var score = quizState.score;
  var progress = 100;

  // 診断結果を取得
  var result = null;
  var keys = Object.keys(QUIZ_RESULTS);
  for (var i = 0; i < keys.length; i++) {
    var r = QUIZ_RESULTS[keys[i]];
    if (score >= r.min) {
      result = r;
      break;
    }
  }

  if (!result) result = QUIZ_RESULTS.novice;

  // アイコンマップ
  var iconMap = {
    crown: "&#x1F451;",
    star: "&#x2B50;",
    chart: "&#x1F4CA;",
    book: "&#x1F4D8;",
    seedling: "&#x1F331;"
  };

  var icon = iconMap[result.icon] || "&#x1F4CA;";

  var html =
    '<div class="quiz-progress">' +
      '<div class="quiz-progress-bar" style="width:' + progress + '%;"></div>' +
    '</div>' +
    '<div class="card quiz-result">' +
      '<div style="font-size:3rem;margin-bottom:1rem;">' + icon + '</div>' +
      '<div class="quiz-result-score">' + score + ' / ' + total + '</div>' +
      '<div class="quiz-result-title">' + escapeHtml(result.title) + '</div>' +
      '<p class="quiz-result-description">' + escapeHtml(result.description) + '</p>' +
      '<p class="quiz-result-advice">' + escapeHtml(result.advice) + '</p>' +

      '<div class="quiz-result-buttons">' +
        '<button class="btn btn-primary btn-lg" onclick="startQuiz()">もう一度挑戦</button>' +
        '<a href="../guide/index.html" class="btn btn-outline btn-lg">作成ガイドで学ぶ</a>' +
      '</div>' +
    '</div>' +

    '<div class="card mt-4">' +
      '<h3 style="font-size:1rem;margin-bottom:1rem;">回答結果一覧</h3>';

  QUIZ_DATA.forEach(function (q, i) {
    var userAnswer = quizState.answers[i];
    var isCorrect = userAnswer === q.answer;
    var mark = isCorrect ? '<span style="color:var(--color-success);font-weight:700;">&#x25CB;</span>' : '<span style="color:var(--color-warning);font-weight:700;">&#x2715;</span>';

    html +=
      '<div style="padding:0.75rem 0;border-bottom:1px solid var(--color-border);font-size:0.875rem;">' +
        '<div class="flex-between" style="gap:0.5rem;">' +
          '<span>' + mark + ' Q' + (i + 1) + ': ' + escapeHtml(q.question.substring(0, 50)) + '...</span>' +
          '<span class="text-light">' + (isCorrect ? "正解" : "不正解") + '</span>' +
        '</div>' +
      '</div>';
  });

  html += '</div>';

  container.innerHTML = html;
}
