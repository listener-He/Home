$(document).ready(function () {
    function animateDynamicIsland(text = '正在加载...') {
        const island = document.querySelector('.dynamic-island');
        const content = island.querySelector('.content');

        content.textContent = text;
        island.classList.add('expand');

        setTimeout(() => {
            island.classList.remove('expand');
        }, 2000); // 2秒后收缩
    }

    function openSimulator(url) {
        const sim = document.querySelector('.iphone-simulator');
        const iframe = document.getElementById('moment-frame');
        const skeleton = document.querySelector('.skeleton');
        const browserView = document.querySelector('.browser-view');

        sim.style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';

        iframe.src = url;

        iframe.onload = () => {
            setTimeout(() => {
                skeleton.style.display = 'none';
                browserView.classList.add('loaded');
            }, 300); // 延迟更自然
        };
    }

    // 处理瞬间链接点击事件
    $('.moments-link').on('click', function (e) {
        e.preventDefault(); // 阻止默认跳转

        // 获取链接地址
        var url = "https://moments.hehouhui.cn";
        // 判断是否是移动端
        var isMobile = /iPhone|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // 移动端：直接跳转
            window.location.href = url;
        } else {
            animateDynamicIsland('正在加载瞬间...');
            // PC端：在模拟器中显示
            openSimulator(url);
        }
    });

    // 关闭按钮点击事件
    $('.close-btn').on('click', function () {
        $('.iphone-simulator').hide();
        $('.overlay').hide();
        $('.iphone-simulator').removeClass('visible');
        $('#moment-frame').attr('src', ''); // 清空iframe内容
    });

    // 遮罩层点击事件 点击空白处关闭模拟器
    $('.overlay').on('click', function () {
        $(this).hide();
        $('.iphone-simulator').hide();
        $('.iphone-simulator').removeClass('visible');
        $('#moment-frame').attr('src', '');
    });

    const iframe = document.getElementById('moment-frame');
    document.querySelector('.back-btn').addEventListener('click', () => {
        try {
            // 安全地尝试让 iframe 内部回退
            if (iframe.contentWindow && iframe.contentWindow.history.length > 1) {
                iframe.contentWindow.history.back();
            }
        } catch (e) {
            // 跨域或权限问题
            console.error('无法回退：', e);
        }
    });
});