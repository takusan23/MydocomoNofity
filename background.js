//バックグラウンドで動く
//初期化
chrome.runtime.onInstalled.addListener(function () {
    //1分ごとに呼び出す
    setInterval(function () {
        //設定内容を取り出す
        chrome.storage.local.get(["url", "json", "par_key", "par_value", "auth", "background_check", "background_hour", "background_close"], function (value) {
            var background_check = value.background_check
            var background_hour = value.background_hour
            var background_close = value.background_close
            if (background_check) {
                //現在時刻を取得する
                var date = new Date()
                var hour = date.getHours()
                if (hour == background_hour) {
                    //mydocomo起動
                    var window = open('https://www.nttdocomo.co.jp/mydocomo/')
                    //数秒後にウィンドウを閉じる
                    setTimeout(function () { window.close() }, background_close)
                }
            }
        });
    }, 60000)
});
