//設定保存
document.getElementById('save_button').onclick = function () {
    save()
}

document.getElementById('send_button').onclick = function () {
    post()
}

window.onload = function () {
    //設定取り出し
    chrome.storage.local.get(["url", "json", "par_key", "par_value", "auth", "background_check", "background_hour", "background_close"], function (value) {
        if (value.url != null) {
            document.getElementById('url_input').value = value.url
            document.getElementById('auth').value = value.auth
            document.getElementById('background_check').checked = value.background_check
            document.getElementById('background_hour').value = value.background_hour
            document.getElementById('background_close').value = value.background_close

            //JSON→配列
            var keyJsonArray = JSON.parse(value.par_key)
            var valueJSONArray = JSON.parse(value.par_value)
            for (var i = 0; i < keyJsonArray.length; i++) {
                document.getElementsByClassName('par_key')[i].value = keyJsonArray[i]
                document.getElementsByClassName('par_val')[i].value = valueJSONArray[i]
            }

        }
    });
}

function save() {
    //パラメーターのKeyを取る
    var keyList = []
    for (var i = 0; i < document.getElementsByClassName('par_key').length; i++) {
        var key = document.getElementsByClassName('par_key')[i].value
        keyList[i] = key
    }
    //パラメーターのValueを取る
    var valueList = []
    for (var i = 0; i < document.getElementsByClassName('par_val').length; i++) {
        var value = document.getElementsByClassName('par_val')[i].value
        valueList[i] = value
    }

    //保存できるようにJSONに変換
    var keyJsonArray = JSON.stringify(keyList)
    var valueJSONArray = JSON.stringify(valueList)

    //保存する
    var url = document.getElementById('url_input').value
    var auth = document.getElementById('auth').value
    var late = document.getElementById('late_input').value
    var background_check = document.getElementById('background_check').checked
    var background_hour = document.getElementById('background_hour').value
    var background_close = document.getElementById('background_close').value

    chrome.storage.local.set({ 'url': url }, function () {
    });
    chrome.storage.local.set({ 'par_key': keyJsonArray }, function () {
    });
    chrome.storage.local.set({ 'par_value': valueJSONArray }, function () {
    });
    chrome.storage.local.set({ 'auth': auth }, function () {
    });
    chrome.storage.local.set({ 'late': late }, function () {
    });
    chrome.storage.local.set({ 'background_check': background_check }, function () {
    });
    chrome.storage.local.set({ 'background_hour': background_hour }, function () {
    });
    chrome.storage.local.set({ 'background_close': background_close }, function () {
    });
}

function post() {
    //送信
    chrome.storage.local.get(["url", "json", "par_key", "par_value", "auth"], function (value) {
        //ぱらめーたー
        var parameter = ""

        //JSON→配列
        var keyJsonArray = JSON.parse(value.par_key)
        var valueJSONArray = JSON.parse(value.par_value)
        for (var i = 0; i < keyJsonArray.length; i++) {
            if (keyJsonArray[i] != "") {
                if (parameter == "") {
                    parameter = `${keyJsonArray[i]}=${valueJSONArray[i]}`
                } else {
                    parameter = `${parameter}&${keyJsonArray[i]}=${valueJSONArray[i]}`
                }
            }
        }

        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', value.url, true)
        //認証情報追加
        if (value.auth != "") {
            xmlHttpRequest.setRequestHeader('Authorization', `Bearer ${value.auth}`)
        }
        xmlHttpRequest.onload = function () {
            //ぱーす
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    alert("成功");
                } else {
                    alert("失敗");
                }
            }
        }
        xmlHttpRequest.onerror = function (e) {
            //エラー時
            alert(xmlHttpRequest.status);
        }
        //JSONだよ！
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xmlHttpRequest.responseType = 'json'
        //送信
        xmlHttpRequest.send(parameter)

    });
}