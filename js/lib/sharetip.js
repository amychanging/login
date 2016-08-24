define(function(require,exports){
  
  //点击出现分享到朋友圈
  var $ = require('js/lib/zepto');
  var mask = require('js/lib/mask');

  var sharebtns = $('.share-to-timeline');
  sharebtns.click(function(){
    var html = '<div class="share-to-timeline-layer">\
      <a href="javascript:;" class="button text-more green-button">好的</a>\
    </div>';

    var el= $(html);
    $(document.body).append(el);
    
    $('.button',el[0]).click(function(){
      hide();
    });

    var masklayer = new mask({
      el:$('.container'),
      css:{
        background:"rgba(0, 0, 0, 0.8)"
      },
      click:function(){
        hide();
      }
    }).show();

    function hide(){
      el.hide().remove();
      masklayer.hide().remove();
    }

  }); 
});