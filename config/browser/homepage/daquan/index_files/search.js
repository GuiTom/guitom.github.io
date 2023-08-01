//搜索
var Search = {
//    from_code: "wm744856",
    from_code: "wm892933",
    defaultValue: "",
    think: function(keyword) {
        keyword = encodeURIComponent(keyword);
        // 百度搜索
        var url = "http://m.baidu.com/su?p=3&ie=utf-8&from=wise_web&wd=" + keyword + "&t=" + Math.round(new Date().getTime() / 1e3);
        $.ajax({
            async:false,
            url: url,
            type: "GET",
            dataType: 'jsonp',
            jsonp: 'callback',
            data: '',
            timeout: 3000,
            success: function (data) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
                var inputValue = trim_str($(".J_search_input").val());
                var search_data = [];
                if (data.s.length > 0 && inputValue !== "") {
                    //搜索下拉推荐
                    if(checkSession()){
                        if (localStorage && localStorage.getItem("history")) {
                            var history = localStorage.getItem("history");
                            var hisArray = history.split(",");
                            for (var j = 0; j < hisArray.length; j++) {
                                if (hisArray[j].indexOf(data["q"]) != -1) {
                                    hisArray[j] = hisArray[j].replace(/@@@/g, ",");
//                                     search_data.push('<li><a href="https://m.so.com/s?src=home&srcg=daohang_5&nav=0&q=' + encodeURIComponent(hisArray[j]) + '" target="_blank" onclick="Search.addClickCount(\'history_search\', \'' + hisArray[j] + '\');"><span class="key">' + data["q"] + "</span>" + hisArray[j].replace(data["q"], "") + "</a><div class=\"op\" onclick=\"cc('click_search');changeKeyword('" + hisArray[j] + "')\"></div></li>");
                                    search_data.push('<li><a href="https://m.baidu.com/s?word=' + encodeURIComponent(hisArray[j]) + '" target="_blank" onclick="Search.addClickCount(\'history_search\', \'' + hisArray[j] + '\');"><span class="key">' + data["q"] + "</span>" + hisArray[j].replace(data["q"], "") + "</a><div class=\"op\" onclick=\"cc('click_search');changeKeyword('" + hisArray[j] + "')\"></div></li>");
                                    break;
                                }
                            }
                        }
                    }
                    for (var i = 0; i < data["s"].length; i++) {
                        if (i < 5) {
//                             search_data.push('<li><a class="history" href="https://m.so.com/s?src=home&srcg=daohang_5&nav=0&q=' + encodeURIComponent(data["s"][i]) + '" target="_blank" onclick="Search.addClickCount(\'lianxiang_search\', \'' + data["s"][i] + '\');"><span class="key">' + data["q"] + "</span>" + data["s"][i].replace(data["q"], "") + "</a><div class=\"op\" onclick=\"cc('click_search');changeKeyword('" + data["s"][i] + "')\"></div></li>");
                            search_data.push('<li><a class="history" href="https://m.baidu.com/s?word=' + encodeURIComponent(data["s"][i]) + '" target="_blank" onclick="Search.addClickCount(\'lianxiang_search\', \'' + data["s"][i] + '\');"><span class="key">' + data["q"] + "</span>" + data["s"][i].replace(data["q"], "") + "</a><div class=\"op\" onclick=\"cc('click_search');changeKeyword('" + data["s"][i] + "')\"></div></li>");
                        }
                    }
                    if (trim_str($(".J_search_input").val()) === "") {
                        $(".J_search_pop").hide();
                        return;
                    }
                    $(".serch-think-ul").html(search_data.join(""));
                    $(".J_search_pop").removeClass("m-serch-think-history").addClass("m-serch-think");
                    $(".J_clearHistory").hide();
                    $(".J_closeSearch").show();
                    $(".serch-think-ul").show();
                    $(".J_search_pop").show();
                }else{
                    $(".J_search_pop").hide();
                }
            }
        });
    },
    changeKeyword: function(keyword) {
        $(".J_search_input").val(keyword);
        $(".J_search_clear").show();
        $('.J_search_input')[0].focus();
        Search.think(keyword);
    },
    setSearchHistory: function(keyword) {
        var in_array = function(k, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == k) return true;
            }
            return false;
        };
        var keyword = trim_str(keyword);
        keyword = keyword.replace(/^\,+|\,+$/g, "");
        if (keyword) {
            keyword = keyword.replace(/\,+/g, "@@@");
            if(checkSession()){
                if (window.localStorage) {
                    if (localStorage.getItem("history")) {
                        var history = localStorage.getItem("history");
                        var hisArray = history.split(",");
                        if (!in_array(keyword, hisArray)) {
                            if (hisArray.length >= 5) {
                                hisArray.splice(4, 1);
                            }
                            history = hisArray.join(",");
                            localStorage.setItem("history", keyword + "," + history);
                        }
                    } else {
                        localStorage.setItem("history", keyword);
                    }
                }
            }
        }
    },
    doSearch: function() {
        var inputValue = trim_str($(".J_search_input").val());
        var in_searchs = "search_" + $(".J_search_input").val();
        if(in_searchs == 'search_')
        {
            if($(".J_search_btn").html() == '百度一下'){
                cc("null_search");
            }
            if($(".J_search_btn").html() == '取&nbsp;&nbsp;消'){
                cc("quxiao_search");
                $(".J_search_btn").html("百度一下");
            }
        }
        else
        {
            cc("search");
            cc(in_searchs);
            cc("keyword_search");
        }
        $(".J_search_pop").hide();
        if (inputValue != ""){
            $(".J_search_clear").hide();
            if (navigator.userAgent.toLocaleLowerCase().indexOf("mb2345browser") != -1) {
//                 window.location.href = "https://m.so.com/s?src=home&srcg=daohang_5&nav=0&q=" + encodeURIComponent($(".J_search_input").val());
                window.location.href = "https://m.baidu.com/s?word=" + encodeURIComponent($(".J_search_input").val());
            }else{
//                 window.open("https://m.so.com/s?src=home&srcg=daohang_5&nav=0&q=" + encodeURIComponent($(".J_search_input").val()));
                window.open("https://m.baidu.com/s?word=" + encodeURIComponent($(".J_search_input").val()));
            }
            try {
                Search.setSearchHistory(inputValue);
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    addClickCount: function(cname, keyword) {
        var in_searchs = "search_" + keyword;
        cc("search");
        cc(in_searchs);
        cc(cname);
//         var search_url = "https://m.so.com/s?src=home&srcg=daohang_5&nav=0&q=" + encodeURIComponent(keyword);
        var search_url = "https://m.baidu.com/s?word="+encodeURIComponent(keyword);
        cc('search_sm', 'A', search_url);
        if (cname == 'lianxiang_search'){
            try {
                Search.setSearchHistory(keyword);
            } catch (e) {
                return false;
            }
        }
    },
    bindEvents: function() {
        var me = this;
        $(".J_search_input").bind("input", function(e) {
            var keyword = $(this).val();
            if (trim_str(keyword) == ""){
                $(".J_search_btn").html("取&nbsp;&nbsp;消");
                $("#input1").val(keyword);
                $(".serch-think-ul").html("");
                $(".J_search_pop").hide();
                $(".J_search_clear").hide();
                return;
            }
            $(".J_search_btn").html("百度一下");
            $(".J_search_clear").show();
            me.think(keyword);
        }).bind("keyup", function(e) {
             e = e || window.event;
             if (e.keyCode == 13) {
                 me.doSearch();
                 return;
             }
         }).bind("focus", function(){
            var keyword = $(this).val();
            if (trim_str(keyword) == "") {
                $(".J_search_btn").html("取&nbsp;&nbsp;消");
                $("#input1").val(keyword);
                $(".serch-think-ul").html("");
                $(".J_search_pop").hide();
                $(".J_search_clear").hide();
                return;
            }
            $(".J_search_btn").html("百度一下");
            $(".J_search_clear").show();
            me.think(keyword);
        });

        $(".J_search_btn").bind('click', me.doSearch);
        $(".J_search_input").bind("click", function() {
            var keyword = $(".J_search_input").val();
            if(keyword == ""){
                $(".J_search_btn").html("取&nbsp;&nbsp;消");
            }
            else
            {
                $(".J_search_btn").html("百度一下");
            }
            if (keyword == "" && $(".J_search_pop").css("display") == "none") {
                var search_data = [];
				if(checkSession()){
					var history = localStorage.getItem("history");
					if (history) {
						var data = history.split(",");
						if (data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								if (search_data.length < 6 && data[i] && trim_str(data[i])) {
									data[i] = data[i].replace(/@@@/g, ",");
									search_data.push('<li><a class="history" href="https://m.baidu.com/s?word=' + encodeURIComponent(data[i]) + '" target="_blank" onclick="Search.addClickCount(\'history_search\', \'' + data[i] + '\');">' + data[i] + "</a><div class=\"op\" onclick=\"cc('click_search');changeKeyword('" + data[i] + "')\"></div></li>");
								}
							}
						}
					}
					if (history) {
                        $(".J_search_pop").addClass("m-serch-think-history");
                        $(".serch-think-ul").html(search_data.join(""));
                        $(".J_clearHistory").show();
                        $(".J_search_pop").show();
					}
				}
            }
        });

        // 2015.11.15 改变输入框默认显示逻辑
        // $("#input1").bind("focus", function() {
        //     if (trim_str($(".J_search_input").val()) === "") $("#input1")[0].setAttribute("placeholder", "");
        // });
        // $("#input1").bind("blur", function() {
        //     alert(2222);
        //     if (trim_str($(".J_search_input").val()) === "") $("#input1")[0].setAttribute("placeholder", "搜索关键词");
        //     $(".J_search_btn").html("搜&nbsp;&nbsp;索");
        // });
    },
    init: function() {
        this.from_code = location.search == "?tg1" ? "1009928a" : "wm892933";
//        this.from_code = location.search == "?tg1" ? "1009928a" : "wm744856";
        window.searchThink = Search.thinkCallback;
        window.changeKeyword = Search.changeKeyword;
        window.submitSearch = Search.doSearch;
        this.bindEvents();
    }
};
Search.init();