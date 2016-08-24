define(function(require,exports){
	var $ = require('js/lib/zepto');
	var mask = require('js/lib/mask');
	var jsondata = require('js/lib/city');
	var iscroll=require('js/lib/iscroll');
	var dialog = require('js/lib/dialog');
	
	var city = jsondata.industrys;

	function cityselector(option,selected){
		if(selected && selected.length === 1 && selected[0] == ''){
			selected = [];
		}
		if(document.activeElement){
			document.activeElement.blur();
			window.focus();	
		}	
		this.city = city.slice(0);
		var self = this;
		this.op = {
			prefix:'js_selector_',//前缀
			alignWith:'',
			top:0,
			mulselected:'js_selector_selected',
			withall:true,//包含 全部地区 ?
			language:1,//英文为 2
			height : document.documentElement.clientHeight,//没有alignWith 时的弹窗高度
			title: '选择行业',//导航的title
			allText:'全部行业',
			withnav:false, //是否有导航？
			max:5,//多选时最多可以选几个
			type: 'single',//单选	more
			close:false
		};

		if(this.op.type !== 'single'){this.op.withnav= false;}
		if(this.op.withnav){this.op.alignWith = '';}

		$.extend(this.op,option);

		if(this.op.type != 'single' && this.op.max > 1){
			this.op.withnav = true;
		}

		//选中数据,需要回显
		selected = selected || [];
		this.orgselected = selected;
		this.selected = [];
		for(var j=0;j<selected.length;j++){
			this.selected.push(this.getItem(selected[j]));
		}


		//多选没有热门城市，所有城市
		if(this.op.type !== 'single'){
			this.op.withall = false;
		}

		this.init();

		var bhtml = this.getBigListHtml();

		this.bel.append(bhtml);

		//初始化第一屏
		new iscroll(this.bel[0],{ });
		if($('.container').length){
			this.maskel = new mask({
				el:$('.container'),
				click:function(){
					self.destroy();	
					this.hide();
				}
			}).show();
		}
	}

	cityselector.prototype = {
		mainClass:'js_city_mainlist',
		getItem:function(code){
			var len = this.city.length;
			for(var i=0;i<len;i++){
				var bdata = this.city[i][1]; 
				for (var j=0;j<bdata.length;j++){
					var tmdata = bdata[j];
					if(code == tmdata[0]){
						return tmdata;
					}
				}
			}
		},
		getItemSelected:function(){
			return $('.'+this.op.mulselected,this.bel[0]);
		},

		//数据存储
		getSelected:function(){
			return this.selected;
		},

		//添加选中地区
		addSelected:function(data){
			//超过最大
			if(this.selected.length === this.op.max){
				this.fireEvent('maxSelected');
				return false;	
			}
			data = this.convertTo3(data);
			//可以添加否？
			if(this.inSeleted(data)){return false;}

			this.selected.push(data);
			this.getItemSelected();
			return true;
		},

		//已经选中了吗
		inSeleted:function(data){
			data = this.convertTo3(data);
			var len = this.selected.length;
			//防止重复
			for(var i=0;i<len;i++){
				if(data[0] === this.selected[i][0]){
					return true;
				}
			}
			return false;
		},

		//删除选中
		removeSelected:function(data){
			data = this.convertTo3(data);
			var len = this.selected.length;
			var deled;
			for(var i=0;i<len;i++){
				if(data[0]=== this.selected[i][0])	{
					deled = this.selected.splice(i,1);
					return deled;
				}
			}
			return deled;
		},
		//转换成 标准形式
		convertTo3:function(data){
			if(data.code) return [data.code,data.name,data.py];	
			return data;
		},
		init :function(){
			var self = this;

			this.eventEl = $('<div class="js_selector">');
			this.con = $('<div class="js_selector_con js_selector_con_industry">');
			if(this.op.withnav){
				this.con.append(this.navHtml());
			}

			this.con.append(this.eventEl);
			$(document.body).append(this.con);

			this.addNavEvent();
			this.addHashEvent();

			var top = 0;
			if(this.op.alignWith){
				// 去掉元素的top值和高度
				top = (parseInt(this.op.alignWith.css('top'),10) || 0 )+ this.op.alignWith[0].offsetHeight;	
			}
			if(this.op.withnav){
				top = top + 44; //nav的固定高度 	
			}
			if(this.op.top){
				top = this.op.top;
			}

			this.eventEl.css({
				top:top	
			});
			this.op.height = (document.documentElement.clientHeight - top) * .62 ;

			this.initHtml();	

			//设置层的高度
			this.bel.css({ height:this.op.height });
			this.initEvent();
			this.show();

		},

		addHashEvent:function(){
			var self = this;
			//$(window).on('hashchange',function(){
				//if(location.hash === '' ){
					//self.destroy();	
				//}
			//});	
		},
		addNavEvent:function(){
			var self = this;
			this.backbtn = $('.nav-back',this.con.get(0) );			
			this.okbtn = $('.nav-profile',this.con.get(0) );			
			//var data = {data:self.selected};
			var data = self.selected;
			this.okbtn.on('click',function(){
				self.fireEvent('complete',{data:data});	
				self.fireEvent('selectOver',{data:data});	
			});
			this.backbtn.on('click',function(){
				self.fireEvent('complete',{data:data});	
				self.fireEvent('cancelSelect',{data:data});	
			});
		},	
		//自定义事件
		addSelfDefineFunc:function(){
			var self = this;
			this.addEvent('maxSelected',function(){

				new dialog.dialog({
					modal:true,		
					css:{ 
						'z-index':2000
					},
					modalcss:{ 'z-index':2000 },
					html:'<p style="font-size: 16px; padding: 10px 0; text-align: center;">超过了最大添加个数！</p>',
					buttons:[{
						text:"确定",
						callback:function(){
							this.hide();	
						}
					}]
				});

			});		

			this.addEvent('complete',function(e,data){
				self.destroy();	
			});

			this.addEvent('select',function(e,data){
				var data = data.data;
				var ps = $('p',self.bel[0]);
				var $this = $(ps[data.index]);

				if($this.hasClass(self.op.mulselected)){
					$this.removeClass(self.op.mulselected);
					self.removeSelected(data);
				}else{
					//可以添加
					if(self.addSelected(data)){
						$this.addClass(self.op.mulselected);
					}
				}
				if(self.op.type == 'single'){
					setTimeout(function(){
						self.destroy();
					},400);
				}
			});
		},

		getBigListHtml:function (){
			var len = this.city.length;
			var html = '<div class="js_selector_inner">';
			if(this.op.withall){
				html += '<p index="000">'+this.op.allText+'</p>';
			}
			for(var i=0;i<len;i++){
				var bdata = this.city[i][1]; 
				var em = '';
				for (var j=0;j<bdata.length;j++){
					var tmdata = bdata[j];
					var cls='';
					if(this.orgselected.indexOf(tmdata[0]) >= 0){
						cls = this.op.mulselected;
					}
					html += '<p class="'+cls+'" index='+ i +' code='+ tmdata[0]+' py='+ tmdata[2] +'>'+ tmdata[this.op.language] + em +'</p>';
					}
			}
			html += '</div>';
			return html;
		},
		
		addEvent:function(name,func){
			this.eventEl.on(name,func);
		},
		delEvent:function(name,func){
			this.eventEl.off(name,func);
		},
		fireEvent:function(name,data){
			this.eventEl.trigger(name,data);	
		},
		initHtml:function(){
			this.bel = $("<div class='js_city_menu "+ this.mainClass +" js_city_industry ' ></div>");

			$(this.eventEl).append(this.bel);
			
		},
		getItemData:function($this){
				var data = {
					dataindex:$this.attr('index'),
					py:$this.attr('py'),
					name:$this.html(),
					code:$this.attr('code')	,
					index:$this.index()
				};
				return data;
		},	
		initEvent:function(){
			var self = this;
			$('.'+this.mainClass).delegate('p','tap',function(e){
				var $this = $(this);
				var data = self.getItemData($this);
				self.fireEvent('select',{data:data});		
			});

			this.addSelfDefineFunc();
		},

		navHtml:function(){
			return '<nav style="position:fixed;top:0;left:0;z-index:1100" class="mod-nav mod-select">\
						<div class="nav-con clearfix">\
						<a href="javascript:;" class="nav-back" style="display:block;width:31px;">取消 </a>\
						<a href="javascript:;" style="font-size:15px;margin-top:4px;" class="nav-profile">确定</a>\
						<h1><span class="page-title" >'+ this.op.title +'</span></h1>\
						</div>\
					</nav>';
		},

		destroy:function(){
			this.hide();
			this.con.remove();
			this.fireEvent('destroy');
		},
		hide:function(){
			this.con.css({ display:'none' });
			//location.hash='';
			$(document.body).css({
				overflow:'auto',
				height:'auto'
			});

			$(document.body)[0].scrollTop = this.orgScrollTop;
			this.selScrolled = false;	
			this.maskel.remove();
			if(typeof this.op.close == 'function'){
				this.op.close.call(this);
			}
		},
		show:function(){
			this.orgScrollTop = $(document.documentElement)[0].scrollTop;
			this.con.css({ display:'block' });
			var self = this;
			//location.hash='cityselector';
			//
			$(document.documentElement)[0].scrollTop = 0 ;	
			$(document.body)[0].scrollTop = 0 ;	
			$(document.body).css({
				overflow:'hidden',
				height:$(window).height()
			});
		}

	};
	return cityselector;
});

