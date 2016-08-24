define(function(require,exports){
	var $ = require('./zepto');
	var mask = require('./mask');

	/** 
 	 * 创建类似ios的弹窗 例子：{@linkplain http://h5.lietou-static.com/m/test/js/dialog/}
	 * @module lib/dialog/dialog
	 */

	/** 
 	 * 创建类似ios的弹窗
	 * @constructor dialog 
	 * @alias module:lib/dialog/dialog
	 * @param option {object} 配置选项
	 * @param option.html {string} html内容
	 * @param option.preventHide {boolean} 取消点击按钮的隐藏 
	 * @param option.modal {boolean} 默认true,  有蒙层
	 * @param option.modalCallback {function} 蒙层点击的回调函数
	 * @param option.buttons {array} 按钮，最多两个
	 * @param option.buttons[0].text {string} 按钮，按钮文字
	 * @param option.buttons[0].callback {function} 按钮，回调
	 */

	 function dialog(option){
		this.option = {
			unique:false,//是否消灭其他已有弹窗

			html:'',//
			preventHide:false,//阻止 按钮隐藏
			modal:true,//蒙层？
			modalCallback:function(){}, //蒙层 func
			css:{},
			modalcss:{
				'z-index':1000
			},
			titleText:'',
			buttons:[
				{
					text:'确定',
					callback:function(){
					}
				}	
			]
		};

		$.extend(this.option,option,true);
		this.init();
	}

	dialog.prototype.init = function(){
		var self = this;

		this.modal = this.option.modal ? 
			new mask({
				el: $('body'),
				css:self.option.modalcss,
				click: function(){
					self.option.modalCallback.call(self);
				}
			}).show() : $('<div>');

		this.dialog = $('<div class="js_dialog"></div>');
		
		//title
		if(self.option.titleText.length){
			var diaCloseClass = 'dialog-close-x';
			var dialogTitle = $('<div class="dialog-title"><a href="javascript:;" class="iconfont '+ diaCloseClass +'">&#xe605;</a><div class="title-text">'+  self.option.titleText +'</div></div>');
			this.dialog.append(dialogTitle);
			dialogTitle.find('.'+ diaCloseClass).click(function(){
				self.remove();
			});
		}

		var html = '<section class="popup">'+
					'<div class="info">'+
						this.option.html +							
					'</div>'+ 
					'<div class="btn-group"></div>'+	
				'</section>';

		// var $html = $(html);

		this.dialog.append(html);

		var btnCon = $('.btn-group',this.dialog[0]);
		if(this.option.noButton){
			btnCon.hide();
		}
		if(this.option.buttons.length){
			this.option.buttons.forEach(function(v,i){
				$('<div class="btn">').text(v.text).click(function(){

					v.callback = v.callback || function(){};
					v.callback.call(self);
					self.remove();

				}).appendTo(btnCon);
			});
		}
	
		btnCon.addClass('btn'+this.option.buttons.length);

		$(document.body).append(this.dialog);
		self.locate();	
		this.dialog.css(self.option.css);

	};

	dialog.prototype.preventHide = function(){
		this.option.preventHide = true;
	};
	//定位
	dialog.prototype.locate = function(top){
		top = top || $(window).height()/2 - this.dialog[0].clientHeight/2 + document.documentElement.scrollTop +  'px';
		this.dialog.css({
			top: top
		});
	};
	/**
	 *隐藏弹窗 
	 */
	dialog.prototype.hide = function(){
		if(this.option.preventHide){
			return;
		}
		this.dialog.hide();
		this.modal.hide();
		return this;
	};

	/**
	 * 移除弹窗 
	 */
	dialog.prototype.remove = function(){
		if(this.option.preventHide){
			return;
		}
		this.hide();
		this.dialog.remove();
		this.modal.remove();
	};

	var alert = function(html,callback){
		callback = callback || function(){};
		return new dialog.dialog({
			html:html,//
			unique:true,//是否消灭其他已有弹窗
			buttons:[
				{
					text:'确定',
					callback:function(){
						this.hide();	
					}
				}	
			]
		});
	};

	return {
		dialog : dialog,
		alert: alert
	};
});


