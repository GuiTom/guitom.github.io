$(document).ready(function(){
$('.selected').removeClass('selected')
$('#'+article_id).removeClass('normal')
$('#'+article_id).addClass('selected')
 $('.menu-container').on('click','.item',function(){
 	  var article_id = $(this).attr('id');
 	  location.href = location.protocol+'//'+location.host+staticHTMLUri+'tutorial/'+tutorial_id+'/'+article_id+'.html';
 })
var preArticle = $('#'+article_id).prev()
var nextArticle = $('#'+article_id).next()
if(preArticle!=null&&preArticle.hasClass('item')){
	var id = preArticle.attr('id')
	var title = preArticle.text()
	$('.left-arror').html('<a href="./'+id+'.html">&lt;&lt;'+title+'</a>')
}
if(nextArticle!=null&&nextArticle.hasClass('item')){
	var id = nextArticle.attr('id')

	var title = nextArticle.text()
	$('.right-arror').html('<a href="./'+id+'.html">'+title+'&gt;&gt;</a>')
}
});