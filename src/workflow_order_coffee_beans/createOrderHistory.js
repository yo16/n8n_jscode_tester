/*
    注文履歴データを作る
*/

const $ = require('../n8n_object/n8n_object');


// 注文履歴データを作る
function createOrderHistory() {
    const nextBeansMaster = $('次に注文する２個を選ぶ').all();
    let maxSeq = $('Max SEQ').first().json.MaxSEQ;

    // 日本時間の今日の16時を正しく取得
    // サーバーはUTCなので注意
    const nowUtc = new Date();
    const jstOffsetMs = 9 * 60 * 60 * 1000;
    const nowJst = new Date(nowUtc.getTime() + jstOffsetMs);
    // JSTの「今日」
    const jstYear = nowJst.getFullYear();
    const jstMonth = nowJst.getMonth(); // 月 (0始まり)
    const jstDate = nowJst.getDate();   // JSTの日
    // JSTの16:00をUTCに変換
    const orderUtcDate = new Date(Date.UTC(jstYear, jstMonth, jstDate, 16 - 9, 0, 0));


    const retArray = [];
    for (let i=0; i<nextBeansMaster.length; i++) {
        const curBM = nextBeansMaster[i].json;
        maxSeq++;

        retArray.push({
            title: String(maxSeq),
            orderedUtcDt: orderUtcDate,
            orderText: `${curBM.properties["コーヒー豆名"].title[0].plain_text}、100g、豆のまま`,
            beansMasterId: curBM.id,
        })
    }

    return retArray;
}
//return createOrderHistory();

module.exports = createOrderHistory;

