define(function(require,exports){
	var $ = require('js/lib/zepto');
	var mask = require('js/lib/mask');
	var doc = document;

	/**
 	 * 创建简单弹窗
	 * 例子：{@linkplain http://h5.lietou-static.com/m/test/js/minidialog/}
	 * @author 崔久代
	 * @module lib/minidialog/minidialog
	 *
	 */
	/** 
	 * @constructor minidialog
	 * @param option {object} 配置选项
	 * @param option.html {string} 必需 提示内容，可以是html  
	 * @param option.modal {boolean} 有蒙层
	 * @param option.modalCallback {function} 蒙层点击的回调函数
	 * @param option.autoHide {number} 毫秒，自动remove 弹窗时间 
	 *
	 */
	function dialog(option){
		this.option = {
			autoHide:0,//自动消失
			html:'',//
			tapRemove:true,
			modal:false,//蒙层？
			noTouch:true,
			modalCallback:function(){} //蒙层 func
		};

		$.extend(this.option,option,true);

		this.init();
	}

	dialog.prototype.init = function(){
		var self = this;

		this.modal = this.option.modal ? 
			new mask({
				el: $('body'),
				click: function(){
					self.option.modalCallback.call(self);
				},
				noTouch:this.option.noTouch,
				css: {
					'z-index':1000
				}
			}).show() : $('<div>');

		this.dialog = $('<div class="js_minidialog"></div>');
		
		this.dialog.append(this.option.html);
		$(document.body).append(this.dialog);

		if(this.option.autoHide){
			setTimeout(function(){
				self.remove();	
			},this.option.autoHide);
		}

		this.dialog.css({
			'z-index':1010,
			'top': $(window).height()/2 - this.dialog[0].clientHeight/2 + document.body.scrollTop +  'px'
		});
		if(this.option.tapRemove){
		   this.handleEvents();	
		}

	};

	dialog.prototype.tapEvent = function(e){
		var self = this;
		return function(){
			self.remove();		
		};
	};

	dialog.prototype.handleEvents = function(){
		if(this.option.modal){
			this.tapEl = this.modal.mask; 
		}else{
			this.tapEl = doc; 
		}
		this.tapfunc  = this.tapEvent();
		$(this.tapEl).on('click',this.tapfunc);	
	};

	/**
	 *隐藏弹窗 
	 */
	dialog.prototype.hide = function(){
		this.dialog.hide();
		this.modal.hide();
	};

	/**
	 * 移除弹窗 
	 */
	dialog.prototype.remove = function(){
		this.hide();
		this.dialog.remove();
		this.modal.remove();
		if(this.option.tapRemove){
			$(this.tapEl).off('click',this.tapfunc);	
		}
	};

	return  dialog;
});



