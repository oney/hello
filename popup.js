
$(document).on('click', '#transBtn', function(e){
	console.log("transBtn");
	chrome.extension.sendMessage({method: "pageAction", which:"transBtn"}, function(response) {
	});
	window.close();
});
$(document).on('click', '#editBtn', function(e){
	chrome.extension.sendMessage({method: "pageAction", which:"editBtn", yql:$("#yqlCheckbox").is(':checked')}, function(response) {
	});
	window.close();
});

var transBtnImgFlag=false;
var time=0;
setInterval(function(){
	if (transBtnImgFlag) {
		time++;
		$("#transBtnImg").rotate(time*5);
	}
},20);

setTimeout(function(){

$('#transBtnImg').blur();
$('#transBtn').blur();
$('#editBtn').blur();
$('#yqlCheckbox').blur();
},100);


$(document).on('mouseover', '#transBtnImg', function(e){
    console.log("mouseover");
    transBtnImgFlag = true;
});
$(document).on('mouseout', '#transBtnImg', function(e){
    console.log("mouseout");
    transBtnImgFlag = false;
    // if (ss_obj_btn_mouseover){
    //     ss_obj_btn_mouseover = false;
    //     $(".zoom_div").hide();
    // }
});