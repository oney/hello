

function randomString(){
    var validCharacters = "abcdefghijklmnopqrstuxyvwzABCDEFGHIJKLMNOPQRSTUXYVWZ";
    var maxNum = validCharacters.length-1;  
    var minNum = 0;
    var sequence="";
    for (var i = 0; i < 8; i++) {
        var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;  
        sequence += validCharacters.charAt(n);
    }
    console.log("randomString:"+sequence);
    return sequence;
}

setInterval(function(){
    chrome.extension.sendMessage({method: "userDefault", udkey:"useDropbox"}, function(response) {

        var useDropbox = response.data;
        if(useDropbox=="yes"){
            var gallery = $('#gallery-view-media');
            if(gallery.length!=0){
                var test = $(".dropbox_muphin_div");
                if(test.length==0){
                    $("body").append('<div class="dropbox_muphin_div"><a class="dropbox_muphin">加入到Muphin</a><h2 style="display:none;">加入成功!</h2></div>');
                }
            }
        }
        else{
            $(".dropbox_muphin_div").remove();
        }
    });

},500);


$(document).on('click', '.dropbox_muphin', function(e){

	var arr = [];
    $("#gallery-view-media li a img").each(function(index){
	    var url = $(this).attr("data-src");
	    url = url.replace(/\/(\d+)x(\d+)\/(\d+)\//g, "/$1x$2/3/");
	    //console.log("url:"+url);
	    arr.push(url);


	}); 
	var current = document.URL;
	var randomStr = randomString();
	//console.log("arr:"+JSON.stringify(arr));
	var dic = {};
	dic["urls"] = arr;
	dic["url"] = current;
	dic["folder"] = randomStr;
	console.log("length:"+arr.length);
	//var bb = new WebKitBlobBuilder();
	$(".dropbox_muphin_div h2").fadeIn("slow");
	setTimeout(function(){
		$(".dropbox_muphin_div h2").fadeOut("slow");
	},1000);
	chrome.extension.sendMessage({method: "saveDropboxUrl", data: dic}, function(response) {
    });
});