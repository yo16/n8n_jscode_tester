/*
    カレンダー用に整形
*/

const $ = require('../../n8n_object/n8n_object');
const formatForCalendar = require('../formatForCalendar');


describe('formatForCalendar', () => {
    it('should return the formatted data', () => {
        $('注文履歴データを作る').registerMockData(
            [
                {
                  "title": "7",
                  "orderedUtcDt": "2025-02-20T07:00:00.000Z",
                  "orderText": "豆1、100g、豆のまま",
                  "beansMasterId": "178f2518-7763-8052-840a-ec5e92a7bc1f"
                },
                {
                  "title": "8",
                  "orderedUtcDt": "2025-02-20T07:00:00.000Z",
                  "orderText": "豆2、100g、豆のまま",
                  "beansMasterId": "178f2518-7763-80d8-a592-e08fec4a37d7"
                }
              ]
        );

        const result = formatForCalendar();

        expect(result.startDt).toBe('2025/2/20 16:00:00');
        expect(result.endDt).toBe('2025/2/20 17:00:00');
        expect(result.orderStr).toBe('- 豆1、100g、豆のまま\n- 豆2、100g、豆のまま');
    });
});