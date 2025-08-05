var canvas;
var stars_count;
var stars;
ini();
makeStars();
var interval=setInterval(function(){drawStars();},50);//��ʱˢ����������

function ini(){//初始化
    canvas = document.getElementById("bg");
    if (!canvas) {
        console.warn('Canvas element with id "bg" not found');
        return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext("2d");
    stars = Array();//������������ɵ��������ݣ�x,y,��С����ɫ���ٶȣ�
    stars_count = 300;//��������
    clearInterval(interval);
}

function makeStars(){//���������������
    if (!canvas) return;
    for(var i=0;i<stars_count;i++)
    {
        let x=Math.random() * canvas.offsetWidth;
        let y = Math.random() * canvas.offsetHeight;
        let radius = Math.random()*0.8;
        let color="rgba("+Math.random()*255+","+Math.random()*255+","+Math.random()*255+",0.8)";
        let speed=Math.random()*0.5;
        let arr={'x':x,'y':y,'radius':radius,'color':color,'speed':speed};//��x,y,��С����ɫ���ٶȣ�
        stars.push(arr);//������ɵ��������ݴ�������
    }
}

function drawStars(){//�����ǻ���������
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

window.onresize = function(){//���ڴ�С�����仯ʱ�������������������
    ini();
    makeStars();
    interval=setInterval(function(){drawStars();},50);
}