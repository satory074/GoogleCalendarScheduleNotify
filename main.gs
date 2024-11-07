// Webhook URLを設定
const WEBHOOK_URL = "WebhookURL";

// 8:00〜20:00までの予定を1時間ごとにリスト化してGoogle Chatに通知
function sendHourlySchedule() {
  const calendar = CalendarApp.getDefaultCalendar();
  const today = new Date();
  today.setHours(8, 0, 0, 0);  // 開始時間を8:00に設定
  const endOfDay = new Date(today);
  endOfDay.setHours(20, 0, 0, 0);  // 終了時間を20:00に設定

  const formattedDate = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy/MM/dd(E)");
  let message = `📅🔔${formattedDate}の予定\n`;

  for (let hour = 8; hour < 20; hour++) {
    const start = new Date(today);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(today);
    end.setHours(hour + 1, 0, 0, 0);

    const events = calendar.getEvents(start, end);
    message += `\n${formatTime(start)}`;

    if (events.length !== 0) {
      events.forEach(event => {
        const title = event.getTitle();
        const startTime = formatTime(event.getStartTime());
        const endTime = formatTime(event.getEndTime());
        message += `\n*${title}* ${startTime} 〜 ${endTime}`;
      });
    }
  }

  // Google Chatに送信
  sendToChat(message);
}

// 時間を整形（例: "08:00"）
function formatTime(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "HH:mm");
}

// Google Chatにメッセージ送信
function sendToChat(message) {
  const payload = JSON.stringify({ text: message });
  const options = {
    method: "post",
    contentType: "application/json",
    payload: payload
  };
  UrlFetchApp.fetch(WEBHOOK_URL, options);
}
