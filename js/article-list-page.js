define(function(require,exports) {
    var $ = require('js/lib/zepto');
    var tip = require('js/lib/tip');
    var cookie=require('js/lib/cookie');

     curPage=1;
    $(function() {

        var windowHeight = document.documentElement.clientHeight;
        var article_category = $("#article_category").val();
         topHeight=parseInt($('.mod-nav').css('height'));
        $('.mod-main').css('min-height',(windowHeight-topHeight)+'px');

        $('.itemList').parent().css('background','none');
        var subItem=$('.sub-nav ul li a.current').parent().index();
        $('.sub-nav').scrollLeft(46*subItem);
        $('.article-area').parent().next('.mod-foot').css('padding-bottom','52px');
        //列表分页
        $('#loadMore').click(function(){
            var _self=$(this);
            _self.text('正在加载...');
            $.get('http://m.zhaozuor.com/zzr/ajaxarticlelist/',{currentPage:curPage,article_category:article_category},function(obj) {
                _self.text('加载更多').css('cursor','pointer;');
                var listHtml = '';
                if(obj.flag) {
                    var list=obj.data.articleForms;
                   for (var i = 0; i<list.length; i++) {
                   	var id = list[i]['article_id'];
						listHtml+='<div class="article-item">'+
						          '<a href="/zzr/articledetail/?article_id='+list[i]['article_id']+'" target="_blank">'+
						          '<img src="http://s.zhaozuor.com/img_article/'+list[i]['article_img']+'.jpg"/>'+
						          '<h3>'+list[i]['article_title']+' </h3>'+
						          '</a>'+
						         ' <span href="javascript:;" class="icon'+(list[i].isCollection?" collected":" ")+'" data-id="'+id+'" data-type="1"></span>'+
						         ' </div>'
                    }
                      $('.article-list').append(listHtml);
                    if(list.length<10){
                        _self.hide();
                    }
                    curPage++;
                }

            });

        });
        $('.article-list').delegate('span.icon','click',function(){
                var that = $(this);
            shoucangClick(that);
            return false;
        });

        $('.collect').click(function(){
            var that = $(this);
            shoucangClick(that);
            return false;
        });
        $('.great').click(function(){
            var id=$('.collect').attr('data-id');
            var _this=$(this);
            if(!_this.hasClass('greated')) {
                $.post('/zzr/dingarticle/', {article_id: id}, function (res) {
                    if(res.flag){
                        _this.addClass('greated');
                        _this.find('.icontext').text(parseInt(_this.find('.icontext').text())+1);
                    }
                });
            }else{
                tip({text:'已经点过赞了！'});
            }
        });
        $('.article-showmore').click(function(){
            $('.article-detail').css('height','auto');
            $(this).hide();
            //$('.article-detail').eq(1).show();
        });

        function shoucangClick(ele){
            var that=ele;
            var id=that.attr('data-id');
            var _type=that.attr('data-type');

            var _url='/zzr/collectionarticle/';
            if(that.hasClass('collected')){
                _url='/zzr/deletecollection/';
            }
            //alert(id);
            if(!cookie.isLogin()){

                tip({text:'请先登录！'});
                return;
            }
            $.ajax({
                url:_url,
                data:{
                    collection_obj_id:id,
                    collection_obj_type:_type
                },
                type:'post',
                success:function(res){
                    if(res.flag){
                        if(that.hasClass('collected')) {
                            that.removeClass('collected');
                        }else{
                            that.addClass('collected');
                        }
                    }
                }
            });
            return;
        }
    });

});
