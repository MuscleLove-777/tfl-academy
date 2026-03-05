/* ============================================
   TFL作成アカデミー - データ定義
   ============================================ */

/**
 * テーブルの種類
 */
const TABLE_TYPES = [
  {
    id: "ae-summary",
    name: "有害事象要約テーブル",
    category: "safety",
    description: "治験中に発生した有害事象をSOC（器官別大分類）およびPT（基本語）別に集計し、投与群ごとの発現例数・発現率を表示する。安全性評価の基本となるテーブル。",
    sampleColumns: ["SOC / PT", "実薬群 N=xxx", "プラセボ群 N=xxx", "合計 N=xxx"],
    sampleData: [
      ["胃腸障害", "25 (16.7)", "10 (6.7)", "35 (11.7)"],
      ["  悪心", "15 (10.0)", "5 (3.3)", "20 (6.7)"],
      ["  嘔吐", "10 (6.7)", "5 (3.3)", "15 (5.0)"]
    ],
    sasProc: "PROC FREQ / PROC SORT / PROC REPORT",
    notes: "MedDRA辞書でコーディング。SOCはInternational SOC orderでソート。同一被験者で複数回発現した場合は1例としてカウント（被験者単位）。"
  },
  {
    id: "ae-severity",
    name: "重症度別有害事象テーブル",
    category: "safety",
    description: "有害事象を重症度（軽度・中等度・重度）別に集計する。被験者ごとに最も重い重症度でカウントするのが一般的。",
    sampleColumns: ["SOC / PT", "軽度 n(%)", "中等度 n(%)", "重度 n(%)", "合計 n(%)"],
    sampleData: [
      ["胃腸障害", "15 (10.0)", "8 (5.3)", "2 (1.3)", "25 (16.7)"],
      ["  悪心", "10 (6.7)", "4 (2.7)", "1 (0.7)", "15 (10.0)"],
      ["  嘔吐", "5 (3.3)", "4 (2.7)", "1 (0.7)", "10 (6.7)"]
    ],
    sasProc: "PROC FREQ / PROC REPORT",
    notes: "同一被験者で同一PTが複数回発現した場合、最大重症度でカウント。CTCAEグレードを使用する場合はグレード1-5で分類。"
  },
  {
    id: "lab-shift",
    name: "臨床検査値シフトテーブル",
    category: "safety",
    description: "臨床検査値のベースラインから投与後への変化をシフト分析で表示する。正常/異常の分類や基準値範囲との比較を行う。",
    sampleColumns: ["検査項目", "ベースライン\\投与後", "低値", "正常", "高値"],
    sampleData: [
      ["ALT", "低値", "2", "1", "0"],
      ["ALT", "正常", "3", "120", "8"],
      ["ALT", "高値", "0", "2", "5"]
    ],
    sasProc: "PROC FREQ / PROC REPORT / PROC TRANSPOSE",
    notes: "基準値範囲はCRF/施設基準値を使用。CTCAE基準でのグレード分類も併用することがある。"
  },
  {
    id: "vitals",
    name: "バイタルサイン要約テーブル",
    category: "safety",
    description: "血圧、脈拍、体温等のバイタルサインについて、各測定時点の要約統計量（N, Mean, SD, Median, Min, Max）とベースラインからの変化量を表示する。",
    sampleColumns: ["パラメータ", "測定時点", "N", "Mean", "SD", "Median", "Min", "Max"],
    sampleData: [
      ["収縮期血圧 (mmHg)", "ベースライン", "150", "125.3", "12.4", "124.0", "95", "160"],
      ["収縮期血圧 (mmHg)", "Week 4", "148", "122.1", "11.8", "121.0", "92", "158"],
      ["収縮期血圧 変化量", "Week 4", "148", "-3.2", "8.5", "-3.0", "-25", "18"]
    ],
    sasProc: "PROC MEANS / PROC REPORT / PROC UNIVARIATE",
    notes: "要約統計量は小数点以下の桁数をSAPで事前に規定する。変化量 = 投与後値 - ベースライン値。"
  },
  {
    id: "demographics",
    name: "被験者背景テーブル",
    category: "demographics",
    description: "登録された被験者の人口統計学的特性（年齢、性別、人種、体重、BMI等）を投与群別に要約する。連続変数は要約統計量、カテゴリ変数は度数と割合で表示。",
    sampleColumns: ["項目", "カテゴリ/統計量", "実薬群 N=xxx", "プラセボ群 N=xxx", "合計 N=xxx"],
    sampleData: [
      ["年齢（歳）", "Mean (SD)", "55.2 (10.3)", "54.8 (11.1)", "55.0 (10.7)"],
      ["性別", "男性", "85 (56.7)", "82 (54.7)", "167 (55.7)"],
      ["性別", "女性", "65 (43.3)", "68 (45.3)", "133 (44.3)"]
    ],
    sasProc: "PROC MEANS / PROC FREQ / PROC REPORT",
    notes: "連続変数: N, Mean, SD, Median, Min, Max。カテゴリ変数: n (%)。群間比較の検定は通常行わない（ICH E9ガイドライン）。"
  },
  {
    id: "disposition",
    name: "被験者の内訳テーブル",
    category: "disposition",
    description: "スクリーニングから試験完了/中止までの被験者の流れを表示する。中止理由別の内訳も含む。",
    sampleColumns: ["項目", "実薬群 N=xxx n(%)", "プラセボ群 N=xxx n(%)", "合計 N=xxx n(%)"],
    sampleData: [
      ["登録例", "150 (100.0)", "150 (100.0)", "300 (100.0)"],
      ["完了例", "130 (86.7)", "125 (83.3)", "255 (85.0)"],
      ["中止例", "20 (13.3)", "25 (16.7)", "45 (15.0)"]
    ],
    sasProc: "PROC FREQ / PROC REPORT",
    notes: "解析対象集団（FAS, PPS, Safety Set等）の内訳も含める。CONSORT flow diagramと整合させる。"
  },
  {
    id: "efficacy-primary",
    name: "主要評価項目テーブル",
    category: "efficacy",
    description: "主要評価項目（Primary Endpoint）の解析結果を表示する。群間差の推定値、信頼区間、p値を含む。",
    sampleColumns: ["投与群", "N", "LS Mean", "SE", "群間差 [95% CI]", "p値"],
    sampleData: [
      ["実薬群", "150", "-2.45", "0.32", "", ""],
      ["プラセボ群", "150", "-0.82", "0.33", "", ""],
      ["実薬群 - プラセボ群", "", "-1.63", "0.46", "-2.53, -0.73", "0.0004"]
    ],
    sasProc: "PROC MIXED / PROC GLM / PROC REPORT",
    notes: "解析モデル（ANCOVA, MMRM等）はSAPで規定。多重性の調整法も明記。p値は小数点以下4桁、ただしp<0.0001の場合は '<0.0001' と表記。"
  },
  {
    id: "efficacy-secondary",
    name: "副次評価項目テーブル",
    category: "efficacy",
    description: "副次評価項目（Secondary Endpoints）の解析結果を投与群別に要約する。主要評価項目と同様の形式で、複数のエンドポイントをまとめて表示することが多い。",
    sampleColumns: ["エンドポイント", "投与群", "N", "Mean (SD)", "LS Mean差 [95% CI]", "p値"],
    sampleData: [
      ["ACR20 レスポンダー率", "実薬群", "150", "95 (63.3)", "", ""],
      ["ACR20 レスポンダー率", "プラセボ群", "150", "60 (40.0)", "23.3 [13.2, 33.4]", "<0.0001"],
      ["DAS28-CRP 変化量", "実薬群", "150", "-1.85 (1.12)", "-0.92 [-1.21, -0.63]", "<0.0001"]
    ],
    sasProc: "PROC FREQ / PROC LOGISTIC / PROC MIXED / PROC REPORT",
    notes: "副次評価項目の多重性調整方法（固定順序法、Hochberg法等）をSAPに従い適用。二値エンドポイントにはロジスティック回帰等を使用。"
  },
  {
    id: "conmeds",
    name: "併用薬テーブル",
    category: "safety",
    description: "治験中に使用された併用薬をWHO Drug辞書（ATC分類）で集計する。投与群別の使用例数・使用率を表示。",
    sampleColumns: ["ATC分類 / 一般名", "実薬群 N=xxx n(%)", "プラセボ群 N=xxx n(%)", "合計 N=xxx n(%)"],
    sampleData: [
      ["鎮痛薬", "45 (30.0)", "50 (33.3)", "95 (31.7)"],
      ["  アセトアミノフェン", "30 (20.0)", "35 (23.3)", "65 (21.7)"],
      ["  イブプロフェン", "15 (10.0)", "15 (10.0)", "30 (10.0)"]
    ],
    sasProc: "PROC FREQ / PROC REPORT",
    notes: "WHO Drug辞書でコーディング。ATC Level 2, 4, 5等の表示レベルをSAPで規定。治験薬投与前/投与中で分けて集計することが多い。"
  },
  {
    id: "exposure",
    name: "曝露量テーブル",
    category: "efficacy",
    description: "治験薬の投与期間、累積投与量、投与遵守率等の曝露量情報を投与群別に要約する。",
    sampleColumns: ["パラメータ", "統計量", "実薬群 N=xxx", "プラセボ群 N=xxx"],
    sampleData: [
      ["投与期間（日）", "Mean (SD)", "165.2 (35.8)", "160.5 (38.2)"],
      ["投与期間（日）", "Median [Min, Max]", "180.0 [14, 196]", "175.0 [7, 196]"],
      ["服薬遵守率（%）", "Mean (SD)", "95.2 (8.3)", "94.8 (9.1)"]
    ],
    sasProc: "PROC MEANS / PROC UNIVARIATE / PROC REPORT",
    notes: "投与期間は実投与日数と計画投与日数の両方を提示。服薬遵守率 = 実際の投与回数 / 計画投与回数 × 100。"
  }
];

/**
 * 図の種類
 */
const FIGURE_TYPES = [
  {
    id: "kaplan-meier",
    name: "Kaplan-Meier曲線",
    description: "生存時間分析の結果を視覚化する曲線。イベント発生までの時間（OS, PFS等）を投与群別に表示し、群間の差を視覚的に比較する。",
    useCase: "腫瘍領域の臨床試験における無増悪生存期間（PFS）や全生存期間（OS）の評価。時間-イベント型の主要評価項目に使用。",
    dataSource: "ADTTE（Time-to-Event Analysis Dataset）",
    sasProc: "PROC LIFETEST / PROC PHREG / ODS GRAPHICS",
    cssArt: "km-curve"
  },
  {
    id: "forest-plot",
    name: "Forest Plot",
    description: "サブグループ解析の結果を視覚化するプロット。各サブグループのハザード比（またはオッズ比）と信頼区間を横棒で表示し、全体の効果との一貫性を確認する。",
    useCase: "主要評価項目のサブグループ解析（年齢、性別、地域等）。メタアナリシスの結果表示にも使用。",
    dataSource: "ADSL + ADTTE / ADEFF",
    sasProc: "PROC SGPLOT / GTL / SAS Macro",
    cssArt: "forest-plot"
  },
  {
    id: "waterfall",
    name: "ウォーターフォールプロット",
    description: "各被験者の腫瘍縮小率を棒グラフで表示する。被験者を縮小率の大きい順に左から右に並べ、ベースラインからの最大変化率を可視化する。",
    useCase: "腫瘍領域の試験における腫瘍径の最大変化率の評価。RECIST基準に基づく奏効判定の視覚的確認。",
    dataSource: "ADTR（Tumor Response Dataset）/ ADRS",
    sasProc: "PROC SGPLOT (VBAR) / PROC TEMPLATE",
    cssArt: "waterfall"
  },
  {
    id: "bar-chart",
    name: "棒グラフ（バーチャート）",
    description: "カテゴリ別の度数や割合を棒の高さで比較するグラフ。投与群別のレスポンダー率や有害事象発現率の比較に使用する。",
    useCase: "レスポンダー率（ACR20/50/70等）の群間比較。有害事象の発現率TOP10の表示。被験者背景のカテゴリ分布。",
    dataSource: "ADEFF / ADAE / ADSL",
    sasProc: "PROC SGPLOT (VBAR/HBAR) / PROC GCHART",
    cssArt: "bar-chart"
  },
  {
    id: "box-plot",
    name: "箱ひげ図（ボックスプロット）",
    description: "連続変数の分布を要約的に表示するグラフ。中央値、四分位範囲、外れ値を投与群別・時点別に表示する。",
    useCase: "臨床検査値や有効性エンドポイントの時点別推移の群間比較。分布の形状や外れ値の確認。",
    dataSource: "ADLB / ADVS / ADEFF",
    sasProc: "PROC SGPLOT (VBOX) / PROC BOXPLOT",
    cssArt: "box-plot"
  },
  {
    id: "line-chart",
    name: "折れ線グラフ（ラインチャート）",
    description: "測定値の経時的な推移を投与群別に表示するグラフ。平均値とSE/SDのエラーバーを付ける。各時点のn数も表示する。",
    useCase: "有効性評価指標のベースラインからの経時変化。バイタルサインの推移。臨床検査値の経時推移。",
    dataSource: "ADEFF / ADLB / ADVS",
    sasProc: "PROC SGPLOT (SERIES/SCATTER) / PROC GPLOT",
    cssArt: "line-chart"
  },
  {
    id: "swimmer-plot",
    name: "スイマープロット",
    description: "各被験者の治療期間と奏効状況を時間軸に沿って横棒で表示する。治療継続中、イベント発生、奏効期間を色分けして視覚化。",
    useCase: "腫瘍領域の試験における個別被験者の奏効状況と治療期間の可視化。Phase I/II試験で使用頻度が高い。",
    dataSource: "ADRS / ADTTE / ADSL",
    sasProc: "PROC SGPLOT (HIGHLOW) / GTL",
    cssArt: "swimmer-plot"
  }
];

/**
 * 一覧表の種類
 */
const LISTING_TYPES = [
  {
    id: "patient-listing",
    name: "被験者一覧",
    description: "全被験者の基本情報（被験者番号、施設番号、投与群、年齢、性別、登録日、完了/中止状況等）を一覧表で表示する。被験者データの全体像を把握するための基本リスティング。",
    keyColumns: ["施設番号", "被験者番号", "投与群", "年齢", "性別", "登録日", "最終投与日", "試験状況", "中止理由"],
    sortOrder: "施設番号、被験者番号の昇順",
    sampleData: [
      ["001", "001-001", "実薬群", "55", "男性", "2024/04/01", "2024/09/28", "完了", ""],
      ["001", "001-002", "プラセボ群", "48", "女性", "2024/04/05", "2024/07/15", "中止", "有害事象"],
      ["002", "002-001", "実薬群", "62", "男性", "2024/04/10", "2024/10/05", "完了", ""]
    ]
  },
  {
    id: "ae-listing",
    name: "有害事象一覧",
    description: "全有害事象の詳細情報（発現日、消失日、重症度、因果関係、処置、転帰等）を被験者単位で一覧表示する。安全性の詳細評価に不可欠。",
    keyColumns: ["被験者番号", "SOC", "PT", "発現日", "消失日", "重症度", "重篤性", "因果関係", "処置", "転帰"],
    sortOrder: "被験者番号、発現日の昇順",
    sampleData: [
      ["001-001", "胃腸障害", "悪心", "2024/04/15", "2024/04/18", "軽度", "非重篤", "関連あるかもしれない", "投与継続", "回復"],
      ["001-001", "神経系障害", "頭痛", "2024/05/02", "2024/05/03", "軽度", "非重篤", "関連なし", "併用薬投与", "回復"],
      ["001-002", "胃腸障害", "嘔吐", "2024/05/10", "2024/05/15", "中等度", "非重篤", "おそらく関連あり", "休薬", "回復"]
    ]
  },
  {
    id: "conmed-listing",
    name: "併用薬一覧",
    description: "治験中に使用された全併用薬の詳細情報を被験者単位で表示する。WHO Drug辞書に基づくATC分類、使用理由、投与期間を含む。",
    keyColumns: ["被験者番号", "薬剤名", "ATC分類", "投与経路", "用量", "開始日", "終了日", "使用理由", "治験薬との関係"],
    sortOrder: "被験者番号、開始日の昇順",
    sampleData: [
      ["001-001", "アセトアミノフェン", "N02BE01", "経口", "400mg", "2024/04/20", "2024/04/22", "頭痛", "投与中"],
      ["001-001", "ロキソプロフェン", "M01AE01", "経口", "60mg", "2024/06/01", "2024/06/05", "腰痛", "投与中"],
      ["001-002", "ドンペリドン", "A03FA03", "経口", "10mg", "2024/05/10", "2024/05/15", "嘔吐", "投与中"]
    ]
  },
  {
    id: "deviation-listing",
    name: "治験実施計画書逸脱一覧",
    description: "治験実施計画書からの逸脱（プロトコルデビエーション）の詳細を一覧表示する。逸脱の種類、発見日、影響度、是正措置等を含む。",
    keyColumns: ["被験者番号", "施設番号", "逸脱カテゴリ", "逸脱の詳細", "発見日", "影響度", "解析対象集団への影響", "是正措置"],
    sortOrder: "施設番号、被験者番号、発見日の昇順",
    sampleData: [
      ["001-003", "001", "選択/除外基準", "除外基準に該当（併存疾患）", "2024/05/20", "重大", "PPS除外", "スポンサーへ報告"],
      ["002-005", "002", "来院ウィンドウ", "Week 8来院が許容範囲外（+5日）", "2024/07/10", "軽微", "影響なし", "モニタリングで指導"],
      ["003-002", "003", "併用禁止薬", "禁止薬の使用あり", "2024/08/15", "重大", "PPS除外", "IRBへ報告"]
    ]
  },
  {
    id: "sae-listing",
    name: "重篤な有害事象（SAE）一覧",
    description: "重篤な有害事象の詳細情報を一覧表示する。報告基準、因果関係判定、規制当局への報告状況等を含む重要な安全性リスティング。",
    keyColumns: ["被験者番号", "SAE名", "発現日", "重篤性基準", "転帰", "因果関係", "報告日", "規制当局報告"],
    sortOrder: "被験者番号、発現日の昇順",
    sampleData: [
      ["001-005", "肺炎", "2024/06/01", "入院", "回復", "関連なし", "2024/06/02", "15日報告"],
      ["002-003", "心筋梗塞", "2024/07/20", "生命を脅かす", "回復（後遺症あり）", "関連あるかもしれない", "2024/07/20", "7日報告"],
      ["003-008", "薬物性肝障害", "2024/09/05", "入院", "回復", "おそらく関連あり", "2024/09/05", "15日報告"]
    ]
  },
  {
    id: "lab-abnormal-listing",
    name: "臨床検査異常値一覧",
    description: "臨床検査で基準値外または臨床的に有意な異常値を示した被験者の一覧。検査値の推移と医師判定を含む。",
    keyColumns: ["被験者番号", "検査項目", "測定時点", "結果", "基準値範囲", "CTCAE Grade", "臨床的有意性", "処置"],
    sortOrder: "被験者番号、検査項目、測定時点の昇順",
    sampleData: [
      ["001-003", "ALT", "Week 4", "152 U/L", "5-45 U/L", "Grade 3", "有意", "休薬"],
      ["001-003", "ALT", "Week 6", "85 U/L", "5-45 U/L", "Grade 1", "有意", "減量して再開"],
      ["002-007", "好中球数", "Week 8", "0.8 x10^9/L", "1.5-7.5", "Grade 3", "有意", "休薬"]
    ]
  }
];

/**
 * TFLシェルの構成要素
 */
const TFL_SHELLS = {
  title: {
    label: "タイトル",
    description: "テーブル番号とタイトルを含む。プロトコル番号、解析対象集団名を付記。",
    rules: [
      "Table X.X.X の形式で番号付け（例: Table 14.1.1）",
      "タイトルは内容を簡潔に表す（例: Summary of Adverse Events by SOC and PT - Safety Analysis Set）",
      "解析対象集団を明記（FAS / PPS / Safety Analysis Set等）",
      "太字（Bold）で記載"
    ],
    example: "Table 14.3.1.1\nSummary of Adverse Events by System Organ Class and Preferred Term\nSafety Analysis Set"
  },
  columnHeaders: {
    label: "カラムヘッダ",
    description: "各列のタイトル。投与群名とN数を含む。",
    rules: [
      "投与群名とN数を記載（例: Drug A N=xxx）",
      "複数行ヘッダの場合は適切に結合",
      "センタリングが基本",
      "ヘッダ下に罫線（横線）を引く"
    ],
    example: "                    Drug A      Placebo      Total\n                    N=150       N=150        N=300"
  },
  body: {
    label: "ボディ（本体）",
    description: "テーブルの主要データ部分。",
    rules: [
      "カテゴリ変数は左寄せ、数値は右寄せまたはデシマル揃え",
      "サブカテゴリはインデント",
      "行間は適切なスペーシング",
      "空白行でセクション区切り"
    ],
    example: "Gastrointestinal disorders    25 (16.7)   10 (6.7)   35 (11.7)\n  Nausea                      15 (10.0)    5 (3.3)   20 (6.7)\n  Vomiting                    10 (6.7)     5 (3.3)   15 (5.0)"
  },
  footnotes: {
    label: "脚注",
    description: "テーブルの補足情報。データソース、集計方法、略語の説明等。",
    rules: [
      "番号付き脚注（a, b, c...）または記号付き脚注",
      "データソース（ADaM dataset名）を記載",
      "略語の定義を記載",
      "統計手法の説明を記載",
      "プログラム名・出力日時を記載"
    ],
    example: "Source: ADAE\nNote: Percentages are based on N in the column heading.\nAE = Adverse Event; SOC = System Organ Class; PT = Preferred Term\nMedDRA version XX.X\nProgram: t_ae_summary.sas  Output: YYYY-MM-DD HH:MM"
  },
  pageInfo: {
    label: "ページ情報",
    description: "ページ番号や出力プログラム情報。",
    rules: [
      "ページ番号を右下に表示（Page X of Y）",
      "出力プログラム名を左下に表示",
      "出力日時を記載",
      "ランドスケープ/ポートレート指定"
    ],
    example: "t_ae_summary.sas                              Page 1 of 3\n2024-10-01 14:30"
  }
};

/**
 * 書式ルール
 */
const FORMAT_RULES = [
  {
    id: "decimal-places",
    name: "小数点桁数のルール",
    description: "測定値の小数点桁数は元データの精度 +1桁とする。平均値は+1桁、標準偏差は+2桁が基本。",
    examples: ["元データが整数 → Mean: XX.X, SD: XX.XX", "元データが小数点1桁 → Mean: XX.XX, SD: XX.XXX"],
    icon: "1.23"
  },
  {
    id: "n-percent",
    name: "N (%) の表記",
    description: "度数とパーセンテージはn (XX.X) の形式で表示する。パーセント記号は列ヘッダに記載し、セル内には含めない。",
    examples: ["正しい: 25 (16.7)", "間違い: 25 (16.7%)", "0の場合: 0 または 0 (0.0)"],
    icon: "n(%)"
  },
  {
    id: "p-value",
    name: "p値の表記",
    description: "p値は小数点以下4桁で表示する。0.0001未満の場合は '<0.0001' と表記する。",
    examples: ["p=0.0234", "p<0.0001", "有意水準: p<0.05（両側）"],
    icon: "p<.05"
  },
  {
    id: "date-format",
    name: "日付フォーマット",
    description: "日付はDDMMMYYYY形式（英語月略記）を使用する。不完全日付はCDISC仕様に従う。",
    examples: ["15MAR2024", "不完全: --MAR2024（日が不明）", "UN---2024（月が不明）"],
    icon: "DDMMM"
  },
  {
    id: "missing-data",
    name: "欠測値の表記",
    description: "欠測値はデータの種類に応じて適切に表示する。空白、ダッシュ(-)、'NC'（Not Calculated）等を使い分ける。",
    examples: ["該当データなし: -", "計算不能: NC", "未評価: NE (Not Evaluable)"],
    icon: "N/A"
  },
  {
    id: "ci-format",
    name: "信頼区間の表記",
    description: "信頼区間は [下限, 上限] の形式で表示する。信頼水準は95%が基本。",
    examples: ["正しい: [-2.53, -0.73]", "ヘッダ例: 95% CI", "ハザード比: 0.65 [0.48, 0.88]"],
    icon: "[CI]"
  },
  {
    id: "summary-stats",
    name: "要約統計量の表示順",
    description: "連続変数の要約統計量は定められた順序で表示する。",
    examples: ["基本: N, Mean, SD, Median, Min, Max", "詳細: N, Mean, SD, SE, Median, Q1, Q3, Min, Max", "変化量も同じ順序"],
    icon: "Stats"
  },
  {
    id: "population-label",
    name: "解析対象集団の記載",
    description: "テーブルのタイトルまたはサブタイトルに解析対象集団名を明記する。",
    examples: ["Full Analysis Set (FAS)", "Per Protocol Set (PPS)", "Safety Analysis Set"],
    icon: "FAS"
  },
  {
    id: "sorting-rules",
    name: "ソート順のルール",
    description: "テーブルのソート順はSAPで規定する。有害事象はSOC国際順、PT頻度順等が一般的。",
    examples: ["AEテーブル: SOC (International Order) → PT (降順頻度)", "人口統計: カテゴリの論理順", "検査値: 検査項目カテゴリ順"],
    icon: "Sort"
  },
  {
    id: "page-layout",
    name: "ページレイアウト",
    description: "テーブルの出力形式（用紙サイズ、向き、フォント等）は事前に規定する。",
    examples: ["ランドスケープ: 幅広テーブル", "ポートレート: 列数少のテーブル", "フォント: Courier New 8-9pt"],
    icon: "Layout"
  },
  {
    id: "number-alignment",
    name: "数値のアラインメント",
    description: "数値は小数点位置を揃えるデシマルアラインメントが基本。カテゴリは左寄せ。",
    examples: ["デシマルアラインメント: 小数点で揃える", "左寄せ: カテゴリ名、被験者番号", "右寄せ: 整数値"],
    icon: "Align"
  },
  {
    id: "abbreviations",
    name: "略語の定義",
    description: "テーブル内で使用する略語は全て脚注で定義する。初出時にフルスペルを記載。",
    examples: ["AE = Adverse Event", "SOC = System Organ Class", "PT = Preferred Term; CI = Confidence Interval"],
    icon: "ABC"
  }
];

/**
 * 作成ガイドステップ
 */
const GUIDE_STEPS = [
  {
    id: 1,
    title: "SAP・モックTFLの確認",
    description: "統計解析計画書（SAP）とモックTFL（TFLシェル）を熟読し、出力仕様を完全に把握する。",
    details: [
      "SAPの解析方法セクションで統計手法、モデル、仮説検定を確認",
      "モックTFLのレイアウト（タイトル、カラムヘッダ、脚注）を確認",
      "解析対象集団（FAS、PPS、Safety Set等）の定義を確認",
      "ソート順、表示形式（小数桁数、N(%)の形式等）を確認",
      "不明点はSAPの著者（統計解析担当）に質問する"
    ],
    tips: "モックTFLは最も重要なインプット。プログラミング開始前に必ずモックとSAPの整合性を確認する。不整合があれば統計チームに確認。",
    pitfalls: [
      "SAPとモックTFLの間に不整合があるのに気づかない",
      "解析対象集団の定義を正確に理解していない",
      "書式ルール（小数点桁数等）を見落とす"
    ]
  },
  {
    id: 2,
    title: "ADaMデータセットの確認",
    description: "TFL作成に必要なADaM（Analysis Data Model）データセットの構造と内容を確認する。",
    details: [
      "使用するADaMデータセット（ADSL, ADAE, ADLB, ADEFF等）を特定",
      "各データセットの変数名、ラベル、フォーマットを確認（define.xml参照）",
      "解析に必要な派生変数（フラグ、カテゴリ変数等）の有無を確認",
      "データセットのレコード構造（BDS / OCCDS）を理解",
      "ADaMデータセットの検証結果（Pinnacle 21等）を確認"
    ],
    tips: "ADSLのフラグ変数（FASFL, PPROTFL, SAFFL等）で解析対象集団を特定する。ADaMデータセットが未完成の場合はダミーデータで開発を先行する。",
    pitfalls: [
      "必要な派生変数がADaMに存在しないのに後で気づく",
      "BDS構造とOCCDS構造を混同する",
      "ADaMのPARAMCD/PARAMの対応を間違える"
    ]
  },
  {
    id: 3,
    title: "プログラム作成",
    description: "SASプログラムを作成し、モックTFLの仕様通りにTFLを出力する。",
    details: [
      "プログラムのヘッダコメント（プログラム名、目的、作成者、日付等）を記載",
      "データの読み込みとフィルタリング（解析対象集団の絞り込み）",
      "集計処理（PROC FREQ, PROC MEANS, PROC MIXED等）",
      "出力フォーマットの整形（PROC REPORT / ODS）",
      "マクロの活用（共通処理の標準化）",
      "ログのチェック（NOTE, WARNING, ERRORの確認）"
    ],
    tips: "共通マクロ（ヘッダ/フッタ出力、N(%)表示、p値フォーマット等）を活用する。PROC REPORTのCOMPUTE/CALLを使いこなすと複雑なレイアウトも実現可能。",
    pitfalls: [
      "SASログにWARNINGやERRORがあるのに見逃す",
      "分母Nの取り方を間違える（全体N vs カテゴリN）",
      "ソート順を間違える",
      "ページ分割の位置が不適切"
    ]
  },
  {
    id: 4,
    title: "QC（品質管理）",
    description: "独立した方法でTFLの正確性を検証する。ダブルプログラミングまたはデータレビューによるQCを実施する。",
    details: [
      "ダブルプログラミング：独立したプログラマーが別プログラムで同じ結果を再現",
      "PROC COMPARE でプロダクションとQCの結果を比較",
      "数値の一致確認（丸め誤差の許容範囲を定義）",
      "レイアウト・書式の目視確認（タイトル、脚注、罫線等）",
      "SAPとモックTFLとの整合性の最終確認"
    ],
    tips: "QCはプロダクションプログラマーとは別の担当者が行う。PROC COMPAREの出力を残してQC記録とする。差異があれば原因を特定・修正。",
    pitfalls: [
      "QCプログラムがプロダクションのコピーになってしまう",
      "小数点の丸め方針が一致していない",
      "レイアウトのQCを省略する",
      "差異の原因調査が不十分"
    ]
  },
  {
    id: 5,
    title: "出力・レビュー・フィックス",
    description: "最終版のTFLを出力し、統計解析担当者・メディカルライターのレビューを受けて修正を反映する。",
    details: [
      "PDF/RTF形式で最終出力を生成",
      "統計解析担当者によるメディカルレビュー",
      "メディカルライターによるCSRへの組み込み確認",
      "レビューコメントへの対応と修正",
      "修正履歴の管理（バージョン管理）",
      "最終版の承認とロック"
    ],
    tips: "レビューコメントはトラッキングシートで一元管理する。軽微な修正でも必ずQCをやり直す。最終版の出力日時とプログラムバージョンを記録。",
    pitfalls: [
      "レビューコメントの反映漏れ",
      "修正後のQC再実施を忘れる",
      "CSRの本文とTFLの数値が不整合",
      "最終版でないバージョンを提出してしまう"
    ]
  }
];

/**
 * クイズデータ
 */
const QUIZ_DATA = [
  {
    id: 1,
    question: "有害事象テーブルで同一被験者が同じPTの有害事象を3回発現した場合、集計上何例としてカウントするか？",
    choices: ["0例", "1例", "2例", "3例"],
    answer: 1,
    explanation: "有害事象テーブルは被験者単位（Subject-level）でカウントするのが基本です。同一被験者で同一PTが複数回発現しても1例として集計します。発現件数（Event-level）の集計は別途行うことがあります。"
  },
  {
    id: 2,
    question: "p値が0.00003の場合、テーブルでの正しい表記は？",
    choices: ["p=0.0000", "p=0.00003", "p<0.0001", "p<0.001"],
    answer: 2,
    explanation: "p値は小数点以下4桁で表示するのが基本ルールです。0.0001未満の場合は '<0.0001' と表記します。0.00003はp<0.0001に該当するため、'p<0.0001' が正しい表記です。"
  },
  {
    id: 3,
    question: "TFLの作成で最初に確認すべきドキュメントは？",
    choices: ["治験総括報告書（CSR）", "EDC仕様書", "統計解析計画書（SAP）とモックTFL", "治験実施計画書"],
    answer: 2,
    explanation: "TFL作成はSAP（統計解析計画書）とモックTFL（TFLシェル）の確認から始めます。SAPで解析方法を、モックTFLで出力フォーマットを理解することが、正確なプログラミングの第一歩です。"
  },
  {
    id: 4,
    question: "N=150の投与群で25例に有害事象が発現した。正しい表記は？",
    choices: ["25 (16.7%)", "25 (16.7)", "25/150 (16.7%)", "16.7% (n=25)"],
    answer: 1,
    explanation: "度数とパーセンテージは 'n (XX.X)' の形式で表示します。パーセント記号(%)は列ヘッダに含め、セル内には含めません。したがって '25 (16.7)' が正しい表記です。"
  },
  {
    id: 5,
    question: "ADaMデータセットで解析対象集団を特定するために使用する変数は？",
    choices: ["TRTP / TRTA", "FASFL / SAFFL", "AVAL / BASE", "PARAMCD / PARAM"],
    answer: 1,
    explanation: "ADSLのフラグ変数（FASFL, PPROTFL, SAFFL等）で解析対象集団を特定します。FASFL='Y'がFull Analysis Set、SAFFL='Y'がSafety Analysis Set、PPROTFL='Y'がPer Protocol Setです。"
  },
  {
    id: 6,
    question: "Kaplan-Meier曲線の作成に使用するSAS PROCは？",
    choices: ["PROC MEANS", "PROC LIFETEST", "PROC LOGISTIC", "PROC FREQ"],
    answer: 1,
    explanation: "Kaplan-Meier曲線の作成にはPROC LIFETESTを使用します。STRATA文で群分け、TIME文で生存時間とイベント変数を指定します。ODS GRAPHICSと組み合わせて高品質なグラフを出力できます。"
  },
  {
    id: 7,
    question: "QC（ダブルプログラミング）で結果の比較に使用する代表的なSAS PROCは？",
    choices: ["PROC FREQ", "PROC COMPARE", "PROC CONTENTS", "PROC PRINT"],
    answer: 1,
    explanation: "PROC COMPAREはプロダクションとQCの2つのデータセットを比較し、差異を詳細に報告します。数値の一致、変数の有無、レコード数の違い等を自動的に検出でき、QCの基本ツールです。"
  },
  {
    id: 8,
    question: "有害事象テーブルでSOC（器官別大分類）のソート順として国際的に推奨されるのは？",
    choices: ["アルファベット順", "発現頻度の降順", "International SOC Order（国際順）", "MedDRAコード番号順"],
    answer: 2,
    explanation: "SOCのソート順はICH推奨のInternational SOC Orderが標準です。これはMedDRAで定義された国際的に統一されたソート順で、規制当局への申請でも広く使用されています。PT（基本語）は通常、発現頻度の降順でソートします。"
  },
  {
    id: 9,
    question: "Forest PlotでHazard Ratio = 1.0 の縦線が表すのは？",
    choices: ["治療効果あり", "統計的有意", "効果なし（帰無仮説）", "プラセボ優越"],
    answer: 2,
    explanation: "Forest PlotでHR=1.0の縦線は帰無仮説（治療効果なし）を表します。HR<1.0は実薬群が優れていること、HR>1.0はプラセボ群が優れていることを示します。各サブグループのCIがこの線を跨ぐかどうかで統計的有意性を視覚的に判断できます。"
  },
  {
    id: 10,
    question: "TFLの脚注に必ず記載すべき項目として最も優先度が高いものは？",
    choices: ["作成者名", "レビュー日", "データソース（ADaMデータセット名）と略語定義", "スポンサー名"],
    answer: 2,
    explanation: "TFLの脚注にはデータソース（使用したADaMデータセット名）、略語の定義、集計方法の説明、MedDRAバージョン（該当する場合）等を記載します。これらにより、テーブルの再現性と解釈可能性が確保されます。"
  }
];

/**
 * クイズ結果の診断マップ
 */
const QUIZ_RESULTS = {
  master: {
    min: 9,
    title: "TFLマスター",
    icon: "crown",
    description: "TFL作成のプロフェッショナルです。SAPの解釈からQCまで、一連のプロセスを完全に理解しています。",
    advice: "後輩の指導やSOP改善に知識を活かしましょう。複雑なカスタムTFLの作成もお任せできるレベルです。"
  },
  advanced: {
    min: 7,
    title: "上級プログラマー",
    icon: "star",
    description: "TFL作成の実務に十分対応できるレベルです。主要なテーブルタイプと書式ルールを理解しています。",
    advice: "Forest PlotやKaplan-Meier曲線など、高度な図の作成にもチャレンジしてスキルを広げましょう。"
  },
  intermediate: {
    min: 5,
    title: "中級プログラマー",
    icon: "chart",
    description: "基本的なTFL作成の知識はありますが、応用的な場面で迷うことがあるかもしれません。",
    advice: "書式ルールとQCプロセスを重点的に復習しましょう。実際のモックTFLを見ながら学ぶと効果的です。"
  },
  beginner: {
    min: 3,
    title: "初級プログラマー",
    icon: "book",
    description: "TFL作成の基礎概念は理解していますが、実務的な知識をもう少し強化する必要があります。",
    advice: "作成ガイドを通して一連の作成プロセスを把握し、書式ルールを一つずつ覚えていきましょう。"
  },
  novice: {
    min: 0,
    title: "TFL入門者",
    icon: "seedling",
    description: "TFL作成はこれからのスタートです。基礎から着実に学んでいきましょう。",
    advice: "まずはテーブルの種類と書式ルールの基本から学習を始めましょう。作成ガイドのStep 1から順に進めると理解が深まります。"
  }
};
