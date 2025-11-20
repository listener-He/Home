var canvas;
var stars_count;
var stars;
ini();
makeStars();
var interval;

function ini(){//初始化
    canvas = document.getElementById("bg");
    if (!canvas) {
        console.warn('Canvas element with id "bg" not found');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext("2d");
    stars = Array();//ɵݣx,y,Сɫٶȣ
    stars_count = SiteConfig.stars.count;//
    
    // 清除可能存在的旧interval
    if (interval) {
        clearInterval(interval);
    }
}

function makeStars(){//
    if (!canvas) return;
    for(var i=0;i<stars_count;i++)
    {
        let x=Math.random() * canvas.offsetWidth;
        let y = Math.random() * canvas.offsetHeight;
        let radius = Math.random()*0.8;
        let color="rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+",0.8)";
        let speed=Math.random()*0.5;
        let arr={'x':x,'y':y,'radius':radius,'color':color,'speed':speed};//x,y,Сɫٶȣ
        stars.push(arr);//ɵݴ
    }
}

function drawStars(){//ǻ
    if (!canvas || !context) return;
    context.fillStyle = "#0e1729";
    context.fillRect(0,0,canvas.width,canvas.height);
    for (var i = 0; i < stars.length; i++) {
        var x = stars[i]['x'] - stars[i]['speed'];
        if(x<-2*stars[i]['radius']) x=canvas.width;
        stars[i]['x']=x;
        var y = stars[i]['y'];
        var radius = stars[i]['radius'];
        context.beginPath();
        context.arc(x, y, radius*2, 0, 2*Math.PI);
        context.fillStyle = "rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+",0.8)";
        context.fill();
    }
}

window.onresize = function(){//ڴС仯ʱ
    ini();
    makeStars();
    // 只有当canvas存在时才设置interval
    if (canvas && !interval) {
        interval=setInterval(function(){drawStars();},SiteConfig.stars.refreshInterval);
    }
}

// 页面加载完成后初始化星空效果
document.addEventListener('DOMContentLoaded', function() {
    ini();
    makeStars();
    // 只有当canvas存在时才设置interval
    if (canvas) {
        interval=setInterval(function(){drawStars();},SiteConfig.stars.refreshInterval);
    }
});