define(function(require,exports){
	var $= require('./zepto');

	/** 
 	 * 蒙层,覆盖住元素，原理是给当前元素添加position:relative,然添加position:absolute的dom子元素； 
	 * 例子：{@linkplain http://h5.lietou-static.com/m/test/js/mask/}
	 * @module lib/mask/mask
	 * @author 崔久代
	 */
	/**
	 * @constructor mask
	 * @param obj {object} 配置选项
	 * @param obj.el {object} 要遮住的元素 
	 * @param obj.className {string} 蒙层的类名
	 * @param obj.css {objct} 为蒙层添加css 
	 * @param obj.onTouch {boolean} 不允许滑动网页 
	 * @param obj.unique {boolean} 多次实例化返回同一个对象.
	 */
	function mask(obj){
		if(!obj.el){return;}
		this.option = {
			css:{},
			className:'js_mask',
			noTouch:true,
			unique:false //一个元素下面只有一个mask
		};

		$.extend(this.option,obj);

		this.option.el = this.el = $(this.option.el);

		if(this.option.unique){
			if(this.el[0].libMaskMask){
				return this.el[0].libMaskMask;	
			}else{
				 this.el[0].libMaskMask = this;
			}
		}

		
		this.init();
	}
	mask.prototype.init = function(){
		this.orgPosition = this.el.css('position');
		//if(this.orgPosition == 'static'){
			//this.el.css({
				//position:"relative"
			//});
		//}

		this.create();
		this.bind();
	};
	mask.prototype.create = function(){
		var mask = this.option.el.children('.'+this.option.className);


		//没有找到浮层就创建，如果已经有了就公用
		if(this.option.unique){
			this.mask =  mask.length ? mask : null; 
		}
		
		if(!this.mask){
			this.mask =	$('<div class="'+ this.option.className +'">').css({
				position:'absolute',
				background:'rgba(0,0,0,0.5)',
				right:0,
				top:0,
				bottom:0,
				left:0
			}).appendTo(this.option.el); 

			if(this.option.noTouch){
				this.mask.on('touchmove',function(){
					//return !1;	
				});
			}
		}

		this.mask.css(this.option.css);
	};

	/**
	 * 显示蒙层
	 * */
	mask.prototype.show = function(){
		this.el.css({position:'relative'});
		if(this.mask)this.mask.show();
		return this;
	};

	/**
	 * 隐藏蒙层
	 */
	mask.prototype.hide = function(){
		this.el.css({position:this.orgPosition});
		if(this.mask)this.mask.hide();
		return this;
	};
	mask.prototype.reset = function(){
		this.el.css({
			position:this.orgPosition 
		});
		if(this.mask)this.mask.hide();
		return this;
	};

	/**
	 * 去掉蒙层,dom里去除
	 */
	mask.prototype.remove = function(){
		this.hide();
		if(this.mask)this.mask.remove();		
		this.mask = null;
		this.el[0].libMaskMask = null;

		return this;
	};
	mask.prototype.bind = function(){
		var self = this;
		if(this.option.click){
			this.el.find('.'+self.option.className).click(function(){
				self.option.click.call($(this));
			});	
		}	
	};
	return mask;
});
