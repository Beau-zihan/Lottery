var bodyWidth = $("body").css("width");
$("div.items").css("width",(bodyWidth.substring(0,bodyWidth.length-2)-380)+"px");

//参与抽奖人数初始值
var itemCount= 120;
//跑马灯循环
var tx;
var runtx;
//是否正在运行跑马灯
var isRun=true;
//是否跑马灯暂停状态
var pause =false;
//排名分组显示算法已经取消
//var ts=20
//默认跑马灯频率
var pl=50;
//程序是否开始运行用于判断程序是否开始运行
var isStart=false;
	
var zzs = "#98ff98";
//跑马灯音效
var runingmic=document.getElementById("runingmic");
runingmic.volume=0.5;
//中奖音效
var pausemic=document.getElementById("pausemic");
pausemic.volume=1.0;

var keyStatus=false;

$("document").ready(function(){
    
    //初始化皮肤
    if(localStorage.getItem("pf")){
		var	pf = localStorage.getItem("pf");
		dynamicLoading.css("./css/style"+pf+".css");
		$("#bodybg img").attr("src","./images/bodybg"+pf+".jpg");
		$("input[name=pf][value="+pf+"]").attr("checked",true);
		if(pf!=1){
		    zzs="#ba3030";
		}
	}
    //初始化标题
    if(localStorage.getItem("title")){
		$("#title").val(localStorage.getItem("title"));
	}
    $(".top").text($("#title").val());
    
    //频率模式本地存储  	 
	if(localStorage.getItem("ms")){
		pl = localStorage.getItem("ms");
		$("input[name=ms][value="+pl+"]").attr("checked",true);
	}
	//排名信息本地存储
	if(localStorage.getItem("sequence")){
        var ssHtml = localStorage.getItem("sequence");
		$(".ss").html(ssHtml);
	}
	
	//已经取消的输入
	//var inputItemCount = prompt("请输入参与抽奖人数(请输入数字，输入非数字会按默认人数计算)。");
	
	//本地排名信息存储
	if(localStorage.getItem("itemCount")){
		itemCount=localStorage.getItem("itemCount");
	}
    //本地设定回显  	 
	$("#personCount").val(itemCount);
	
	//创建item小方格
	for(var i=1;i<=itemCount;i++){
		$("div.items").append("<div class='item i"+i+"'>"+i+"</div>");
    }
	//本地存储item宽度信息
	if(localStorage.getItem("itemk")){
		$("div.item").css("width",localStorage.getItem("itemk")+"px");
	}
    //本地存储item高度信息
	if(localStorage.getItem("itemg")){
		$("div.item").css("height",localStorage.getItem("itemg")+"px");
		$("div.item").css("line-height",localStorage.getItem("itemg")+"px");
	}
    //回显设定item宽高
	$("#itemk").attr("placeholder",$(".i1").css("width"));
	$("#itemg").attr("placeholder",$(".i1").css("height"));
	
	//初始化排序信息
	$(".ss li").each(function(idx,item){
		$(".i"+$(item).attr("data-number")).addClass("ignore");
	});
	
	//$("div.menu").css("height",$("div.items").css("height"));
    $("body").keyup(function(e){
    	keyStatus=false;
	});
	//全局键盘事件监听
	$("body").keydown(function(e){
		if(isStart){
			if(!keyStatus){
			keyStatus=true;
			}else{
				return false;
			}
		}
		if(e.keyCode==116||e.keyCode==8){
			return true;
		}
		//按F1弹出帮助窗口
		if(e.keyCode==112){
			e.preventDefault();
			showReadme();
			return false;
		}
		//ESC案件呼出隐藏菜单
		if(e.keyCode==27){
			if($(".help:hidden").size()>0)
				$(".help").show();
			else
				$(".help").hide();
			
			return false;
		}
        
		if(e.keyCode==37){
			$(".prev").click();
			return false;
		}
		if(e.keyCode==39){
			$(".next").click();
			return false;
		}
		//当程序出于暂停状态
		if(pause){
			//以下按键有效 数字键 0-9 和 小键盘 0-9
			return true;
		}
		//存在未中奖用户切程序出于未开始运行状态执行开始方法
		if((e.keyCode==32||e.keyCode==65)&&$("div.item:not(.ignore)").size()!=0&&!isStart){
			isStart=!isStart;
			startApp();
			return false;
		}
		
		if(e.keyCode==32||e.keyCode==65){
			
			//当所有抽奖号全部抽取完毕则销毁跑马和音效循环
			if($("div.item:not(.ignore)").size()==0){
				clearInterval(tx);
				clearInterval(runtx);
				runingmic.puase();
				
				alert("抽奖已经全部结束。");
				return false;
			}
			//更新运行状态
			isRun=!isRun;
			//如果项目出于运行状态
			if(!isRun){
				//取得当前选中号码
				var it = $(".item.active").text();
				//停止跑马灯
				runingmic.pause();
				//Math.floor($(".sequence li").size()/ts)
				
				//播放中奖音效
				pausemic.currentTime = 0;
				pausemic.play();

				//中奖号处理
				var it=Number(it);
                var r;
                var n='很遗憾，什么都没抽中';
                var j1='一等奖：蒂爵公司提供饰品一件（价值3000元）';
                var j2='二等奖：蒂爵公司提供饰品一件（价值1000元）';
                var j3='三等奖：U盘一件';
                var j4='四等奖：公仔一件';
                switch(it){
                    case 28: 
                        r=j1;
                        break;
                    case 35:
                    case 75:
                    case 93: 
                        r=j2;
                        break;
                    case 36:
                    case 23:
                    case 78:
                    case 25:
                    case 73:
                    case 88:
                    case 44:
                    case 90:
                    case 22:
                    case 98: 
                        r=j3;
                        break;
                    case 4:
                    case 8:
                    case 12:
                    case 45:
                    case 76:
                    case 83:
                    case 87:
                    case 24:
                    case 99:
                    case 110:
                    case 120:
                    case 85:
                    case 87:
                    case 2:
                    case 5:
                    case 9:
                    case 13:
                    case 111:
                    case 77:
                    case 20: 
                        r=j4;
                        break;
                    default:
                        r=n;
                }
                $('.ss ol').append('<li data-number='+it+'>'+it+"号："+r+'；</li>');
                if(r==n){
                    r='<h3>'+r+'！</h3>';
                }else{
                    r='<h2>恭喜您，抽得'+r+'！</h2>';
                }
                var dd = dialog({
                        title: '抽奖结果',
                        content: r,
                        okValue: '确定'
                    });
                dd.show();
                localStorage.setItem("sequence",$(".ss").html()); 
				$(".item.active").addClass("ignore");
				$(".item.active").pulsate({
					color: zzs,        //#98ff98
					repeat: 5
				});
			}else{
				$(".active").removeClass("active");
				runingmic.play();
			}
		}
		
		e.preventDefault();
	});
	
	//打开高级设置窗口	 
	$("a.config").click(function(){
		pause=true;
		runingmic.pause();
		var d = dialog({
			title: '抽奖参数设定',
		    content: $(".model"),
		    okValue: '确定',
		    ok: function () {
		    	if($("#reset:checked").val()&&confirm("点击确定将清空抽奖结果。")){
		    		localStorage.removeItem("sequence");
		    	}
		    	if($("#personCount").val()){
		    		localStorage.setItem("itemCount",$("#personCount").val());
		    	}
		   		if($("#itemk").val()){
		   			localStorage.setItem("itemk",$("#itemk").val());
		    	}
		   		if($("#itemg").val()){
		    		localStorage.setItem("itemg",$("#itemg").val());
		    	}
		    	localStorage.setItem("title",$("#title").val());
		    	localStorage.setItem("ms",$("input[name=ms]:checked").val());
		    	localStorage.setItem("pf",$("input[name=pf]:checked").val());
		    	
		    	window.location.reload();
		    },onclose: function () {
		        pause=false;
		    }
			});
			d.show();
		 });
	
	//清除错误中奖号
	$("body").on("click",".item.ignore",function(){
		var inputItemCount = prompt("请输入点击的号码来进行删除中奖号码（例如“12”）。");
		if(inputItemCount == $(this).text()){
			$("li[data-number="+$(this).text()+"]").remove();
			$(this).removeClass("ignore");
			localStorage.setItem("sequence",$(".ss").html());	
			
                }else{
		}
		
	});
});
//程序开始入口
function startApp(){
	//开始播放跑马灯音效
	runingmic.play();
 	//产生随机数临时变量
	var rand =0
	//存储上一次随机数的临时变量
	var prenum;
	tx=setInterval(function(){
	    if(isRun){
	    	while(true){
				rand=Math.floor(Math.random() * ( $("div.item:not(.ignore)").size()));
			 	if(rand ==0 || rand!=prenum){break;}
			}
			prenum=rand;
			$(".item.active").removeClass("active");
			$("div.item:not(.ignore):not(.active)").eq(rand).addClass("active");
		}
	},pl);
	runtx = setInterval(function(){runingmic.currentTime = 0;},7000);
}
function showReadme(){
	var d = dialog({
		    title: '帮助信息',
		    content: $(".readme") ,
		    width:'400px',
		    okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
	}).show();
}

var dynamicLoading = {
    css: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}