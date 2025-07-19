$(document).ready(function () {
    const iframe = document.getElementById('moment-frame');
    const momentsContainer = document.getElementById('moments-container');

    function animateIframe() {
        momentsContainer.style.display = 'block';
        momentsContainer.classList.add('visible');
    }

    function openMoments(url) {
        if (iframe.src == null || iframe.src === '' || iframe.src !== url) {
            iframe.src = url;

            iframe.onload = () => {
                setTimeout(() => {
                    animateIframe();
                }, 300); // 延迟更自然
            };
        } else {
            animateIframe();
        }
    }

    // 处理瞬间链接点击事件
    $('.moments-link').on('click', function (e) {
        e.preventDefault(); // 阻止默认跳转

        // 获取链接地址
        const url = "https://moments.hehouhui.cn";

        // 判断是否是移动端
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // 移动端：直接跳转
            window.location.href = url;
        } else {
            // PC端：在iframe中显示
            openMoments(url);
        }
    });

    // 关闭按钮点击事件
    $('.close-btn').on('click', function () {
        momentsContainer.classList.remove('visible');
        setTimeout(() => {
            momentsContainer.style.display = 'none';
        }, 500); // 等待动画结束后隐藏
    });

    // 遮罩层点击事件 点击空白处关闭模拟器
    $('.overlay').on('click', function () {
        momentsContainer.classList.remove('visible');
        setTimeout(() => {
            momentsContainer.style.display = 'none';
        }, 500); // 等待动画结束后隐藏
    });
});