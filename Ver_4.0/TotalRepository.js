var TotalRepository = {

    keyName : "",

    data: {
        ClearStageNum: 0,
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