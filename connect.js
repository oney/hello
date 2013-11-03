
//chrome.extension.sendRequest({method:"saveMuphinToken",accessToken:document.getElementById("access_token").innerText},function(){window.close()});

var CLIENT_ID = "256002347743983",
    CLIENT_ID2 = "683455521680785", //493521934051375 256002347743983 452811101463488
    location = window.location;
    
if (0 <= location.search.indexOf("client_id=" + CLIENT_ID)) {
    console.log("location.hash:"+location.hash);
    var match = /access_token=([^&]+)/.exec(location.hash);
    if (match && match[1]) {
        var accessToken = match[1];
        //console.log("accessToken:"+accessToken);
        chrome.extension.sendMessage(
            {
                method: "saveToken",
                accessToken: accessToken
            }, function () {
                window.close();
            }
        )
    }
}
else if (0 <= location.search.indexOf("client_id=" + CLIENT_ID2)) {
    var match = /access_token=([^&]+)/.exec(location.hash);
    if (match && match[1]) {
        var accessToken = match[1];
        //console.log("hash:"+location.hash);
        chrome.extension.sendMessage(
            {
                method: "saveMuphinToken",
                accessToken: accessToken
            }, function () {
                window.close();
            }
        )
    }
}