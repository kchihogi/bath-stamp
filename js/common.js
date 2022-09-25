const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 初期表示
window.onload = function () {
    showProcess(today, calendar);
};
// 前の月表示
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー表示
function showProcess(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

    var calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    var calendar = "<table><tr class='dayOfWeek'>";
    for (var i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    var count = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var lastMonthEndDate = new Date(year, month, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    var data = 'data\\'+year+'\\'+(month+1)+'.csv'
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", data, false); // アクセスするファイルを指定
    req.send(null); // sHTTPリクエストの発行
    var datamap = []; // 最終的な二次元配列を入れるための配列
    if (req.status == 200) {
        var tmp = req.responseText.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
        // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
        for(var i=0;i<tmp.length;++i){
            datamap[i] = tmp[i].split(',');
        }
    }

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1)  + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate)  + "</td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                var stamp = ''
                var hit = false
                var index =0
                for(index;index<datamap.length;++index){
                    if (datamap[index][0] == count) {
                        hit =true
                        break
                    }
                }
                if (hit) {
                    for (let i = 1; i <= (datamap[index].length-1); i++) {
                        stamp += '<br><img class="stamp" src="'+ datamap[index][i] +'" alt="Stamp"/>'
                    }
                }
                else{
                    stamp = ''
                }
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += "<td class='today'>" + count + stamp +"</td>";
                } else {
                    calendar += "<td>" + count  + stamp + "</td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}