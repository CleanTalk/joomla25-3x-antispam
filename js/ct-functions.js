function ctSetCookie(c_name, value) {
	document.cookie = c_name + "=" + encodeURIComponent(value) + "; path=/";
}

ctSetCookie("ct_ps_timestamp", Math.floor(new Date().getTime()/1000));
ctSetCookie("ct_fkp_timestamp", "0");
ctSetCookie("ct_pointer_data", "0");
ctSetCookie("ct_timezone", new Date().getTimezoneOffset()/60*(-1));

//Stop observing function
function ctMouseStopData(){
	if(typeof window.addEventListener == "function")
		window.removeEventListener("mousemove", ctFunctionMouseMove);
	else
		window.detachEvent("onmousemove", ctFunctionMouseMove);
	clearInterval(ctMouseReadInterval);
	clearInterval(ctMouseWriteDataInterval);				
}

//Stop key listening function
function ctKeyStopStopListening(){
	if(typeof window.addEventListener == "function"){
		window.removeEventListener("mousedown", ctFunctionFirstKey);
		window.removeEventListener("keydown", ctFunctionFirstKey);
	}else{
		window.detachEvent("mousedown", ctFunctionFirstKey);
		window.detachEvent("keydown", ctFunctionFirstKey);
	}			
}

var d = new Date(), 
	ctTimeMs = new Date().getTime(),
	ctMouseEventTimerFlag = true, //Reading interval flag
	ctMouseData = "[",
	ctMouseDataCounter = 0;
	
//Reading interval
var ctMouseReadInterval = setInterval(function(){
		ctMouseEventTimerFlag = true;
	}, 150);
	
//Writting interval
var ctMouseWriteDataInterval = setInterval(function(){ 
		var ctMouseDataToSend = ctMouseData.slice(0,-1).concat("]");
		ctSetCookie("ct_pointer_data", ctMouseDataToSend);
	}, 1200);

//Logging mouse position each 300 ms
var ctFunctionMouseMove = function output(event){
	if(ctMouseEventTimerFlag == true){
		var mouseDate = new Date();
		ctMouseData += "[" + event.pageY + "," + event.pageX + "," + (mouseDate.getTime() - ctTimeMs) + "],";
		ctMouseDataCounter++;
		ctMouseEventTimerFlag = false;
		if(ctMouseDataCounter >= 100)
			ctMouseStopData();
	}
}
//Writing first key press timestamp
var ctFunctionFirstKey = function output(event){
	var KeyTimestamp = Math.floor(new Date().getTime()/1000);
	ctSetCookie("ct_fkp_timestamp", KeyTimestamp);
	ctKeyStopStopListening();
}

if(typeof window.addEventListener == "function"){
	window.addEventListener("mousemove", ctFunctionMouseMove);
	window.addEventListener("mousedown", ctFunctionFirstKey);
	window.addEventListener("keydown", ctFunctionFirstKey);
}else{
	window.attachEvent("onmousemove", ctFunctionMouseMove);
	window.attachEvent("mousedown", ctFunctionFirstKey);
	window.attachEvent("keydown", ctFunctionFirstKey);
}