/*
    注文履歴データを作る
*/

const $ = require('../../n8n_object/n8n_object');
const createOrderHistory = require('../createOrderHistory');


describe('createOrderHistory', () => {
    it('should return an array of order history objects', () => {
        // テストデータ
        $('Max SEQ').registerMockData([
            {
              "MaxSEQ": 6
            }
        ]);
        $('次に注文する２個を選ぶ').registerMockData([
          {
            id: "b-1",
            properties: {"コーヒー豆名": {title: [{plain_text: "豆1"}]}},
          },
          {
            id: "b-2",
            properties: {"コーヒー豆名": {title: [{plain_text: "豆2"}]}},
          },
        ]);

        // テスト実行
        const result = createOrderHistory();

        // 検証
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(2);
        expect(result[0].title).toBe("7");
        expect(result[0].orderText).toBe("豆1、100g、豆のまま");
        expect(result[0].beansMasterId).toBe("b-1");
        expect(result[1].title).toBe("8");
        expect(result[1].orderText).toBe("豆2、100g、豆のまま");
        expect(result[1].beansMasterId).toBe("b-2");
    });
});


