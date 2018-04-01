// tool function
//把单位为秒的时间规则化
function regularTime(s) {
    s = parseInt(s);
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
    //rotating interval
    var rotatingInerval;
    // current song list's name
    var songListName;
    // song list len
    var songListLen;
    // current song index
    var curSongIndex;
    //rotating 
    var rotatingTime = 0;

    // 获取歌单和索引
    function getBasicInfo() {
        var hashData = window.location.search.substring(1);
        songListName = hashData.split('&')[0];
        curSongIndex = parseInt(hashData.split('&')[1]);

    }
    //获取播放歌曲的全部信息并播放
    function getSongNameToPlay() {
        // bigPic wrapper
        var picWrapper = document.getElementsByClassName('neiquan')[0];
        //song name wrapper
        var songNameWrapper = document.getElementsByClassName('name')[0];
        // songer wrapper
        var singerWrapper = document.getElementsByClassName('singer')[0];

        $.ajax({
            "url": "../server/" + songListName + ".json",
            "dataType": "json"
        }).done(function(data) {
            console.log(data);
            var thisInfo = data.info[curSongIndex];
            console.log(curSongIndex);
            var songName = thisInfo.name;
            songNameWrapper.innerHTML = songName.split(" - ")[1];
            singerWrapper.innerHTML = songName.split(" - ")[0];
            picWrapper.style.background = "url(" + thisInfo.img_url + ")  no-repeat";
            console.log(songName);
            songListLen = data.info.length;
            createAndPlay(songName);
        });
    }






    // play with adapt mask change
    function playAdaptMask() {
        var dura = audio.duration;
        var bar = document.getElementById('bar');
        var scroll = document.getElementById('scroll');
        var barRelativePosi = bar.offsetLeft + bar.offsetWidth / 2;

        // console.log('bar.offsetLeft  ' + bar.offsetLeft);
        // console.log('scroll.offsetLeft  ' + scroll.offsetLeft);
        // console.log('barRelativePosi  ' + barRelativePosi);
        var barPercent = barRelativePosi / scroll.offsetWidth;
        var toTime = barPercent * dura;
        audio.currentTime = toTime;
    }


    function dragFn() {

        var scroll = document.getElementById('scroll');
        var bar = document.getElementById('bar');
        var mask = document.getElementById('mask');
        var ptxt = document.getElementsByTagName('p')[0];
        var barleft = 0;

        scroll.onmousedown = function(event) {
            // var event = event || window.event;
            var leftVal = scroll.offsetLeft;
            barleft = event.clientX - leftVal;
            mask.style.width = barleft + 'px';
            bar.style.left = barleft - bar.offsetWidth / 2 + "px";
            playAdaptMask();
            changeTimeCur();


        }
        scroll.ontouchmove = function() {
            var leftVal = scroll.offsetLeft;
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
            document.ontouchend = function() {
                //播放总时间
                playAdaptMask();
                changeTimeCur();
                document.ontouchmove = null; //弹起鼠标不做任何操作
                // document.ontouchend = null;
                document.ontouchend = null;
                document.ontouchmove = null;
            }

        }
    }

    function createAndPlay(songName) {

        audio.src = "../server/media/" + songName + ".mp3";
        audio.play();
        console.log([audio]);
        audio.onloadedmetadata = function() {
            var timeAll = document.getElementsByClassName('time-all')[0];
            timeAll.innerHTML = regularTime(audio.duration);
        }

    }

    // add curtime in html time-cur
    function changeTimeCur() {
        var curTime = document.getElementsByClassName('time-cur')[0];
        curTime.innerHTML = regularTime(parseInt(audio.currentTime));
    }
    // mask and bar adapt to play
    function mabAdaptPlay() {
        var scroll = document.getElementById('scroll');
        var bar = document.getElementById('bar');
        var playPercent = audio.currentTime / audio.duration;
        bar.style.left = parseInt(playPercent * scroll.offsetWidth - bar.offsetWidth / 2) + 'px';
        mask.style.width = parseInt(playPercent * scroll.offsetWidth) + 'px';
    }
    //让然轮盘旋转
    function rotating() {
        rotatingTime += 0.4;
        var lunpan = document.getElementsByClassName('lunpan')[0];
        lunpan.style.transform = "rotate(-" + rotatingTime + "deg)";
    }

    function settingInterval() {
        myInterval = setInterval(function() {
            changeTimeCur();
            mabAdaptPlay();
        }, 500);

        rotatingInerval = setInterval(function() {
            rotating();
        }, 50)
    }

    function bindEvent() {
        // var backBar = document.getElementsByClassName('back')[0];
        // backBar.ontouchend = function() {
        //     window.location.href = "./songlist.html";
        // }

        switchWrapper.onmouseup = function(ev) {
            console.log(ev.target.classList);
            console.log(switchWrapper.children);
            var playBar = switchWrapper.children[1];
            var curTar = ev.target;
            var curClass = ev.target.classList[0];
            switch (curClass) {
                case "pause":
                    {
                        curTar.classList.remove('pause');
                        curTar.classList.add('play');
                        audio.pause();
                        clearInterval(myInterval);
                        clearInterval(rotatingInerval);
                    };
                    break;
                case "play":
                    {
                        curTar.classList.remove('play');
                        curTar.classList.add('pause');
                        audio.play();
                        settingInterval();
                    };
                    break;
                case "next":
                    {
                        clearInterval(myInterval);
                        clearInterval(rotatingInerval);
                        // console.log(songListLen);
                        curSongIndex = (curSongIndex + 1) % songListLen;
                        getSongNameToPlay();
                        audio.play();
                        playBar.classList.remove('play');
                        playBar.classList.add('pause');
                        settingInterval();
                    };
                    break;
                case "last":
                    {
                        clearInterval(myInterval);
                        clearInterval(rotatingInerval);
                        curSongIndex = (curSongIndex - 1) % songListLen;
                        getSongNameToPlay();
                        audio.play();
                        playBar.classList.remove('play');
                        playBar.classList.add('pause');
                        settingInterval();
                    };
                    break;
            }
        }
    }



    var init = function() {
        audio = new Audio();
        getBasicInfo();
        getSongNameToPlay();
        // createAndPlay();
        dragFn();
        bindEvent();
        settingInterval();
    }
    return init;
})();