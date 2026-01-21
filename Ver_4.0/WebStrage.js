var WebStorage = {

    useSession: false,       // セッションストレージを使うか否か

    /**
     * Storageが使用可能かどうか
     */
    usable : function () {
        return (typeof localStorage !== 'undefined');
    },

    /**
     * ストレージを取得する
     *
     */
    getStorage : function (useSession) {
        return (useSession) ? sessionStorage : localStorage;
    },

    /**
     * 保存する
     *
     * @param key
     *              Key名
     * @param data
     *              データ
     */
    save : function (key, data) {
        WebStorage.getStorage(this.useSession).setItem(key, JSON.stringify(data));
    },

    /**
     * 取得する
     *
     * @param key
     *              Key名
     */
    get : function (key) {
        var data = WebStorage.getStorage(this.useSession).getItem(key);
        return (data == null) ? null : JSON.parse(data);
    },

    /**
     * 削除する
     *
     * @param key
     *              Key名
     */
    remove : function (key) {
        WebStorage.getStorage(this.useSession).removeItem(key);
    },

    /**
     * 全てクリアする
     *
     */
    clear : function () {
        WebStorage.getStorage(this.useSession).clear();
    }
}
