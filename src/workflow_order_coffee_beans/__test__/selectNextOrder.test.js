/*
    次に注文する２個を選ぶ
    
    // 深煎り、中深煎りから１つ、それ以外から１つ選ぶ
    // 優先順位は、
    // 1. 過去に注文したことがないもの（であればどれでもよい）
    // 2. もっとも過去に注文したもの（同じ日の場合はどれでもよい）
*/

const $ = require('../../n8n_object/n8n_object');
//const selectNextOrder = require('../selectNextOrder');
const { selectNextOrder, separateIriGroup, selectOneBean } = require('../selectNextOrder');



describe('separateIriGroup', () => {
    it('深煎り、中煎り、浅い煎りの分類', () => {
        // テストデータ
        $('豆マスター').registerMockData([
            {
                id: "b-1",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
            {
                id: "b-2",
                properties: {"煎り": {select: {name: "中深煎り",},},},
            },
            {
                id: "b-3",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
            {
                id: "b-4",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
            {
                id: "b-5",
                properties: {"煎り": {select: {name: "中深煎り",},},},
            },
            {
                id: "b-6",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
        ]);

        const result = separateIriGroup($('豆マスター').all());

        expect(result).toBeInstanceOf(Object);
        expect(result.fuka).toBeInstanceOf(Array);
        expect(result.fuka.length).toBe(4);
        expect(result.fuka[0]).toBe("b-1");
        expect(result.fuka[1]).toBe("b-2");
        expect(result.fuka[2]).toBe("b-5");
        expect(result.fuka[3]).toBe("b-6");
        expect(result.asa).toBeInstanceOf(Array);
        expect(result.asa.length).toBe(2);
        expect(result.asa[0]).toBe("b-3");
        expect(result.asa[1]).toBe("b-4");
    });
});



describe('selectOneBean', () => {
    it('過去に注文したことがないものを選ぶ', () => {
        const beans = [
            {json: {id: "b-1"},},
            {json: {id: "b-2"},},
            {json: {id: "b-3"},},
            {json: {id: "b-4"},},
        ];
        const orderHis = [
            {json: {beansMasterId: "b-1", lastOrdered: "2025/1/1"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/1/2"},},
        ];

        const result = selectOneBean(beans, orderHis);
        expect(result).toBe("b-3");
    });

    
    it('すべて注文したことがある場合、もっとも過去に注文した豆を選ぶ1', () => {
        const beans = [
            {json: {id: "b-2"},},
            {json: {id: "b-3"},},
        ];
        const orderHis = [
            {json: {beansMasterId: "b-1", lastOrdered: "2025/1/1"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/1/2"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/1/3"},},
            {json: {beansMasterId: "b-4", lastOrdered: "2025/1/4"},},
            {json: {beansMasterId: "b-5", lastOrdered: "2025/1/5"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/2/2"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/2/3"},},
        ];

        const result = selectOneBean(beans, orderHis);
        expect(result).toBe("b-2");
    });

    
    it("すべて注文したことがある場合、もっとも過去に注文した豆を選ぶ2", () => {
        const beans = [
            {json: {id: "b-2"},},
            {json: {id: "b-3"},},
        ];
        const orderHis = [
            {json: {beansMasterId: "b-1", lastOrdered: "2025/1/1"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/1/3"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/1/2"},},
            {json: {beansMasterId: "b-4", lastOrdered: "2025/1/4"},},
            {json: {beansMasterId: "b-5", lastOrdered: "2025/1/5"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/2/2"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/2/3"},},
        ];

        const result = selectOneBean(beans, orderHis);
        expect(result).toBe("b-3");
    });

    
    it("すべて注文したことがあり、同じ日がある場合、最初に見つけた豆を選ぶ", () => {
        const beans = [
            {json: {id: "b-2"},},
            {json: {id: "b-3"},},
        ];
        const orderHis = [
            {json: {beansMasterId: "b-1", lastOrdered: "2025/1/1"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/1/3"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/1/3"},},
            {json: {beansMasterId: "b-4", lastOrdered: "2025/1/4"},},
            {json: {beansMasterId: "b-5", lastOrdered: "2025/1/5"},},
            {json: {beansMasterId: "b-2", lastOrdered: "2025/2/2"},},
            {json: {beansMasterId: "b-3", lastOrdered: "2025/2/3"},},
        ];

        const result = selectOneBean(beans, orderHis);
        expect(result).toBe("b-2");
    });
});



describe('selectNextOrder', () => {
    it("注文したことのない豆を選ぶ", () => {
        $('豆マスター').registerMockData([
            {
                id: "b-1",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
            {
                id: "b-2",
                properties: {"煎り": {select: {name: "中深煎り",},},},
            },
            {
                id: "b-3",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
            {
                id: "b-4",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
            {
                id: "b-5",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
        ]);

        $('Group by 豆').registerMockData([
            {
                "beansMasterId": "b-1",
                "lastOrdered": "2025/1/1"
            },
            {
                "beansMasterId": "b-2",
                "lastOrdered": "2025/1/2"
            },
        ]);

        const result = selectNextOrder();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result[0].json.id).toBe("b-4");
        expect(result[1].json.id).toBe("b-3");
    });

    

    it("注文したことのある豆を選ぶ", () => {
        $('豆マスター').registerMockData([
            {
                id: "b-1",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
            {
                id: "b-2",
                properties: {"煎り": {select: {name: "中深煎り",},},},
            },
            {
                id: "b-3",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
            {
                id: "b-4",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
        ]);

        $('Group by 豆').registerMockData([
            {
                "beansMasterId": "b-1",
                "lastOrdered": "2025/1/1"
            },
            {
                "beansMasterId": "b-2",
                "lastOrdered": "2025/1/2"
            },
            {
                "beansMasterId": "b-3",
                "lastOrdered": "2025/1/3"
            },
            {
                "beansMasterId": "b-1",
                "lastOrdered": "2025/1/4"
            },
            {
                "beansMasterId": "b-4",
                "lastOrdered": "2025/1/5"
            },
        ]);

        const result = selectNextOrder();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result[0].json.id).toBe("b-1");
        expect(result[1].json.id).toBe("b-3");
    });



    it("注文したことのある/なし混合", () => {
        $('豆マスター').registerMockData([
            {
                id: "b-1",
                properties: {"煎り": {select: {name: "深煎り",},},},
            },
            {
                id: "b-2",
                properties: {"煎り": {select: {name: "中深煎り",},},},
            },
            {
                id: "b-3",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
            {
                id: "b-4",
                properties: {"煎り": {select: {name: "浅煎り",},},},
            },
        ]);

        $('Group by 豆').registerMockData([
            {
                "beansMasterId": "b-1",
                "lastOrdered": "2025/1/11"
            },
            {
                "beansMasterId": "b-2",
                "lastOrdered": "2025/1/2"
            },
            {
                "beansMasterId": "b-3",
                "lastOrdered": "2025/1/3"
            },
            {
                "beansMasterId": "b-1",
                "lastOrdered": "2025/1/4"
            },
        ]);

        const result = selectNextOrder();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result[0].json.id).toBe("b-2");
        expect(result[0].pairedItem).toBe(1);
        expect(result[1].json.id).toBe("b-4");
        expect(result[1].pairedItem).toBe(3);
    });

});
