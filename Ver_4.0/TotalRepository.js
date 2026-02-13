var TotalRepository = {

    keyName : "",

    data: {
        ClearStageNum: -1,
        Zanki: 0,
        Scores: [],
        Level: 0,
        Type: 0,
        Pattern: -1
    },

    restore: function() {
        var storageData = WebStorage.get(this.keyName);
        if (storageData != null) {
            this.data = storageData;
        }else{
            this.data = {
                ClearStageNum: 0,
                Zanki: 0,
                Scores: [],
                Level: 0,
                Type: 0,
                Pattern: -1
            }
        }
    },
    save: function() {
        WebStorage.save(this.keyName, this.data);
    },
    initialize : function () {
        this.restore();
    },
    remove: function() {
        WebStorage.remove(this.keyName);
    },
    getStageNum : function(){
        return this.data.ClearStageNum;
    },
    getZanki : function(){
        return this.data.Zanki;
    },
    getScores: function(){
        return this.data.Scores;
    },
    getLevel: function(){
        return this.data.Level;
    },
    getType: function(){
        return this.data.Type;
    },
    getPattern: function(){
        return this.data.Pattern;
    }
}
/* IndexedDB対応版
var TotalRepository = {

    keyName : "total",

    data: {
        ClearStageNum: 0,
        Zanki: 0,
        Scores: [],
        Level: 0,
        Type: 0,
        Pattern: -1
    },

    async restore() {
        const storageData = await IDBStorage.get(this.keyName);
        if (storageData != null) {
            this.data = storageData;
        }
    },

    async save() {
        await IDBStorage.save(this.keyName, this.data);
    },

    async initialize() {
        await IDBStorage.init();
        await this.restore();
    },

    async remove() {
        await IDBStorage.remove(this.keyName);
    },

    // getter はそのまま
    getStageNum() { return this.data.ClearStageNum; },
    getZanki() { return this.data.Zanki; },
    getScores() { return this.data.Scores; },
    getLevel() { return this.data.Level; },
    getType() { return this.data.Type; },
    getPattern() { return this.data.Pattern; }
};

// ゲーム起動時等での呼び出し
await TotalRepository.initialize();
*/
