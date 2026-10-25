(function(root){
'use strict';
// User-provided 中産階級AIカード一覧.xlsx. Empty policy cells are intentional.
root.MCA_CARD_DATA={
 "1": {
  "order": [
   "BGS",
   "BC",
   "SFM",
   "PB"
  ],
  "policies": [
   "3",
   "6"
  ],
  "bonus": "この手番では、政府が販売する医療の価格は半額（端数切り上げ）になる。",
  "bonusType": "halfHealth",
  "special": "追加シフトを1回行う。",
  "specialType": "extraShift",
  "bonusCondition": "",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "2": {
  "order": [
   "BGS",
   "BC",
   "SFM",
   "AW"
  ],
  "policies": [],
  "bonus": "この手番では、政府が販売する教育の価格は半額（端数切り上げ）になる。",
  "bonusType": "halfEducation",
  "special": "他の階級（複数可）の駒を３個引くまで、袋から投票駒を引く。その３個の駒を中産階級の投票駒に交換してから、引いたすべての駒を袋に戻す。",
  "specialType": "replaceVotes",
  "bonusCondition": "",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0
 },
 "3": {
  "order": [
   "BGS",
   "BC",
   "PB",
   "AW"
  ],
  "policies": [
   "4",
   "3"
  ],
  "bonus": "この手番で商品とサービスを購入する場合、利用可能なすべての販売元（自分自身を含む）から、それぞれ人口に等しい数まで購入する。",
  "bonusType": "allSources",
  "special": "袋から投票駒6個を引く。引いた中産階級の投票駒をすべて袋に戻す。引いた他の投票駒をすべて取り除く。",
  "specialType": "removeDrawnVotes",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "4": {
  "order": [
   "BGS",
   "BC",
   "PB",
   "SFM"
  ],
  "policies": [
   "7",
   "5"
  ],
  "bonus": "この手番で商品とサービスを購入する場合、あなたの労働者がある国有企業は最初に生産を1回行う。",
  "bonusType": "publicProduction",
  "special": "教育6までをそれぞれ10ヴァルディスで政府に販売する。",
  "specialType": "sellEducation",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1/3教育",
  "influenceIcons": 0
 },
 "5": {
  "order": [
   "BGS",
   "BC",
   "AW",
   "SFM"
  ],
  "policies": [],
  "bonus": "この手番で商品とサービスを購入する場合、あなたの労働者がある国有企業は最初に生産を1回行う。",
  "bonusType": "publicProduction",
  "special": "医療6までをそれぞれ10ヴァルディスで政府に販売する。",
  "specialType": "sellHealth",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1/3医療",
  "influenceIcons": 1
 },
 "6": {
  "order": [
   "BGS",
   "AW",
   "BC",
   "PB"
  ],
  "policies": [
   "2",
   "6"
  ],
  "bonus": "この手番で商品とサービスを購入する場合、海外市場からの食料か贅沢品のための関税は支払わない。",
  "bonusType": "waiveTariff",
  "special": "3影響力をそれぞれ5ヴァルディスで政府から購入する。購入できない1影響力ごとに、代わりに投票駒を袋に2個追加する。",
  "specialType": "buyInfluenceOrVotes",
  "bonusCondition": "6A/6B",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "7": {
  "order": [
   "BGS",
   "SFM",
   "BC",
   "AW"
  ],
  "policies": [],
  "bonus": "この手番で商品とサービスを購入する場合、政府は最初に、国有企業か資本家階級の企業で雇用されているあなたの労働者1個ごとに2ヴァルディスをあなたに支払う。",
  "bonusType": "employedCash",
  "special": "労働者階級の労働者があるあなたの企業１つごとに、政府から5ヴァルディスを得る。そのあと、可能ならばそれらの企業のうち１つで追加シフトを1回行う。",
  "specialType": "employeeGrantShift",
  "bonusCondition": "2B/2C",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 1
 },
 "8": {
  "order": [
   "BGS",
   "PB",
   "BC",
   "AW"
  ],
  "policies": [
   "3",
   "5"
  ],
  "bonus": "この手番で商品とサービスを購入する場合、利用可能なすべての販売元（自分自身を含む）から、それぞれ人口に等しい数まで購入する。",
  "bonusType": "allSources",
  "special": "可能ならば人口1ごとに6ヴァルディスを支払い、1繁栄度を得る。",
  "specialType": "payProsperity",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0
 },
 "9": {
  "order": [
   "BGS",
   "PB",
   "BC",
   "SFM"
  ],
  "policies": [
   "7",
   "4"
  ],
  "bonus": "この手番で商品とサービスを購入する場合、政府は最初に、国有企業か資本家階級の企業で雇用されているあなたの労働者1個ごとに2ヴァルディスをあなたに支払う。",
  "bonusType": "employedCash",
  "special": "あなたの労働者が雇用されている国有企業と資本家階級の企業の数+2に等しい数の投票駒を袋に追加する。",
  "specialType": "employedCompanyVotes",
  "bonusCondition": "2B/2C",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "10": {
  "order": [
   "BC",
   "AW",
   "BGS",
   "PB"
  ],
  "policies": [
   "6",
   "4"
  ],
  "bonus": "この手番で企業を設立する場合、そのコストを政府が支払う。",
  "bonusType": "stateBuild",
  "special": "あなたの企業に労働者階級の失業労働者を3個まで割り当てる。こうして割り当てた労働者1個ごとに、政府から5ヴァルディスを得る。",
  "specialType": "staffEmployees",
  "bonusCondition": "1A/1B",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "11": {
  "order": [
   "BC",
   "BGS",
   "SFM",
   "PB"
  ],
  "policies": [
   "7",
   "2"
  ],
  "bonus": "この手番でメディア以外の企業を設立する場合、そのコストを4ヴァルディス減らして支払う。そなおと、その企業が生産する資源のための保管エリアタイルを得る。",
  "bonusType": "discountStorage",
  "special": "追加シフトを1回行う。",
  "specialType": "extraShift",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "12": {
  "order": [
   "BC",
   "BGS",
   "AW",
   "PB"
  ],
  "policies": [
   "5",
   "3"
  ],
  "bonus": "この手番で企業を設立する場合、サプライから任意の中産階級の熟練労働者を1個取って使う。",
  "bonusType": "supplyBuild",
  "special": "他の階級（複数可）の駒を３個引くまで、袋から投票駒を引く。その３個の駒を中産階級の投票駒に交換してから、引いたすべての駒を袋に戻す。",
  "specialType": "replaceVotes",
  "bonusCondition": "7B/7C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0
 },
 "13": {
  "order": [
   "BC",
   "AW",
   "BGS",
   "SFM"
  ],
  "policies": [],
  "bonus": "この手番で企業を設立する場合、そのコストを政府が支払う。",
  "bonusType": "stateBuild",
  "special": "袋から投票駒6個を引く。引いた中産階級の投票駒をすべて袋に戻す。引いた他の投票駒をすべて取り除く。",
  "specialType": "removeDrawnVotes",
  "bonusCondition": "1A/1B",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "14": {
  "order": [
   "BC",
   "SFM",
   "BGS",
   "AW"
  ],
  "policies": [],
  "bonus": "この手番で企業を設立する場合、サプライから任意の中産階級の熟練労働者を1個取って使う。",
  "bonusType": "supplyBuild",
  "special": "医療6までをそれぞれ10ヴァルディスで政府に販売する。",
  "specialType": "sellHealth",
  "bonusCondition": "7B/7C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1/3医療",
  "influenceIcons": 0
 },
 "15": {
  "order": [
   "BC",
   "PB",
   "BGS",
   "SFM"
  ],
  "policies": [
   "1",
   "5"
  ],
  "bonus": "この手番でメディア以外の企業を設立する場合、そのコストを4ヴァルディス減らして支払う。そなおと、その企業が生産する資源のための保管エリアタイルを得る。",
  "bonusType": "discountStorage",
  "special": "教育6までをそれぞれ10ヴァルディスで政府に販売する。",
  "specialType": "sellEducation",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1/3教育",
  "influenceIcons": 1
 },
 "16": {
  "order": [
   "AW",
   "BGS",
   "BC",
   "SFM"
  ],
  "policies": [],
  "bonus": "この手番で労働者を割り当てる場合\n2B:任意の数の失業労働者を割り当てることができる。\n2C:任意の数の労働者を割り当てることができる。",
  "bonusType": "unlimitedWorkers",
  "special": "3影響力をそれぞれ5ヴァルディスで政府から購入する。購入できない1影響力ごとに、代わりに投票駒を袋に2個追加する。",
  "specialType": "buyInfluenceOrVotes",
  "bonusCondition": "2B/2C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "17": {
  "order": [
   "AW",
   "BGS",
   "BC",
   "PB"
  ],
  "policies": [
   "3",
   "1"
  ],
  "bonus": "この手番で労働者を割り当てる場合、最初にサプライから熟練労働者を1個得る。",
  "bonusType": "supplyAssign",
  "special": "労働者階級の労働者があるあなたの企業１つごとに、政府から5ヴァルディスを得る。そのあと、可能ならばそれらの企業のうち１つで追加シフトを1回行う。",
  "specialType": "employeeGrantShift",
  "bonusCondition": "7B/7C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 1
 },
 "18": {
  "order": [
   "AW",
   "BC",
   "BGS",
   "SFM"
  ],
  "policies": [],
  "bonus": "この手番で労働者を割り当てる場合\n2B:任意の数の失業労働者を割り当てることができる。\n2C:任意の数の労働者を割り当てることができる。",
  "bonusType": "unlimitedWorkers",
  "special": "可能ならば人口1ごとに6ヴァルディスを支払い、1繁栄度を得る。",
  "specialType": "payProsperity",
  "bonusCondition": "2B/2C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "19": {
  "order": [
   "AW",
   "BC",
   "BGS",
   "PB"
  ],
  "policies": [
   "2",
   "4"
  ],
  "bonus": "この手番で労働者を割り当てる場合、最初にサプライから熟練労働者を1個得る。",
  "bonusType": "supplyAssign",
  "special": "あなたの労働者が雇用されている国有企業と資本家階級の企業の数+2に等しい数の投票駒を袋に追加する。",
  "specialType": "employedCompanyVotes",
  "bonusCondition": "7B/7C",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "20": {
  "order": [
   "SFM",
   "BGS",
   "BC",
   "AW"
  ],
  "policies": [],
  "bonus": "海外市場に販売する場合、実行した取引1回ごとに、追加の5ヴァルディスを得る。",
  "bonusType": "exportExtra",
  "special": "あなたの企業に労働者階級の失業労働者を3個まで割り当てる。こうして割り当てた労働者1個ごとに、政府から5ヴァルディスを得る。",
  "specialType": "staffEmployees",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "21": {
  "order": [
   "SFM",
   "BGS",
   "BC",
   "PB"
  ],
  "policies": [
   "7",
   "1"
  ],
  "bonus": "海外市場に販売する場合、実行した取引1回ごとに、政府はあなたに5ヴァルディスを支払う。",
  "bonusType": "exportGrant",
  "special": "追加シフトを1回行う。",
  "specialType": "extraShift",
  "bonusCondition": "1A/1B",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "22": {
  "order": [
   "SFM",
   "BC",
   "BGS",
   "AW"
  ],
  "policies": [],
  "bonus": "海外市場に販売する場合、実行した取引1回ごとに、追加の5ヴァルディスを得る。",
  "bonusType": "exportExtra",
  "special": "他の階級（複数可）の駒を３個引くまで、袋から投票駒を引く。その３個の駒を中産階級の投票駒に交換してから、引いたすべての駒を袋に戻す。",
  "specialType": "replaceVotes",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0
 },
 "23": {
  "order": [
   "SFM",
   "BC",
   "BGS",
   "PB"
  ],
  "policies": [
   "5",
   "2"
  ],
  "bonus": "海外市場に販売する場合、実行した取引1回ごとに、政府はあなたに5ヴァルディスを支払う。",
  "bonusType": "exportGrant",
  "special": "袋から投票駒6個を引く。引いた中産階級の投票駒をすべて袋に戻す。引いた他の投票駒をすべて取り除く。",
  "specialType": "removeDrawnVotes",
  "bonusCondition": "1A/1B",
  "bonusLegitimacy": "中産階級+1",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "24": {
  "order": [
   "PB",
   "BC",
   "BGS",
   "AW"
  ],
  "policies": [
   "3",
   "7"
  ],
  "bonus": "この手番で法案を提議する場合、影響力を支払うことなく即時投票を要求する。",
  "bonusType": "freeImmediate",
  "special": "労働者階級の労働者があるあなたの企業１つごとに、政府から5ヴァルディスを得る。そのあと、可能ならばそれらの企業のうち１つで追加シフトを1回行う。",
  "specialType": "employeeGrantShift",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "25": {
  "order": [
   "PB",
   "BC",
   "BGS",
   "SFM"
  ],
  "policies": [
   "6",
   "3"
  ],
  "bonus": "この手番で法案を提議する場合、最初に投票駒を袋に2個追加する。",
  "bonusType": "proposalVotes",
  "special": "あなたの労働者が雇用されている国有企業と資本家階級の企業の数+2に等しい数の投票駒を袋に追加する。",
  "specialType": "employedCompanyVotes",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "26": {
  "order": [
   "PB",
   "BGS",
   "BC",
   "AW"
  ],
  "policies": [
   "3",
   "6"
  ],
  "bonus": "この手番で法案を提議する場合、影響力を支払うことなく即時投票を要求する。",
  "bonusType": "freeImmediate",
  "special": "あなたの企業に労働者階級の失業労働者を3個まで割り当てる。こうして割り当てた労働者1個ごとに、政府から5ヴァルディスを得る。",
  "specialType": "staffEmployees",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "中産階級+1",
  "influenceIcons": 0
 },
 "27": {
  "order": [
   "PB",
   "BGS",
   "BC",
   "SFM"
  ],
  "policies": [
   "6",
   "3"
  ],
  "bonus": "この手番で法案を提議する場合、最初に投票駒を袋に2個追加する。",
  "bonusType": "proposalVotes",
  "special": "追加シフトを1回行う。",
  "specialType": "extraShift",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1
 },
 "28": {
  "order": [
   "SA",
   "BGS",
   "PB",
   "AW"
  ],
  "policies": [
   "6",
   "1"
  ],
  "bonus": "",
  "bonusType": null,
  "special": "あなたの失業労働者が最低4個ある場合、そのうち2個（可能ならば未熟練、それ以外はランダム）を取り除いて10ヴァルディスを得る。",
  "specialType": "removeWorkersForCash",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0,
  "extraCheck": "あなたの失業労働者が最低4個ある場合：失業労働者1個ごとにSA+1",
  "checkType": "unemployedPriority"
 },
 "29": {
  "order": [
   "SA",
   "SFM",
   "BC",
   "PB"
  ],
  "policies": [
   "4",
   "7"
  ],
  "bonus": "",
  "bonusType": null,
  "special": "あなたの失業労働者が最低4個ある場合、そのうち2個（可能ならば未熟練、それ以外はランダム）を取り除いて10ヴァルディスを得る。",
  "specialType": "removeWorkersForCash",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 1,
  "extraCheck": "あなたの失業労働者が最低4個ある場合：失業労働者1個ごとにSA+1",
  "checkType": "unemployedPriority"
 },
 "30": {
  "order": [
   "SA",
   "BGS",
   "AW",
   "SFM"
  ],
  "policies": [],
  "bonus": "",
  "bonusType": null,
  "special": "あなたの失業労働者が最低4個ある場合、そのうち2個（可能ならば未熟練、それ以外はランダム）を取り除いて10ヴァルディスを得る。",
  "specialType": "removeWorkersForCash",
  "bonusCondition": "",
  "bonusLegitimacy": "",
  "specialCondition": "",
  "specialLegitimacy": "",
  "influenceIcons": 0,
  "extraCheck": "あなたの失業労働者が最低4個ある場合：失業労働者1個ごとにSA+1",
  "checkType": "unemployedPriority"
 }
};
if(typeof module!=='undefined')module.exports=root.MCA_CARD_DATA;
})(globalThis);
