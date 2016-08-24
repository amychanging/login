define(function(require,exports){
  var $ = require('js/lib/zepto');
  var dialog = require('js/lib/dialog');
  var tip = require('js/lib/tip');
  var fileInput;
  var uploadTip ;
  var form ;
  var imageDialog ;

  function upload() {
	  var fileInput = $('#file-input');
	  var uploadTip = $('.uploadTip');
	  var form = $('#upload-image-form');
	  var arr = fileInput.val().split(".");
	  var extName = arr[arr.length - 1];
    if ( !(/(jpg|gif|bmp|png|jpeg)$/i).test( fileInput.val()) ) {
      uploadTip.html( '仅支持上传jpg,gif,png,bmp格式的图片' );
      return;
    }
    
   
    // fileInput[0].disabled = true;
    uploadTip.html('上传中....');
    form.submit();
  }

  $('.avator-con').add('.avatar-con').click(function(){
    
    imageDialog = new dialog.dialog({
      html:'<div>\
            <form action="/user/upload/" id="upload-image-form" enctype="multipart/form-data" method="post" target="photo-target-iframe" >\
              <input type="file" id="file-input"  name="avatar">\
              <span class="uploadTip" style="display:none;">上传中...<span>\
            </form>\
          </div>',
      titleText:"更换头像",
      noButton:true,
      css:{
        top: '50px'
      }
    });

    var iframe = '<iframe style="display:none;" name="photo-target-iframe"  id="photo-target-iframe" src="http://m.zhaozuor.com/ajaxproxy.html" ></iframe>'
    $(document.body).append(iframe);

    fileInput = $('#file-input');
    uploadTip = $('.uploadTip');
    form = $('#upload-image-form');

    fileInput[0].onchange = function() {
      upload();
    };
  });

  window.avatarImgCallback = function(json){
    imageDialog.remove();

    if(json.flag === 0){
        tip({
          text:json.msg,
          alignWith:$('#mod-nav')
        });
        return; 
    }
    
    var html ='<div class="avatar avatar-img">'+
                '<img src="'+ json.url +'">'+
              '</div>';
    $('.avatar-con').html(html);
             
  }

});