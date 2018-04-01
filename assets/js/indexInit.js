var oList = document.getElementsByClassName('swiper-slide');
console.log(oList);

var oDivList = document.getElementsByClassName('sectionBody');
console.log(oDivList);

getData();

function getData() {
    $.ajax({
        type: "GET",
        url: "../../server/main-slider-img.json",
        dataType: "json"
    }).done(function(data) {
        console.log(data);
        for (var i = 0; i < oList.length; i++) {
            oList[i].url = "data.info[i]";
        }
    })

    $.ajax({
        type: "GET",
        url: "../../server/songList-list.json",
        dataType: "json"
    }).done(function(data) {
        for (var i = 0; i < oList.length; i++) {

        }
    })
}