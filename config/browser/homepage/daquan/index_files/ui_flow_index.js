(function($){
	var obj_window = $(window),
		obj_body = $('body'),
        is_get_data = true,//�Ƿ��ڻ�ȡ����
		obj_header = $('#header'), //ͷ������
		obj_flow_cont = $('#J_flow_cont'), //��Ϣ��������
		obj_flow_list = $('#J_flow_list'), //��Ϣ���б����
		obj_flow_header = $('#J_flow_header'), //��Ϣ��ͷ������
		obj_flow_headerLoad = $('#J_flow_headerLoad'), //��Ϣ��ͷ��load����
		obj_flow_headerTitle = $('#J_flow_headerTitle'), //��Ϣ��ͷ���������
		obj_flow_headerBack = $('#J_flow_headerBack'), //��Ϣ��ͷ��������ҳ����
		obj_box_mz = $('#J_box_mz'), //��վ����
		obj_flow_load = $('#J_flow_load'), //����loading����
		obj_flow_tips = $('#J_flow_tips'), //��ʾ����
        	tips = $('#tips'), //��ʾ��������
		obj_flow_fixedLoadBtn = $('#J_flow_fixedLoadBtn'), //����loadbtn����
		obj_flow_fixedLoad = obj_flow_fixedLoadBtn.find('.i-load'), //����load����
		obj_flow_fixedBackBtn = $('#J_flow_fixedBackBtn'), //����backbtn����
		obj_flow_refresh = $('#J_flow_refresh'), //���ˢ�¶���
		obj_flow_itemLoading = $('#J_flow_itemLoading'), //���ڼ���...����
        	J_flow_getmore = $("#J_flow_getmore"),//�鿴����
        	J_flow_retry = $("#J_flow_retry"),//���¼���
		b_mz_hidden = false, //�Ƿ�����Ϣ��״̬
		b_getData = false, //�Ƿ�����ȡ����
		b_canPull = true, //�Ƿ�������
		b_touchmove = false, //�Ƿ�������
        n_flow_header_height = function(){return parseInt(obj_flow_header.css('height'))},
        n_flow_offset_top = function(){return obj_flow_cont.offset().top},
        n_flow_toplocation = function(){return n_flow_offset_top() - n_flow_header_height()}, //��Ϣ������λ��
        	isbom = true;//�ж��Ƿ񵽵ײ�

    //���³�ʼ������
    function reset_params(){
        city = encodeURIComponent($.fn.cookie('city'));//Ĭ�ϳ���
        start_pos = parseInt($.fn.cookie('start_pos'));
        news_type = $.fn.cookie('news_type');
        userkey = $.fn.cookie('userkey');
        adnums = $.fn.cookie(news_type + '_adnums');
        if(adnums == null){
            adnums = 0;
        }
        adnums = parseInt(adnums);
        $.fn.cookie(news_type + '_adnums', adnums);
        pgnum_down = $.fn.cookie(news_type + '_pgnum_down');
        idx_down = $.fn.cookie(news_type + '_idx_down');
        if((pgnum_down == null) && (idx_down == null))
        {
            pgnum_down = -1;
            idx_down = 0;
            $.fn.cookie(news_type + '_pgnum_down', -1);
            $.fn.cookie(news_type + '_idx_down', 0);
        }
        pgnum_top = $.fn.cookie(news_type + '_pgnum_top');
        idx_top = $.fn.cookie(news_type + '_idx_top');
        if((pgnum_top == null) && (idx_top == null))
        {
            pgnum_top = 1;
            idx_top = 0;
            $.fn.cookie(news_type + '_pgnum_top', 1);
            $.fn.cookie(news_type + '_idx_top', 0);
        }
    }

    obj_window.scroll(function(event){
        var win_scrollTop = obj_window.scrollTop();
        if(win_scrollTop <= 0){
            b_canPull = true;
        }
        if(!b_mz_hidden && win_scrollTop <= 50){
            obj_flow_tips.css({'opacity':0});
        }
        if(win_scrollTop >= n_flow_toplocation() - 1){
            if(!b_mz_hidden) showFlowHead();
        }
        else{
            if(b_mz_hidden) hideFlowHead();
        }
        //����ҳ��ײ�
        if((isbom && win_scrollTop + $(window).height()) >= $(document).height()){
            isbom = false;
            reset_params();
            if(parseInt(pgnum_top) < 5){
                if(is_get_data)
                {
                    is_get_data = false;
                    cc('scroll_getmore');
                    getDatas('top');
                }
            }
        }
        if(checkSession()){
            reset_params();
            set_current_position(win_scrollTop, news_type);
        }

        if($.fn.cookie('start_pos') == null)
        {
            $.fn.cookie('start_pos', n_flow_toplocation() + 1);
        }
    });

    //������ת����Ϣ��
    pulldown();

    //init
    function newsinit(){
        reset_params();
        if(checkSession()){
            var last_positon = get_current_position(news_type) ? get_current_position(news_type) : start_pos;
            var isfirst = sessionStorage.getItem(news_type + 'isfirst');
            if(!isfirst){//�״�����
                var jsondata=JSON.parse(localStorage.getItem(news_type));
                if(jsondata)
                {
                    init_data(jsondata, news_type);
                }
                //�״�����ʱ���¼
                //var date1 = new Date();
                //$.fn.cookie('first_start_time', date1.getTime());
                getDatas('top', 0, 1);
            }
            else{
                /*var first_start_time = $.fn.cookie('first_start_time');
                //��ǰʱ��
                var nowTime = new Date();
                console.log(nowTime.getTime(),first_start_time,(nowTime.getTime() - first_start_time)/(1000 * 60));
                console.log(Math.floor((nowTime.getTime() - first_start_time) / (60 * 1000)));
                //����30����������ˢ��ҳ��
                if (Math.floor((nowTime.getTime() - first_start_time) / (60 * 1000)) >= 5){
                    sessionStorage.removeItem(news_type + "current_position");
                    sessionStorage.removeItem(news_type + 'news_data_id');
                    $.fn.cookie(news_type + '_pgnum_top', null);
                    $.fn.cookie(news_type + '_idx_top', null);
                    $.fn.cookie(news_type + '_pgnum_down', null);
                    $.fn.cookie(news_type + '_idx_down', null);
                    localStorage.removeItem(news_type);
                    $.fn.cookie('first_start_time', nowTime.getTime());
                    getDatas('top', 0, 1);
                    return;
                }*/

                var news_data = sessionStorage.getItem(news_type + 'news_data_id').split(',');
                if(news_data)
                {
                    for(var i in news_data){
                        var jsondata=JSON.parse(sessionStorage.getItem(news_data[i]));
                        jsondata.win_w=$(window).width() > 720 ? "720":$(window).width();
                        var $getHtml = template('new_list_module', jsondata);
                        $('#J_flow_list').append($getHtml);
                        insertAd(jsondata.data);
                    }
                    if(parseInt(pgnum_top) > 3){
                        obj_flow_itemLoading.html(getmore);
                    }
                    else{
                        obj_flow_itemLoading.html('���ڼ���...');
                    }
                    obj_flow_itemLoading.css("opacity","1");
                }
                else
                {
                    getDatas('top', 0, 1);
                }
                // ��ת���ϴη��ʵ�λ��
                $(window).scrollTop(last_positon);
                lazyload();
            }
        }else{
            getDatas('top', 0, 1);
            lazyload();
        }
    }

    newsinit();

    //ͷ������
    obj_flow_headerTitle.on('click',function(event){
        event.stopPropagation();
        backFlow();
        reset_params();
        cc('refresh_top');
        if(is_get_data)
        {
            is_get_data = false;
            getDatas('down', 1);
        }
    });

    //����loadbtn
    obj_flow_fixedLoadBtn.on('click',function(event){
        obj_flow_fixedLoad.addClass('loading');
        backFlow();
        reset_params();
        cc('refresh_bottom');
        if(is_get_data)
        {
            is_get_data = false;
            getDatas('down', 1);
        }
    });

    obj_flow_fixedBackBtn.on('click',function(event){
        event.stopPropagation();
        reset_params();
        cc('back_top');
        backHome();
    });

    //�鿴����
    $(document).on('click', '#J_flow_getmore', function(event){
        event.stopPropagation();
        reset_params();
        cc("morenews");
        if(is_get_data)
        {
            is_get_data = false;
            getDatas('top');
        }
    });

    //�������⣬������
    $(document).on('click', '#J_flow_retry', function(event){
        event.stopPropagation();
        if(is_get_data)
        {
            is_get_data = false;
            getDatas('top');
        }
    });

    //�ոտ�������
    $(document).on('click', '.J_mid', function(event){
        event.stopPropagation();
        backFlow();
	    reset_params();
        cc('refresh_mid');
        if(is_get_data)
        {
            is_get_data = false;
            getDatas('down', 1);
        }
    });

    //����ˢ��
    function pulldown(){
        var n_start_Y ,
            n_end_Y,
            n_delta,
            n_loading_stop = 165,
            n_loading_buffer = 60;
        obj_body.on('touchstart',function(event){
            n_start_Y = event.touches[0].pageY;
            if(obj_window.scrollTop() <= 0){
                obj_flow_load.css({
                    'display':'block',
                    'opacity':0
                });
                b_canPull = true;
            }
            else{
                b_canPull = false;
            }
        });
        obj_body.on('touchmove',function(event){
            n_end_Y = event.touches[0].pageY;
            n_delta = n_end_Y - n_start_Y;
            if(b_canPull && n_delta > 0){
                event.preventDefault();
                obj_flow_load.css({
                    'opacity':n_delta / n_loading_stop,
                    '-webkit-transform':'translateY(' + n_delta / 3 + 'px)',
                    'transform':'translateY(' + n_delta / 3 + 'px)'
                });
                b_touchmove = true;
            }
        });
        obj_body.on('touchend',function(event){
            if(b_canPull && b_touchmove){
                if(n_delta < n_loading_stop){
                    pullLoad_hide();
                }
                else{
                    backFlow('bottom');
		    reset_params();
                    cc('refresh_pull');
                    if(is_get_data)
                    {
                        is_get_data = false;
                        getDatas('down', 1);
                    }
                    pullLoad_hide();
                }
            }
            b_touchmove = false;
            b_canPull = false;
        });
    }

	//����loading��ʧ
	function pullLoad_hide(){
		obj_flow_load.animate({
			'opacity':0,
			'-webkit-transform':'translateY(0px)',
			'transform':'translateY(0px)'
		});
	}
	//����loading��ʾ
	function pullLoad_show(target){
		obj_flow_load.animate({
			'opacity':1,
			'-webkit-transform':'translateY(' + target / 3 + 'px)',
			'transform':'translateY(' + target / 3 + 'px)'
		},function(){
			$(this).find('i').addClass('loading');
            if(is_get_data)
            {
                is_get_data = false;
                getDatas('down');
            }
		});
	}

    //��ʾ��Ϣ������ͷ��
    function showFlowHead(){
        b_mz_hidden = true;
        obj_flow_cont.addClass('flow-cont-oper');
        obj_flow_header.css({
            'display':'block'
        });
    }

    //������Ϣ������ͷ��
    function hideFlowHead(){
        b_mz_hidden = false;
        obj_flow_cont.removeClass('flow-cont-oper');
        obj_flow_header.css({
            'display':'none'
        });
    }

    //������Ϣ��
    function backFlow(target){
        var s_target = target || 'top';
        if(s_target == 'top'){
            obj_body.scrollTop(n_flow_toplocation());
        }
        else if(s_target == 'bottom'){
            $("body").scrollTo({toT:n_flow_toplocation(),durTime:200});
        }
    }

	//������ҳ
	function backHome(){
		b_mz_hidden = false;
		obj_flow_header.css({
			'display':'none'
		});
		obj_flow_cont.removeClass('flow-cont-oper');
		obj_window.scrollTop(0);
	}

    //��ȡ����
    function getDatas(oper, flag, isfirst, target)
    {
        reset_params();
        var url = '';
        var endkey = $.fn.cookie(news_type + 'endkey');
        if(endkey == null)
        {
            endkey = '';
        }
        var newkey = $.fn.cookie(news_type + 'newkey');
        if(newkey == null)
        {
            newkey = '';
        }

        var params = {
            type: 'toutiao',
            pgnum: 1,
            ime: userkey,
            idx: 0,
            apptypeid: '2345m',
            appver: '1.1.3',
            qid: '2345m',
            position: city,
            startkey: endkey,
            newkey: newkey
        };

        var baidufeed_param = null;
        //������ȡ����
        if(oper == 'down')
        {
            params.idx = idx_down;
            params.pgnum = pgnum_down;
            baidufeed_param = baiduFeedParam(10);
        }
        else//������ȡ����
        {
            params.idx = idx_top;
            params.pgnum = pgnum_top;
            baidufeed_param = baiduFeedParam(20);
        }
        params.startkey = endkey;
        params.newkey = newkey;
        url = getUrl(params);
        if (baidu_feed_flag){
            $.ajax({
                url: 'https://cpu-openapi.baidu.com/api/v2/data/list/',
                headers: {
                    'Content-Type': 'application/json'
                },
                xhrFields: {
                    withCredentials: true
                },
                processData: false,
                type: 'POST',
                dataType: 'json',
                timeout: 25000,
                data: JSON.stringify(baidufeed_param),
                success:function (json) {
                    baiduFeedAjaxSuccessCallback(json, oper, flag, isfirst, target)
                },
		        error: function(xhr){
                    //jsonp ��ʽ�˷�����������.ԭ�������dataType���ָ��Ϊjsonp�Ļ�,���Ѿ�����ajax�¼���
                    //���������
                    obj_flow_headerLoad.removeClass('loading');
                    obj_flow_fixedLoad.removeClass('loading');
                    obj_flow_itemLoading.html(retry);
                    isbom = true;
                    is_get_data = true;
                }
            })
        }else {
            $.ajax({
                async:false,
                url: url,
                type: "GET",
                dataType: 'jsonp',
                jsonp: 'callback',
                data: '',
                timeout: 25000,
                success:function (json) {
                    toutiaoAjaxSuccessCallback(json, oper, flag, isfirst, target)
                },
                error: function(xhr){
                    //jsonp ��ʽ�˷�����������.ԭ�������dataType���ָ��Ϊjsonp�Ļ�,���Ѿ�����ajax�¼���
                    //���������
                    obj_flow_headerLoad.removeClass('loading');
                    obj_flow_fixedLoad.removeClass('loading');
                    obj_flow_itemLoading.html(retry);
                    isbom = true;
                    is_get_data = true;
                }
            });
        }
    }

    //�ٶ�feed����
    function baiduFeedParam(pageSize) {
        var appsid = 'fded5367';
        var token = 'be84f954c08213a90f4504b6b';
        var data = {
            'contentParams': {
                'pageSize': pageSize,
                'pageIndex': 1,
                'adCount': 0,
                'catIds': [],
            },
            'device': {
                'deviceType': '1',
                'osType': '1',
                'osVersion': '4',
                'vendor': 'xiaomi',
                'model': 'mi2s',
                'udid': {
                    'imei': '862613123121532',
                    'imeiMd5': '364ca309fcfbd30d68b8b04791019026'
                }
            },
            'network': {
                'ipv4': '192.168.31.10',
                'connectionType': 0,
                'operatorType': 0,
            },
        };
        var timestamp = Date.parse(new Date());
        var sigurate = md5(timestamp + token + JSON.stringify(data)).toString();
        return {
            'appsid': appsid,
            'data': data,
            'signature': sigurate,
            'timestamp': timestamp,
            'token': token
        };
    }

    //����ͷ���ص�
    function toutiaoAjaxSuccessCallback(json, oper, flag, isfirst, target) {//�ͻ���jqueryԤ�ȶ���õ�callback����,�ɹ���ȡ����������ϵ�json���ݺ�,�ᶯִ̬�����callback����
        var data_len = json.data.length;
        var news = json.data;
        if (news) {
            $.fn.cookie(news_type + 'endkey', json.endkey);
            $.fn.cookie(news_type + 'newkey', json.newkey);

            var date = new Date();
            var now = date.getTime();
            var news_data = [];
            if (checkSession() && sessionStorage.getItem(news_type + 'news_data_id')) {
                news_data = sessionStorage.getItem(news_type + 'news_data_id').split(',');
            }
            if (oper == 'down') {
                news_data.unshift(now);
                $.fn.cookie(news_type + '_pgnum_down', parseInt(pgnum_down) - 1);
                $.fn.cookie(news_type + '_idx_down', parseInt(idx_down) - parseInt(data_len));
            }
            else {
                news_data.push(now);
                $.fn.cookie(news_type + '_pgnum_top', parseInt(pgnum_top) + 1);
                $.fn.cookie(news_type + '_idx_top', parseInt(idx_top) + parseInt(data_len));
            }
            if (checkSession()) {
                sessionStorage.setItem(news_type + 'news_data_id', news_data);
            }
        }
        //�״�����
        if (isfirst == 1 && checkSession()) {
            sessionStorage.setItem(news_type + 'isfirst', 1);
        }
        if (news) {
            //������
            var getHtml = '',
                n_insertNum = data_len,
                s_target = target || oper;
            var dealnews = [];
            var addata = {};
            for (var ii in news) {
                dealnews.push(news[ii]);
                addata = {};
                if ((parseInt(ii) + 2) % 5 == 0) {
                    addata.datatype = 'ba_news';
                    //����ǰ4��
                    if ((isfirst == 1) && (parseInt(ii) < 20)) {
                        addata.adid = bid_relation.firstFir;
                        addata.adindex = bid_relation.firstFir + '_' + adnums;
                        dealnews.push(addata);
                    }
                    //������4��
                    else if ((isfirst == 1) && (parseInt(ii) > 20)) {
                        addata.adid = bid_relation.firstSec;
                        addata.adindex = bid_relation.firstSec + '_' + adnums;
                        dealnews.push(addata);
                    }
                    else if ((oper == 'down') && (parseInt(ii) == 3)) {//����ˢ��
                        addata.adid = bid_relation.down;
                        addata.adindex = bid_relation.down + '_' + adnums;
                        dealnews.push(addata);
                    }
                    else if (oper == 'top') {//��������
                        addata.adid = bid_relation.top;
                        addata.adindex = bid_relation.top + '_' + adnums;
                        dealnews.push(addata);
                    }
                    adnums += 1;
                }
            }
            $.fn.cookie(news_type + '_adnums', adnums);
            var deal_data = {
                'endkey': json.endkey,
                'newkey': json.newkey,
                'data': dealnews
            };
            if (checkSession()) {
                sessionStorage.setItem(now, JSON.stringify(deal_data));
            }
            deal_data.win_w = $(window).width() > 720 ? "720" : $(window).width();
            var $getHtml = template('new_list_module', deal_data);
            //ģ��ȡ���ݣ�����1��ȡ���
            var timer2;
            clearTimeout(timer2);
            obj_flow_headerLoad.addClass('loading');
            if (oper == 'down') {
                if (flag == 1) {
                    $('.item-refresh').remove();
                    getHtml += '<li class="item-refresh">';
                    getHtml += '<a class="J_mid trig" id="J_flow_refresh" href="javascript:;">�ոտ���������ˢ��</a>';
                    getHtml += '</li>';
                    $getHtml += getHtml;
                }

                obj_flow_tips.html('��Ϊ���Ƽ�' + data_len + '������');
                if (obj_body.scrollTop() >= 50) {
                    obj_flow_tips.animate({
                        'opacity': 1,
                        'z-index': 99
                    });
                }
                pullLoad_hide();
                obj_flow_list.prepend($getHtml);
                timer2 = setTimeout(function () {
                    obj_flow_tips.animate({
                        'opacity': 0,
                        'z-index': 0
                    });
                }, 1500);
            }
            else {
                if (parseInt(pgnum_top) > 3) {
                    obj_flow_itemLoading.html(getmore);
                }
                else {
                    obj_flow_itemLoading.html('���ڼ���...');
                }
                obj_flow_list.append($getHtml);
            }
            insertAd(dealnews);
            obj_flow_headerLoad.removeClass('loading');
            obj_flow_fixedLoad.removeClass('loading');
            setTimeout(function () {
                obj_flow_list.find('.item-pulldown').removeClass('item-pulldown');
            }, 800);
            b_getData = false;
        }
        else {
            obj_flow_headerLoad.removeClass('loading');
            obj_flow_fixedLoad.removeClass('loading');
            obj_flow_itemLoading.html(retry);
        }
        isbom = true;
        is_get_data = true;
        lazyload();
    }

    //�ٶ�feed���ص�
    function baiduFeedAjaxSuccessCallback(json, oper, flag, isfirst, target) {//�ͻ���jqueryԤ�ȶ���õ�callback����,�ɹ���ȡ����������ϵ�json���ݺ�,�ᶯִ̬�����callback����
        var data_len = json.items.length;
        var news = [];
        for(var index =0 ;index<data_len; index++){
            var item = JSON.parse(json.items[index].data);
            news.push({
                datatype:'baidu_feed_news',
                topic:item.title,
                bigpic:0,
                images:item.images,
                source:item.source,
                url:item.detailUrl,
                recommend:item.recommend
            });
        }
        if (news) {
            var date = new Date();
            var now = date.getTime();
            var news_data = [];
            if (checkSession() && sessionStorage.getItem(news_type + 'news_data_id')) {
                news_data = sessionStorage.getItem(news_type + 'news_data_id').split(',');
            }
            if (oper == 'down') {
                news_data.unshift(now);
                $.fn.cookie(news_type + '_pgnum_down', parseInt(pgnum_down) - 1);
                $.fn.cookie(news_type + '_idx_down', parseInt(idx_down) - parseInt(data_len));
            }
            else {
                news_data.push(now);
                $.fn.cookie(news_type + '_pgnum_top', parseInt(pgnum_top) + 1);
                $.fn.cookie(news_type + '_idx_top', parseInt(idx_top) + parseInt(data_len));
            }
            if (checkSession()) {
                sessionStorage.setItem(news_type + 'news_data_id', news_data);
            }
        }
        //�״�����
        if (isfirst == 1) {
            if (checkSession()) {
                sessionStorage.setItem(news_type + 'isfirst', 1);
            }
        }
        if (news) {
            //������
            var getHtml = '',
                n_insertNum = data_len,
                s_target = target || oper;
            var dealnews = [];
            var addata = {};
            for (var ii in news) {
                dealnews.push(news[ii]);
                addata = {};
                if ((parseInt(ii) + 2) % 5 == 0) {
                    addata.datatype = 'ba_news';
                    //����ǰ4��
                    if ((isfirst == 1) && (parseInt(ii) < 20)) {
                        addata.adid = bid_relation.firstFir;
                        addata.adindex = bid_relation.firstFir + '_' + adnums;
                        dealnews.push(addata);
                    }
                    //������4��
                    else if ((isfirst == 1) && (parseInt(ii) > 20)) {
                        addata.adid = bid_relation.firstSec;
                        addata.adindex = bid_relation.firstSec + '_' + adnums;
                        dealnews.push(addata);
                    }
                    else if ((oper == 'down') && (parseInt(ii) == 3)) {//����ˢ��
                        addata.adid = bid_relation.down;
                        addata.adindex = bid_relation.down + '_' + adnums;
                        dealnews.push(addata);
                    }
                    else if (oper == 'top') {//��������
                        addata.adid = bid_relation.top;
                        addata.adindex = bid_relation.top + '_' + adnums;
                        dealnews.push(addata);
                    }
                    adnums += 1;
                }
            }
            $.fn.cookie(news_type + '_adnums', adnums);
            var deal_data = {
                'endkey': json.endkey,
                'newkey': json.newkey,
                'data': dealnews
            };
            if (checkSession()) {
                sessionStorage.setItem(now, JSON.stringify(deal_data));
            }
            deal_data.win_w = $(window).width() > 720 ? "720" : $(window).width();
            var $getHtml = template('new_list_module', deal_data);
            //ģ��ȡ���ݣ�����1��ȡ���
            var timer2;
            clearTimeout(timer2);
            obj_flow_headerLoad.addClass('loading');
            if (oper == 'down') {
                if (flag == 1) {
                    $('.item-refresh').remove();
                    getHtml += '<li class="item-refresh">';
                    getHtml += '<a class="J_mid trig" id="J_flow_refresh" href="javascript:;">�ոտ���������ˢ��</a>';
                    getHtml += '</li>';
                    $getHtml += getHtml;
                }

                obj_flow_tips.html('��Ϊ���Ƽ�' + data_len + '������');
                if (obj_body.scrollTop() >= 50) {
                    obj_flow_tips.animate({
                        'opacity': 1,
                        'z-index': 99
                    });
                }
                pullLoad_hide();
                obj_flow_list.prepend($getHtml);
                timer2 = setTimeout(function () {
                    obj_flow_tips.animate({
                        'opacity': 0,
                        'z-index': 0
                    });
                }, 1500);
            }
            else {
                if (parseInt(pgnum_top) > 3) {
                    obj_flow_itemLoading.html(getmore);
                }
                else {
                    obj_flow_itemLoading.html('���ڼ���...');
                }
                obj_flow_list.append($getHtml);
            }
            insertAd(dealnews);
            obj_flow_headerLoad.removeClass('loading');
            obj_flow_fixedLoad.removeClass('loading');
            setTimeout(function () {
                obj_flow_list.find('.item-pulldown').removeClass('item-pulldown');
            }, 800);
            b_getData = false;
        }
        else {
            obj_flow_headerLoad.removeClass('loading');
            obj_flow_fixedLoad.removeClass('loading');
            obj_flow_itemLoading.html(retry);
        }
        isbom = true;
        is_get_data = true;
        var last_positon = get_current_position(news_type) ? get_current_position(news_type) : start_pos;
        $(window).scrollTop(last_positon);
        lazyload();
    }

    $(".J_search_clear").click(function() {
        $(".J_search_input").val("");
        $(".J_search_input").focus();
        $(".J_search_btn").html("ȡ&nbsp;&nbsp;��");
        $(".J_search_pop").hide();
        $(".J_search_clear").hide();
    });
    $(".J_closeSearch").click(function() {
        $(".J_search_pop").hide();
    });
    $(".J_clearHistory").click(function() {
        cc("hisclean_search");
        if (confirm("���ȫ����ѯ��ʷ��¼��")) {
            if(checkSession()){
                if (window.localStorage) {
                    localStorage.removeItem("history");
                    $(".J_search_pop").hide();
                    $(".serch-think-ul").html("");
                }
            }
        }
    });

    $.fn.scrollTo =function(options){
        var defaults = {
            toT : 0,    //����Ŀ��λ��
            durTime : 500,  //���ɶ���ʱ��
            delay : 30,     //��ʱ��ʱ��
            callback:null   //�ص�����
        };
        var opts = $.extend(defaults,options),
            timer = null,
            _this = this,
            curTop = _this.scrollTop(),//��������ǰ��λ��
            subTop = opts.toT - curTop,    //������Ŀ��λ�ú͵�ǰλ�õĲ�ֵ
            index = 0,
            dur = Math.round(opts.durTime / opts.delay),
            smoothScroll = function(t){
                index++;
                var per = Math.round(subTop/dur);
                if(index >= dur){
                    _this.scrollTop(t);
                    window.clearInterval(timer);
                    if(opts.callback && typeof opts.callback == 'function'){
                        opts.callback();
                    }
                    return;
                }else{
                    _this.scrollTop(curTop + index*per);
                }
            };
        timer = window.setInterval(function(){
            smoothScroll(opts.toT);
        }, opts.delay);
        return _this;
    };
})(Zepto);
