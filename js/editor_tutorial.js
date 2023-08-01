var newItemLevel = 1;
var opt = 'create';
function getArticleDetail(article_id){
    var params = {
    }
    if(article_id!='article'){
        params["articleId"] = article_id;
    }
    $.post(location.protocol+'//'+location.host+'/api/getArticleDetail', params,
   function(data){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        DJMask.closeAll();
        var obj = data['data'];
        if(obj.content==undefined){
          obj.content = '';
        }
        UE.getEditor('editor').setContent(obj.content)
        if(obj.author==undefined){
          $('.author').val(tutorial_author)
        }else {
          $('.author').val(obj.author);
        }
        
   });
}
function randomStr(){
  var str = ''
  for(var i=0;i<n;i++){
    str = str + Math.floor(Math.random()*10);
  }
  return str;
}
//新建或更新文章
function updateArticle(title,author,content,level,tutorial_id,article_id){
    var params = {}

    if(article_id!=null){
      params['articleId'] = article_id;
    }
    if(tutorial_id!=null){
      params['tutorial_id'] = tutorial_id;
    }
    if(title!=null){
      params['title'] = title;
    }
    if(author!=null){
      params['author'] = author;
    }
    if(content!=null){
      params['content'] = content;
    }
    if(level!=null){
      params['level'] = level;
    }

    $.post(location.protocol+'//'+location.host+'/api/updateArticle',params,
    function(data,msg,response){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        articleId = data['data']
        
       
        var html = '';
        article = data['data']
        if(data['data'].level==1){
          html = '<div id="'+article.articleId+'" class="item chapter normal preview">'+article.title+'</div>'
        }else {
          html = '<div id="'+article.articleId+'" class="item course normal preview">'+article.title+'</div>'
        }
      if(opt=='create'){
          if(currentItem!=null&&newItemLevel==2){
            currentItem.after(html)
            currentItem = null;
          }else {
            $('.menu-container').append(html)
          }
      }else if(opt=='rename'){
          currentItem.text(title)
      }
      if(opt!='create'){
        $('#btn-create-static').removeClass('disabled')
      }else {
        $('#btn-create-static').addClass('disabled')
      }
      
      DJMask.closeAll();
      if(article_id==null){
        $('#'+article.articleId).click()
      }
       
        setArticlesHTMLForTutorial(tutorial_id,$('.menu-container').html())
        
        $('#btn-create').remove()

    }); 
}
function getArticlesHTMLForTutorial(tutorial_id){
    var params = {
      "tutorial_id":tutorial_id
    }
    $.post(location.protocol+'//'+location.host+'/api/getArticlesHTMLForTutorial', params,
    function(data){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        var html = Base64.decode(data['data']);
        $('.menu-container').html(html)
        if(html!=null&&html!=''){
          $('#btn-create').remove();
        }
        $('.item').first().click();
    });
}
function setArticlesHTMLForTutorial(tutorial_id,html,success_callback){
    var params = {
      "tutorial_id":tutorial_id,
      "html":html
    }
    $.post(location.protocol+'//'+location.host+'/api/setArticlesHTMLForTutorial', params,
    function(data){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        if(success_callback!=null){
          success_callback()
        }
       
    });
}
function deleteItem(){
  var params = {
    "article_id":currentItem.attr('id')
  }
    $.post(location.protocol+'//'+location.host+'/api/deleteArticle',params,
    function(data,msg,response){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        currentItem.remove()
        setArticlesHTMLForTutorial(tutorial_id,$('.menu-container').html(),null)
    });
}

function generateStaticArticlePage(){
  var params = {
    "tutorial_id":tutorial_id
  }
    $.post(location.protocol+'//'+location.host+'/api/generateStaticArticlePage',params,
    function(data,msg,response){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }

        if(confirm('已经生成静态页面,去查看吗?')){
          location.href = location.protocol+'//'+location.host+staticHTMLUri+'tutorial/'+tutorial_id+'/'+currentItem.attr('id')+'.html';
        }else {

        }
    });
}
function move_up(){
  currentItem.after(currentItem.prev())
  setArticlesHTMLForTutorial(tutorial_id,$('.menu-container').html(),null)
}
function move_down(){
  currentItem.before(currentItem.next())
  setArticlesHTMLForTutorial(tutorial_id,$('.menu-container').html(),null)
}
function rename(){
    var html = '<div class="container" style="width:100%;"><div class="row"><div class="col-sm-8 col-sm-offset-2 text-center"> <div class="input-group" id="searchBox" style="width:100%;height:30px;margin-top:10px;">\
                <input type="text" class="form-control input-md" id="article_title" value="'+currentItem.text()+'" placeholder="输入文章名称"/> \
               </div><div style="margin-top:10px;">\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-confirm-rename" class="btn btn-primary btn-sm">确定</button>\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-cancel" class="btn btn-primary btn-sm">取消</button>\
               </div></div></div>'
      DJMask.open({
          width:"500px",
          height:"200px",
          title:"重命名",
          content:html
      }); 
}
var currentItem = null;
function addNewItem(){
    var html = '<div class="container" style="width:100%;"><div class="row"><div class="col-sm-8 col-sm-offset-2 text-center"> <div class="input-group" id="searchBox" style="width:100%;height:30px;margin-top:10px;">\
                <input type="text" class="form-control input-md" id="article_title" placeholder="输入文章名称"/> \
               </div><div style="margin-top:10px;">\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-confirm" class="btn btn-primary btn-sm">确定</button>\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-cancel" class="btn btn-primary btn-sm">取消</button>\
               </div></div></div>'
      DJMask.open({
          width:"500px",
          height:"200px",
          title:"新建章节",
          content:html
      });
}
function toCommit(){
      var article_id = currentItem.attr('id')
    var title = currentItem.text()
    var author = $('.author').val()
    var content = UE.getEditor('editor').getContent()
    if(activeTabId=='#pre'){
      content = UE.getEditor('editor').getContent()
    }else if(activeTabId=='#source'){
      content = $('#text-area').val()
    }
    opt = 'modify'
    updateArticle(title,author,content,null,null,article_id)
}
var activeTabId = 'pre'
$(document).ready(function(){
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  // 获取已激活的标签页的名称
  activeTabId = $(e.target).attr('href');
  if(activeTabId=='#pre'){
    UE.getEditor('editor').setContent($('#text-source').val())
  }else if(activeTabId=='#source'){
    $('#text-source').val(UE.getEditor('editor').getContent())
  }
  // 获取前一个激活的标签页的名称
  // var previousTabId = $(e.relatedTarget).attr('id')

});
 $('#btn-create-static').on('click',function(){
    $('#'+currentItem.attr('id')).removeClass('preview')
    setArticlesHTMLForTutorial(tutorial_id,$('.menu-container').html(),generateStaticArticlePage)  
 })
var ue = UE.getEditor('editor', {
serverUrl: "/upload/"
});
ue.addListener( 'ready', function( editor ) {
    ue.execCommand( 'focus' ); //编辑器加载完成后，让编辑器拿到焦点
    getArticlesHTMLForTutorial(tutorial_id);
});
  
  // UE.getEditor('editor').setContent('')
 $('.menu-container').on('click','.item',function(){
 	  var article_id = $(this).attr('id');
    $('.item').removeClass('selected')
    $(this).addClass('selected')
    currentItem = $(this)
 	  getArticleDetail(article_id)
 })
 $('#btn-completed').on('click',function(){
  toCommit()
 });
$('body').on('click','#btn-confirm',function(){
    var title = $('#article_title').val();
    // var level = $("#level-select").val();
    var urlArry = location.href.split('/')
    var tutorial_id = urlArry[urlArry.length-1]
    opt = 'create'
    updateArticle(title,null,null,newItemLevel,tutorial_id,null)
});
$('body').on('click','#btn-confirm-rename',function(){
    var title = $('#article_title').val();
    var article_id = currentItem.attr('id')
    var urlArry = location.href.split('/')
    var tutorial_id = urlArry[urlArry.length-1]
    opt = 'rename'
    updateArticle(title,null,null,newItemLevel,tutorial_id,article_id);
});

$('body').on('click','#btn-cancel',function(){
  DJMask.closeAll();
});
$('#btn-create').on('click',function(){
  addNewItem();
})
var menus = [{
      name: '上移一行',
      onClick: function(t) {
        currentItem = t;
        move_up();
      }
    }, {
      name: '下移一行',
      onClick: function(t) {
        currentItem = t;
        move_down();
      }
    },{
      name: '重命名',
      onClick: function(t) {
        currentItem = t;
        rename();
      }
    }, {
      name: '删除',
      onClick: function(t) {
        currentItem = t;
        deleteItem();
      }
    },{
      name: '添加节(二级标题，紧随本项添加)',
      onClick: function(t) {
        currentItem = t;
        newItemLevel = 2;
        addNewItem();
      }
    }]
var menu = new BootstrapMenu('.course', {
  actions: menus
});
menus.push({
      name: '添加章(一级标题，在目录末尾添加)',
      onClick: function(t) {
        currentItem = t;
        newItemLevel = 1;
        addNewItem();
      }
    })
var menu = new BootstrapMenu('.chapter', {
  actions: menus
});
})
