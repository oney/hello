
var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";




var imgUrl = chrome.extension.getURL('/img/');
var CURRENT_TEXT="";
// var transArr = [["Photo","照片"],["Quote","引用"],["Link","連結"]];
// var transArr = {"Photo":"照片","Quote":"引用","Link":"連結"};
var storeArr = [];
var collectArr;
var translateResultArr;
var timeout1Index;

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function makeEditable(pointer){
	pointer.mousedown(function(event) {
	    // switch (event.which) {
	    //     case 1:
	    //         console.log('Left mouse button pressed');
	    //         break;
	    //     case 2:
	    //         console.log('Middle mouse button pressed');

	    //         break;
	    //     case 3:
	    //         console.log('Right mouse button pressed');
	    //         break;
	    //     default:
	    //         console.log('You have a strange mouse');
	    // }
	    if (event.which==3) {
	    	console.log('Right mouse button pressed');
	    	$(this).attr('contentEditable', true);
	    	selectElementContents($(this)[0]);
	    	CURRENT_TEXT = getSelectionText();
	    	console.log("CURRENT_TEXT:"+CURRENT_TEXT);
	    	$(this).blur(function() {
	    		selectElementContents($(this)[0]);
	    		var edited = getSelectionText();
		    	// console.log("edited:"+edited);
		    	storeTranslate(CURRENT_TEXT, edited);
	            // $(this).attr('contentEditable', false);
	            $(this).removeAttr('contentEditable');
	        });
	    }
	});
	pointer.keypress(function(e) {
		if ((e.which == 13)&&(!e.shiftKey)) {
			// console.log("keypress");
			e.preventDefault();
			$(this).blur();
		}
	});
}

var storeTranslateFlag = true;

function storeTranslate(origin, trans){

	

	if (storeTranslateFlag) {
		storeTranslateFlag=false;
		setTimeout(function(){
			storeTranslateFlag=true;
		},100);
		if (trans.charAt(trans.length-1)==="\n") {
			console.log("===nn");
			trans = trans.substr(0, trans.length-1);
		}
		// if (origin==trans) {
		// 	return;
		// }

		if (origin.match(/\d+/)) {
			if (trans.match(/\d+/)) {
				origin = origin.replace(/\d+/g, "%k");
				trans = trans.replace(/\d+/g, "%k");

			}
			else{
				console.log("不好意思，pattern不同噢");
			}
		}


		console.log("pp origin:"+origin+"|trans:"+trans+"|");


		for (var i = 0; i < storeArr.length; i++) {
			var obj = storeArr[i];
			if (obj.o==origin) {
				return;
			}
		};

		console.log("origin:"+origin+"|trans:"+trans+"|");
		storeArr.push({o:origin, t:trans});
		refreshTitle();

		// chrome.extension.sendMessage({method: "uploadText", origin_text:origin, trans_text:trans, url:"http://www.tumblr.com/dashboard"}, function(response) {
		// });
	}
}

function addListener(elements){
	elements.each(function(index){
		// console.log("text:"+$(this).html());
		var htmlstr = $(this).html();

		$(this).children().each(function(index){
			var child = $(this)[0].outerHTML;
			// console.log("children:"+child);
			htmlstr = htmlstr.replace(child, "");
		});
		console.log("htmlstr retain:"+htmlstr);

		if (htmlstr.length>0) {

			var firstStr="xxx";
			var flag = false;
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				if (substr!=="\n"&&substr!==" ") {
					var kkk = [];
					kkk.push(substr);
					console.log("kkk:"+JSON.stringify(kkk));
					firstStr = substr;
					flag=true;
					break;
				}
			}
			console.log("firstStr:"+firstStr);
			if (flag&&firstStr!=="<") {
				console.log("come in");
				makeEditable($(this));
				// $(this).css({"background":"red"});

			}
		}


		return;




		if (htmlstr.length>0) {

			var firstStr="xxx";
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				// console.log("substr:"+substr+"kk");
				// var kkk = [];
				// kkk.push(substr);
				// console.log("kkk:"+JSON.stringify(kkk));
				if (substr!=="\n"&&substr!==" ") {
					// console.log("come in");
					firstStr = substr;
					break;
				}
			}
			// console.log("firstStr:"+firstStr);
			if (firstStr!=="<"&&firstStr!=="xxx") {
				makeEditable($(this));
				$(this).css({"background":"red"});

			}
		}
		

	});
}


// setTimeout(function(){
// 	$("body").attr("oncontextmenu", "return false;");


// 	addListener($('span'));
// 	addListener($('a'));
// 	addListener($('div'));
// }, 1000);

// setTimeout(function(){
// 	transDiv($('span'));
// 	transDiv($('a'));
// 	transDiv($('div'));
// }, 1000);



function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

function transDiv(elements){
	elements.each(function(index){
		var htmlstr = $(this).html();
		$(this).children().each(function(index){
			var child = $(this)[0].outerHTML;
			// console.log("children:"+child);
			htmlstr = htmlstr.replace(child, "");
		});
		console.log("htmlstr retain:"+htmlstr);

		if (htmlstr.length>0) {

			var firstStr="xxx";
			var flag = false;
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				if (substr!=="\n"&&substr!==" ") {
					var kkk = [];
					kkk.push(substr);
					console.log("kkk:"+JSON.stringify(kkk));
					firstStr = substr;
					flag=true;
					break;
				}
			}
			console.log("firstStr:"+firstStr);
			if (flag&&firstStr!=="<") {
				
				// $(this).css({"background":"red"});
				$(this).attr('contentEditable', true);
		    	selectElementContents($(this)[0]);

		    	var selection = getSelectionText();

		    	var transText = transArr[selection];
		    	if (transText) {
		    		replaceSelectedText(transText);
		    	}
		    	else{
		    		if (selection.match(/\d+/)) {

		    			var selectionKey = selection.replace(/\d+/g, "%k");

		    			// console.log("selection:"+selection);
		    			var transText2 = transArr[selectionKey];
		    			if (transText2) {
		    				var arr = selection.match(/\d+/g);
			    			var splitArr = transText2.split("%k");

			    			var completeStr = "";
			    			// console.log("arr:"+arr);
			    			// console.log("splitArr:"+splitArr);
			    			for (var i = 0; i < splitArr.length; i++) {
			    				// console.log("splitArr[i]:"+splitArr[i]);
			    				completeStr += splitArr[i];
			    				if (i<arr.length) {
			    					completeStr += arr[i];
			    				}
			    			};
			    			// console.log("completeStr:"+completeStr);
				    		replaceSelectedText(completeStr);
		    			}

						
					}
		    	}
	            // $(this).attr('contentEditable', false);
	            $(this).removeAttr('contentEditable');

			}
		}


		return;
		if (htmlstr.length>0) {

			var firstStr="xxx";
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				if (substr!=="\n"&&substr!==" ") {
					// console.log("come in");
					firstStr = substr;
					break;
				}
			}
			// console.log("firstStr:"+firstStr);
			if (firstStr!=="<"&&firstStr!=="xxx") {
				
				// $(this).css({"background":"red"});
				$(this).attr('contentEditable', true);
		    	selectElementContents($(this)[0]);

		    	var selection = getSelectionText();

		    	var transText = transArr[selection];
		    	if (transText) {
		    		replaceSelectedText(transText);
		    	}
		    	else{
		    		if (selection.match(/\d+/)) {

		    			var selectionKey = selection.replace(/\d+/g, "%k");

		    			// console.log("selection:"+selection);
		    			var transText2 = transArr[selectionKey];
		    			if (transText2) {
		    				var arr = selection.match(/\d+/g);
			    			var splitArr = transText2.split("%k");

			    			var completeStr = "";
			    			// console.log("arr:"+arr);
			    			// console.log("splitArr:"+splitArr);
			    			for (var i = 0; i < splitArr.length; i++) {
			    				// console.log("splitArr[i]:"+splitArr[i]);
			    				completeStr += splitArr[i];
			    				if (i<arr.length) {
			    					completeStr += arr[i];
			    				}
			    			};
			    			// console.log("completeStr:"+completeStr);
				    		replaceSelectedText(completeStr);
		    			}

						
					}
		    	}
	            // $(this).attr('contentEditable', false);
	            $(this).removeAttr('contentEditable');
			}
		}
		

	});
}



function collectDiv(elements){
	elements.each(function(index){
		var htmlstr = $(this).html();
		$(this).children().each(function(index){
			var child = $(this)[0].outerHTML;
			htmlstr = htmlstr.replace(child, "");
		});
		console.log("htmlstr retain:"+htmlstr);

		if (htmlstr.length>0) {

			var firstStr="xxx";
			var flag = false;
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				if (substr!=="\n"&&substr!==" ") {
					var kkk = [];
					kkk.push(substr);
					// console.log("kkk:"+JSON.stringify(kkk));
					firstStr = substr;
					flag=true;
					break;
				}
			}
			// console.log("firstStr:"+firstStr);
			if (flag&&firstStr!=="<") {
				
				// $(this).css({"background":"red"});
				$(this).attr('contentEditable', true);
		    	selectElementContents($(this)[0]);

		    	var selection = getSelectionText();
		    	if (selection!=="") {
			    	collectArr.push(selection);
		    	}
	            $(this).removeAttr('contentEditable');

			}
		}
		

	});
}


function transDivYql(elements){
	elements.each(function(index){
		var htmlstr = $(this).html();
		$(this).children().each(function(index){
			var child = $(this)[0].outerHTML;
			// console.log("children:"+child);
			htmlstr = htmlstr.replace(child, "");
		});
		// console.log("htmlstr retain:"+htmlstr);

		if (htmlstr.length>0) {

			var firstStr="xxx";
			var flag = false;
			for (var i = 0; i < htmlstr.length; i++) {
				var substr = htmlstr.charAt(i);
				if (substr!=="\n"&&substr!==" ") {
					var kkk = [];
					kkk.push(substr);
					// console.log("kkk:"+JSON.stringify(kkk));
					firstStr = substr;
					flag=true;
					break;
				}
			}
			console.log("firstStr:"+firstStr);
			if (flag&&firstStr!=="<") {
				
				// $(this).css({"background":"red"});
				$(this).attr('contentEditable', true);
		    	selectElementContents($(this)[0]);

		    	var selection = getSelectionText();

		    	var transText = translateResultArr[selection];
		    	if (transText) {
		    		replaceSelectedText(transText);
		    	}
		    	else{
		    		if (selection.match(/\d+/)) {

		    			var selectionKey = selection.replace(/\d+/g, "%k");
		    			var transText2 = translateResultArr[selectionKey];
		    			if (transText2) {
		    				var arr = selection.match(/\d+/g);
			    			var splitArr = transText2.split("%k");

			    			var completeStr = "";
			    			for (var i = 0; i < splitArr.length; i++) {
			    				
			    				completeStr += splitArr[i];
			    				if (i<arr.length) {
			    					completeStr += arr[i];
			    				}
			    			};
				    		replaceSelectedText(completeStr);
		    			}
					}
		    	}
	            $(this).removeAttr('contentEditable');
			}
		}
	});
}

function async(){
	console.log("async");

    
	

}

var refreshFlag=true;

function resetRefresh(){
	refreshFlag=true;
}
function callManyTime(){
	setTimeout("async();",100);
	setTimeout("async();",500);
	setTimeout("async();",700);
	setTimeout("async();",1000);
	setTimeout("async();",1500);
	setTimeout("async();",2000);
}

function callRefresh(){
	if(refreshFlag){
    	refreshFlag=false;
    	setTimeout("resetRefresh();",1000);
    	setTimeout("async();",100);
    }
}


$("body").bind("DOMSubtreeModified", function() {
	//xxconsole.log("DOMSubtreeModified jjjjjjjjjjjjjjjjjjjjjjjjjjj\n\n\n")
    callRefresh();
});
$('html').click(function(e) {

    if (typeof ($(e.target).closest(".status_detail_div_s").attr("class")) === 'undefined'){
	    	
	    

    }

    callRefresh();
});


function addTitle(){
	var str = '<div class="share_gt mrl_gt" id="gt_wrap">\
            <ul>\
              <li>\
                <label class="share-label" for="share-toggle2">請對你想要翻譯的詞彙點選右鍵<br>完成翻譯後請按Enter鍵</label>\
              </li>\
              <li>\
                <label class="share-label" for="share-toggle4" id="gt_status">目前已翻譯了0個詞彙</label>\
              </li>\
            </ul>\
            <a href="#" class="btn_gt btn-primary_gt btn-block_gt btn-large" style="width: 220px;" id="gt_saveBtn">儲存</a>\
          </div>';
	// var str = '<div id="gt_wrap"><div id="gt_status"></div><div><input type="button" id="gt_closeBtn" value="關閉"></div><div><input type="button" id="gt_saveBtn" value="儲存此次翻譯"></div></div>';

	$("body").append(str);

}

function refreshTitle(){
	if(storeArr.length!=0){
		$("#gt_status").text("目前已翻譯了"+storeArr.length+"個詞彙");
	}
	
}

$(document).on('click', '#gt_saveBtn', function(e){
	$("#gt_wrap").remove();
	$("body").removeAttr("oncontextmenu");
	chrome.extension.sendMessage({method: "uploadText", data:storeArr, url:document.URL}, function(response) {
	});
});

// function firstCall(){
// 	callManyTime();
// 	setTimeout(function(){
// 		callManyTime();

// 	},5000);
// }
// firstCall();
var elementNames = ['div', 'span', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

chrome.extension.onMessage.addListener(function(request, sender, callback) {
	console.log("ddd:"+JSON.stringify(sender));
	if (request.method == "transBtn"){
		transArr = JSON.parse(request.data);
	   	// transDiv($('span'));
		// transDiv($('a'));
		// transDiv($('div'));
		// transDiv($('li'));
		for (var i = 0; i < elementNames.length; i++) {
			transDiv($(elementNames[i]));
		};


    }
    else if (request.method == "editBtn"){
    	// console.log("request.yql:"+request.yql);return;

    	$("body").attr("oncontextmenu", "return false;");
		// addListener($('span'));
		// addListener($('a'));
		// addListener($('div'));
		// addListener($('li'));

		if (request.yql) {
			collectArr = [];
			for (var i = 0; i < elementNames.length; i++) {
				collectDiv($(elementNames[i]));
			}

			var progress = '<div class="demo-wrapper html5-progress-bar">\
			<div class="progress-bar-wrapper">\
				<progress id="progressbar" value="0" max="100"></progress>\
				<span class="progress-value">0%</span>\
			</div>\
		</div>';
			var jp = $(progress);

			jp.css('opacity',0).animate({ opacity: 0.9 },"fast");
			$("body").append(jp);

			console.log("collectArr:"+JSON.stringify(collectArr));
				chrome.extension.sendMessage({method: "yqlGoogleTranslate", data:collectArr}, function(response) {
			});
		}
		else{
	    	for (var i = 0; i < elementNames.length; i++) {
				addListener($(elementNames[i]));
			}
			addTitle();
			storeArr = [];
			refreshTitle();
			
		}

		

		
    }
    else if (request.method == "yqlGoogleTranslate"){
    	console.log("yqlGoogleTranslate result:"+JSON.stringify(request.data));
    	translateResultArr = request.data;
    	for (var i = 0; i < elementNames.length; i++) {
			transDivYql($(elementNames[i]));
		}
		// return;
    	for (var i = 0; i < elementNames.length; i++) {
			addListener($(elementNames[i]));
		}
		addTitle();
		storeArr = [];
		refreshTitle();
		$(".html5-progress-bar").animate({ opacity: 0.0 },"fast", function(){
			$(".html5-progress-bar").remove();
		});
    }
    else if (request.method == "transBtnPrepare"){
	    var progress = '<div class="demo-wrapper html5-progress-bar">\
		<div class="progress-bar-wrapper">\
			<progress id="progressbar" value="0" max="100"></progress>\
			<span class="progress-value">0%</span>\
		</div>\
	</div>';
		var jp = $(progress);

		jp.css('opacity',0).animate({ opacity: 0.9 },"fast");
		$("body").append(jp);
		timeout1Index=0;
		timeout1();
    }
    else if (request.method == "yqlProgress"){
    	var value = Math.floor(request.value);
    	$(".html5-progress-bar progress").val(value);
    	$('.progress-value').html(value + '%');
    }
});


function timeout1(){
	if (timeout1Index>=10) {

		$(".html5-progress-bar").animate({ opacity: 0.0 },"fast", function(){
			$(".html5-progress-bar").remove();
		});
		return;
	}
	setTimeout(function(){
		timeout1Index++;
		var value = timeout1Index*10;
		$(".html5-progress-bar progress").val(value);
    	$('.progress-value').html(value + '%');
    	timeout1();
	},100);
}


// setTimeout(function(){
// addTitle();
// },1000);

