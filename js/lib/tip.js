/*=============================================================================
#     FileName: tip.js
#         Desc: 提示层 单例模式，一次只能有一个提示层
#       Author: jiudai.cui
#        Email: jiudai.cui@renren-inc.com
#     HomePage: http://blog.meituo.net
#      Version: 0.0.1
#   LastChange: 2014-07-23 17:39:46
#      History:
=============================================================================*/
define(function(require,exports){

	var $ = require('./zepto');
	var className = 'js_lib_tip';

	var tpl = '<div class="'+ className +'" style="width:100%;overflow:hidden;line-height:2;font-size: 14px;background:#ff5050;text-align:center;color:#fff;height:28px;">test</div>';
	var el;
	var hideTimer; //隐藏timer
	/*
	* option 
	* 	text: //提示文字
	* 	alignType:定位方式 fixed
	* 	alignWith: 定位在谁的下面
	* 	autoHide: //自动隐藏时间
	* 	click://点击的回调
	* 	className //允许添加新的class
	* 	closeBtn: //显示close
	*/
	var conf = {
		autoHide : 1000,
		alignType:'',
		text:''
	};

	function tip(option){
		$.extend(conf,option);		


		//是否已经有tip了有了就去掉
		var tmptip = $('.'+className);
		if(tmptip.length){
			el = tmptip;
			el.remove();
		}

		el = $(tpl);

		//text
		el.html(conf.text);

		//className
		if(conf.className){
			el.addClass(conf.className);
		}
		//click 
		if(conf.click){
			el.click(function(){
				conf.click();	
			});
		}

		var top = 0;
		var alignType;
		//放到后面
		if(conf.alignWith && conf.alignWith.length ){
			el.insertAfter(conf.alignWith);
			top = conf.alignWith.offset().top + conf.alignWith[0].offsetHeight;
			alignType = 'absolute'
		}else{
			$(document.body).append(el);
			alignType = 'fixed'
		} 
		if(conf.alignType) {
			alignType = conf.alignType;
		}

		el.css({
			position:alignType,
			left:0,
			top:top
		});
		
		show();
		if(conf.autoHide){
			hide();
		}
	}

	function clearHideTimer(){
		if(hideTimer){clearTimeout(hideTimer);hideTimer=null;}
	}
	function show(){
		clearHideTimer();
		if(el){
			el.show();
		}
	}
	//transition: height linear .5s;

	function hide(){
		if(el){
			clearHideTimer();
			hideTimer = setTimeout(function(){
				el.animate({'height':0},500,'linear',function(){
					el.remove();
				});
			},conf.autoHide); 
		}
	}

	return tip;
});
