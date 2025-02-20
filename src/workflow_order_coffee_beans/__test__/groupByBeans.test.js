/*
    Group by 豆
    Notionの注文履歴データを豆でGroup byする
*/

const $ = require('../../n8n_object/n8n_object');
const groupByBeans = require('../groupByBeans');


describe('groupByBeans', () => {
    it('１件', () => {
        // テストデータ
        $('注文履歴').registerMockData([
            {
              "properties": {
                "注文日": {
                  "date": {
                    "start": "2025-02-18T16:00:00.000+09:00",
                  }
                },
                "豆マスター": {
                  "relation": [
                    {
                      "id": "BeansID1"
                    }
                  ],
                },
              }
            },
        ]);
        
        // テスト実行
        const result = groupByBeans();

        // 検証
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(1);
        expect(result[0].json.beansMasterId).toBe('BeansID1');
        expect(result[0].json.lastOrdered).toBe('2025/2/18');
    });



    it('同一IDが複数', () => {
      // テストデータ
      $('注文履歴').registerMockData([
          {
            "properties": {
              "注文日": {
                "date": {
                  "start": "2025-02-18T16:00:00.000+09:00",
                }
              },
              "豆マスター": {
                "relation": [
                  {
                    "id": "BeansID1"
                  }
                ],
              },
            }
          },
          {
            "properties": {
              "注文日": {
                "date": {
                  "start": "2025-02-19T16:00:00.000+09:00",
                }
              },
              "豆マスター": {
                "relation": [
                  {
                    "id": "BeansID1"
                  }
                ],
              },
            }
          },
          {
            "properties": {
              "注文日": {
                "date": {
                  "start": "2025-02-17T16:00:00.000+09:00",
                }
              },
              "豆マスター": {
                "relation": [
                  {
                    "id": "BeansID1"
                  }
                ],
              },
            }
          },
      ]);
      
      // テスト実行
      const result = groupByBeans();

      // 検証
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0].json.beansMasterId).toBe('BeansID1');
      expect(result[0].json.lastOrdered).toBe('2025/2/19');
    });



    it('別IDがある', () => {
      // テストデータ
      $('注文履歴').registerMockData([
          {
            "properties": {
              "注文日": {
                "date": {
                  "start": "2025-02-18T16:00:00.000+09:00",
                }
              },
              "豆マスター": {
                "relation": [
                  {
                    "id": "BeansID1"
                  }
                ],
              },
            }
          },
          {
            "properties": {
              "注文日": {
                "date": {
                  "start": "2025-02-18T16:00:00.000+09:00",
                }
              },
              "豆マスター": {
                "relation": [
                  {
                    "id": "BeansID2"
                  }
                ],
              },
            }
          },
      ]);
      


      // テスト実行
      const result = groupByBeans();


      
      // 検証
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0].json.beansMasterId).toBe('BeansID1');
      expect(result[0].json.lastOrdered).toBe('2025/2/18');
      expect(result[1].json.beansMasterId).toBe('BeansID2');
      expect(result[1].json.lastOrdered).toBe('2025/2/18');
    });
});


