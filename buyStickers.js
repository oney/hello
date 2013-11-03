console.log("ddd");
chrome.extension.sendMessage({method: "stickersInfo"}, function(data) {
	$(".pic").attr("src", data.pic);
	$(".picname").text(data.name);

	//var dic = {sticker:data.serial, fbid:data.fbid};
	var fbid = data.fbid;
	var custom = "sticker"+data.serial+"fbid"+fbid;
	$(".card2 input[name='custom']").val(custom);

	$(".fb_pic").attr("src", 'https://graph.facebook.com/'+fbid+'/picture');
	queryUsername(fbid);
});

function queryUsername(fid){
    var url = "https://graph.facebook.com/"+fid;
    $.get(url, function(resp) {
        console.log("graph:"+JSON.stringify(resp));
        var name = resp["name"];
        if(name){
            $(".fb_name").text(name);
        }
    });
}