/*
    次に注文する２個を選ぶ
    
    // 深煎り、中深煎りから１つ、それ以外から１つ選ぶ
    // 優先順位は、
    // 1. 過去に注文したことがないもの（であればどれでもよい）
    // 2. もっとも過去に注文したもの（同じ日の場合はどれでもよい）
*/

const $ = require('../n8n_object/n8n_object');




// 深煎り豆と浅煎り豆に分け、idの配列を返す
// 戻り値の型
//     Record<("fuka" | "asa"), string[]>[]
function separateIriGroup(
    beansMaster,
) {
    // fuka/asaごとの空の配列を作成
    const retGroups = {
        fuka: [],
        asa: [],
    };
    
    // 豆マスターを、深煎りグループと、浅煎りグループに分ける
    for (let i=0; i<beansMaster.length; i++) {
        const curBeans = beansMaster[i].json;
        const curBeansId = curBeans.id;
        if (
            (curBeans.properties["煎り"].select.name === "深煎り") ||
            (curBeans.properties["煎り"].select.name === "中深煎り")
        ) {
            retGroups.fuka.push(curBeansId);
        } else {
            retGroups.asa.push(curBeansId);
        }
    }

    return retGroups;
}



// １つの豆をピックアップし、beansのidを返す
// 1. 過去に注文したことがないもの（であればどれでもよい）
// 2. もっとも過去に注文したもの（同じ日の場合は、最初に見つけたもの）
function selectOneBean(
    beans,
    orderHis,
) {
    // beansの先頭から探して、最初に見つけた過去に注文したことのない豆を返す
    for (const bean of beans) {
        const curBean = bean.json;
        const curBeanId = curBean.id;

        // 過去に注文したことがない豆を見つけたら終了
        let existsInHis = false;
        for (const his of orderHis) {
            if (curBeanId === his.json.beansMasterId) {
                existsInHis = true;
                break;
            }
        }
        if (!existsInHis) {
            return curBeanId;
        }
    }

    // 過去に注文したことのない豆はない
    // （`beans`の豆は、すべて履歴にある）

    // もっとも古い注文をした豆を探す
    let oldestOrder = {
        beanId: "",     // この関数はこの値を返す
        ordered: new Date(2099, 12, 31),
    };
    for (const bean of beans) {
        const curBean = bean.json;
        const curBeanId = curBean.id;

        // curBeanIdに関する履歴を探す
        for (const his of orderHis) {
            const curHis = his.json;

            // curBeanIdに関する履歴を探す
            if (curHis.beansMasterId !== curBeanId) {
                continue;
            }

            // 履歴の日付を取得
            const hisOrderDt = new Date(curHis.lastOrdered);
            // もっとも古い日付より古い場合は、もっとも古い日付を更新
            if (hisOrderDt < oldestOrder.ordered) {
                oldestOrder.beanId = curBeanId;
                oldestOrder.ordered = hisOrderDt;
            }
        }
    }

    return oldestOrder.beanId;
}



// 注文する２つの豆を選ぶ
function selectNextOrder() {
    // 深煎り、中深煎りから１つ、それ以外から１つ選ぶ
    // 優先順位は、
    // 1. 過去に注文したことがないもののうち、最初に見つけたもの
    // 2. もっとも過去に注文したもの（同じ日の場合は、最初に見つけたもの）

    // 豆マスター
    const beansMaster = $('豆マスター').all();
    // 過去の注文情報
    const orderHis = $('Group by 豆').all();

    // 豆マスターのIDから、豆マスターのindexを取得するマップを定義しておく
    const beansMasterIdToIndex = new Map();
    for (let i=0; i<beansMaster.length; i++) {
        const curBeans = beansMaster[i].json;
        const curBeansId = curBeans.id;
        beansMasterIdToIndex.set(curBeansId, i);
    }

    // 豆マスターを、深煎りグループと、浅煎りグループに分け、beansGroupに格納
    // グループには、豆マスターのindexを登録する
    const beansSeparatedByIri = separateIriGroup(beansMaster);
    
    // 煎り方ごとに、豆を１つずつ選択
    const selectedBeansMasterIndexes = [];    // これを作る
    for (const iri in beansSeparatedByIri) {
        // 煎り方ごとの豆マスターのindex配列
        const curBeanIds = beansSeparatedByIri[iri];

        // 煎り方に対する豆マスターのレコードを、beansMasterから抽出する
        const curIriBeansMaster = beansMaster
            .filter(bean => curBeanIds.includes(bean.json.id))
        ;
        
        // curIriBeansMasterから、１つ選択
        const selectedBeanId = selectOneBean(
            curIriBeansMaster,
            orderHis,
        );
        selectedBeansMasterIndexes.push(
            beansMasterIdToIndex.get(selectedBeanId)
        );
    }

    // 出力情報を整理
    // 豆マスターのjsonをそのまま"json"へ格納し、"pairedItem"へ選択した豆マスターのindexを格納する
    // n8nで、前モジュールから入力した要素をフィルターして、次モジュールへ引き継ぐときのお作法
    const retArray = [];
    for(let i=0; i<selectedBeansMasterIndexes.length; i++ ){
        const beanIndex = selectedBeansMasterIndexes[i];
        const curBM = beansMaster[beanIndex].json;
        retArray.push({
            json: curBM,
            pairedItem: beanIndex,
        });
    }

    return retArray;
}
//return selectNextOrder();



module.exports = {
    selectNextOrder,
    separateIriGroup,
    selectOneBean,
};

