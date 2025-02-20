/*
    Group by 豆
    Notionの注文履歴データを豆でGroup byして、最大日付のレコードを抽出
*/

const $ = require('../n8n_object/n8n_object');



// Notionの注文履歴データを豆でGroup byして、最大日付のレコードを抽出
function groupByBeans() {
    // 豆マスターIDでGroup By、最大の日付のレコードだけ残す
    const beansMap = {};

    // 豆ごとの最大日付を取得
    const beansMaster = $('注文履歴').all();
    for (let i=0; i<beansMaster.length; i++ ){
        const curBeans = beansMaster[i].json;
        const beansId = curBeans.properties["豆マスター"].relation[0].id;
        const orderDate = new Date(curBeans.properties["注文日"].date.start);
        //console.log(beansId, orderDate);

        if (beansId in beansMap) {
            if (beansMap[beansId] < orderDate) {
                // 日付が大きかったら更新
                beansMap[beansId] = orderDate;
            }
        } else {
            // 登録されていなかったら無条件に登録
            beansMap[beansId] = orderDate;
        }
    }

    // 整形
    const ids = Object.keys(beansMap);
    const retArray = [];
    for (let i=0; i<ids.length; i++) {
        retArray.push({
            "json": {
                beansMasterId: ids[i],
                lastOrdered: beansMap[ids[i]].toLocaleDateString(),
            },
            "pairedItem": i,
        })
    }

    return retArray;
}
//return groupByBeans();



module.exports = groupByBeans;

