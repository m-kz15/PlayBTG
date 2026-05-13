var Repository = {

    keyName : "",

    data: {
        //Name: "",
        StageNum: 0,
        Zanki: 0,
        Scores: [],
        Level: 0,
        Type: 0,
        Pattern: -1,
        UseLife: false
    },

    restore: function() {
        var storageData = WebStorage.get(this.keyName);
        if (storageData != null) {
            this.data = storageData;
        }else{
            this.data = {
                //Name: "",
                StageNum: 0,
                Zanki: 0,
                Scores: [],
                Level: 0,
                Type: 0,
                Pattern: -1,
                UseLife: false
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
    /*getName : function(){
        return this.data.Name;
    },*/
    getStageNum : function(){
        return this.data.StageNum;
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
    },
    getUseLife: function(){
        return this.data.UseLife;
    }
    /*getCircleName : function(cd) {
        var item = getItemfromList(this.data.CircleNameList, 'xxxxx', cd);
        return item == null ? '': item.yyyyyy + '：' + item.zzzzzz;
    },
    getSaenaiSikyKish: function (sikyKishKbn) {
        return getItemfromList(this.data.SaenaiKishList, 'kishKbn', sikyKishKbn);
    },
    getComboboxItem: function (comboboxName, valueFieldName, value) {
        var list = this.data.combobox[comboboxName];
        return getItemfromList(list || [], valueFieldName, value);
    },
    getshinkanInfo: function(){
        return this.data.shinkanInfo;
    }*/
}