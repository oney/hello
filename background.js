
var CURRENT_USER_ID = "111";
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41743490-1']);
setTimeout(function(){
    _gaq.push(['_trackEvent', 'openApp', chrome.app.getDetails().version, CURRENT_USER_ID]);
},1000);

var translateResultArr;
var translateQueryArr;
var yqlIndex;
var transTabId;


chrome.extension.onMessage.addListener(function (request, sender, callback) {
    if("saveToken" == request.method){
        
    }
    else if (request.method == "uploadText"){
        console.log("data:"+JSON.stringify(request.data));
        $.post("http://onlyone.tw/goodtrans/upload_text.php", {arr:JSON.stringify(request.data), url:request.url}, function(data) {
            console.log("upload_text:"+data);
        });
    }
    else if (request.method == "pageAction"){
        if (request.which=="transBtn") {


            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, {method: "transBtnPrepare"});
            });

            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var tab = tabs[0];
                console.log("dsfsd:"+JSON.stringify(tab));

                $.post("http://onlyone.tw/goodtrans/search_text.php", {url:tab.url}, function(data) {
                    console.log("search_text:"+data);

                    chrome.tabs.sendMessage(tab.id, {method: "transBtn", data:data});
                });
            });
        }
        else if (request.which=="editBtn") {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, {method: "editBtn", yql:request.yql});
            });
        }
    }
    else if (request.method=="yqlGoogleTranslate") {
        transTabId = sender.tab.id;

        translateResultArr = {};
        yqlIndex=0;
        translateQueryArr = request.data;
        yqlTrans();
    }
    

});


function yqlTrans(){
    console.log("yqlTrans:"+yqlIndex);
    // if (yqlIndex>=10) {return;}
    chrome.tabs.sendMessage(transTabId, {method: "yqlProgress", value:(yqlIndex*100/translateQueryArr.length)});
    if (yqlIndex>=translateQueryArr.length) {
        chrome.tabs.sendMessage(transTabId, {method: "yqlGoogleTranslate", data:translateResultArr});
        return;
    }

    var word = translateQueryArr[yqlIndex];
    $.ajax({
        url: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.translate%20where%20q%3D%22'+encodeURIComponent(word)+'%22%20and%20target%3D%22zh-tw%22%3B&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
        error: function(xhr) {
            yqlIndex++;
            // console.log("yqlIndex:"+yqlIndex+" error");
            yqlTrans();
        },
        success: function(response) {
            yqlIndex++;
            // console.log("yqlIndex:"+yqlIndex+" success:"+response.query.results.json.sentences.trans);
            if (response&&response.query&&response.query.results&&response.query.results.json&&response.query.results.json.sentences&&response.query.results.json.sentences.trans) {

                var transResult = response.query.results.json.sentences.trans;
                if (word.match(/\d+/)) {
                    if (transResult.match(/\d+/)) {
                        word = word.replace(/\d+/g, "%k");
                        transResult = transResult.replace(/\d+/g, "%k");
                    }
                }
                translateResultArr[word] = transResult;
            }
            yqlTrans();
        }
    });
}



(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
