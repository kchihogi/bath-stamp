const drawClock = function drawClock(){
	var canvas = document.getElementById("js__clock");
  
  //�ݒ�
	var padding = 5;

	if ( ! canvas || ! canvas.getContext ){return false};

	var now         = new Date();
  var year        = now.getFullYear();
  var month       = now.getMonth() + 1;
  var date        = now.getDate();
  var day         = `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()]}.`;
	var hour        = now.getHours();
	var minute      = now.getMinutes();
	var second      = now.getSeconds() + (now.getMilliseconds() / 1000);

  document.getElementById("js__date").innerHTML = `${year} / ${zeroPad(month)} / ${zeroPad(date)} (${day})`;
  document.getElementById("js__time").innerHTML = `${zeroPad(hour)} : ${zeroPad(minute)} : ${zeroPad(~~second)}`;
  
	var width  = canvas.width;
	var height = canvas.height;
	var center = {x: width/2, y: height/2};

	var ctx = canvas.getContext('2d');

	ctx.clearRect(0,0,width,height);

	//�~��`��
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
  ctx.arc(center.x, center.y, center[width > height ? "x" : "y"] - padding, 0, Math.PI*2, false);
	ctx.stroke();

	//�ڐ����`��
	ctx.strokeStyle = "#999999";
	ctx.save();
	ctx.translate(center.x, center.y);
	for(var i = 0; i < 360; i+=6){
		ctx.rotate(Math.PI / 30);
		ctx.beginPath();
		// if(((i / 6) + 1) % 5 === 0){
		// 	ctx.moveTo(0, center.y * 0.77);
		// }else{
		// 	ctx.moveTo(0, center.y * 0.87);
		// }
    ctx.moveTo(0, center.y * (((i / 6) + 1) % 5 ? 0.88 : 0.77));
		ctx.lineTo(0, center.y * 0.9);

		ctx.stroke();
	}
	ctx.translate(-center.x, -center.y);
	ctx.restore();

	//�j�̕`��
	ctx.strokeStyle = '#333333';

	drawHand(center.y * 0.5, hour * 30 + minute / 2);
	drawHand(center.y * 0.8, minute * 6 + second / 10);

	ctx.strokeStyle = '#EE0000';

	drawHand(center.y * 0.8, second * 6);
  
  requestAnimationFrame(drawClock);
  
  function zeroPad(str){
    return (""+str).padStart(2, "0");
  }
  
  function drawHand(length, angle){
		ctx.save();
		ctx.translate(center.x, center.y);
		ctx.rotate( angle * Math.PI / 180);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.restore();
	}
}

drawClock();


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

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='disabled'>" + (count - endDate) + "</td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += "<td class='today'>" + count + "</td>";
                } else {
                    calendar += "<td>" + count + "</td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}