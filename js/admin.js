function updateTutorial(tutorial_id,tutorial_name,tutorial_author){
    var params = {
    }
    if(tutorial_id!=null){
      params['tutorial_id'] = tutorial_id;
    }
    if(tutorial_name!=null){
      params["tutorial_name"] = tutorial_name;
    }
    if(tutorial_author!=null){
      params["tutorial_author"] = tutorial_author;
    }
    $.post(location.protocol+'//'+location.host+'/api/updateTutorial', params,
   function(data){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        DJMask.closeAll();
        location.reload();
   });
}
function deleteTutorial(tutorial_id){
    var params = {
        "tutorial_id":tutorial_id
    }
    $.post(location.protocol+'//'+location.host+'/api/deleteTutorial', params,
   function(data){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        location.reload();

   });
}
function addNewItem(){
    var html = '<div class="container" style="width:100%;"><div class="row"><div class="col-sm-8 col-sm-offset-2 text-center"> <div class="input-group" id="searchBox" style="width:100%;height:30px;margin-top:10px;">\
                <input type="text" class="form-control input-md" id="tutorial_name" placeholder="输入教程名称"/> \
               </div><div style="margin-top:10px;">\
               <div><input type="text" class="form-control input-md" id="tutorial_author" placeholder="输入作者名称"/></div>\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-confirm" class="btn btn-primary btn-sm">确定</button>\
              <button style="margin-top: 15px;width: 45%;display:inline;" type="button" id="btn-cancel" class="btn btn-primary btn-sm">取消</button>\
               </div></div></div>'
      DJMask.open({
          width:"500px",
          height:"200px",
          title:"新建教程",
          content:html
      });
}
function generateStaticHomePage(){
  var params = {
   
  }
  $.post(location.protocol+'//'+location.host+'/api/generateStaticHomePage',params,
    function(data,msg,response){
        var errorCode = data["errorCode"]
        if(errorCode!=0){
            console.log(data["msg"])
            return;
        }
        if(confirm('已经生成静态页面,去查看吗?')){
          window.open(location.protocol+'//'+location.host+staticHTMLUri+'index.html');
        }else {

        }
    });
}
var currentItem = null;
$(document).ready(function(){
 $('#btn-create-static').on('click',function(){
    generateStaticHomePage();
 });
$('body').on('click','#btn-confirm',function(){
    var title = $('#tutorial_name').val();
    var author = $('#tutorial_author').val();
    updateTutorial(null,title,author)
});
$('#btn-create').on('click',function(){
      addNewItem();
});
var menus = [{
      name: '重命名',
      onClick: function(t) {
        currentItem = t;
        
       
        var tutorial_name = prompt('重命名',t.text())
        if(tutorial_name!=''&&tutorial_name!=null){
            //重命名
            var tutorial_id = t.attr('id')
            updateTutorial(tutorial_id,tutorial_name,null)
        }else {
            alert('请填写教程名称!')
        }
      }
    }, {
      name: '删除',
      onClick: function(t) {
        currentItem = t;
        if(confirm('确定删除该教程吗?')){
          deleteTutorial(t.attr('id'));
        }
      }
    }]
var menu = new BootstrapMenu('.item', {
  actions: menus
});
});