var $ = function(id) {
	return typeof id === "string" ? document.getElementById(id) : id;
}
var $$ = function(tagName,oParent) {
	return (oParent||document).getElementsByTagName(tagName);
}
var Demo = function(box,imgBox,originalImg,lis,imgsNum,url) {
	var oThis = this;
	this.box = box;
	this.imgBox = imgBox;
	this.originalImg = originalImg;
	this.lis = lis;
	this.imgsNum = imgsNum;
	this.url = url;
	this.init = function() {
		var x = 120;
		var y = 94;
		var newChild = document.createElement("ul");
		for(var i = 0;i < oThis.imgsNum;i ++) {
			var liChild = document.createElement("li");
			liChild.style.left = oThis.order("left") + "px";
			liChild.style.top = oThis.order("top") + "px";
			liChild.style.backgroundPositionX = -Math.floor(i%5)*x + "px";
			liChild.style.backgroundPositionY = -Math.floor(i/5)*y + "px";
			newChild.appendChild(liChild);
		}
		oThis.imgBox.appendChild(newChild);
		// compatible with FF and IE
		try{
			oThis.box.style.opacity = 0.5;
		}
		catch(e) {
			oThis.box.filters.alpha.opacity = 0.5;
		}
	};
	this.start = function() {
		var imgLis = $$("li",oThis.imgBox);
		try {
			oThis.box.style.opacity = 1;			
		}
		catch(e) {
			oThis.box.filters.alpha.opacity = 1;			
		}
		for(var i = 0;i < oThis.imgsNum;i ++) {
			oThis.dragEvent(imgLis[i],i);
		}
	}
	this.order = function(target) {
		if(target === "left") {
			return Math.floor(Math.random(10)*350);
		}
		else if(target === "top") {
			return Math.floor(Math.random(10)*250);
		}
		else {
			return;
		}
	};
	this.dragEvent = function(li,index) {
		var disX = 0,
			disY = 0,
			left = 0,
			top = 0,
			flag = false;	
		li.onmousedown = function(event) {
			var e = event || window.event;
			flag = true;
			disX = parseInt(e.clientX) - parseInt(li.style.left);
			disY = parseInt(e.clientY) - parseInt(li.style.top);
			li.style.zIndex = 1;
			document.onmousemove = function(event) {
				var e = event || window.event;
				if(flag) {
					li.style.left = parseInt(e.clientX) - disX + "px";
					li.style.top = parseInt(e.clientY) - disY + "px";
					if(oThis.matchImg(li,index))  {
						flag = false;
						li.onmousedown = null;
						li.onmousemove = null;
						li.onmouseup = null;
					}
				}
				return false;
			};
			document.onmouseup = function(event) {
				li.style.zIndex = 0;
				flag = false;
				return false;
			};
			return false;
		};
	};
	this.matchImg = function(li,index) {
		var left = parseInt(oThis.imgBox.offsetLeft - oThis.lis[index].offsetLeft);
		var top = parseInt(oThis.imgBox.offsetTop - oThis.lis[index].offsetTop);
		var liLeft = -parseInt(li.style.left);
		var liTop = -parseInt(li.style.top);
		var maxLeft = left + 5;
		var minLeft = left - 5;
		var maxTop = top + 5;
		var minTop = top - 5;
		if(liLeft < maxLeft && liLeft > minLeft && liTop < maxTop && liTop > minTop) {
			li.style.left = -left + "px";
			li.style.top = -top + "px";
			return true;
		}
		else 
			return false;
	};
	this.checkTime = function() {
		var time = new Date();
		var minute = time.getMinutes();
		var second = time.getSeconds();


	};
}
window.onload = function(){
	var imgsNum = 20;
	var imgBox = $("image-piece");
	var originalImg = $("image-box");
	var button = $("start");
	var lis = $$("li",originalImg);
	var box = $("box");
	var url = "url(../images/image.png)";
	var puzzleDemo = new Demo(box,imgBox,originalImg,lis,imgsNum,url);
	puzzleDemo.init();
	button.onclick = function() {
		puzzleDemo.start();
	}
}