var $ = function(id) {
	// 获取id
	return typeof id === "string" ? document.getElementById(id) : id;
}
var $$ = function(tagName,oParent) {
	// 获取标签
	return (oParent || document).getElementsByTagName(tagName);
}
function ObjectImage(lis,imgs,imageBox,imgArray) {
	var oThis = this;
	this.lis = lis;
	this.imgs = imgs;
	this.imageBox = imageBox;
	this.imgArray = imgArray;
	this.showImg = function() {
		var length = oThis.lis.length;
		for(var i = 0;i < length;i++) {
			oThis.imgs[i].src = oThis.imgArray[i];
			oThis.lis[i].style.left = oThis.shuffle("left") + oThis.imageBox.offsetLeft + "px";
			oThis.lis[i].style.top = oThis.shuffle("top") + oThis.imageBox.offsetTop + "px";
			oThis.dragEvent(oThis.lis[i],i);
		}
	};
	this.shuffle = function(e) {
		var left = oThis.imageBox.offsetWidth-120;
		var top = oThis.imageBox.offsetHeight-94;
		if(e == "left") {
			return Math.floor(Math.random()*left);
		}
		else if(e == "top") {
			return Math.floor(Math.random()*top);
		}
		else
			return;
	};
	this.dragEvent = function(object,index) {
		var disX = "",
			disY = "",
			top = "",
			left = "";
		var flag = false;
		object.onmousedown = function(event) {
			var e = event || window.event;
			flag = true;
			disX = parseInt(e.clientX) - parseInt(object.style.left);
			disY = parseInt(e.clientY) - parseInt(object.style.top);
			this.style.zIndex ++;
			document.onmousemove = function(event) { 
				var e = event || window.event;
				if(flag) {
					left = e.clientX - disX;
					top = e.clientY - disY;
					object.style.left = left + "px";
					object.style.top = top + "px";
					oThis.matchImg(object,index);
				}
				return false;
			};
			document.onmouseup = function(event) {
				flag = false;
				object.style.zIndex = 0;
				// oThis.isSucceed();
				return false;
			};
			return false;
		};
	};
	this.matchImg = function(obj,index) {
		var box = $("image-box"),
			matchLis = $$("li",box),
			liLeft = matchLis[index].offsetLeft,
			liTop = matchLis[index].offsetTop,
			objLeft = parseInt(obj.style.left),
			objTop = parseInt(obj.style.top),
			value = 10,
			maxLeft = liLeft + value,
			minLeft = liLeft - value,
			maxTop = liTop + value,
			minTop = liTop - value;
		if(objLeft > minLeft && objLeft < maxLeft) {
			if(objTop > minTop && objTop < maxTop){
				if(!matchLis[index].firstChild && obj.firstChild){
					var newChild = document.createElement("img");
					newChild.src = obj.firstChild.src;
					matchLis[index].appendChild(newChild);
					obj.removeChild(obj.firstChild);	
				}
			}
		}			
	};
}
window.onload = function() {
	var imageBox = $("image-piece");
	var lis = $$("li",imageBox);
	var imgs = $$("img",imageBox);
	var imgArray = [];
	var index = 1;
	var length = lis.length;
	for(var i = 0;i < length;i ++) {
		//存放图片的相对路径
		imgArray[imgArray.length] = "../images/" + (index++) + ".png";
	}
	var puzzleDemo = new ObjectImage(lis,imgs,imageBox,imgArray);
	puzzleDemo.showImg();
}