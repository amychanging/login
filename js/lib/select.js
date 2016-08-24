define(function(require,exports){
	var $ = require('js/lib/zepto');
	var maskobj = require('js/lib/mask');
	var iscroll = require('js/lib/iscroll');
	var $body = $(document.body);

	function select(option){
		this.op = {
			area:document,
			el:null
		};	
		if(option){
			$.extend(this.op,option);	
		}
		this.init();
	}

	select.prototype = {
		init:function(){
			if(!this.op.el){return;}
			var self = this;
			var selects = this.getSelets();

			//selects.forEach(function(v,i){
				//self.packItem(v);
			//});
			self.packItem(this.op.el);

			this.mask = new maskobj({
				click:function(){
					self.hide();
					this.hide();
				},
				css:{
					zIndex:1000
				},
				el:$(document.body)
			}).show();
			this.locate();
		},
		packItem:function(v){
			var self = this;
			var el = this.packCon(v);	

			var options = $('option',v);
			var html = "";
			options.forEach(function(v,i){
				html += self.packp(v);	
			});

			el.inner.html(html);
			el.input.insertBefore(v);
			$body.append(el.con);
			$(v).remove();
			new iscroll(el.iscrollWrap[0],{ click: true });
			
			this.addEvents();
			this.addSelfDefine();
		},

		getSelets:function(){
			return $('select',this.op.area);	
		},
		packCon:function(select){
			var $select = $(select);

			var con = $('<div class="js_util_select js_city_menu" style="overflow:hidden;"/>');
			var iscrollWrap = $('<div class="iscroll-wrapper" />');
			
			con.append(iscrollWrap);

			iscrollWrap.css({
				'background':'#f7f7f7',
				'width': '100%' ,
				'max-height': $(window).height()*.8
			});

			con.css({
				position:'fixed',	
				width:'100%',
				top: 0,
				left: 0,
				zIndex: 1001
			});

			var inner = $('<div class="js_util_select_inner">');
			inner.css({});

			iscrollWrap.append(inner);

			var input = this.getSeletData($select);

			this.con = con;
			this.inner = inner;
			this.input = input;

			return {
				con:con,
				inner:inner,
				iscrollWrap:iscrollWrap,
				input:input
			};
		},

		packp:function(option){
			option = $(option);
			if(!option.html().trim().length){
				return '';
			}
			return 	"<p val='"+ option.attr('value') +"'>"+ option.html() +"</p>";
		},

		getSeletData:function($select){
			var input = $('<input type="hidden" >');
			input.attr('id',$select.attr('id'));
			input.attr('name',$select.attr('name'));
			input.attr("validate-title",$select.attr("validate-title"));
			input.attr("validate-rules",$select.attr("validate-rules"));

			input.val($select.val());
			input.triggerHandler('blur.valid')
			return input;
		},

		addEvents:function(){
			var self = this;
			this.con.find('.iscroll-wrapper').delegate('p','tap',function(e){
				var val = $(this).attr('val'); 				
				var txt = $(this).html(); 				
				self.fireEvent('select',{
					data:{
						val:val,	
						txt:txt
					}
				});
				 //self.goTop();
         //$.validRefresh();
			});	
		},
		addSelfDefine:function(){
			var self = this;
			this.addEvent('select',function(e,data){
				self.input.val(data.data.val);
				self.input.triggerHandler('blur.valid')
				self.hide();
			});	
		},
		addEvent:function(name,func){
			this.con.on(name,func);	
		},
		fireEvent:function(name,data){
			this.con.trigger(name,data);	
		},
		locate:function(){
			//var top =  $(window).height()/2 - this.inner[0].clientHeight/2 + document.body.scrollTop;
			if(top<0)top = 0;
			this.inner.css({
				'top':top  +  'px'
			});	
		},
		hide:function(){
			this.con.css({
				display:'none'
			});
			this.mask.hide();
		},
		show:function(){
			this.mask.show();
			this.con.css({
				display:'block'
			});
		},
		goTop:function(){
            var goTopTimer;
            if(!document.body.scrollTop)return;
             goTopTimer = setInterval(function(){
                if(document.body.scrollTop > 0) {
                    document.body.scrollTop =document.body.scrollTop - 150; 
                }else{
                    if(goTopTimer){
                        clearInterval(goTopTimer);
                        goTopTimer = null;
                    }
                }
            },50);
        }
	};

	var selects = $('.list-item select')
	selects.hide();

	var newselects = {};
	selects.forEach(function(v,i){
			var $select = $(v);
			var $p = $select.closest('.list-item');
			$p.attr('select-inited','1');

			var timeid = new Date().getTime();
			$p.attr('timeid',timeid);

			var res = $('.select-text',$p);
			
			var options = $('option',$select[0]);

			var value= $select.val();
			var selectedText = '';
			options.forEach(function(v,i){
				if($(v).attr('value') === value ){
					selectedText = $(v).html();
				}
			});

			newselects[timeid] = new select({
				el:$select
			});

			newselects[timeid].hide();

			res.html(selectedText);

			newselects[timeid].addEvent('select',function(e,data){
				res.html(data.data.txt);
			});

	});

	$('.list-item').click(function(){
			if(!$(this).attr('select-inited'))return;
			timeid = $(this).attr('timeid');
			if(!newselects[timeid])return;
			newselects[timeid].show();	
	});
});

