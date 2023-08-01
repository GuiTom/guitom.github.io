var baseLocation = 'http://127.0.0.1:81/'
var baseUrl = 'http://127.0.0.1:81/api/';
function getLocalTime(nS) {     
   return new Date(parseInt(nS)).toLocaleDateString().replace(/:\d{1,2}$/,' ');     
}
function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}
function getArticleList(userInfo){
var pid = getQueryString('pid');
var params = {
    "startNO":1,
    "pageSize":100
}

$.post(baseUrl+'getArticleList', params,
function(data){
    var errorCode = data["errorCode"]
    if(errorCode!=0){
        console.log(data["msg"])
        return;
    }
    var count = data['count'];
    var tmpHtml = '';
    for(var i=0;i<count;i++){
        var obj = data['data'][i];
        var href = baseLocation + '../editor/'+obj.articleId
        var href0 = baseLocation+'../article/'+obj.articleId
        tmpHtml += '<div class="row article" data-id='+obj.articleId+'>\
        <div class="col-sm-10 col-sm-offset-2">\
        <a href="'+href0+'" style="color:#a1a1a1;"><span>'+obj.title+'</span>\
        <span>'+getLocalTime(obj.create_time*1000)+'</span></a>\
        <span style="float:right"><a href="'+href+'">编辑</a></span>\
        \
        </div>\
        </div>';
        // if(i<count-1){
        tmpHtml += '<hr/>';
        // }
    }
    $('.content').append(tmpHtml);

});
}

function deleteArticle(articleId) {
        var urlArry = location.href.split('/')
        var articleId = urlArry[urlArry.length-1]
        var title = $('.title').val()
        var author = $('.author').val()
        var content = UE.getEditor('editor').getContent()
        function deleteArticle(userInfo){
        var pid = getQueryString('pid');
        var params = {
            "articleId":articleId
        }
        $.post(baseUrl+'deleteArticle', params,
       function(data){
            var errorCode = data["errorCode"]
            if(errorCode!=0){
                console.log(data["msg"])
                return;
            }else if(errorCode==-2){
            	alert('标题重复了')
            	return
            }
            alert('删除成功!')
       });
      }
}

$(document).ready(function(){
 getArticleList()
 $('.article').on('click',function(evt){
 	var articleId = evt.target.getAttribute('data-id');
 	deleteArticle(articleId);
 })
})