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
    addHandle: function (target, type, callback) {
        if(target.addEventListener) {
            target.addEventListener(type, callback, false);
        } else if(target.attachEvent) {
            target.attachEvent("on" + type, callback);
        } else {
            target["on"+type] = callback;
        }
    },
    removeHandle: function (target, type, callback) {
        if(target.removeEventListener) {
            target.removeEventListener(type, callback, false);
        } else if(target.detachEvent) {
            target.detachEvent("on" + type, callback);
        } else {
            target["on" + type] = callback;
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
var Clock = (function(){
    var timer = {},
        interval = 100,
        seconds = 0,
        minutes = 0;
    var start = function(time, flag) {
        if(flag == "up") {} 
        else {
            if(time > 0) {
                setInterval(function(){
                    if(minutes < time) {
                        seconds++;
                        if(seconds%60 == 0) {
                            seconds = 0;
                            minutes ++;
                        }
                        console.log("1");
                        $("timer").nodeValue = minutes + ":" + seconds;
                    }
                },interval);
            }
        }
    };
    return {
        //暴露在外的接口
        start: function(time, flag) {
            start(time, flag);
        }
    };
})();
var myPuzzle = myPuzzle || {};
if(myPuzzle.puzzle) {
    console.log("myPuzzle.puzzle is already being used.");
} else {
    myPuzzle.puzzle = (function() {
        var pieceBox = "image_piece",
            columns = 5,
            rows = 4,
            readyTime = 3,   //以秒为单位
            timer;
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
        var clock = function(flag) {
            switch(flag) {
                case "ready": 
                    //3秒后执行
                    timer = setTimeout(start, readyTime*1000);
                    break;
                case "start": break;
                case "end": break;
            }
        };
        var start = function() {
            Clock.start(readyTime,"down");
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
                EventUtil.addHandle($("start"), "click", clock("ready"));
            }
        };
    })();
}
window.onload = function() {
    var target = $("image_wrap");
    myPuzzle.puzzle.init(target);
};