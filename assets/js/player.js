// tool function
//把单位为秒的时间规则化
function regularTime(s) {
    var min = parseInt(s / 60);
    var sec = s - min * 60;
    str = '';
    if (min > 9) {
        str += min + ':';
    } else {
        str += '0' + min + ':';
    }
    if (sec > 9) {
        str += sec;
    } else {
        str += '0' + sec;
    }
    return str;
}

// main
var play = (function(data) {
    // new的audio原件
    var audio;
    //  按钮的wrapper
    var switchWrapper = document.getElementsByClassName('switch')[0];
    // interval
    var myInterval;
    // ontouchmove
    function dragFn() {
        var scroll = document.getElementById('scroll');
        var bar = document.getElementById('bar');
        var mask = document.getElementById('mask');
        var ptxt = document.getElementsByTagName('p')[0];
        var barleft = 0;
        scroll.onmousedown = function(event) {
            // var event = event || window.event;
            var leftVal = scroll.offsetLeft;
            // console.log(scroll.offsetLeft)
            barleft = event.clientX - leftVal;
            // console.log(barleft + "barleft")
            mask.style.width = barleft + 'px';
            bar.style.left = barleft - bar.offsetWidth / 2 + "px";
            // 拖动一定写到 down 里面才可以
            document.ontouchmove = function(event) {
                // var event = event || window.event;
                // console.log(event.touches[0].pageX)
                barleft = event.touches[0].pageX - leftVal;
                // console.log(event.clientX)
                if (barleft < 0)
                    barleft = 0;
                else if (barleft > scroll.offsetWidth)
                    barleft = scroll.offsetWidth;
                mask.style.width = barleft + 'px';
                bar.style.left = barleft - bar.offsetWidth / 2 + "px";
                // console.log(barleft)

                //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            }

        }
        document.onmouseup = function() {
            document.onmousemove = null; //弹起鼠标不做任何操作
        }
    }

    function createAndPlay() {
        audio = new Audio("../server/media/文武贝 - 星空.mp3");
        audio.play();
        console.log([audio])
        var timeAll = document.getElementsByClassName('time-all')[0];
        timeAll.innerHTML = parseInt([audio][0].duration);
        console.log([audio][0].duration);
    }

    function settingInterval() {
        myInterval = setInterval(function() {
            var curTime = document.getElementsByClassName('time-cur')[0];
            curTime.innerHTML = regularTime(parseInt(audio.currentTime));
        }, 1000);
    }

    function bindEvent() {

        switchWrapper.onmouseup = function(ev) {
            console.log(ev.target.classList);
            var curTar = ev.target;
            var curClass = ev.target.classList[0];
            switch (curClass) {
                case "pause":
                    {
                        curTar.classList.remove('pause');
                        curTar.classList.add('play');
                        audio.pause();
                    };
                    break;
                case "play":
                    {
                        curTar.classList.remove('play');
                        curTar.classList.add('pause');
                        audio.play();
                    };
                    break;
            }
        }
    }



    var init = function() {
        createAndPlay();
        dragFn();
        bindEvent();
        settingInterval();
    }
    return init;
})();