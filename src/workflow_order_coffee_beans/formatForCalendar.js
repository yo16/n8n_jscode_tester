/*
    Googleカレンダー用に整形
*/

const $ = require('../n8n_object/n8n_object');


// Googleカレンダー用に整形
function formatForCalendar() {
    const hisRecs = $('注文履歴データを作る').all();

    // 注文した豆
    let orderArray = [];
    for (let i=0; i<hisRecs.length; i++) {
        const curOrder = hisRecs[i].json;
        orderArray.push(`- ${curOrder.orderText}`);
    }
    const orderStr = orderArray.join("\n");

    // 開始時刻と終了時刻
    const startDt = new Date(hisRecs[0].json.orderedUtcDt);
    const endDt = new Date(startDt.getTime() + 60*60*1000);

    return {
        startDt: startDt.toLocaleString(),
        endDt: endDt.toLocaleString(),
        orderStr,
    };
}
//return formatForCalendar();

module.exports = formatForCalendar;

