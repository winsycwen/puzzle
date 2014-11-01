/**
*   @author: winsycwen
*   @creat: 2014/09/18 10:55
*   @referer: http://stephen-young.me.uk/2013/01/05/maintainable-js-with-modules.html
*/
function $(id) {
    return id ? document.getElementById(id) : id;
}
function $$(className) {
    if(typeof className === "string") {
        console.log("1");
    }
}
var EventUtil = {
    addHandle: function (element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if(element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on"+type] = handler;
        }
    },
    removeHandle: function (element, type, handler) {
        if(element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if(element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event) {
        if(event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
function Clock () {
    this.timer = null;
    this.interval = 1000;
    this.seconds = 0;
    this.minutes = 0;
    this.startTime = 0;
    this.endTime = 0;
}
Clock.prototype = {
    constructor: Clock,
    init: function(time) {
        var that = this,
            date = new Date();
        if(typeof time === "number") {
            that.startTime = date.getTime();
            that.endTime = time*1000 + that.startTime;
            console.log(that.startTime,that.endTime);
        }
    },
    ready: function(time){
        //倒计时功能，未完善
        var that = this,
            date = new Date(),
            currentTime = date.getTime();
        that.init(time);
        if(that.startTime < that.endTime) {
            $("timer").innerHTML = currentTime - that.startTime;
            that.ready();
        }
//            that.timer = setInterval(function(){
//                that.seconds++;
//                if(that.seconds%60 == 0) {
//                    that.seconds = 0;
//                    that.minutes ++;
//                }
//                $("timer").innerHTML = that.minutes + ":" + that.seconds;
//                if(that.seconds == that.time) {
//                   that.timer = null; 
//                }
//            },interval);
//        }
    }
};
var myPuzzle = myPuzzle || {};
if(myPuzzle.puzzle) {
    console.log("myPuzzle.puzzle is already being used.");
} else {
    myPuzzle.puzzle = (function() {
        var pieceBox = "image_piece",
            columns = 5,
            rows = 4,
            readyTime = 3;   //以秒为单位;
        var createList = function(target) {
            //初始化图片列表
            var total = columns * rows,
                fragment = document.createDocumentFragment(),
                wrap = document.createElement("ul"),
                item,
                xIndex,
                yIndex;
            wrap.id = pieceBox;
            for(var i = 1; i<=total; i++) {
                xIndex = (i%columns-1)/(columns-1) < 0 ? 1 : (i%columns-1)/(columns-1);
                yIndex = parseInt((i-1)/columns)/(rows-1);
                item = document.createElement("li");
                item.style.backgroundPosition =  xIndex*100 + "% " + yIndex*100 + "%";
                fragment.appendChild(item);
            }
            wrap.appendChild(fragment);
            target.appendChild(wrap);
        };
        return {
            /**
            *   init the puzzle list
            *   @method init
            *   @params {Number} a
            *   @return {Number} sum
            */
            init: function(target) {
                createList(target);
                //点击开始按钮，计时3秒。之后将打乱拼图的顺序。
//                var btn = document.getElementById("start");
//                btn.addEventListener("click", function(){
//                    var clock = new Clock();
//                    clock.ready(readyTime);
//                },false);
                EventUtil.addHandle($("start"), "click", function(){
                    var clock = new Clock();
                    clock.ready(readyTime);
                });
            }
        };
    })();
}
window.onload = function() {
    var target = $("image_wrap");
    myPuzzle.puzzle.init(target);
};