/**
*   @author: winsycwen
*   @creat: 2014/09/18 10:55
*   @referer: http://stephen-young.me.uk/2013/01/05/maintainable-js-with-modules.html
*/
function $(id) {
    return id ? document.getElementById(id) : id;
}
var EventUtil = {
    addHandle: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandle: function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    getEvent: function (event) {
        return event || window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
};
function Clock() {
    this.timer = null;
    this.interval = 1000;
    this.targetTime = 0;
    this.leftHour = 0;
    this.leftMinutes = 0;
    this.leftSeconds = 0;
}
Clock.prototype = {
    constructor: Clock,
    init: function (time) {
        var that = this,
            startTime = new Date().getTime();
        if (typeof time === "number") {
            that.targetTime = new Date(startTime + (time + 1) * 1000).getTime();
        }
    },
    countDown: function (time, callback) {
        //倒计时功能
        var that = this,
            currentTime = null,
            seconds_left = 0;
        that.init(time);
        that.timer = setInterval(function () {
            currentTime = new Date().getTime();
            if (currentTime > that.targetTime) {
                //时间到达，执行回调函数
                if(callback && typeof callback === "function") {
                    //回调函数内部再使用回调函数
                    callback(that.timing.apply(that));
                }
                clearInterval(that.timer);
            }
            seconds_left = (that.targetTime - currentTime) / 1000;
            that.leftMinutes = parseInt(seconds_left / 60);
            that.leftSeconds = parseInt(seconds_left % 60);
            $("timer").innerHTML = (that.leftMinutes > 10?"":"0")+that.leftMinutes+"分"+(that.leftSeconds>10?"":"0")+that.leftSeconds+"秒";
        },that.interval);
    },
    timing: function(){
        //计时功能
        var that = this;
    }
};
var myPuzzle = myPuzzle || {};
if (myPuzzle.puzzle) {
    console.log("myPuzzle.puzzle is already being used.");
} else {
    myPuzzle.puzzle = (function() {
        var pieceBox = "image_piece",
            started = false,
            columns = 5,
            rows = 4,
            readyTime = 0;   //以秒为单位;
        var createList = function (target) {
            //初始化图片列表
            var total = columns * rows,
                fragment = document.createDocumentFragment(),
                wrap = document.createElement("ul"),
                item,
                xIndex,
                yIndex;
            wrap.id = pieceBox;
            for(var i = 1; i<=total; i++) {
                xIndex = (i%columns-1) / (columns-1) < 0 ? 1 : (i%columns-1)/(columns-1);
                yIndex = parseInt((i-1) / columns) / (rows-1);
                item = document.createElement("li");
                item.style.backgroundPosition =  xIndex*100 + "% " + yIndex*100 + "%";
                fragment.appendChild(item);
            }
            wrap.appendChild(fragment);
            target.appendChild(wrap);
        };
        var randomList = function (callback){
            //图片切块，并打乱其顺序
            var arr = [],
                total = rows * columns,
                pieces = $(pieceBox).childNodes,
                xIndex = 0,
                yIndex = 0;
            for(var i = 0; i<total; i++) {
                temp = parseInt(Math.random(total)*total+1);
                if(arr.indexOf(temp) == -1) {
                    arr.push(temp);
                    xIndex = (temp%columns-1) / (columns-1) < 0 ? 1 : (temp%columns-1)/(columns-1);
                    yIndex = parseInt((temp-1) / columns) / (rows-1);
                    pieces[i].style.backgroundPosition =  xIndex*100 + "% " + yIndex*100 + "%";
                } else {
                    i--;
                }
            }
            Drag.enable();
            if(callback && typeof callback === "function") {
                callback();
            }
        };
        var Drag = function(){
            //拖拽对象，此处的getElementLeft与getElementTop频繁访问offset属性，会造成页面reflow和repaint，需改善。
            var diffX = 0,
                diffY = 0,
                dragging = null;
            function getElementLeft(element) {
                var acturalLeft = element.offsetLeft;
                var current = element.offsetParent;
                while(current !== null) {
                    acturalLeft += current.offsetLeft;
                    current = current.offsetParent;
                }
                return acturalLeft;
            }
            function getElementTop(element) {
                var acturalTop = element.offsetTop;
                var current = element.offsetParent;
                while(current !== null) {
                    acturalTop += current.offsetTop;
                    current = current.offsetParent;
                }
                return acturalTop;
            }
            function handleEvent(event) {
                var event = EventUtil.getEvent(event),
                    target = EventUtil.getTarget(event);
                EventUtil.preventDefault(event);
                getElementLeft
                switch(event.type) {
                    case "mousedown": 
                        dragging = target;
                        currentX = getElementLeft($(pieceBox)) - dragging.offsetLeft;
                        currentY = getElementTop($(pieceBox)) - dragging.offsetTop;
                        console.log(getElementTop($(pieceBox)),dragging.offsetTop);
                        break;
                    case "mousemove": 
                        if(dragging !== null) {
                            dragging.style.left = event.clientX- getElementLeft($(pieceBox))+ "px";
                            dragging.style.top = event.clientY - getElementTop($(pieceBox))+ "px";
                            dragging.style.zIndex = 1;
                        }
                        break;
                    case "mouseup": 
                        dragging.style.zIndex = 0;
                        dragging = null;
                        break;
                    default: break;
                }
            }
            return {
                enable: function() {
                    EventUtil.addHandle($(pieceBox), "mousedown", handleEvent);
                    EventUtil.addHandle($(pieceBox), "mousemove", handleEvent);
                    EventUtil.addHandle($(pieceBox), "mouseup", handleEvent);
                },
                disable: function() {
                    EventUtil.removeHandle($(pieceBox), "mousedown", handleEvent);
                    EventUtil.removeHandle($(pieceBox), "mousemove", handleEvent);
                    EventUtil.removeHandle($(pieceBox), "mouseup", handleEvent);
                }
            };
        }();
        return {
            /**
            *   init the puzzle list
            *   @method init
            *   @params {Number} a
            *   @return {Number} sum
            */
            init: function(target) {
                createList(target);
                //点击开始按钮，计时3秒。之后将图片切块，并打乱其顺序。
                /*
                *   Question one: 事件注册中事件如果不使用闭包，会自动执行
                *   Question two: 倒计时未完成，后续函数直接执行了，需要利用回调才可以实现先执行倒计时的函数，再执行后续的函数
                */
                EventUtil.addHandle($("start"), "click", function(){
                    if(!started) {
                        started = true;
                        var clock = new Clock();
                        clock.countDown(readyTime, randomList);
                    }
                });
            },
            randomList: randomList
        };
    })();
}
window.onload = function() {
    var target = $("image_wrap");
    myPuzzle.puzzle.init(target);
};