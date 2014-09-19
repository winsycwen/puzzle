/**
*   @author: winsycwen
*   @creat: 2014/09/18 10:55
*   @referer: http://stephen-young.me.uk/2013/01/05/maintainable-js-with-modules.html
*/
var EventUtil = {
    addHandle: function(target, type, callback) {
        if(target.addEventListener) {
            target.addEventListener(type, callback, false);
        } else if(target.attachEvent) {
            target.attachEvent("on" + type, callback);
        } else {
            target["on"+type] = callback;
        }
    },
    removeHandle: function(target, type, callback) {
        if(target.removeEventListener) {
            target.removeEventListener(type, callback, false);
        } else if(target.detachEvent) {
            target.detachEvent("on" + type, callback);
        } else {
            target["on" + type] = callback;
        }
    }
};
var Clock = {
    timer: {},
    interval: 1000,
    showClock: function(time) {
        var clock = document.getElementById("timer");
        var times = time/this.interval;
        var index = 1;
        timer = setTimeout(function(){
            if(index === times) {
                console.log("1");
                timer = null;
            }
            index ++;
            console.log("2");
        },this.interval);
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
            readyTime = 3,   //以秒为单位
            timer;
        var createList = function(target) {
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
            Clock.showClock(readyTime);
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
                EventUtil.addHandle(document.getElementById("start"), "click", clock("ready"));
            }
        };
    })();
}
window.onload = function() {
    var target = document.getElementById("image_wrap");
    myPuzzle.puzzle.init(target);
};