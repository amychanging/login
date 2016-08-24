//基础的js
define(function(require,exports){
  //document.domain = "";
  
  var $ = require('js/lib/zepto');
  require('js/lib/sharetip');

  var $nav = $('.mod-nav');
  var $main = $('.mod-main');
  var $foot = $('.mod-foot');
  var $mainUnder = $('.main-under');
//var $nav_li = $(".sub-nav li");
//console.log($nav-li);

  function innerHeight($nav){
    return parseInt($nav.css('height')) + parseInt($nav.css('padding-top')) + parseInt($nav.css('padding-bottom'))
  }
  function outerHeight($nav){
    return innerHeight($nav) + parseInt($nav.css('margin-top')) + parseInt($nav.css('margin-bottom')) 
  }

  //footer stick on bottom 
  var windowHeight = document.documentElement.clientHeight;
  var navHeight = $nav.length ?  outerHeight($nav) :  0 ;
  var footHeight = $foot.length ? outerHeight($foot): 0 ;
  var mainPadding = parseInt($main.css('padding-bottom'),10) + parseInt($main.css('padding-top'),10) || 0
  var mainUnderHeight = $mainUnder.length ? outerHeight($mainUnder) : 0 ;
  
  $main.css({
    'min-height':(windowHeight - navHeight - footHeight - mainPadding - mainUnderHeight)+'px'
  });
  $foot.css({
    visibility:'visible'
  });  


  //password-control 代理密码的点击事件
  $('.container').delegate('.password-control','click',function(){
    var $this = $(this);
    var checkedClass = 'checked';
    var $input = $this.parent().find('input');

    if($this.hasClass(checkedClass)){
      $this.removeClass(checkedClass);
      $input.attr('type','password');

    }else{
      $this.addClass(checkedClass);
      $input.attr('type','text');
    }
    return false;
  });

  //nav-back
  (function() {
        $navback = $("#mod-nav .nav-back");
        if ($navback.length) {
            var icon;

            if (!document.referrer) {
                if (location.pathname != "/") {
                    $navback.html('<a href="/"><span class="iconfont" style="color:#fff;font-size:1.5rem">&#xe603;</span></a>').show();
                }
            } else {
                $navback.on("click", function() {
                  window.history.go(-1);
                }).show();
            }
        }

        var _width=$('body').width();
        var isShowMenu=false;
        var nav_m_logo=$('<div class="nav_m_logo"></div>');
       $('.navM').css('font-size', _width * 16 / 320 + 'px');
       nav_m_logo.css('font-size', _width * 16 / 320 + 'px');
       
       $('.navM').after(nav_m_logo);
       $('.nav_m_logo').click(function(){
        if(!isShowMenu){
          $('.navM').css('display','block');
          $(this).css('background-image','url(../images/2/logo_s.png)');
          $('.navM .circle,.navM .hbg').css('display','block');
          isShowMenu=true;
        }else{
          $('.navM').css('display','none');
          $(this).css('background-image','url(../images/2/logo.png)');
          $('.navM .circle,.navM .hbg').css('display','none');
          isShowMenu=false;
        }
        
       });
    })();


    $('.container').delegate(".util-date-selector", "click", function(e) {
        var $self = $(this);
        var val = $self.find('input[type="hidden"]').val();
        var notonow = $self.attr("notonow");

        function pad(num) {
            return (num + "").length < 2 ? "0" + num : num;
        }

        require.async("js/lib/multiselector", function(selector) {
            if (document.activeElement) {
                try {
                    document.activeElement.blur();
                } catch (e) {}
            }
            new selector({
                val: val,
                notonow: notonow,
                complete: function(obj) {
                    var val = obj.year  +""+  pad(obj.month);
                    $self.find(".select-text").html(obj.year  +"年"+  pad(obj.month)+"月");
                    $self.find('input[type="hidden"]').val(val).triggerHandler("blur.valid");
                },
                tonow: function(obj) {
                    var val = obj.year +""+ pad(obj.month);
                    $self.find(".select-text").html(obj.year  +"年"+  pad(obj.month)+"月");
                    $self.find('input[type="hidden"]').val(val).triggerHandler("blur.valid");
                }
            });
        });
    });
});




