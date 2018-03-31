var curIndex = 0;
var aLiList = document.querySelectorAll('#select_list li');
var magor = document.getElementsByClassName("magor")[0];
var leave = document.getElementsByClassName("leave")[0];
document.getElementById('select_list').onclick = function(ev) {
    // 获取事件源对象
    var oTarget = ev.target;
    if (oTarget.nodeName == 'LI') {
        var v = $(oTarget).index();
        if (v == curIndex) {
            return;
        }
        run(v, curIndex);
        curIndex = v;
        var name = oTarget.getAttribute("id");
        begin(name);
    }
};
//服务器请求
function begin(indexname) {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1/newwyy/easeCouldMusic_DIV/server/" + indexname + ".json",
        dataType: "json"
    }).done(function(data) {
        insertDom(data.info);
        picture_img(data.title_img);
    });
}
//动态打入歌曲列表
function insertDom(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmpArr = [
            '<a href="' + arr[i].url + '">',
            '<li>',
            /* '<div class="cover" style="background:url(' + arr[i].img_url + ')")>',*/
            '<div class="cover">',
            '<img src=" ' + arr[i].img_url + '">',
            '</div>',
            '<div class="title">',
            '<h1 class="name">' + arr[i].name.split(" ")[2] + '</h1>',
            '<span class="singer">' + arr[i].name + '</span>',
            '</div>',
            '<div class="logo">',
            '<i class="icon iconfont icon-youcecaidan"></i>',
            '</div>',
            '</li>',
            '</a>'
        ];
        str += tmpArr.join('');
    }
    $(magor).html(str);
};

function run(v, curindex) {
    if (deviceWidth > 750) deviceWidth = 750;
    if (v > curindex)
        leave.style.left = leave.offsetLeft + (v - curindex) * deviceWidth / 5 + "px";
    if (v < curindex)
        leave.style.left = leave.offsetLeft - (curindex - v) * deviceWidth / 5 + "px";
};

function picture_img(arr) {
    var tmpArr = [
        '<img ',
        'src="' + arr + '">'
    ];
    tmpArr = tmpArr.join('');
    var pictureimg = document.getElementsByClassName("pictureimg")[0];
    $(pictureimg).html(tmpArr);
};
begin(aLiList[curIndex].getAttribute("id"));