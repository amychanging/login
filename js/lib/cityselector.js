define(function(require,exports){
	var $ = require('js/lib/zepto');
	var mask = require('js/lib/mask');
	var jsondata = require('js/lib/city');
	var iscroll=require('js/lib/iscroll');
	var dialog = require('js/lib/dialog');

	var city = jsondata.dq.list;
	function cityselector(option,selected){
	
		if(selected && selected.length === 1 && selected[0] == ''){
			selected = [];
		}
		var self = this;
		this.city = city.slice(0);
		this.op = {
			prefix:'js_selector_',//前缀
			alignWith:'',
			top:0,
			selectedClass:'js_selector_selected',
			withHotData:true,//包含热门地区?
			withall:true,//包含 全部地区 ?
			language:1,//英文为 2
			height : document.documentElement.clientHeight,//没有alignWith 时的弹窗高度
			title: '选择地点',//导航的title
			withnav:false, //是否有导航？
			max:5,//多选时最多可以选几个
			type: 'single',//单选	more
			close:false
		};

		$.extend(this.op,option);

		if(this.op.type != 'single' && this.op.max >1){this.op.withnav= true;}

		if(this.op.withnav){this.op.alignWith = '';}

		//热门城市的选择太复杂，多选不允许有热门城市
		if(this.op.type !== 'single'){this.op.withHotData = false;}

		//选中数据,需要回显
		selected = selected || [];
		this.selected = [];

		for(var j=0;j<selected.length;j++){

			var item = this.getItem(selected[j]);
			//可能找不到
			item && this.selected.push(item);
		}
		//删除四个直辖市
		if(this.op.type=="single" && this.op.withHotData){
			this.city.splice(0,4);	
		}
		//添加热门城市
		if(this.op.withHotData){
			this.city.unshift([1,['rmcs','热门城市','hotcity'],jsondata.dq.hotcity]);	
		}

		//初始化时的选择
		this.parentItem = {}; 
		for(var i = 0;i<selected.length;i++){
			 var index = this.getParentIndex(selected[i]);	
			 if(this.parentItem[index]){
			 	++this.parentItem[index];
			 }else{
			 	this.parentItem[index] = 1;
			 }
		}

		//多选没有热门城市，所有城市
		if(this.op.type !== 'single'){
			this.op.withall = false;
			this.op.withHotData = false;
		}

		this.init();

		var bhtml = this.getBigListHtml();

		this.bel.append(bhtml);

		//初始化第一屏
		new iscroll(this.bel[0],{ tap:true });
		
		if($('.container').length){
			this.maskel = new mask({
				el:$('.container'),
				click:function(){
					self.destroy();	
					this.hide();
				}
			}).show();
		}


		//展开第一项
		var ps = $('p',this.bel[0]);
		var p = ps.eq(0);
		//兼容全部
		if(p.attr('index') == '000')	{
			p=ps.eq(1);	
		}
		p.trigger('tap');
	}

	cityselector.prototype = {
		mainClass:'js_city_mainlist',
		subClass:'js_city_sublist',
		getItem:function(code){
			var len = this.city.length;
			for(var i=0;i<len;i++){
				var tmd = this.city[i][2];
			   for (var j=0;j<tmd.length;j++){
					if(tmd[j][0] == code ){
						return tmd[j];
					}	
				}			
			}
			return null;
		},
		getParentIndex:function(code){
			var len = this.city.length;
			
			var bgn = 0;
			//去除热门城市
			if(this.op.withHotData){
				bgn=1;	
			}
			for(var i=bgn;i<len;i++){
				var tmd = this.city[i][2];
			   for (var j=0;j<tmd.length;j++){
					if(tmd[j][0] == code ){
						//res.push(i);
						return i;
					}	
				}			
			}
		},

		getItemSelected:function(){
			return $('.'+this.op.selectedClass,this.bel[0]);
		},
		addNum:function(){
			this.handleNum(true);		
		},
		minusNum:function(){
			this.handleNum();		
		},

		//一级菜单的数字显示
		handleNum :function(add){
			var p = this.getItemSelected();
			var item =  $('em',p[0]);
			var num;
			if(item.length){
				num = +item.html() || 0;
			}else{
				item = $('<em>');
				p.append(item);
				num = 0;	
			}
			if(add){
				++num;
			}else{
				--num;	
			}
			if(!num || num<0){
				num = '';
			}
			item.html(num);
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
			if(!len){return false;}
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
			this.con = $('<div class="js_selector_con js_selector_con_city">');
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
			this.sel.css({ height:this.op.height });
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

			//自定义事件
			this.addEvent('mainSelected',function(e,data){
				data = data.data;
				var ps = $('p',self.bel[0]);
				ps.removeClass(self.op.selectedClass);
				$(ps[data.index]).addClass(self.op.selectedClass);
			});
			//单选
			this.addEvent('subSelected',function(e,data){
				data = data.data;
				var ps = $('p',self.sel[0]);
				ps.removeClass(self.op.selectedClass);
				$(ps[data.index]).addClass(self.op.selectedClass);
				setTimeout(function(){
					self.destroy();
				},400);
			});
			//多选
			this.addEvent('mulsubSelected',function(e,data){

				data = data.data;
				var ps = $('p',self.sel[0]);
				var $this = $(ps[data.index]);
				if($this.hasClass(self.op.selectedClass)){
					$this.removeClass(self.op.selectedClass);
					self.removeSelected(data);
					self.minusNum();
				}else{
					//可以添加
					if(self.addSelected(data)){
						$this.addClass(self.op.selectedClass);
						self.addNum();
					}
				}
			});
		},

		//根据索引获得城市列表
		getIndexlist:function (index){
			return this.city[index][2];
		},

		getBigListHtml:function (){

			var len = this.city.length;
			var html = '<div class="js_selector_inner">';
			if(this.op.withall){
				html += '<p index="000">全部地区</p>';
			}
			for(var i=0;i<len;i++){
				var tmdata = this.city[i][1]; 
				var em = '';
				if(this.parentItem[i]){
					em = "<em>"+ this.parentItem[i] +"</em>";
					this.parentItem[i]='';
				}
				html += '<p index='+ i +' code='+ tmdata[0]+' py='+ tmdata[2] +'>'+ tmdata[this.op.language] + em +'</p>';
			}
			html += '</div>';
			return html;
		},
		
		getSubListHtml:function (dataindex){
			var data = this.getIndexlist(dataindex);
			var len = data.length;
			var html = '<div class="js_selector_inner">';
			for(var i=0;i<len;i++){
				var tmdata = data[i]; 
				var  cls = '';
				//显示选中状态
				if(this.inSeleted(data[i])){
					cls = this.op.selectedClass;
				}
				html += '<p class="'+ cls +'" index='+ i +' code="'+ tmdata[0]+'" py="'+ tmdata[2] +'">'+ tmdata[this.op.language] +'</p>';
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
			this.bel = $("<div class='js_city_menu "+ this.mainClass +"' ></div>");
			this.sel = $("<div class='js_city_menu "+ this.subClass +"' ></div>");

			$(this.eventEl).append(this.bel);
			$(this.eventEl).append(this.sel);
			
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
		selScrolled : false,
		initEvent:function(){
			var self = this;
			$('.'+this.mainClass).delegate('p','tap',function(){
				var $this = $(this);

				var data = self.getItemData($this);

				//全部地区 特殊处理
				if(data.dataindex === "000"){
					self.fireEvent('subSelected',{data:data});
				}else{
					//生成子菜单
					var html = self.getSubListHtml(data.dataindex);
					self.sel.html('').append(html).show();
					if(!self.selScrolled){
						this.selScrolled = new iscroll(self.sel[0]);  
					}else{
						this.selScrolled.refresh();  
					}
					self.fireEvent('mainSelected',{data:data});
				}
			});

			var u = navigator.userAgent;

			$('.'+this.subClass).delegate('p','tap',function(){
				var $this = $(this);
				var data = self.getItemData($this);
				var index = $(this).index();
				var el;

				//非热门城市执行逻辑:
				if($('.'+self.mainClass + ' .'+self.op.selectedClass).attr('code') !== 'rmcs'){
					//选中省了，下面的点击取消选中省
					if( index !== 0){
						el = $this.parent().children().eq(0);
						if (el.hasClass(self.op.selectedClass)) {
							el.trigger('tap');
						}
					}else{
						//第一个点击,下面有选中的会取消选中
						el = $this.parent().children().eq(0);
						if (!el.hasClass(self.op.selectedClass)) {
							var els = $this.parent().children("."+self.op.selectedClass);
							els.trigger('tap');
						}
					}
				}

				if(self.op.type === 'single'){
					//单选
					self.fireEvent('subSelected',{data:data});
				}else{
					//多选
					self.fireEvent('mulsubSelected',{data:data});		
				}
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

