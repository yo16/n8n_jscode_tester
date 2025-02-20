/*
    Max SEQ
    注文履歴のMax(SEQ)を取得する
*/

const $ = require('../n8n_object/n8n_object');



// 注文履歴のMax(SEQ)を取得する
function maxSeq() {
    const his = $('注文履歴').all();
    let maxSeq = -1;
    for (let i=0; i<his.length; i++){
        const curHis = his[i].json;
        const curHisSeq = Number(curHis.properties["SEQ"].title[0].plain_text);
        if (maxSeq < curHisSeq) {
            maxSeq = curHisSeq;
        }
    }
    
    return {
        MaxSEQ: maxSeq,
    };
}
//return maxSeq();



module.exports = maxSeq;

