//通信量を取り出す
window.onload = function () {
    //遅延する時間を取り出してから通信量を取り出す
    chrome.storage.local.get("late", function (value) {
        //なんかしらんけどMydocomo表示されるまで時間がかかるので遅延させる
        setTimeout(function (e) {
            //通信量の項目を取り出す
            //使用済み
            var dataUse = document.getElementsByClassName('card-t-number t-bold color-blue')[0]
            //利用可能データ量
            var dataTotal = document.getElementsByClassName('card-t-number t-bold')[1]
            post(dataUse.innerHTML, dataTotal.innerHTML)
        }, value.late)
    });
}


function post(dataUse, dataTotal) {
    //送信
    chrome.storage.local.get(["url", "json", "par_key", "par_value", "auth"], function (value) {
        //ぱらめーたー
        var parameter = ""

        var url = value.url
        var auth = value.auth

        //JSON→配列
        var keyJsonArray = JSON.parse(value.par_key)
        var valueJSONArray = JSON.parse(value.par_value)
        for (var i = 0; i < keyJsonArray.length; i++) {
            if (keyJsonArray[i] != "") {
                if (parameter == "") {
                    //置き換える
                    //残りGB　と　トータル　の部分を置き換える
                    var value = valueJSONArray[i]
                    value = value.replace('残りGB', dataUse + 'GB')
                    value = value.replace('トータル', dataTotal + 'GB')
                    parameter = `${keyJsonArray[i]}=${value}`
                } else {
                    //残りGB　と　トータル　の部分を置き換える
                    var value = valueJSONArray[i]
                    value = value.replace('残りGB', dataUse + 'GB')
                    value = value.replace('トータル', dataTotal + 'GB')
                    parameter = `${parameter}&${keyJsonArray[i]}=${value}`
                }
            }
        }
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', url, true)
        //認証情報追加
        if (auth != "") {
            xmlHttpRequest.setRequestHeader('Authorization', `Bearer ${auth}`)
        }
        xmlHttpRequest.onload = function () {
            //ぱーす
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    //alert("成功");
                } else {
                    //alert("失敗" + xmlHttpRequest.status);
                }
            }
        }
        xmlHttpRequest.onerror = function (e) {
            //エラー時
            //alert(xmlHttpRequest.status);
        }
        //JSONだよ！
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        //送信
        xmlHttpRequest.send(parameter)


    });
}
