/**
 * 特殊渠道跳转
 * @return 无
 */
(function(){
    var s_apps = location.search.split("?").pop();
    var channel_arr = {
        'lm_823':'lm_823',
        'lm_766':'lm_766',
        'lm_1090':'lm_1090'
    };
    if (channel_arr[s_apps]){
        window.location.href='http://m.2345.com/mwhite/index.htm?' + channel_arr[s_apps];
        return;
    }
})();

/*var bids = {
    'u2929941': 'bq3a1ece92fec3f339db197798a4ff25ec5dac8f576fb77fe1103c',//首屏首次启动前4条
    'u2929968': 'cs3a1ece92fec3f130db197798a4ff25ec5dac8f576fb77fe1103c',//首次进入后4条
    'u2929973': 'hx3a1ece92fec3f03bdb197798a4ff25ec5dac8f576fb77fe1103c',//上拉加载
    'u2929979': 'ne3a1ece92fec3f031db197798a4ff25ec5dac8f576fb77fe1103c'//下拉刷新
}

var bid_relation = {
    'firstFir':'u2929941',
    'firstSec':'u2929968',
    'down':'u2929979',
    'top':'u2929973'
};*/

var bids = {
//    'u3169166': 'kfxoenoee',//首屏首次启动前4条
    'u3190111':'togxwuxxx',
    'u3169179': 'ojbsirskr',//首次进入后4条
    'u3169191': 'idvmclmlm',//上拉加载
    'u3169214': 'ezriyhoiv'//下拉刷新
}

var bid_relation = {
//    'firstFir':'u3169166',
    'firstFir':'u3190111',
    'firstSec':'u3169179',
    'down':'u3169214',
    'top':'u3169191'
};

//统计
var report = (function() {
    var imgs = [];
    return function(url) {
        var img = new Image();
        imgs.push(img);
        img.src = url;
    };
})();

var staCount = function(a, isA, dfurl, isopen)
{
    var sE = '';
    var timestamp = Date.parse(new Date());
    var ver = 'mversion20170320';
    var jump = '';
    var event = event || window.event;
    var isopen = isopen ? isopen : 0;
    if(!!event && isA =='A')
    {
        event.preventDefault();
        sE = event.target || event.srcElement;
        sE =  $( sE ).closest("a");
        var tmpurl = sE.attr('href');
        if (sE.attr('tagName' == "A") && tmpurl != "" && tmpurl !== "javascript:;") {
            jump = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(document.location.href) + "&fBL=" + screen.width + "*" + screen.height + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(tmpurl) + "?nytjsplit=" + encodeURIComponent("http://" + location.hostname + "/");
        }
        if(a == 'hotword-default' || a == 'search_sm' || a == 'hotnews')
        {
            tmpurl = dfurl;
            jump = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(document.location.href) + "&fBL=" + screen.width + "*" + screen.height + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(tmpurl) + "?nytjsplit=" + encodeURIComponent("http://" + location.hostname + "/");
        }
        if(a == 'news_appdownload1' || a == 'news_appdownload2' || a == 'news_appdownload3' || a == 'news_appdownload4'){
            tmpurl = 'http://app.2345.com/download.php?app=m_news';
            jump = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(document.location.href) + "&fBL=" + screen.width + "*" + screen.height + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(tmpurl) + "?nytjsplit=" + encodeURIComponent("http://" + location.hostname + "/");
        }
        if(a == 'downloadbanner_click' || a == 'm_feed_click' || a == 'm_xuanfu_click')
        {
            jump = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(document.location.href) + "&fBL=" + screen.width + "*" + screen.height + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(dfurl+tmpurl) + "?nytjsplit=" + encodeURIComponent("http://" + location.hostname + "/");
        }
    }
    if (a.length > 0) {
        var from = location.search;
        if (from == "?fgz") {
            from = "_fgz";
        } else {
            from = "";
        }
        if(a == 'news_appdownload1' || a == 'news_appdownload2' || a == 'news_appdownload3' || a == 'news_appdownload4'){
            var c3 = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(location.href) + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent('news_appdownload') + from;
            report(c3);
        }
        var c = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(location.href) + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(a) + from;
        //搜索计费链调整统计
        if(a != 'search_sm'){
            report(c);
        }
        if(jump != '' && isA == 'A')
        {
            report(jump);
            setTimeout(function(){window.location.href=tmpurl}, 250);
        }
    }
    return true;
}
window.cc = staCount;

var city = encodeURIComponent($.fn.cookie('city'));//默认城市
var news_type = $.fn.cookie('news_type');
if(news_type == null){
    news_type = 'toutiao';
}
var userkey = $.fn.cookie('userkey');
if(userkey == null)
{
    userkey = guid();
}
$.fn.cookie('userkey', userkey, {expires: 365});
$.fn.cookie('news_type', news_type);
var adnums = 0;
var start_pos = 0;

var pgnum_down = -1;
var idx_down = 0;
var pgnum_top = 1;
var idx_top = 0;

// Generate four random hex digits.
function S4()
{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

// 产生随机字符串作为用户userkey
function guid()
{
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * 获取页面滚动条的位置
 * @return 返回浏览器上次浏览的位置
 */
function get_current_position(news_type){
    return sessionStorage.getItem(news_type + "current_position");
}

/**
 * 保存浏览器当前的滚动位到sessionStorage中
 * @param {number|string} value 滚动条停留的位置
 */
function set_current_position(value, news_type){
    sessionStorage.setItem(news_type + "current_position",value);
}

//请求接口拼装
function getUrl(data)
{
    if (baidu_feed_flag) {
        var url = 'https://cpu-openapi.baidu.com/api/v2/data/list/';
    } else {
        var url = 'http://2345api.dftoutiao.com/newsapi/newsjp?';
        for (var i in data) {
            url += i + '=' + data[i] + '&';
        }
        url = url.substr(0, url.length - 1);
    }
    return url;
}

var obj_flow_list = $('#J_flow_list'); //信息流列表对象
// 初始新闻流数据
function init_data(jsondata, news_type){
    jsondata.win_w=$(window).width() > 720 ? "720":$(window).width();
    var $getHtml = $(template('new_list_module', jsondata));
    obj_flow_list.html($getHtml);
    insertAd(jsondata.data);
}

var getmore = '<span class="item-getmore">';
getmore += '<a class="trig" style="color:#4ca9f9;" id="J_flow_getmore" href="javascript:;">查看更多</a>';
getmore += 	'</span>';

var retry = '<span class="item-retry">';
retry += '<a class="trig" style="color:#4ca9f9;" id="J_flow_retry" href="javascript:;">网络不佳，请重试</a>';
retry += 	'</span>';

/**
 * 用于页面初始化
 * @return 无
 */
(function(){
    if (!window.navigator.cookieEnabled) {
        alert("你禁用了浏览器cookie，这可能导致部分功能不可用");
    }
})();

function checkSession(){
    var testKey = 'test', storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function lazyload(){
    $(".m-newsList img").each(function(){
        var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());
        var thisTop = parseInt($(window).scrollTop());
        var PictureTop = parseInt($(this).offset().top);
        if (PictureTop >= thisTop && PictureTop <= thisButtomTop && $(this).attr("data-src") != $(this).attr("src")) {
            $(this).attr("src", $(this).attr("data-src"));
        }
    });
}

//百度广告
function getAd(uid, adid)
{
    try {
        cpro_id = null;
        (function() {
            var a;
            a = window._SF_ && window._SF_._global_ && window._SF_._global_._ssp ? window._SF_._global_._ssp : window._ssp_global = window._ssp_global || {};
            if (!a.___exp) a.___exp = "115100";
            var c = "cpro.baidustatic.com/cpro/ui/cm.js",
                d = 0;
            c = /qqbrowser|ucbrowser|ubrowser|vivobrowser|oppobrowser|miui/i.test(navigator.userAgent);
            if (a.___checkExp) d = 1;
            else if (a.___closeExp) d = 0;
            else if (c) {
                d = 1;
                a.___exp = "115101"
            }
            if (!a.___closeExp && /qqbrowser|ucbrowser|ubrowser|vivobrowser|oppobrowser|miui/i.test(navigator.userAgent) || a.___checkExp) {
                c = "ggcode.2345.com/2e4d8bc2a586a06f.js";
                d = 1
            } else c = "cpro.baidustatic.com/cpro/ui/cm.js";
            var f = bids[adid];
            if (!document.getElementById(f)) {
                f = "_" + Math.random().toString(36).slice(2);
                $("." + uid).append('<div id="' + f + '"></div>');
            }
            var g = {
                id: adid,
                container: f,
                async: true,
                exps: a.___exp
            };
            if (d) {
                g.proxy = 1;
                g.pos = "ggsearch.2345.com";
                c = "ggcode.2345.com/2e4d8bc2a586a06f.js"
            }
            var h = window["_" + bids[adid]] ? window["_" + bids[adid]] : null;
            if (h) for (var i in h) if (i && h.hasOwnProperty) g[i] = h[i];
            (window.slotbydup = window.slotbydup || []).push(g);
            var k = function(b) {
                var e = document.createElement("script");
                e.type = "text/javascript";
                e.async = true;
                e.src = ("https:" === document.location.protocol ? "https:" : "http:") + "//" + b;
                b = document.getElementsByTagName("script")[0];
                b.parentNode.insertBefore(e, b)
            };
            if (!a.isRemoteLoaded) {
                a.isRemoteLoaded = true;
                k(c);
            }!d && 1 && setTimeout(function() {
                var b = document.getElementById(f);
                if (!b || b.getElementsByTagName("iframe").length < 1) {
                    a.isRemoteLoaded = true;
                    a.___checkExp = 1;
                    a.___exp = a.___closeExp ? "116102" : "115102";
                    if (window.slotbydup && window.slotbydup instanceof Array) {
                        b = 0;
                        for (var e = window.slotbydup.length; b < e; b++) {
                            var j = window.slotbydup[b];
                            j.proxy = 1;
                            j.pos = "ggsearch.2345.com";
                            j.exps = a.___exp
                        }
                    }
                    k("ggcode.2345.com/2e4d8bc2a586a06f.js")
                }
            }, 800)
        })()
    } catch (e$$5) {
        var url = ["//eclick.baidu.com/se.jpg?&type=fatalError", "mes=" + encodeURIComponent(e$$5)].join("&"),
            img = new Image;
        img.src = url
    };
}

//插入百度广告
function insertAd(data, news_type){
    for(var i in data){
        if(data[i]['datatype'] == 'ba_news'){
            //var licon = '<script type="text/javascript" src="http://ggcode.2345.com/' + bids[news_type][dealnews[i]['adid']] + '.js"><\/script>';
            //$("." + dealnews[i]['adindex']).html(licon);
            getAd(data[i]['adindex'], data[i]['adid']);
        }
    }
}

//推啊广告渲染与统计
function getTuia(tuiaid, tid, cword){
    new TuiaMedia({
        container:'#' + tuiaid,
        appKey:'4HwXeb5Nbzs68fUKpYicnPCHs9WK',
        adslotId:tid,
        clickTag:'true',
        success:function(res){
            var str = '<img id="customer"  src="'+ res.img_url +'"/> ';
            document.querySelector('#' + tuiaid).innerHTML = str;
            document.querySelector('#' + tuiaid).addEventListener('click',function(){
                /*统计代码*/
                var timestamp = Date.parse(new Date());
                var ver = 'mversion20161026';
                var c_word = cword;
                var jump = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(document.location.href) + "&fBL=" + screen.width + "*" + screen.height + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(c_word + '_'+res.clickurl) + "?nytjsplit=" + encodeURIComponent("http://" + location.hostname + "/");
                var c = "http://thp.2345.com/web/ajax154?uId2=SPTNPQRLSX&r=" + encodeURIComponent(location.href) + "&ver=" + ver + "&rand=" + timestamp + "&lO=" + encodeURIComponent(c_word);
                report(c);
                report(jump);
                setTimeout(function(){
                    window.location.href=res.clickurl;
                },200);
            });
        }
    });
}

//输入字符串过滤前后空格
function trim_str(str) {
    if (str.trim) {
        return str.trim();
    }
    return str.replace(/^\s+|\s+$/g, '');
}