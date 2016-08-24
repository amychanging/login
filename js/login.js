define(function(require,exports){
  var $ = require('js/lib/zepto');
  var minidialog = require('js/lib/minidialog');
  var tip = require('js/lib/tip');
  var md5 = require('js/lib/md5');

  function errTip(text){
    tip({
      text:text,
      alignWith:$('#mod-nav')
    });
  }
  var phoneReg = /1\d{10}$/;
  //var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
var emailReg=/^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  function checkUsername(userval){
    return !phoneReg.test(userval) && !emailReg.test(userval)
  }

//登录
  (function(){
    var page = $('.accout-page')
    
    var form = $('#login-form');
    if(!form.length)return;
    
    var username = $('#username'),
      password = $('#password'),
      checkbox = $('#agreement');
    
    function checkInput(){
      var userval = username.val().trim();
      if(!userval.length){
         errTip('请输入用户名');
         return false;
      }
      if(checkUsername(userval)){
         errTip('请正确格式的用户名');
         return false;
      }
      if(!password.val().length){
         errTip('请输入密码');
         return false;
      }
      if(password.val().length< 6 || password.val().length > 16){
         errTip('请输入6-16位长度的密码');
         return false;
      }  
      if(!checkbox.attr('checked')){
         errTip('请阅读并勾选用户协议');
         return false;
      }
      return true;
    }
	
    $('.submit-btn').click(function(){
      if(!checkInput()){
        return;
      }
      $.ajax({
        url:"/user/dologin/",
        data:{
          user_login:username.val().trim(),
          user_password:md5(password.val()),
          url:$("#url").val(),
          open_id:$('#open_id').val()  
        },
        type:'post',
        success:function(res){
          if(res.flag){
            location.href = res.url;
          }else{
            errTip(res.msg);
          }
        }
      });
    });

  })();



  //注册页面
 (function(){

    var form = $('#signup-form');
    if(!form.length)return;

    var username = $('#username'),
      password = $('#password'),
      captcha = $('#captcha'),
      checkbox = $('#agreement');
    
    function checkInput(){
      var userval = username.val().trim();
      if(!userval.length){
         errTip('请输入用户名');
         return false;
      }
      if(checkUsername(userval)){
         errTip('请正确格式的用户名');
         return false;
      }
      if(!password.val().length){
         errTip('请输入密码');
         return false;
      }
      if(password.val().length< 6 || password.val().length > 16){
         errTip('请输入6-16位长度的密码');
         return false;
      }  
      if(!captcha.val().length){
         errTip('请输入验证码');
         return false;
      }       
      if(!checkbox.attr('checked')){
         errTip('请阅读并勾选用户协议');
         return false;
      }

      return true;
    }

    var imgcode = $('img.code-control');
    var code = $('a.code-control');
    var codeOrgText = code.html();

    //username 输入监听
    username.keyup(function(event) {
      var val = $(this).val().trim();
      //符合手机格式

      if(phoneReg.test(val)){
          toPhoneCode();
      }else{
          code.hide();
          imgcode.show();
      }
    });

    //code 不能点击时候的验证码
    var disableClass = 'disabled';
    var time = 60;
    var codeTimer;
    imgcode.click(function(){
      imgcode.attr('src','/image/randomcode/?time='+new Date().getTime())
    });
    

    code.click(function(e){
      var $this = $(this);
      if($this.hasClass(disableClass)){
        return;
      }
      var userval = username.val().trim();
      if(!userval.length){
          errTip('请输入正确手机号！');
          return;
      }
      startDisable();
      $.ajax({
        type:'post',
        url:"/user/sendvalidatecodesms/",
        data:{
          c_tel:userval
        },
        success:function(res){
        }
      });
      return false;

    });

    //显示 “获取验证码”
    function toPhoneCode(){
      imgcode.hide();
      code.show();
    }

    // "获取验证码“ 倒计时
    function countDown(){
      if(time>0){
         code.html( --time + '秒'); 
      }else{
        resetCode();
      }
    }
    //重置可以点击状态
    function resetCode (){
        code.html(codeOrgText);
        code.removeClass(disableClass);
        clearInterval(codeTimer);
        time = 60;
    }
    //禁止点击
    function startDisable(){
      code.addClass(disableClass);
      countDown();
      codeTimer = setInterval(function(){
        countDown();
      },1000);
    }

    $('.signup-submit-btn').click(function(){
      if(!checkInput()){
        return;
      }
      resetCode();

      $.ajax({
        url:"/user/doregister/",
        data:{
          user_login:username.val().trim(),
          user_password:md5(password.val()),
          url:$("#url").val(),
          open_id:$('#open_id').val() ,
          valicode:captcha.val()
        },
        type:'post',
        success:function(res){
          if(res.flag){
            location.href = res.url;
          }else{
            errTip(res.msg);
              imgcode.attr('src','/image/randomcode/?time='+new Date().getTime())
          }
        }
      });
    });

  })();

//修改密码
(function(){
  var page = $('.change-password-page');
  if(!page.length) return;

  var passwordNew = $('#password-new'),
      password = $('#password'),
      passwordNew2 = $('#password-new2');
    
    function check(password,text){

      if(!password.val().length){
         errTip('请输入'+ text);
         return false;
      }
      if(password.val().length< 6 || password.val().length > 16){
         errTip('请输入长度6-16位的' + text );
         return false;
      }
      return true;  
    }

    function checkInput(){
      return check(password,'原密码') && check(passwordNew,'新密码') && check(passwordNew2,'确认密码') ?  true : false;
    }

    $('.submit-btn').click(function(){
      if(!checkInput()){
        return;
      }
      
      if( passwordNew.val() !== passwordNew2.val() ){
          errTip("新密码两次输入不一致！");
         return false;
      }
      $.ajax({

        url:"/user/dochangepassword/",
        data:{
          old_password:md5(password.val().trim()),
          new_password:md5(passwordNew.val().trim()),
          re_password:passwordNew2.val()
        },

        type:'post',

        success:function(res){
          if(res.flag){
              new minidialog({
                html:'密码修改成功！',
                modal:true,
                autoHide:20000
              })
              location.href = res.url;
          }else{
             errTip(res.msg);
          }
        }
      });
    });

})();

//找回密码 第一步 输入邮箱或者号码
(function(){
  var form = $('.get-back-form')
  if(!form.length)return;
  var username = $('#username');

  function checkInput(){
    var userval = username.val().trim();
    if(!userval.length){
       errTip('请输入正确手机/邮箱');
       return false;
    }
    if(checkUsername(userval)){
       errTip('您的输入不符合 手机/邮箱 格式');
       return false;
    }
  }
    
  $('.submit-btn').click(function(){
    if(!checkInput()){
      return;
    }
    $.ajax({
      url:"",
      data:{},
      type:'post',
      success:function(){

      }
    });
  });


})();


//邮箱点击链接进入的修改密码页面
(function(){
  var page = $('.get-from-email');
  if(!page.length) return;

  var passwordNew = $('#password-new'),
      passwordNew2 = $('#password-new2');
    
    function check(password,text){

      if(!password.val().length){
         errTip('请输入'+ text);
         return false;
      }
      if(password.val().length< 6 || password.val().length > 16){
         errTip('请输入长度6-16位的' + text );
         return false;
      }
      return true;  
    }

    function checkInput(){
      return check(passwordNew,'新密码') && check(passwordNew2,'确认密码') ?  true : false;
    }

    $('.submit-btn').click(function(){
      if(!checkInput()){
        return;
      }
      if( passwordNew.val() !== passwordNew2.val() ){
          errTip("新密码两次输入不一致！");
         return false;
      }
      $.ajax({
        url:"",
        data:{},
        type:'post',
        success:function(){

        }
      });
    });

})();




  
});