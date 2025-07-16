var iUp = (function () {
	var t = 0,
		d = 150,
		clean = function () {
			t = 0;
		},
		up = function (e) {
			setTimeout(function () {
				$(e).addClass("up")
			}, t);
			t += d;
		},
		down = function (e) {
			$(e).removeClass("up");
		},
		toggle = function (e) {
			setTimeout(function () {
				$(e).toggleClass("up")
			}, t);
			t += d;
		};
	return {
		clean: clean,
		up: up,
		down: down,
		toggle: toggle
	}
})();

$(document).ready(function () {

	// 获取一言数据
	fetch('https://v1.hitokoto.cn?c=c&c=d&c=i&c=k').then(function (res) {
		return res.json();
	}).then(function (e) {
		$('#description').html(e.hitokoto + "<br/> -「<strong>" + e.from + "</strong>」")
	}).catch(function (err) {
		console.error("获取一言数据失败", err);
	})

	/**
	 *  自定义壁纸
	 */
	var imgUrls = JSON.parse(sessionStorage.getItem("imgUrls"));
	var index = sessionStorage.getItem("index");
	var $panel = $('#panel');
	var date = new Date();
    var dayOfWeek = date.getDay();
	if (imgUrls == null) {
		imgUrls = [];
		index = 0;
        for (let i = 1; i < 8; i++) {
            imgUrls.push("https://blog-file.hehouhui.cn/bj/"+i+".jpg");
        }
        sessionStorage.setItem("imgUrls", JSON.stringify(imgUrls));
        // sessionStorage.setItem("index", index);
	} else {
//		if (index == imgUrls.length)
//			index = 0;
//		else
//			index++;
//		sessionStorage.setItem("index", index);
	}

	var imgUrl = imgUrls[dayOfWeek];
    $panel.css("background", "url('" + imgUrl + "') center center no-repeat #666");
    $panel.css("background-size", "cover");

	$(".iUp").each(function (i, e) {
		iUp.up(e);
	});

	$(".js-avatar")[0].onload = function () {
		$(".js-avatar").addClass("show");
	}
});

$('.btn-mobile-menu__icon').click(function () {
	if ($('.navigation-wrapper').css('display') == "block") {
		$('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
			$('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
		});
		$('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

	} else {
		$('.navigation-wrapper').toggleClass('visible animated bounceInDown');
	}
	$('.btn-mobile-menu__icon').toggleClass('social iconfont icon-list social iconfont icon-ngleup animated fadeIn');
});

// 处理瞬间链接点击事件
$('.moments-link').on('click', function (e) {
  e.preventDefault(); // 阻止默认跳转
  
  // 获取链接地址
  var url = $(this).attr('href');
  console.log("当前用户UA-", navigator.userAgent)
  // 判断是否是移动端
  var isMobile = /iPhone|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 移动端：直接跳转
    window.location.href = url;
  } else {
    // PC端：在模拟器中显示
    $('#moment-frame').attr('src', url);
    $('.iphone-simulator').show();
    $('.overlay').show();
  }
});

// 关闭按钮点击事件
$('.close-btn').on('click', function () {
  $('.iphone-simulator').hide();
  $('.overlay').hide();
  $('#moment-frame').attr('src', ''); // 清空iframe内容
});

// 遮罩层点击事件
$('.overlay').on('click', function () {
  $(this).hide();
  $('.iphone-simulator').hide();
  $('#moment-frame').attr('src', '');
});
