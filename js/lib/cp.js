define(function(require,exports){
	var $ = require('./zepto');
	/** 
 	 * 罗盘图
	 * @constructor cp 
	 * @alias module:lib/cp
	 * @param option {object} 配置选项
	 * @param option.data {json} 原始数据
	 */
	 function cp(option){
	 	this.option={
	 		data:'',
	 		ele:$('.cp')
	 	}
	 	$.extend(this.option,option,true);
	 	this.init();
	 	
	 }
	 cp.prototype.init=function(){
	 	op=this.option;
	 	createElement(op.ele,op.data);

	 	checkOrient();
	 	
	 };
	 cp.prototype.addAnimation=function(){
    		$('.r_h,.l_h').css('-webkit-animation','toBig 1s ease-out 0s');
    }
    cp.prototype.removeAnimation=function(){
    	$('.r_h,.l_h').css('-webkit-animation',' ');
    }
	 function createElement(ele,data){
	 	var quan=$('<div class="quan"></div>');
	 	var bword=$('<ul class="bword"></div>');
	 	var flag=$('<div class="flag"></div>');
	 	var jn=data[0][2].items;//技能
	 	var tz=data[0][3].items;//潜在物质
	 	var job=data[0][0].items;//学历
	 	var xl=data[0][1].items;//工作经历
	 	var colorful=[" ","selected","s_red","s_blue","s_green"];
	 	var jn_li='',tz_li='',job_li='',xl_li='',bw_li='';
	 	for(var i=0;i<jn.length;i++){
			jn_li+='<li class="'+colorful[jn[jn.length-i-1].s]+'"></li>';
	 		bw_li+='<li><i>●</i>'+jn[i].name+'</li>';
	 	}
	 	for(var i=0;i<tz.length;i++){
	 		if(tz[tz.length-i-1].s){
				tz_li+='<li class="'+colorful[tz[tz.length-i-1].s]+'"></li>';
	 		}else{
	 			tz_li+='<li></li>';
	 		}
	 		
	 		bw_li+='<li><i>●</i>'+tz[i].name+'</li>';
	 	}
	 	for(var i=0;i<job.length;i++){
	 		if(job[i].s){
	 			job_li+='<li class="'+colorful[job[i].s]+'"><span class="ns'+(i+1)+'">'+job[i].name+'</span></li>';
	 		}else{
	 			job_li+='<li><span class="ns'+(i+1)+'">'+job[i].name+'</span></li>';
	 		}
	 		
	 	}
	 	for(var i=0;i<xl.length;i++){
	 		if(xl[i].s){
	 			xl_li+='<li class="'+colorful[xl[i].s]+'"><span class="ns'+(i+1)+'">'+xl[i].name+'</span></li>';
	 		}else{
	 			xl_li+='<li><span class="ns'+(i+1)+'">'+xl[i].name+'</span></li>';
	 		}
	 	}
	 	quan.append('<ul class="r_h c1_1">'+jn_li+'</ul>');
	 	quan.append('<ul class="l_h c1_2">'+tz_li+'</ul>');
	 	quan.append('<ul class="r_h c2_1">'+jn_li+'</ul>');
	 	quan.append('<ul class="l_h c2_2">'+tz_li+'</ul>');
	 	quan.append('<ul class="r_h c3_1">'+jn_li+'</ul>');
	 	quan.append('<ul class="l_h c3_2">'+tz_li+'</ul>');
	 	//console.log(jn);
		quan.append('<ul class="c4"></ul');
		quan.append('<ul class="r_h c5_1">'+job_li+'</ul>');
		quan.append('<ul class="l_h c5_2">'+xl_li+'</ul>');
		quan.append('<ul class="c6"></ul');
		quan.append('<ul class="c7"></ul');
	 	ele.append(quan);
	 	bword.append(bw_li);


	 	ele.append(bword).append(flag);



		var _w =quan.width();
	    ele.css('font-size', _w * 16 / 320 + 'px');
	    ele.css('height',_w+'px');
	    quan.css('height',_w+'px');
	    bword.css('height',_w+'px');
	    flag.css('height',_w*600/455+'px');
	    bwPosition(bword,jn.length);
	    eachLi($('.c1_1'),0);
	    eachLi($('.c1_2'),180);
	    eachLi($('.c2_1'),0);
	    eachLi($('.c2_2'),180);
	    eachLi($('.c3_1'),0);
	    eachLi($('.c3_2'),180);
	    eachLi($('.c5_1'),0);
	    eachLi($('.c5_2'),180);
	    
	 }
	function eachLi(ele,cha){//cha转动度数
    	if(typeof cha=='undefined'){ cha=0}
    	ele.find('li').each(function(){
  			var iteams=ele.find('li').length;
  			//console.log(cha);
  			$(this).css('transform','rotate('+($(this).index()*180/iteams-90+cha)+'deg)');
  			$(this).css('-webkit-transform','rotate('+($(this).index()*180/iteams-90+cha)+'deg)');
  			var _sp=$(this).find('span')
  			if(_sp.length>0){
  				_sp.css('transform','rotate('+(-($(this).index()*180/iteams-90+cha))+'deg)');
  				_sp.css('-webkit-transform','rotate('+(-($(this).index()*180/iteams-90+cha))+'deg)');
  			}
  		});
    }
    function bwPosition(ele,i_first){
    	//console.log('e');
    	//console.log(ele.find('li'));
    	var _w = ele.width();
    	 ele.find('li').each(function(){
    	 	var _self=$(this);
	        var _i=_self.index();

	        var i=ele.find('li').length;

	        var i1=i_first;
	        var i2=i-i_first;
	        var i=i1;
	        
	       //console.log(i);
	        //console.log(i_first);
	        var d2f=Math.PI*2/360;//度转幅度
	        var _i2=_i;
	        if(_i>=i){
	           _self.find('i').addClass('r');
	         }
	          var sin=Math.sin((180/i*_i2+180/i/2)*d2f);
		      var cos=Math.cos((180/i*_i2+180/i/2)*d2f);
	         if(_i>(i1-1)){
	         	i=i2;
	         	_i2=_i2-i_first;
	         	sin=Math.sin((180/i*_i2+180/i/2+180)*d2f);
		      	cos=Math.cos((180/i*_i2+180/i/2+180)*d2f);
	        }
	        //console.log(i);
	        var l=_w/2+sin*_w/2;
	        var t=_w/2+cos*_w/2;
	        if(_i<i1/2){

	        }else if(_i<i1){
	           t-=_self.height();
	        }else if((_i-i_first)<i2/2){
	        	//console.log('c');
	          t-=_self.height();
	          l-=_self.width();
	        }else{

	           l-=_self.width();
	        }
		    _self.css({
	          'left':l+'px',
	          'top':t+'px'
	        });

    	});
    }
    function checkOrient(){

    	var s_width=window.innerWidth;
    	var s_height=window.innerHeight;
    	if(s_width>s_height){
    		alertOrient();
    	}

    	$(window).bind( 'orientationchange', function(e){
			var _orient=orient();
			
			if(!_orient){
				alertOrient();
			}else{
				$('.js_mask,.js_minidialog').remove();
			}
		});
    }
    function alertOrient(){
    	var minidialog=require('js/lib/minidialog');
    	new minidialog({
    			modal:true,
    			html:'请使用竖屏浏览本页!'
    	});
    }
    function orient() {
		//alert('gete');
		var orientation;
		if (window.orientation == 0 || window.orientation == 180) {
		//$("body").attr("class", "portrait");
		orientation = true;
		}
		else if (window.orientation == 90 || window.orientation == -90) {
		//$("body").attr("class", "landscape");
		orientation = false;
		}
		return orientation;
	}

	 return cp;
    
});