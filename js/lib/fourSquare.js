define(function(require,exports){
	var $ = require('./zepto');
	/** 
 	 * 四方图
	 * @constructor fourSquare 
	 * @alias module:lib/fourSquare
	 * @param option {object} 配置选项
	 * @param option.data {json} 原始数据
	 */
	 function fourSquare(option){
	 	this.option={
	 		data:'',
	 		ele:$('.fourSquare'),
	 		lineColor:['#0000cc','#00cc00','#cc0000'],
	 		fillColor:['rgba(0,0,200,0.2)','rgba(0,200,0,0.2)','rgba(200,0,0,0.2)']

	 	}
	 	$.extend(this.option,option,true);
	 	this.init();
	 }
	 fourSquare.prototype.init=function(){
	 	var fs=this;
	 	var width=parseInt(fs.option.ele.width());
	 	var height=parseInt(fs.option.ele.height());
	 	var cv=$('<canvas id="fs_canvas"></canvas>');
	 	// cv.css({
	 	// 	width:width+'px',
	 	// 	height:height+'px'
	 	// });
		cv.attr('width',width);
		cv.attr('height',height);
	 	fs.option.ele.html(cv);

	 	
	 	//console.log(fs.option.data);
	 	var canvas = document.getElementById('fs_canvas');
	 	var ctx;
	 	if (canvas.getContext) {
		    ctx = canvas.getContext('2d');
		}

		fs.drawBg(width,height,ctx);
	 };
	 fourSquare.prototype.drawBg=function(width,height,ctx){//画背景
	 	
		var list=this.option.data[0];
		//console.log(this.option.data.length);
		var i_w=list[0].items.length+1;
		var i_h=list[1].items.length+1;
		if(i_w<(list[2].items.length+1)){
			i_w=list[2].items.length+1;
		}
		if(i_h<(list[3].items.length+1)){
			i_h=list[3].items.length+1;
		}
		var gr=7;
		var gr2=12;
		var w=width*(gr-2)/gr/i_w;
		var h=height*(gr2-2)/gr2/i_h;
		var margin_w=width*1/gr;
		var margin_h=height*1/gr2;
		var font_size=16*width/600;
		

		var font="bold "+font_size+"px Arial";
		//console.log(w);

		for(var i=1;i<=i_h;i++){
			for(var j=1;j<=i_w;j++){

				drawSqAndLine(margin_w+w*(j-1),margin_h+h*(i-1),margin_w+w*j,margin_h+h*i,ctx,'#cccccc',j%2==0?'#efefef':'#ffffff');

			}
		}
		
		//四个角
		drawWordAndBg(ctx,margin_w,margin_h-font_size/4,font_size,"#333333",list[0].title,"left");
		drawWordAndBg(ctx,width-margin_w+font_size/2,margin_h+font_size*1.75,font_size,"#333333",list[1].title,"left");
		drawWordAndBg(ctx,margin_w-font_size*2.5,height-margin_h+font_size*2.5-font_size/4,font_size,"#333333",list[2].title,"left");
		drawWordAndBg(ctx,0,margin_h+font_size*1.75,font_size,"#333333",list[3].title,"left");
		
		//var point=[];
		for(var i=0;i<list[0].items.length;i++){
			drawWord(ctx,margin_w+w*(i+1),margin_h-font_size*0.75,font,'#333333',list[0].items[i].name,'left',font_size);
		}
		for(var i=0;i<list[1].items.length;i++){
			drawWord(ctx,width-margin_w+0.5*font_size,margin_h+h*(i+1),font,'#333333',list[1].items[i].name,'left',font_size);
		}
		for(var i=0;i<list[2].items.length;i++){
			drawWord(ctx,margin_w+w*(i+1)-font_size*1,height-margin_h+font_size*2,font,'#333333',list[2].items[i].name,'left',font_size);
		}
		for(var i=0;i<list[3].items.length;i++){
			drawWord(ctx,margin_w-0.5*font_size,margin_h+h*(i+1),font,'#333333',list[3].items[i].name,'right',font_size);
		}

		var bigData=this.option.data;
		for (var i = 0; i <bigData.length; i++) {//多少组
			var items=bigData[i];
			var pt=[];
			//console.log(items);
			for(var j=0;j<items.length;j++){//多少个方向
				
				var aspect=items[j].items;
				//console.log(aspect);
				for(var k=0;k<aspect.length;k++){
					if(aspect[k].s){
						//console.log(aspect[k].name);
						if(j==0){
							pt.push([margin_w+w*(k+1),margin_h]);
						}else if(j==1){
							pt.push([width-margin_w,margin_h+h*(k+1)]);
						}else if(j==2){
							pt.push([width-margin_w-w*(k+1),height-margin_h]);
						}else if(j==3){
							pt.push([margin_w,height-margin_h-h*(k+1)]);
						}
					}
				}
			}
			//console.log(pt);
			if(pt.length){
				drawCircleAndLine(ctx,pt,this.option.lineColor[i],this.option.fillColor[i]);
			}
		};
		//drawCircleAndLine(ctx,point,'#00cc00',"rgba(0,200,0,0.2)");//第一层点和线
		ctx.save();
		ctx.restore();
		
	 }
	 function drawCircleAndLine(ctx,point,color,color2){//点线
	 	ctx.beginPath();
		ctx.moveTo(point[0][0],point[0][1]); 
		for(var i=0;i<point.length;i++){//画线
			
			ctx.lineTo(point[i][0],point[i][1]);
			
		}
		
		ctx.lineTo(point[0][0],point[0][1]); 
		ctx.lineWidth =2; 
		ctx.strokeStyle =color; 
		ctx.stroke(); 
		ctx.closePath();
		ctx.fillStyle=color2;
		ctx.fill();


		for(var i=0;i<point.length;i++){//画点

			drawCircle(ctx,point[i][0],point[i][1],5,color);
		}

	 }

	 function drawCircle(ctx,x,y,r,color){//画圈圈
	 	ctx.beginPath(); 
		ctx.arc(x, y, r, 0, Math.PI*2, true); 
		ctx.lineWidth = 2.0; 
		ctx.strokeStyle = color; 
		ctx.stroke();
		ctx.arc(x, y, r-2, 0, Math.PI*2, true);
		ctx.fillStyle = '#fff'; 
		ctx.fill();
	 }

	 function drawSqAndLine(x,y,x2,y2,ctx,color1,color2){//画带边框的正方形
		drawSq(x,y,x2,y2,ctx,color2);
		drawSqLine(x,y,x2,y2,ctx,color1);
	 }
	function drawSq(x,y,x2,y2,ctx,c){//填充正方形
		ctx.fillStyle=c;
		ctx.fillRect(x,y,x2-x,y2-y);
	 }
	 function drawSqLine(x,y,x2,y2,ctx,c){//画正方形边框
	 	ctx.beginPath(); // 开始路径绘制
		ctx.moveTo(x, y); // 设置路径起点，坐标为(20,20)
		ctx.lineTo(x2, y); // 绘制一条到(200,20)的直线
		ctx.lineTo(x2,y2);
		ctx.lineTo(x,y2);
		ctx.lineTo(x,y);
		ctx.lineWidth =0.3; // 设置线宽
		ctx.strokeStyle =c; // 设置线的颜色
		ctx.stroke(); // 进行线的着色，这时整条线才变得可见
	 }
	 function drawWord(ctx,x,y,fs,c,text,ta,fsize){//写字
	 	if(checkOs()){
	 		//引入hidpi-canvas.js解决高清屏字体模糊的问题,字体大小需要加入这个比率
		 	var ratio = getPixelRatio(ctx);

		 	fs=fs.replace('bold ','');
		 	fs=parseFloat(fs);
		 	fs='bold '+fs*ratio+'px Arial';
		 }
	 	//console.log(fs);
	 	// 设置字体
		ctx.font =fs;
		// 设置对齐方式
		ctx.textAlign = ta;
		// 设置填充颜色
		ctx.fillStyle = c; 
		// 设置字体内容，以及在画布上的位置
		if(/\n/g.test(text)){//判断是否换行
			var text_array=text.split('\n');
			for(var i=0;i<text_array.length;i++){
				ctx.fillText(text_array[i], x, y+fsize*1.2*i);
			}
			
		}else{
			ctx.fillText(text, x, y); 
		}
		// 绘制空心字
		//ctx.strokeText("Hello!", 10, 100);
	 }
	 function drawWordAndBg(ctx,x,y,fs,c,text,ta){//写带背景的字
	 	//console.log(text.length);
	 	drawSq(x,y,x+fs*text.length+fs*2/3,y-fs*7/4,ctx,'#cccccc');
		drawWord(ctx,x+fs/4,y-fs/2,"bold "+fs+'px Arial',c,text,ta);
	 }
	 var getPixelRatio = function(context) {
		  var backingStore = context.backingStorePixelRatio ||
		    context.webkitBackingStorePixelRatio ||
		    context.mozBackingStorePixelRatio ||
		    context.msBackingStorePixelRatio ||
		    context.oBackingStorePixelRatio ||
		    context.backingStorePixelRatio || 1;
		   return (window.devicePixelRatio || 1) / backingStore;
		};
	function checkOs(){
		var p = window.navigator.userAgent.toLowerCase(); 
		//return true;
       //console.log(p);
      
        if (p.indexOf('chrome')>0||p.indexOf('iphone')>0) { 
 			return false;
        }else{
        	console.log('c');
        	return true;
        }
	}
	
	var requestAnimFrame =
		    window.requestAnimationFrame ||
		    window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.oRequestAnimationFrame ||
		    window.msRequestAnimationFrame ||
		    function (callback) {
		        window.setTimeout(callback, 1000 / 60);
			};

	 return fourSquare;
});