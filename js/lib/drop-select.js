//select 控件
define(function(require,exports){
  var $ = require('js/lib/zepto');

  //选中或者隐藏列表
  $(document).click(function(e){
    var el = $(e.srcElement);
    var $list = el.closest('.select-ui-list');
    var $uishow = el.closest('.select-ui-show');

    //click the select options
    if($list.length){
     var $ui = el.parent('.select-ui');
      $('.selected',$ui[0]).html(el.html());
      $('input[type="hidden"]',$ui[0]).val(el.attr('val'));
      $list.hide() 
    //click the select 
    }else if($uishow.length){
      $uishow.parent('.select-ui').find('.select-ui-list').css({
        display:'block'
      });
    //click area not in select  
    }else{
      $('.select-ui-list').hide()
    }
    
  });

});