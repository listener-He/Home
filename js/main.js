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
		console.error(err);
	})

	/**
	 *  自定义壁纸
	 */
	var imgUrls = JSON.parse(sessionStorage.getItem("imgUrls"));
	var index = sessionStorage.getItem("index");
	var $panel = $('#panel');
	var date = new Date();
    var dayOfWeek = date.getDay() + 1;
	if (imgUrls == null) {
		imgUrls = new Array();
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
