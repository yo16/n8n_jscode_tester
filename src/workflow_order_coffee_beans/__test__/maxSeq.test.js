/*
    Group by 豆
    Notionの注文履歴データを豆でGroup byする
*/

const $ = require('../../n8n_object/n8n_object');
const maxSeq = require('../maxSeq');


describe('maxSeq', () => {
    it('１件', () => {
        $('注文履歴').registerMockData(
            [
                {
                  "properties": {
                    "SEQ": {
                      "title": [
                        {
                          "plain_text": "1",
                        }
                      ]
                    }
                  },
                },
            ]
        );

        const result = maxSeq();

        expect(result.MaxSEQ).toBe(1);
    });



    it('複数件', () => {
        $('注文履歴').registerMockData(
            [
                {
                  "properties": {
                    "SEQ": {
                      "title": [
                        {
                          "plain_text": "1",
                        }
                      ]
                    }
                  },
                },
                {
                  "properties": {
                    "SEQ": {
                      "title": [
                        {
                          "plain_text": "3",
                        }
                      ]
                    }
                  },
                },
                {
                  "properties": {
                    "SEQ": {
                      "title": [
                        {
                          "plain_text": "2",
                        }
                      ]
                    }
                  },
                },
            ]
        );



        const result = maxSeq();



        expect(result.MaxSEQ).toBe(3);
    });
});
