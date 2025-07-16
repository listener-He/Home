$(document).ready(function () {
    // 处理瞬间链接点击事件
    $('.moments-link').on('click', function (e) {
        e.preventDefault(); // 阻止默认跳转

        // 获取链接地址
        var url = "https://moments.hehouhui.cn";
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
});