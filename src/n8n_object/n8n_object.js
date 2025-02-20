/*
    n8nのcodeモジュールで使用する"$"関数をモック
*/



const mockResults = {};

const $ = function (nodeName) {
    return {
        // 前処理の結果データを登録する
        registerMockData: (objectArray) => {
            console.assert(Array.isArray(objectArray), 'objectArray must be an array');

            mockResults[nodeName] = objectArray.map((obj) => ({json: obj}));
        },

        // n8nで使用する関数
        all: () => mockResults[nodeName],
        first: () => mockResults[nodeName][0],
    };
}

module.exports = $;

