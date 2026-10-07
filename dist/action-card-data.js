// Source: user-provided hegemony_action_cards_full_v6_bonus_fixed.json. Preserve descriptions and metadata.
(function(root){
const data={
  "working_class": {
    "base": [
      {
        "id": "wc_affordable_housing",
        "class": "working_class",
        "name": "手頃な住宅",
        "copies": 1,
        "expansion": "base",
        "effect": "資本家階級に20V支払って5VPを得る、または中産階級に10V支払って3VPを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Affordable Housing"
      },
      {
        "id": "wc_healthcare_benefits",
        "class": "working_class",
        "name": "医療給付",
        "copies": 2,
        "expansion": "base",
        "effect": "国家から、自分の人口値までの医療を、費用の半額（端数切り上げ）で購入する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": 1
        },
        "name_en": "Healthcare Benefits"
      },
      {
        "id": "wc_need_for_change",
        "class": "working_class",
        "name": "変革の必要",
        "copies": 3,
        "expansion": "base",
        "effect": "法案を1つ提出する。その後、最初とは異なる法案をもう1つ提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Need for Change"
      },
      {
        "id": "wc_signing_bonus",
        "class": "working_class",
        "name": "雇用ボーナス",
        "copies": 2,
        "expansion": "base",
        "effect": "失業中の労働者を最大4人配置する。この方法で企業に配置した労働者1人につき、その企業の所有者から4Vを得る。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": null,
        "name_en": "Signing Bonus"
      },
      {
        "id": "wc_state_scholarship",
        "class": "working_class",
        "name": "国家奨学金",
        "copies": 2,
        "expansion": "base",
        "effect": "国家から、自分の人口値までの教育を、費用の半額（端数切り上げ）で購入する。",
        "requirement": "政策5がBまたはC（5B/5C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": 1
        },
        "name_en": "State Scholarship"
      },
      {
        "id": "wc_cooperative_farm",
        "class": "working_class",
        "name": "農業協同組合",
        "copies": 2,
        "expansion": "base",
        "effect": "失業中の労働者が3人以上いる場合、Cooperative Farmを開始して自分のプレイヤーボードの横に置き、その失業労働者3人を配置する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Cooperative Farm"
      },
      {
        "id": "wc_labor_market_deregulation",
        "class": "working_class",
        "name": "労働市場の規制緩和",
        "copies": 2,
        "expansion": "base",
        "effect": "失業中の労働者を任意の人数配置する。政策2Cが施行中なら、すでに配置済みの労働者も任意の人数、別の企業へ再配置できる。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": null,
        "name_en": "Labor Market Deregulation"
      },
      {
        "id": "wc_highlight_social_issues",
        "class": "working_class",
        "name": "社会問題の喚起",
        "copies": 1,
        "expansion": "base",
        "effect": "国家から影響力3を15Vで購入する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": 1
        },
        "name_en": "Highlight Social Issues"
      },
      {
        "id": "wc_fake_news",
        "class": "working_class",
        "name": "フェイクニュース",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から投票キューブを6個引く。そのうち最大4個をサプライへ戻し、残りを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Fake News"
      },
      {
        "id": "wc_interest_groups",
        "class": "working_class",
        "name": "利益団体",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から、他クラスの投票キューブを3個引くまで公開する。その3個を同数の自分の投票キューブ（サプライから）と置き換え、置き換えた自分のキューブと残りの公開キューブを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Interest Groups"
      },
      {
        "id": "wc_immigration",
        "class": "working_class",
        "name": "移民",
        "copies": 2,
        "expansion": "base",
        "effect": "失業労働者が4人以上いる場合、最大2人を取り除き、その分だけ人口を減らす（最低値未満にはしない）。取り除いた一般労働者1人につき5V、熟練労働者1人につき10Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Immigration"
      },
      {
        "id": "wc_boost_domestic_tourism",
        "class": "working_class",
        "name": "国内観光の促進",
        "copies": 2,
        "expansion": "base",
        "effect": "他プレイヤーから、自分の人口値までの贅沢品を、費用の半額（端数切り上げ）で購入する。残額は国家が支払う。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": 1
        },
        "name_en": "Boost Domestic Tourism"
      },
      {
        "id": "wc_workplace_accident",
        "class": "working_class",
        "name": "労働災害",
        "copies": 1,
        "expansion": "base",
        "effect": "産業部門（食料・贅沢品・医療・教育・影響力）を1つ選ぶ。その部門で、自分の労働者が配置されている相手プレイヤーの企業1つにつき、そのプレイヤーから8Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Workplace Accident"
      },
      {
        "id": "wc_unemployment_benefits",
        "class": "working_class",
        "name": "失業給付",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の失業労働者1人につき国家から5Vを得る。その後、国家から商品・サービスを購入できる。 正当性ボーナス：X = 失業中の自分の労働者3人ごとに1。",
        "requirement": "政策4がAまたはB（4A/4B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": "X",
          "detail": "X = 失業中の自分の労働者3人ごとに1",
          "calculation": {
            "basis": "unemployed_workers",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Unemployment Benefits"
      },
      {
        "id": "wc_workers_movement",
        "class": "working_class",
        "name": "労働者運動",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、労働市場（政策2）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Workers' Movement"
      },
      {
        "id": "wc_healthcare_movement",
        "class": "working_class",
        "name": "医療運動",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、福祉国家－医療（政策4）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Healthcare Movement"
      },
      {
        "id": "wc_student_movement",
        "class": "working_class",
        "name": "学生運動",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、福祉国家－教育（政策5）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Student Movement"
      },
      {
        "id": "wc_proletarians_unite",
        "class": "working_class",
        "name": "万国の労働者よ、団結せよ！",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の人口値と同数の自分の投票キューブをサプライから投票袋へ加える。",
        "requirement": null,
        "bonus": null,
        "name_en": "Proletarians of the World, Unite!"
      },
      {
        "id": "wc_supplemental_income_program",
        "class": "working_class",
        "name": "所得補助制度",
        "copies": 2,
        "expansion": "base",
        "effect": "配置済みの自分の労働者1人につき国家から1Vを得る。その後、商品・サービスを購入できる。 正当性ボーナス：X = 配置済みの自分の労働者10人ごとに1。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": "X",
          "detail": "X = 配置済みの自分の労働者10人ごとに1",
          "calculation": {
            "basis": "assigned_workers",
            "per": 10,
            "gain": 1
          }
        },
        "name_en": "Supplemental Income Program"
      },
      {
        "id": "wc_immigration_reform",
        "class": "working_class",
        "name": "移民改革",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、移民（政策7）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Immigration Reform"
      },
      {
        "id": "wc_radical_reforms",
        "class": "working_class",
        "name": "急進的改革",
        "copies": 1,
        "expansion": "base",
        "effect": "法案を提出する。現在の政策位置に隣接していないスペースにも提案マーカーを置ける。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Radical Reforms"
      },
      {
        "id": "wc_general_strike",
        "class": "working_class",
        "name": "ゼネスト",
        "copies": 2,
        "expansion": "base",
        "effect": "ストライキを行う。自分が持つ活動中の労働組合1つにつき、追加でストライキマーカーを1個置ける。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": null,
        "name_en": "General Strike"
      },
      {
        "id": "wc_public_opinion_polling",
        "class": "working_class",
        "name": "世論調査",
        "copies": 1,
        "expansion": "base",
        "effect": "法案を提出し、投票袋から投票キューブ5個を公開する。その法案について影響力を支払わず即時投票を行ってよい。行う場合は新たに引かず、公開した5個を使う。行わない場合は投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Opinion Polling"
      },
      {
        "id": "wc_specialization",
        "class": "working_class",
        "name": "専門化",
        "copies": 2,
        "expansion": "base",
        "effect": "任意の種類の熟練労働者1人をサプライから失業エリアへ置く。その後、労働者を最大3人配置する。",
        "requirement": "政策7がBまたはC（7B/7C）",
        "bonus": null,
        "name_en": "Specialization"
      },
      {
        "id": "wc_public_sector_overtime",
        "class": "working_class",
        "name": "公共部門の時間外労働",
        "copies": 2,
        "expansion": "base",
        "effect": "稼働中の公共企業を1つ選ぶ。国家がそこに配置された労働者へ賃金を支払い、その企業で生産を行う。その後、その企業が生産した種類の商品・サービスを国家から購入できる。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Sector Overtime"
      }
    ],
    "crisis_and_control": [
      {
        "id": "wc_rising_covid_19_cases",
        "class": "working_class",
        "name": "COVID-19感染者数の増加",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "国家から、自分の人口値の半分（端数切り上げ）までの医療を無料で得る。その後、任意の数の供給元から、それぞれ自分の人口値まで医療を購入できる。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "working_class",
          "amount": 1
        },
        "name_en": "Rising Covid-19 Cases"
      },
      {
        "id": "wc_change_government_agenda",
        "class": "working_class",
        "name": "政府方針の変更",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上の法案が3つ以下なら、他プレイヤーの法案を1つ捨てる。その後、自分が別の法案を提出し、最後にその相手も別の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Change of Government Agenda"
      },
      {
        "id": "wc_protect_status_quo",
        "class": "working_class",
        "name": "現状維持",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "政策を1つ選ぶ。このラウンド中、その政策には法案を提出できない。目印として自分の提案マーカーを現行政策欄に置く。その後、影響力1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Protect the Status Quo"
      },
      {
        "id": "wc_reveal_political_scandal",
        "class": "working_class",
        "name": "政治スキャンダルの暴露",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "他プレイヤー1人から影響力2を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Reveal Political Scandal"
      },
      {
        "id": "wc_momentum_for_change",
        "class": "working_class",
        "name": "変革への勢い",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上にある自分の法案提案マーカー1個につき影響力1を得る。その後、法案を提出する。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Momentum for Change"
      }
    ]
  },
  "middle_class": {
    "base": [
      {
        "id": "mc_healthcare_benefits",
        "class": "middle_class",
        "name": "医療給付",
        "copies": 1,
        "expansion": "base",
        "effect": "国家から、自分の人口値までの医療を、費用の半額（端数切り上げ）で購入する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "Healthcare Benefits"
      },
      {
        "id": "mc_foreign_market_insight",
        "class": "middle_class",
        "name": "海外市場の知見",
        "copies": 2,
        "expansion": "base",
        "effect": "次の輸出カードを公開する。現在の輸出カードと交換してよい。その後、海外市場へ販売し、使わなかった輸出カードを捨てる。各取引を最大2回まで実行できる。",
        "requirement": null,
        "bonus": null,
        "name_en": "Foreign Market Insight"
      },
      {
        "id": "mc_personal_consumption",
        "class": "middle_class",
        "name": "個人消費",
        "copies": 2,
        "expansion": "base",
        "effect": "任意の数の供給元から、それぞれ自分の人口値まで商品・サービスを購入する。または、1つの供給元から自分の人口値の2倍まで購入する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Personal Consumption"
      },
      {
        "id": "mc_small_business_grant",
        "class": "middle_class",
        "name": "中小企業助成金",
        "copies": 2,
        "expansion": "base",
        "effect": "企業を1つ開始する。その費用は国家が支払う。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "Small Business Grant"
      },
      {
        "id": "mc_labor_market_deregulation",
        "class": "middle_class",
        "name": "労働市場の規制緩和",
        "copies": 1,
        "expansion": "base",
        "effect": "失業中の労働者を任意の人数配置する。政策2Cが施行中なら、配置済み労働者も任意の人数、別の企業へ再配置できる。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": null,
        "name_en": "Labor Market Deregulation"
      },
      {
        "id": "mc_health_crisis",
        "class": "middle_class",
        "name": "医療危機",
        "copies": 1,
        "expansion": "base",
        "effect": "医療を最大6個、1個10Vで国家へ売る。 正当性ボーナス：X = 国家へ売った医療3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = 国家へ売った医療3個ごとに1",
          "calculation": {
            "basis": "healthcare_sold_to_state",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Health Crisis"
      },
      {
        "id": "mc_highlight_social_issues",
        "class": "middle_class",
        "name": "社会問題の喚起",
        "copies": 1,
        "expansion": "base",
        "effect": "国家から影響力3を15Vで購入する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "Highlight Social Issues"
      },
      {
        "id": "mc_fake_news",
        "class": "middle_class",
        "name": "フェイクニュース",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から投票キューブを6個引く。そのうち最大4個をサプライへ戻し、残りを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Fake News"
      },
      {
        "id": "mc_interest_groups",
        "class": "middle_class",
        "name": "利益団体",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から、他クラスの投票キューブを3個引くまで公開する。その3個を同数の自分の投票キューブ（サプライから）と置き換え、置き換えた自分のキューブと残りの公開キューブを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Interest Groups"
      },
      {
        "id": "mc_immigration",
        "class": "middle_class",
        "name": "移民",
        "copies": 3,
        "expansion": "base",
        "effect": "失業労働者が4人以上いる場合、最大2人を取り除き、その分だけ人口を減らす（最低値未満にはしない）。取り除いた一般労働者1人につき5V、熟練労働者1人につき10Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Immigration"
      },
      {
        "id": "mc_growing_business",
        "class": "middle_class",
        "name": "成長企業",
        "copies": 2,
        "expansion": "base",
        "effect": "倉庫を1つ無料で建設し、特定資源に対応する位置に置く。その後、企業を開始してよい。その企業がその資源を生産する場合、費用を4V減らす。",
        "requirement": null,
        "bonus": null,
        "name_en": "Growing Business"
      },
      {
        "id": "mc_land_of_opportunity",
        "class": "middle_class",
        "name": "機会の国",
        "copies": 2,
        "expansion": "base",
        "effect": "任意の種類の中産階級熟練労働者1人をサプライから使って企業を開始する。",
        "requirement": "政策7がBまたはC（7B/7C）",
        "bonus": null,
        "name_en": "Land of Opportunity"
      },
      {
        "id": "mc_voice_of_middle_class_workers",
        "class": "middle_class",
        "name": "中産階級の声",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブを、2＋『自分の労働者が配置されている公共企業・資本家企業の数』だけサプライから投票袋へ加える。",
        "requirement": null,
        "bonus": null,
        "name_en": "Voice of Middle Class Workers"
      },
      {
        "id": "mc_new_theme_park",
        "class": "middle_class",
        "name": "新しいテーマパーク",
        "copies": 1,
        "expansion": "base",
        "effect": "現在の人口値×6Vを支払い、繁栄度1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "New Theme Park"
      },
      {
        "id": "mc_investment_opportunities",
        "class": "middle_class",
        "name": "投資機会",
        "copies": 2,
        "expansion": "base",
        "effect": "企業を8V安く開始する。または、企業デッキから任意の企業を探して8V多く支払って開始し、その後デッキをシャッフルする。",
        "requirement": null,
        "bonus": null,
        "name_en": "Investment Opportunities"
      },
      {
        "id": "mc_unemployment_initiative_program",
        "class": "middle_class",
        "name": "失業対策プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "失業中の労働者階級の労働者を最大3人、自分の企業へ配置する。この方法で配置した労働者1人につき国家から5Vを得る。",
        "requirement": "政策4がAまたはB（4A/4B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "Unemployment Initiative Program"
      },
      {
        "id": "mc_higher_education_program",
        "class": "middle_class",
        "name": "高等教育プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "教育を最大6個、1個10Vで国家へ売る。 正当性ボーナス：X = 国家へ売った教育3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = 国家へ売った教育3個ごとに1",
          "calculation": {
            "basis": "education_sold_to_state",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Higher Education Program"
      },
      {
        "id": "mc_supplemental_income_program",
        "class": "middle_class",
        "name": "所得補助制度",
        "copies": 2,
        "expansion": "base",
        "effect": "公共企業・資本家企業に配置されている自分の労働者1人につき、国家から2Vを得る。その後、商品・サービスを購入できる。 正当性ボーナス：X = このカードで数えた労働者5人ごとに1。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = このカードで数えた労働者5人ごとに1",
          "calculation": {
            "basis": "workers_counted_by_card",
            "per": 5,
            "gain": 1
          }
        },
        "name_en": "Supplemental Income Program"
      },
      {
        "id": "mc_immigration_reform",
        "class": "middle_class",
        "name": "移民改革",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、移民（政策7）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Immigration Reform"
      },
      {
        "id": "mc_public_opinion_polling",
        "class": "middle_class",
        "name": "世論調査",
        "copies": 2,
        "expansion": "base",
        "effect": "法案を提出し、投票袋から投票キューブ5個を公開する。その法案について影響力を支払わず即時投票を行ってよい。行う場合は公開した5個を使い、行わない場合は投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Opinion Polling"
      },
      {
        "id": "mc_specialization",
        "class": "middle_class",
        "name": "専門化",
        "copies": 2,
        "expansion": "base",
        "effect": "任意の種類の労働者階級の熟練労働者1人をサプライから失業エリアへ置く。その後、失業中の労働者階級の労働者を最大3人、自分の企業へ配置する。",
        "requirement": "政策7がBまたはC（7B/7C）",
        "bonus": null,
        "name_en": "Specialization"
      },
      {
        "id": "mc_public_sector_overtime",
        "class": "middle_class",
        "name": "公共部門の時間外労働",
        "copies": 1,
        "expansion": "base",
        "effect": "稼働中の公共企業を1つ選ぶ。国家がそこに配置された労働者へ賃金を支払い、その企業で生産を行う。その後、その企業が生産した種類の商品・サービスを国家から購入できる。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Sector Overtime"
      },
      {
        "id": "mc_export_subsidy",
        "class": "middle_class",
        "name": "輸出補助金",
        "copies": 2,
        "expansion": "base",
        "effect": "海外市場へ販売する。この方法で実行した取引1回につき国家から5Vを得る。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "Export Subsidy"
      },
      {
        "id": "mc_import_subsidy",
        "class": "middle_class",
        "name": "輸入補助金",
        "copies": 2,
        "expansion": "base",
        "effect": "海外市場のImportエリアから食料または贅沢品を、自分の人口値まで関税なしで購入できる。 正当性ボーナス：X = このカードで購入した食料または贅沢品4個ごとに1。",
        "requirement": "政策6がAまたはB（6A/6B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = このカードで購入した食料または贅沢品4個ごとに1",
          "calculation": {
            "basis": "food_or_luxury_bought_by_card",
            "per": 4,
            "gain": 1
          }
        },
        "name_en": "Import Subsidy"
      },
      {
        "id": "mc_employment_subsidy",
        "class": "middle_class",
        "name": "雇用補助金",
        "copies": 2,
        "expansion": "base",
        "effect": "労働者階級の労働者がいる自分の企業1つにつき国家から5Vを得る。その後、それらの企業のうち1つで追加シフトを実行できる。 正当性ボーナス：X = このカードで数えた自分の企業3つごとに1。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = このカードで数えた自分の企業3つごとに1",
          "calculation": {
            "basis": "companies_counted_by_card",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Employment Subsidy"
      },
      {
        "id": "mc_state_scholarship",
        "class": "middle_class",
        "name": "国家奨学金",
        "copies": 1,
        "expansion": "base",
        "effect": "国家から、自分の人口値までの教育を、費用の半額（端数切り上げ）で購入する。",
        "requirement": "政策5がBまたはC（5B/5C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": 1
        },
        "name_en": "State Scholarship"
      }
    ],
    "crisis_and_control": [
      {
        "id": "mc_change_government_agenda",
        "class": "middle_class",
        "name": "政府方針の変更",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上の法案が3つ以下なら、他プレイヤーの法案を1つ捨てる。その後、自分が別の法案を提出し、最後にその相手も別の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Change of Government Agenda"
      },
      {
        "id": "mc_covid_19_stimulus_package",
        "class": "middle_class",
        "name": "COVID-19景気刺激策",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "公共企業・資本家企業に配置されている自分の労働者1人につき国家から2V、さらに自分が所有する企業1つにつき4Vを得る。 正当性ボーナス：X = このカードで受け取った15Vごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "middle_class",
          "amount": "X",
          "detail": "X = このカードで受け取った15Vごとに1",
          "calculation": {
            "basis": "money_received_by_card",
            "per": 15,
            "gain": 1
          }
        },
        "name_en": "Covid-19 Stimulus Package"
      },
      {
        "id": "mc_protect_status_quo",
        "class": "middle_class",
        "name": "現状維持",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "政策を1つ選ぶ。このラウンド中、その政策には法案を提出できない。目印として自分の提案マーカーを現行政策欄に置く。その後、影響力1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Protect the Status Quo"
      },
      {
        "id": "mc_reveal_political_scandal",
        "class": "middle_class",
        "name": "政治スキャンダルの暴露",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "他プレイヤー1人から影響力2を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Reveal Political Scandal"
      },
      {
        "id": "mc_momentum_for_change",
        "class": "middle_class",
        "name": "変革への勢い",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上にある自分の法案提案マーカー1個につき影響力1を得る。その後、法案を提出する。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Momentum for Change"
      }
    ]
  },
  "capitalist_class": {
    "base": [
      {
        "id": "cc_endorse_political_campaign",
        "class": "capitalist_class",
        "name": "政治キャンペーンの支援",
        "copies": 1,
        "expansion": "base",
        "effect": "15Vを支払い、自分の投票キューブ6個をサプライから投票袋へ加える。",
        "requirement": null,
        "bonus": null,
        "name_en": "Endorse Political Campaign"
      },
      {
        "id": "cc_business_expansion",
        "class": "capitalist_class",
        "name": "事業拡大",
        "copies": 2,
        "expansion": "base",
        "effect": "企業を2つ開始する。その後、企業市場に新しい企業を2つ追加する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Business Expansion"
      },
      {
        "id": "cc_global_branding",
        "class": "capitalist_class",
        "name": "グローバル・ブランディング",
        "copies": 1,
        "expansion": "base",
        "effect": "海外市場へ販売する。さらに贅沢品を最大6個、1個10Vで売ってよい。",
        "requirement": null,
        "bonus": null,
        "name_en": "Global Branding"
      },
      {
        "id": "cc_buy_private_island",
        "class": "capitalist_class",
        "name": "プライベートアイランドの購入",
        "copies": 1,
        "expansion": "base",
        "effect": "Capitalから国家へ50V支払い、7VPを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Buy Private Island"
      },
      {
        "id": "cc_foreign_market_insight",
        "class": "capitalist_class",
        "name": "海外市場の知見",
        "copies": 2,
        "expansion": "base",
        "effect": "次の輸出カード2枚を公開する。現在の輸出カードをそのうち1枚と交換してよい。使わない輸出カードを捨て、その後海外市場へ販売する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Foreign Market Insight"
      },
      {
        "id": "cc_global_food_crisis",
        "class": "capitalist_class",
        "name": "世界的食料危機",
        "copies": 1,
        "expansion": "base",
        "effect": "海外市場へ販売する。さらに食料を最大4個、1個15Vで売ってよい。",
        "requirement": null,
        "bonus": null,
        "name_en": "Global Food Crisis"
      },
      {
        "id": "cc_health_crisis",
        "class": "capitalist_class",
        "name": "医療危機",
        "copies": 1,
        "expansion": "base",
        "effect": "医療を最大9個、1個10Vで国家へ売る。 正当性ボーナス：X = 国家へ売った医療3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = 国家へ売った医療3個ごとに1",
          "calculation": {
            "basis": "healthcare_sold_to_state",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Health Crisis"
      },
      {
        "id": "cc_fake_news",
        "class": "capitalist_class",
        "name": "フェイクニュース",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から投票キューブを6個引く。そのうち最大4個をサプライへ戻し、残りを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Fake News"
      },
      {
        "id": "cc_interest_groups",
        "class": "capitalist_class",
        "name": "利益団体",
        "copies": 1,
        "expansion": "base",
        "effect": "投票袋から、他クラスの投票キューブを3個引くまで公開する。その3個を同数の自分の投票キューブ（サプライから）と置き換え、置き換えた自分のキューブと残りの公開キューブを投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Interest Groups"
      },
      {
        "id": "cc_industrialization",
        "class": "capitalist_class",
        "name": "工業化",
        "copies": 1,
        "expansion": "base",
        "effect": "食料または贅沢品部門の企業を1つ、費用の半額（端数切り上げ）で開始する。残額は国家が支払う。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": 1
        },
        "name_en": "Industrialization"
      },
      {
        "id": "cc_tap_into_new_markets",
        "class": "capitalist_class",
        "name": "新市場への進出",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、外国貿易（政策6）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Tap into New Markets"
      },
      {
        "id": "cc_trade_protectionism_lobby",
        "class": "capitalist_class",
        "name": "貿易保護主義ロビー",
        "copies": 1,
        "expansion": "base",
        "effect": "自分が所有する食料部門の企業1つにつき、自分の投票キューブ2個をサプライから投票袋へ加える。政策6Aが施行中なら贅沢品部門の企業も数える。",
        "requirement": "政策6がAまたはB（6A/6B）",
        "bonus": null,
        "name_en": "Trade Protectionism Lobby"
      },
      {
        "id": "cc_bid_rigging",
        "class": "capitalist_class",
        "name": "談合",
        "copies": 1,
        "expansion": "base",
        "effect": "贅沢品を最大6個、1個10Vで国家へ売る。その後、影響力1を得る。 正当性ボーナス：X = 国家へ売った贅沢品3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = 国家へ売った贅沢品3個ごとに1",
          "calculation": {
            "basis": "luxury_sold_to_state",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Bid Rigging"
      },
      {
        "id": "cc_investment_opportunities",
        "class": "capitalist_class",
        "name": "投資機会",
        "copies": 2,
        "expansion": "base",
        "effect": "企業を10V安く開始する。または、企業デッキから任意の企業を探して10V多く支払って開始し、その後デッキをシャッフルする。",
        "requirement": null,
        "bonus": null,
        "name_en": "Investment Opportunities"
      },
      {
        "id": "cc_foreign_partner",
        "class": "capitalist_class",
        "name": "海外パートナー",
        "copies": 2,
        "expansion": "base",
        "effect": "貿易協定を行う。その後、食料および／または贅沢品を海外市場へ売ってよい。",
        "requirement": "政策6がBまたはC（6B/6C）",
        "bonus": null,
        "name_en": "Foreign Partner"
      },
      {
        "id": "cc_unemployment_initiative_program",
        "class": "capitalist_class",
        "name": "失業対策プログラム",
        "copies": 2,
        "expansion": "base",
        "effect": "失業労働者を、自分の非稼働企業1つに配置する。この方法で配置した労働者1人につき国家から5Vを得る。",
        "requirement": "政策4がAまたはB（4A/4B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": 1
        },
        "name_en": "Unemployment Initiative Program"
      },
      {
        "id": "cc_higher_education_program",
        "class": "capitalist_class",
        "name": "高等教育プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "教育を最大9個、1個10Vで国家へ売る。 正当性ボーナス：X = 国家へ売った教育3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = 国家へ売った教育3個ごとに1",
          "calculation": {
            "basis": "education_sold_to_state",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Higher Education Program"
      },
      {
        "id": "cc_technological_progress",
        "class": "capitalist_class",
        "name": "技術進歩",
        "copies": 3,
        "expansion": "base",
        "effect": "20Vを支払って機械化トークン1個を得る、または45Vを支払って機械化トークン2個を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Technological Progress"
      },
      {
        "id": "cc_foreign_recruitment",
        "class": "capitalist_class",
        "name": "海外人材の採用",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の非稼働企業を1つ選ぶ。10Vを支払い、その企業に必要な労働者をサプライから配置する。",
        "requirement": "政策7がBまたはC（7B/7C）",
        "bonus": null,
        "name_en": "Foreign Recruitment"
      },
      {
        "id": "cc_radical_reforms",
        "class": "capitalist_class",
        "name": "急進的改革",
        "copies": 1,
        "expansion": "base",
        "effect": "法案を提出する。現在の政策位置に隣接していないスペースにも提案マーカーを置ける。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Radical Reforms"
      },
      {
        "id": "cc_offshore_companies",
        "class": "capitalist_class",
        "name": "オフショア企業",
        "copies": 2,
        "expansion": "base",
        "effect": "Revenueエリアの資金の半分（端数切り捨て）をCapitalエリアへ移す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Offshore Companies"
      },
      {
        "id": "cc_public_opinion_polling",
        "class": "capitalist_class",
        "name": "世論調査",
        "copies": 1,
        "expansion": "base",
        "effect": "法案を提出し、投票袋から投票キューブ5個を公開する。その法案について影響力を支払わず即時投票を行ってよい。行う場合は公開した5個を使い、行わない場合は投票袋へ戻す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Opinion Polling"
      },
      {
        "id": "cc_business_grants",
        "class": "capitalist_class",
        "name": "企業助成金",
        "copies": 1,
        "expansion": "base",
        "effect": "自分が所有する企業1つにつき国家から5Vを得る。 正当性ボーナス：X = 自分が所有する企業3つごとに1。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = 自分が所有する企業3つごとに1",
          "calculation": {
            "basis": "companies_owned",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Business Grants"
      },
      {
        "id": "cc_push_political_agenda",
        "class": "capitalist_class",
        "name": "政治方針の推進",
        "copies": 1,
        "expansion": "base",
        "effect": "25Vを支払い、法案を2つ提出する。それぞれの提出アクションを別々に解決する。同じ法案を続けて2回提出することはできない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Push Political Agenda"
      },
      {
        "id": "cc_competitive_wages",
        "class": "capitalist_class",
        "name": "競争力のある賃金",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の非稼働企業1つの賃金を最大（L3）に設定する。その後、その企業と同じ必要労働者数の公共企業を1つ選び、そこにいる労働者を自分の選んだ企業へ配置する。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": null,
        "name_en": "Competitive Wages"
      },
      {
        "id": "cc_exit_strategy",
        "class": "capitalist_class",
        "name": "出口戦略",
        "copies": 2,
        "expansion": "base",
        "effect": "自動化されていない自分の企業1つを、その企業コストの2倍で売る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Exit Strategy"
      },
      {
        "id": "cc_taxed_enough_already",
        "class": "capitalist_class",
        "name": "もう十分に課税されている！",
        "copies": 1,
        "expansion": "base",
        "effect": "自分の投票キューブ2個をサプライから投票袋へ加える。その後、税制（政策3）の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Taxed Enough Already"
      },
      {
        "id": "cc_extra_shift",
        "class": "capitalist_class",
        "name": "追加シフト",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の稼働中かつ非自動化の企業1つを選び、賃金を支払ってその企業の生産を1回行う。",
        "requirement": null,
        "bonus": null,
        "name_en": "Extra Shift"
      }
    ],
    "crisis_and_control": [
      {
        "id": "cc_change_government_agenda",
        "class": "capitalist_class",
        "name": "政府方針の変更",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上の法案が3つ以下なら、他プレイヤーの法案を1つ捨てる。その後、自分が別の法案を提出し、最後にその相手も別の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Change of Government Agenda"
      },
      {
        "id": "cc_covid_19_vaccine_r_and_d_funding",
        "class": "capitalist_class",
        "name": "COVID-19ワクチン研究開発助成",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "自分が所有する稼働中の医療部門企業1つにつき、国家から15Vを得る。 正当性ボーナス：X = このカードの対象となる自分の企業1つごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = このカードの対象となる自分の企業1つごとに1",
          "calculation": {
            "basis": "qualifying_companies",
            "per": 1,
            "gain": 1
          }
        },
        "name_en": "Covid-19 Vaccine R&D Funding"
      },
      {
        "id": "cc_protect_status_quo",
        "class": "capitalist_class",
        "name": "現状維持",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "政策を1つ選ぶ。このラウンド中、その政策には法案を提出できない。目印として自分の提案マーカーを現行政策欄に置く。その後、影響力1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Protect the Status Quo"
      },
      {
        "id": "cc_reveal_political_scandal",
        "class": "capitalist_class",
        "name": "政治スキャンダルの暴露",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "他プレイヤー1人から影響力2を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Reveal Political Scandal"
      },
      {
        "id": "cc_momentum_for_change",
        "class": "capitalist_class",
        "name": "変革への勢い",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上にある自分の法案提案マーカー1個につき影響力1を得る。その後、法案を提出する。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Momentum for Change"
      }
    ]
  },
  "state": {
    "base": [
      {
        "id": "st_foreign_financial_assistance",
        "class": "state",
        "name": "海外からの財政支援",
        "copies": 2,
        "expansion": "base",
        "effect": "現在の政治アジェンダカードと一致する施行中の政策1つにつき10Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Foreign Financial Assistance"
      },
      {
        "id": "st_higher_vat",
        "class": "state",
        "name": "付加価値税の引き上げ",
        "copies": 2,
        "expansion": "base",
        "effect": "各プレイヤーは国家へ15V支払う。その後、国家は任意の2クラスの正統性トラックをそれぞれ1スペース下げる。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "chosen_class",
          "amount": -1,
          "detail": "対象は任意の2クラス。各クラスについて国家の正当性を1下げる。"
        },
        "name_en": "Higher VAT"
      },
      {
        "id": "st_construction_boom",
        "class": "state",
        "name": "建設ブーム",
        "copies": 1,
        "expansion": "base",
        "effect": "国家・労働者階級・資本家階級がそれぞれ15Vを得る。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": [
            "working_class",
            "capitalist_class"
          ],
          "amount": 1,
          "detail": "労働者階級と資本家階級に対する国家の正当性をそれぞれ1上げる。"
        },
        "name_en": "Construction Boom"
      },
      {
        "id": "st_growth_in_tourism",
        "class": "state",
        "name": "観光業の成長",
        "copies": 1,
        "expansion": "base",
        "effect": "国家・中産階級・資本家階級がそれぞれ15Vを得る。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": [
            "middle_class",
            "capitalist_class"
          ],
          "amount": 1,
          "detail": "中産階級と資本家階級に対する国家の正当性をそれぞれ1上げる。"
        },
        "name_en": "Growth in Tourism"
      },
      {
        "id": "st_denial_of_free_speech",
        "class": "state",
        "name": "言論の自由の否定",
        "copies": 1,
        "expansion": "base",
        "effect": "メディア影響力を最大2得る。その後、相手を最大2人選ぶ。各相手は国家に影響力1を渡し、国家はその相手の正統性トラックで1スペース下がる。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "chosen_class",
          "amount": -1,
          "detail": "選んだ相手ごとに、そのクラスに対する国家の正当性を1下げる。"
        },
        "name_en": "Denial of Free Speech"
      },
      {
        "id": "st_agenda_setting",
        "class": "state",
        "name": "政策課題の設定",
        "copies": 2,
        "expansion": "base",
        "effect": "現在の政治アジェンダカードと一致する施行中の政策1つにつき、個人影響力1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Agenda-setting"
      },
      {
        "id": "st_allowances_and_subsidies",
        "class": "state",
        "name": "給付金と補助金",
        "copies": 2,
        "expansion": "base",
        "effect": "1クラスに20Vを提供し、そのクラスの正統性トークン1個を得る。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy_token",
          "target_class": "chosen_class",
          "amount": 1,
          "detail": "対象クラスの正当性トークン1個を得る。"
        },
        "name_en": "Allowances and Subsidies"
      },
      {
        "id": "st_nationalization",
        "class": "state",
        "name": "国有化",
        "copies": 1,
        "expansion": "base",
        "effect": "非稼働の公共企業1つをゲームから除外し、条件を満たす資本家企業1つと置き換えてPublic Sectorへ移す。その後、その企業へ労働者を配置してよい。政策1Bが施行中なら、その企業の費用を資本家階級へ支払う。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": null,
        "name_en": "Nationalization"
      },
      {
        "id": "st_privatization",
        "class": "state",
        "name": "民営化",
        "copies": 1,
        "expansion": "base",
        "effect": "稼働中の公共企業1つを、そのコストで資本家階級へ売り、Capitalist Classエリアへ置く。資本家がその企業を売却した場合はPublic Sectorへ戻る。",
        "requirement": "政策1がBまたはC（1B/1C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": null,
          "amount": 1
        },
        "name_en": "Privatization"
      },
      {
        "id": "st_employment_support_scheme",
        "class": "state",
        "name": "雇用支援制度",
        "copies": 1,
        "expansion": "base",
        "effect": "労働者階級と中産階級へそれぞれ15Vを提供する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": [
            "working_class",
            "middle_class"
          ],
          "amount": 1
        },
        "name_en": "Employment Support Scheme"
      },
      {
        "id": "st_literacy_program",
        "class": "state",
        "name": "教育支援プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "労働者階級または中産階級へ、そのクラスの人口値と同数の教育を提供する。そのクラスの正統性トークン1個を得る。",
        "requirement": "政策5がAまたはB（5A/5B）",
        "bonus": {
          "type": "legitimacy_token",
          "target_class": "chosen_class",
          "amount": 1,
          "detail": "対象クラスの正当性トークン1個を得る。"
        },
        "name_en": "Literacy Program"
      },
      {
        "id": "st_healthcare_program",
        "class": "state",
        "name": "医療支援プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "労働者階級または中産階級へ、そのクラスの人口値と同数の医療を提供する。そのクラスの正統性トークン1個を得る。",
        "requirement": "政策4がAまたはB（4A/4B）",
        "bonus": {
          "type": "legitimacy_token",
          "target_class": "chosen_class",
          "amount": 1,
          "detail": "対象クラスの正当性トークン1個を得る。"
        },
        "name_en": "Healthcare Program"
      },
      {
        "id": "st_foreign_investment_program",
        "class": "state",
        "name": "海外投資プログラム",
        "copies": 2,
        "expansion": "base",
        "effect": "個人影響力2を支払い、40Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Foreign Investment Program"
      },
      {
        "id": "st_unemployment_initiative_program",
        "class": "state",
        "name": "失業対策プログラム",
        "copies": 1,
        "expansion": "base",
        "effect": "失業労働者を、自分の非稼働企業1つへ配置する。",
        "requirement": "政策4がAまたはB（4A/4B）",
        "bonus": null,
        "name_en": "Unemployment Initiative Program"
      },
      {
        "id": "st_quantitative_easing",
        "class": "state",
        "name": "量的緩和",
        "copies": 1,
        "expansion": "base",
        "effect": "25Vを得る。借入が1つ以上ある場合は、代わりに35Vを得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Quantitative Easing"
      },
      {
        "id": "st_a_matter_of_high_priority",
        "class": "state",
        "name": "最優先事項",
        "copies": 2,
        "expansion": "base",
        "effect": "イベントデッキ上から2枚を見る。可能なら、そのうち1枚をイベントボードへ置く。その後、イベントを1つ解決する（今置いたイベントでなくてもよい）。",
        "requirement": null,
        "bonus": null,
        "name_en": "A Matter of High Priority"
      },
      {
        "id": "st_pressing_matters",
        "class": "state",
        "name": "緊急課題",
        "copies": 2,
        "expansion": "base",
        "effect": "法案を提出する。影響力を支払わず即時投票を行ってよい。",
        "requirement": null,
        "bonus": null,
        "name_en": "Pressing Matters"
      },
      {
        "id": "st_supplemental_income_program",
        "class": "state",
        "name": "所得補助制度",
        "copies": 1,
        "expansion": "base",
        "effect": "労働者階級または中産階級へ、そのクラスの就業中労働者1人につき1Vを提供する。提供した10Vごとに、そのクラスに対する正統性を+1する。 正当性ボーナス：X = 選んだクラスへ提供した10Vごとに1。",
        "requirement": "政策2がBまたはC（2B/2C）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "chosen_class",
          "amount": "X",
          "detail": "X = 選んだクラスへ提供した10Vごとに1",
          "calculation": {
            "basis": "money_provided_to_chosen_class",
            "per": 10,
            "gain": 1
          },
          "eligible_classes": [
            "working_class",
            "middle_class"
          ]
        },
        "name_en": "Supplemental Income Program"
      },
      {
        "id": "st_radical_reforms",
        "class": "state",
        "name": "急進的改革",
        "copies": 1,
        "expansion": "base",
        "effect": "法案を提出する。現在の政策位置に隣接していないスペースにも提案マーカーを置ける。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Radical Reforms"
      },
      {
        "id": "st_immediate_response",
        "class": "state",
        "name": "即時対応",
        "copies": 2,
        "expansion": "base",
        "effect": "イベントを1つ選び、続けて2回解決する。各回で異なる選択をしてよい。資源を提供するイベントを同じクラスに2回解決する場合、両方の資源を例外的にState Benefitsスペースへ累積できる。",
        "requirement": null,
        "bonus": null,
        "name_en": "Immediate Response"
      },
      {
        "id": "st_business_grants",
        "class": "state",
        "name": "企業助成金",
        "copies": 1,
        "expansion": "base",
        "effect": "資本家階級へ、その所有企業1つにつき5Vを提供する。 正当性ボーナス：X = 資本家階級が所有する企業3つごとに1。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": {
          "type": "legitimacy",
          "target_class": "capitalist_class",
          "amount": "X",
          "detail": "X = 資本家階級が所有する企業3つごとに1",
          "calculation": {
            "basis": "capitalist_companies_owned",
            "per": 3,
            "gain": 1
          }
        },
        "name_en": "Business Grants"
      },
      {
        "id": "st_shift_focus",
        "class": "state",
        "name": "焦点の転換",
        "copies": 2,
        "expansion": "base",
        "effect": "イベントデッキ上から2枚を見る。ボード上のイベント1枚をペナルティなしで捨て、その2枚のうち1枚と交換してよい。その後、イベントを1つ解決する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Shift Focus"
      },
      {
        "id": "st_emergency_state",
        "class": "state",
        "name": "非常事態",
        "copies": 1,
        "expansion": "base",
        "effect": "ボード上に法案が3つ以上ある場合、法案が提出されていない政策を1つ選び、その現行政策マーカーを隣接するセクションへ移す。",
        "requirement": null,
        "bonus": null,
        "name_en": "Emergency State"
      },
      {
        "id": "st_public_sector_overtime",
        "class": "state",
        "name": "公共部門の時間外労働",
        "copies": 2,
        "expansion": "base",
        "effect": "自分の企業1つを選び、労働者へ賃金を支払い、その企業の生産を1回行う。",
        "requirement": null,
        "bonus": null,
        "name_en": "Public Sector Overtime"
      },
      {
        "id": "st_foreign_students",
        "class": "state",
        "name": "留学生",
        "copies": 1,
        "expansion": "base",
        "effect": "教育を最大8個、現在の国内価格（政策5で決まる価格）で海外市場へ売る。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": null,
        "name_en": "Foreign Students"
      },
      {
        "id": "st_geopolitical_support",
        "class": "state",
        "name": "地政学的支援",
        "copies": 2,
        "expansion": "base",
        "effect": "施行中の外国貿易政策に応じて資金を得る。6Aなら15V、6Bなら30V、6Cなら45V。",
        "requirement": null,
        "bonus": null,
        "name_en": "Geopolitical Support"
      },
      {
        "id": "st_medical_tourism",
        "class": "state",
        "name": "医療ツーリズム",
        "copies": 1,
        "expansion": "base",
        "effect": "医療を最大8個、現在の国内価格（政策4で決まる価格）で海外市場へ売る。",
        "requirement": "政策1がAまたはB（1A/1B）",
        "bonus": null,
        "name_en": "Medical Tourism"
      },
      {
        "id": "st_step_for_representation",
        "class": "state",
        "name": "政治参加への一歩",
        "copies": 2,
        "expansion": "base",
        "effect": "1クラスに影響力1と投票キューブ2個を提供し、そのクラスに対する正統性を+2する。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "chosen_class",
          "amount": 2,
          "detail": "選んだ1クラスに対する国家の正当性を2上げる。"
        },
        "name_en": "Step for Representation"
      }
    ],
    "crisis_and_control": [
      {
        "id": "st_change_government_agenda",
        "class": "state",
        "name": "政府方針の変更",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上の法案が3つ以下なら、他プレイヤーの法案を1つ捨てる。その後、自分が別の法案を提出し、最後にその相手も別の法案を提出する。",
        "requirement": null,
        "bonus": null,
        "name_en": "Change of Government Agenda"
      },
      {
        "id": "st_covid_19_vaccination_program",
        "class": "state",
        "name": "COVID-19ワクチン接種プログラム",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "海外市場から医療を1個5Vで、現在の保管容量まで購入する。その後、労働者階級または中産階級へ、その人口値と同数の医療を提供する。この方法で提供した医療3個ごとに、そのクラスに対する正統性を+1する。 正当性ボーナス：X = 選んだクラスへ提供した医療3個ごとに1。",
        "requirement": null,
        "bonus": {
          "type": "legitimacy",
          "target_class": "chosen_class",
          "amount": "X",
          "detail": "X = 選んだクラスへ提供した医療3個ごとに1",
          "calculation": {
            "basis": "healthcare_provided_to_chosen_class",
            "per": 3,
            "gain": 1
          },
          "eligible_classes": [
            "working_class",
            "middle_class"
          ]
        },
        "name_en": "Covid-19 Vaccination Program"
      },
      {
        "id": "st_protect_status_quo",
        "class": "state",
        "name": "現状維持",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "政策を1つ選ぶ。このラウンド中、その政策には法案を提出できない。目印として自分の提案マーカーを現行政策欄に置く。その後、個人影響力1を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Protect the Status Quo"
      },
      {
        "id": "st_reveal_political_scandal",
        "class": "state",
        "name": "政治スキャンダルの暴露",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "他プレイヤー1人から影響力2を得る。",
        "requirement": null,
        "bonus": null,
        "name_en": "Reveal Political Scandal"
      },
      {
        "id": "st_momentum_for_change",
        "class": "state",
        "name": "変革への勢い",
        "copies": 1,
        "expansion": "crisis_and_control",
        "effect": "ボード上にある自分の法案提案マーカー1個につき個人影響力1を得る。その後、法案を提出する。この法案について即時投票は行えない。",
        "requirement": null,
        "bonus": null,
        "name_en": "Momentum for Change"
      }
    ]
  },
  "_metadata": {
    "fields_added": [
      "effect",
      "requirement",
      "bonus"
    ],
    "language_of_effect_fields": "ja",
    "translation_note": "カード名を日本語化し、元の英語名は name_en に保持。",
    "terminology": {
      "mechanization_token": "機械化トークン",
      "legitimacy_token": "正当性トークン",
      "legitimacy_track_change": "正当性の増減。総量が可変の場合は +X / -X とし、Xの算出方法を bonus_detail に記載する。"
    },
    "revision_note": "赤=労働者、青=資本家、黄=中産階級として bonus を構造化。",
    "card_name_language": "ja",
    "english_name_field": "name_en",
    "bonus_semantics": {
      "description": "bonus はカード上の色付き正当性ボーナス。",
      "color_mapping": {
        "red": "working_class",
        "blue": "capitalist_class",
        "yellow": "middle_class"
      },
      "types": {
        "legitimacy": "国家の正当性トラックの増減",
        "legitimacy_token": "正当性トークンの獲得"
      }
    },
    "variable_legitimacy_bonus": {
      "representation": "amount='X' とし、Xの算出条件を effect と bonus.calculation に保持する。",
      "formula": "X = floor(basis / per) * gain"
    }
  }
};
root.HEGEMONY_ACTION_CARDS=data;
if(typeof module!=="undefined")module.exports=data;
})(globalThis);
