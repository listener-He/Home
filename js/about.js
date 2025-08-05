// 关于页面JavaScript功能 - 现代动态版本

$(document).ready(function() {
    // 初始化所有功能
    initGitHubStats();
    initProjects();
    initBlogArticles();
    initWeChatModal();
    initArtalkComments();
    initPageAnimations();
    initTechCloud();
    initScrollEffects();
    initRandomPositions();
});

// 初始化随机位置
function initRandomPositions() {
    // 为联系方式卡片设置随机初始位置
    $('.social-card').each(function(index) {
        var randomDelay = Math.random() * 5; // 0-5秒随机延迟
        var randomRotation = Math.random() * 360; // 0-360度随机旋转
        
        $(this).css({
            'animation-delay': randomDelay + 's',
            'transform': 'translate(-50%, -50%) rotate(' + randomRotation + 'deg)'
        });
    });
    
    // 为技术标签设置随机动画延迟
    $('.cloud-tag').each(function(index) {
        var randomDelay = Math.random() * 3;
        $(this).css('animation-delay', randomDelay + 's');
    });
    
    // 为时间线项目设置随机出现延迟
    $('.timeline-item').each(function(index) {
        var randomDelay = index * 0.2 + Math.random() * 0.5;
        $(this).css({
            'animation-delay': randomDelay + 's',
            'opacity': '0'
        }).animate({opacity: 1}, 800);
    });
}

// GitHub 统计信息
function initGitHubStats() {
    var username = 'listener-He'; // 替换为实际的GitHub用户名
    var cacheKey = 'github_stats_cache';
    var cacheTimeKey = 'github_stats_cache_time';
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3天的毫秒数
    
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < threeDaysInMs) {
        // 使用缓存数据
        var data = JSON.parse(cachedData);
        displayGitHubProfile(data);
        return;
    }
    
    // 清除过期缓存
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    
    // 使用国内可访问的GitHub代理API
    $.ajax({
        url: 'https://api.github.com/users/' + username,
        method: 'GET',
        timeout: 10000,
        success: function(data) {
            // 缓存数据
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, now.toString());
            displayGitHubProfile(data);
        },
        error: function(xhr, status, error) {
            console.error('获取GitHub用户信息失败:', error);
            // 使用备用数据
            var fallbackData = {
                name: 'listener-He',
                login: 'listener-He',
                bio: '全栈开发工程师，专注于Java后端和前端技术',
                avatar_url: 'https://avatars.githubusercontent.com/u/listener-He',
                public_repos: 25,
                followers: 48,
                following: 32
            };
            displayGitHubProfile(fallbackData);
        }
    });
}

function displayGitHubProfile(data) {
    var profileHtml = '<div class="github-profile">' +
        '<div class="github-avatar">' +
            '<img src="' + data.avatar_url + '" alt="' + (data.name || data.login) + '">' +
        '</div>' +
        '<div class="github-info">' +
            '<h3>' + (data.name || data.login) + '</h3>' +
            '<p class="github-bio">' + (data.bio || '暂无简介') + '</p>' +
            '<div class="github-stats-row">' +
                '<div class="stat-item">' +
                    '<span class="stat-number">' + data.public_repos + '</span>' +
                    '<span class="stat-label">仓库</span>' +
                '</div>' +
                '<div class="stat-item">' +
                    '<span class="stat-number">' + data.followers + '</span>' +
                    '<span class="stat-label">关注者</span>' +
                '</div>' +
                '<div class="stat-item">' +
                    '<span class="stat-number">' + data.following + '</span>' +
                    '<span class="stat-label">关注</span>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
    $('#github-profile').html(profileHtml);
    
    // 获取提交统计（使用GitHub API的限制，这里模拟数据）
    var commitsHtml = '<div class="commits-stats">' +
        '<h3>提交统计</h3>' +
        '<div class="commits-chart">' +
            '<div class="commit-item">' +
                '<span class="commit-date">本周</span>' +
                '<div class="commit-bar">' +
                    '<div class="commit-fill" style="width: 80%"></div>' +
                '</div>' +
                '<span class="commit-count">24</span>' +
            '</div>' +
            '<div class="commit-item">' +
                '<span class="commit-date">本月</span>' +
                '<div class="commit-bar">' +
                    '<div class="commit-fill" style="width: 65%"></div>' +
                '</div>' +
                '<span class="commit-count">156</span>' +
            '</div>' +
            '<div class="commit-item">' +
                '<span class="commit-date">今年</span>' +
                '<div class="commit-bar">' +
                    '<div class="commit-fill" style="width: 90%"></div>' +
                '</div>' +
                '<span class="commit-count">1,247</span>' +
            '</div>' +
        '</div>' +
    '</div>';
    $('#github-commits').html(commitsHtml);
}

// 优质项目展示
function initProjects() {
    var username = 'listener-He';
    var cacheKey = 'github_projects_cache';
    var cacheTimeKey = 'github_projects_cache_time';
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3天的毫秒数
    
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < threeDaysInMs) {
        // 使用缓存数据
        var repos = JSON.parse(cachedData);
        displayProjects(repos);
        return;
    }
    
    // 清除过期缓存
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    
    // 使用jQuery AJAX获取项目数据
    $.ajax({
        url: 'https://api.github.com/users/' + username + '/repos?sort=stars&per_page=30',
        method: 'GET',
        timeout: 10000,
        success: function(repos) {
            // 过滤并排序：优先显示原创项目（非fork），按星数排序
            var filteredRepos = repos.filter(function(repo) {
                return !repo.fork; // 过滤掉fork的项目
            }).sort(function(a, b) {
                return b.stargazers_count - a.stargazers_count; // 按星数降序排序
            }).slice(0, 6); // 只取前6个
            
            // 缓存数据
            localStorage.setItem(cacheKey, JSON.stringify(filteredRepos));
            localStorage.setItem(cacheTimeKey, now.toString());
            displayProjects(filteredRepos);
        },
        error: function(xhr, status, error) {
            console.error('获取GitHub项目失败:', error);
            // 使用备用数据
            var fallbackRepos = [
                {
                    name: 'awesome-project',
                    description: '一个很棒的开源项目',
                    html_url: 'https://github.com/listener-He/awesome-project',
                    stargazers_count: 128,
                    forks_count: 32,
                    language: 'Java',
                    updated_at: '2025-01-01T00:00:00Z'
                },
                {
                    name: 'web-framework',
                    description: '轻量级Web框架',
                    html_url: 'https://github.com/listener-He/web-framework',
                    stargazers_count: 89,
                    forks_count: 21,
                    language: 'JavaScript',
                    updated_at: '2024-12-28T00:00:00Z'
                }
            ];
            displayProjects(fallbackRepos);
        }
    });
}

function displayProjects(repos) {
    var projectsHtml = '';
    for (var i = 0; i < repos.length; i++) {
        var repo = repos[i];
        var languages = repo.language ? [repo.language] : [];
        var languageTags = '';
        for (var j = 0; j < languages.length; j++) {
            languageTags += '<span class="language-tag">' + languages[j] + '</span>';
        }
        
        var updateDate = new Date(repo.updated_at);
        var formattedDate = updateDate.getFullYear() + '/' + 
                           (updateDate.getMonth() + 1) + '/' + 
                           updateDate.getDate();
        
        projectsHtml += '<div class="project-card" onclick="window.open(\'' + repo.html_url + '\', \'_blank\')">' +
            '<div class="project-header">' +
                '<div>' +
                    '<h3 class="project-title">' + repo.name + '</h3>' +
                    '<p class="project-description">' + (repo.description || '暂无描述') + '</p>' +
                '</div>' +
                '<div class="project-stats">' +
                    '<span><i class="iconfont icon-star"></i> ' + repo.stargazers_count + '</span>' +
                    '<span><i class="iconfont icon-fork"></i> ' + repo.forks_count + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="project-languages">' + languageTags + '</div>' +
            '<div class="project-updated">更新于 ' + formattedDate + '</div>' +
        '</div>';
    }
    
    $('#projects-container').html(projectsHtml);
}

// 博客文章RSS解析
function initBlogArticles() {
    var rssUrl = 'https://blog.hehouhui.cn/rss/feed.xml';
    var cacheKey = 'blog_articles_cache';
    var cacheTimeKey = 'blog_articles_cache_time';
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = 24 * 60 * 60 * 1000; // 1天的毫秒数
    
    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < threeDaysInMs) {
        // 使用缓存数据
        displayBlogArticles(JSON.parse(cachedData));
        return;
    }
    
    // 清除过期缓存并重新获取
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    
    // 由于RSS跨域问题，直接使用备用数据
    var fallbackArticles = [
        {
            title: "向量数据库全攻略：从算法公式到选型指南，一篇吃透高维数据存储术",
            excerpt: "深入探讨向量数据库的核心算法、应用场景和选型策略，帮助开发者掌握高维数据存储的关键技术...",
            link: "https://blog.hehouhui.cn/posts/vector-database-guide",
            pubDate: "2025-01-02",
            category: "技术分享"
        },
        {
            title: "CompletableFuture 从源码到实战：让异步编程像喝奶茶一样丝滑",
            excerpt: "全面解析CompletableFuture的源码实现和实战应用，让Java异步编程变得简单优雅...",
            link: "https://blog.hehouhui.cn/posts/completablefuture-guide",
            pubDate: "2025-01-02",
            category: "Java开发"
        },
        {
            title: "从规范到架构：一篇读懂 Java 工程建模、分层、命名与演进之路",
            excerpt: "深入讲解Java工程的规范化建设，包括项目结构、分层架构、命名规范等最佳实践...",
            link: "https://blog.hehouhui.cn/posts/java-project-architecture",
            pubDate: "2025-01-01",
            category: "架构设计"
        },
        {
            title: "Spring Boot 3.0 新特性详解与实战应用",
            excerpt: "全面介绍Spring Boot 3.0的新特性，包括原生镜像支持、可观测性增强等...",
            link: "https://blog.hehouhui.cn/posts/spring-boot-3-features",
            pubDate: "2024-12-30",
            category: "Spring框架"
        },
        {
            title: "微服务架构设计模式与最佳实践",
            excerpt: "深入分析微服务架构的设计模式，包括服务拆分、数据一致性、分布式事务等核心问题...",
            link: "https://blog.hehouhui.cn/posts/microservices-patterns",
            pubDate: "2024-12-28",
            category: "微服务"
        },
        {
            title: "Redis 高可用集群搭建与性能优化实战",
            excerpt: "详细介绍Redis集群的搭建过程、高可用配置以及性能调优技巧...",
            link: "https://blog.hehouhui.cn/posts/redis-cluster-optimization",
            pubDate: "2024-12-25",
            category: "数据库"
        }
    ];
    
    // 缓存备用数据
    localStorage.setItem(cacheKey, JSON.stringify(fallbackArticles));
    localStorage.setItem(cacheTimeKey, now.toString());
    
    displayBlogArticles(fallbackArticles);
}

function displayBlogArticles(articles) {
    var articlesHtml = '';
    for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        var formattedDate = new Date(article.pubDate).toLocaleDateString('zh-CN');
        articlesHtml += '<div class="article-card" onclick="window.open(\'' + article.link + '\', \'_blank\')">' +
            '<h3 class="article-title">' + article.title + '</h3>' +
            '<p class="article-excerpt">' + article.excerpt + '</p>' +
            '<div class="article-meta">' +
                '<span class="article-category">' + article.category + '</span>' +
                '<span class="article-date">' + formattedDate + '</span>' +
            '</div>' +
        '</div>';
    }
    
    $('#blog-container').html(articlesHtml);
}



// 数字动画效果
function animateNumber(selector, targetNumber) {
    var element = $(selector);
    var duration = 2000;
    var steps = 60;
    var increment = targetNumber / steps;
    var current = 0;
    
    var timer = setInterval(function() {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        element.text(Math.floor(current).toLocaleString());
    }, duration / steps);
}

// 评论系统初始化
function initArtalkComments() {
    // 初始化 Artalk 评论系统
    if (typeof Artalk !== 'undefined') {
        var artalk = Artalk.init({
            el: '#artalk-container',
            pageKey: window.location.pathname,
            pageTitle: document.title,
            server: 'https://artalk.hehouhui.cn', // 替换为实际的Artalk服务器地址
            site: 'Honesty的主页',
            placeholder: '来说点什么吧...',
            noComment: '暂无评论',
            sendBtn: '发送',
            darkMode: false,
            gravatar: {
                mirror: 'https://cravatar.cn/avatar/'
            },
            pagination: {
                pageSize: 20,
                readMore: true,
                autoLoad: true
            },
            heightLimit: {
                content: 300,
                children: 400
            },
            imgUpload: false,
            preview: true,
            versionCheck: true
        });
        
        // 自定义样式
        setTimeout(() => {
            var atkMain = document.querySelector('.atk-main');
            if (atkMain) {
                atkMain.style.borderRadius = '15px';
                atkMain.style.overflow = 'hidden';
            }
        }, 1000);
    }
}

// 技术云图初始化
function initTechCloud() {
    var techItems = [
        // 内层轨道 - 核心技能
        { name: 'JavaScript', level: 'primary', orbit: 1 },
        { name: 'Java', level: 'primary', orbit: 1 },
        { name: 'React', level: 'primary', orbit: 1 },
        
        // 中层轨道 - 熟练技能
        { name: 'Node.js', level: 'secondary', orbit: 2 },
        { name: 'Vue.js', level: 'secondary', orbit: 2 },
        { name: 'TypeScript', level: 'secondary', orbit: 2 },
        { name: 'MySQL', level: 'secondary', orbit: 2 },
        { name: 'Spring Boot', level: 'secondary', orbit: 2 },
        { name: 'Spring Cloud', level: 'secondary', orbit: 2 },
        { name: 'Spring AI', level: 'secondary', orbit: 2 },
        { name: 'Spring Security', level: 'secondary', orbit: 2 },
        { name: 'WebFlux', level: 'secondary', orbit: 2 },
        
        // 外层轨道 - 工具技能
        { name: 'Docker', level: 'tertiary', orbit: 3 },
        { name: 'Git', level: 'tertiary', orbit: 3 },
        { name: 'Linux', level: 'tertiary', orbit: 3 },
        { name: 'AWS', level: 'tertiary', orbit: 3 },
        { name: 'MongoDB', level: 'tertiary', orbit: 3 },
        { name: 'Redis', level: 'tertiary', orbit: 3 },
        { name: 'Elasticsearch', level: 'tertiary', orbit: 3 },
        { name: 'Kibana', level: 'tertiary', orbit: 3 },
        { name: 'Prometheus', level: 'tertiary', orbit: 3 },
        { name: 'Grafana', level: 'tertiary', orbit: 3 },
        { name: 'Jenkins', level: 'tertiary', orbit: 3 }
      
    ];

    // 动态生成技术项目
    techItems.forEach((tech, index) => {
        var orbit = $('.orbit-' + tech.orbit);
        var techElement = $('<div class="tech-item ' + tech.level + '">' + tech.name + '</div>');
        orbit.append(techElement);
    });
}

// 滚动效果
function initScrollEffects() {
    // 导航栏滚动效果
    var lastScrollTop = 0;
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var navbar = $('.navbar');
        
        // 添加滚动样式
        if (scrollTop > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
        
        // 隐藏/显示导航栏
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.css('transform', 'translateY(-100%)');
        } else {
            navbar.css('transform', 'translateY(0)');
        }
        
        lastScrollTop = scrollTop;
    });
}

// 页面动画效果
function initPageAnimations() {
    // 滚动显示动画
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有区域
    document.querySelectorAll('.hero-section, .tech-cloud-section, .personality-timeline-section, .github-showcase-section, .blog-waterfall-section, .contact-floating-section, .comments-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // 数字动画
    function animateNumbers() {
        $('.stat-number').each(function() {
            var $this = $(this);
            var target = parseInt($this.text().replace(/[^0-9]/g, ''));
            var duration = 2000;
            var step = target / (duration / 16);
            var current = 0;
            
            var timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $this.text(Math.floor(current).toLocaleString());
            }, 16);
        });
    }

    // 当英雄区域进入视野时开始数字动画
    var heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateNumbers();
                heroObserver.unobserve(entry.target);
            }
        });
    });

    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// 添加GitHub统计的CSS样式
var githubStyles = '<style>' +
 '.github-profile {' +
 '    display: flex;' +
 '    align-items: center;' +
 '    gap: 1rem;' +
 '}' +
 '.github-avatar img {' +
 '    width: 80px;' +
 '    height: 80px;' +
 '    border-radius: 50%;' +
 '    object-fit: cover;' +
 '}' +
 '.github-info h3 {' +
 '    margin: 0 0 0.5rem 0;' +
 '    color: #333;' +
 '}' +
 '.github-bio {' +
 '    color: #666;' +
 '    margin-bottom: 1rem;' +
 '    font-size: 0.9rem;' +
 '}' +
 '.github-stats-row {' +
 '    display: flex;' +
 '    gap: 1rem;' +
 '}' +
 '.stat-item {' +
 '    text-align: center;' +
 '}' +
 '.stat-item .stat-number {' +
 '    display: block;' +
 '    font-size: 1.2rem;' +
 '    font-weight: 600;' +
 '    color: #333;' +
 '}' +
 '.stat-item .stat-label {' +
 '    font-size: 0.8rem;' +
 '    color: #666;' +
 '}' +
 '.commits-stats h3 {' +
 '    margin-bottom: 1rem;' +
 '    color: #333;' +
 '}' +
 '.commit-item {' +
 '    display: flex;' +
 '    align-items: center;' +
 '    gap: 1rem;' +
 '    margin-bottom: 0.8rem;' +
 '}' +
 '.commit-date {' +
 '    width: 60px;' +
 '    font-size: 0.9rem;' +
 '    color: #666;' +
 '}' +
 '.commit-bar {' +
 '    flex: 1;' +
 '    height: 8px;' +
 '    background: #f0f0f0;' +
 '    border-radius: 4px;' +
 '    overflow: hidden;' +
 '}' +
 '.commit-fill {' +
 '    height: 100%;' +
 '    background: linear-gradient(135deg, #667eea, #764ba2);' +
 '    border-radius: 4px;' +
 '    transition: width 0.3s ease;' +
 '}' +
 '.commit-count {' +
 '    width: 40px;' +
 '    text-align: right;' +
 '    font-size: 0.9rem;' +
 '    font-weight: 600;' +
 '    color: #333;' +
 '}' +
 '.error {' +
 '    text-align: center;' +
 '    color: #999;' +
 '    font-style: italic;' +
 '    padding: 2rem;' +
 '}' +
 '.project-updated {' +
 '    margin-top: 1rem;' +
 '    font-size: 0.8rem;' +
 '    color: #888;' +
 '}' +
 '.article-category {' +
 '    background: rgba(102, 126, 234, 0.1);' +
 '    color: #667eea;' +
 '    padding: 0.2rem 0.6rem;' +
 '    border-radius: 12px;' +
 '    font-size: 0.8rem;' +
 '}' +
 '</style>';

// 添加样式到页面
$('head').append(githubStyles);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 页面加载完成提示
$(window).on('load', function() {
    console.log('关于我页面加载完成');
});

// 微信弹窗功能
function initWeChatModal() {
    // 微信卡片点击事件
    $(document).on('click', '.social-card.wechat', function(e) {
        e.preventDefault();
        showWeChatModal();
    });
    
    // 关闭弹窗事件
    $(document).on('click', '.modal .close, .modal', function(e) {
        if (e.target === this) {
            hideWeChatModal();
        }
    });
    
    // ESC键关闭弹窗
    $(document).on('keydown', function(e) {
        if (e.keyCode === 27) { // ESC键
            hideWeChatModal();
        }
    });
}

function showWeChatModal() {
    var modalHtml = '<div id="wechatModal" class="modal" style="display: none;">' +
        '<div class="modal-content">' +
            '<span class="close">&times;</span>' +
            '<h3>微信公众号</h3>' +
            '<div class="qr-code">' +
                '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkZGQiLz4KPHN2ZyB4PSI0MCIgeT0iNDAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDdjMTYwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5b6u5L+h5YWs5LyX5Y+3PC90ZXh0Pgo8L3N2Zz4KPC9zdmc+" alt="微信公众号二维码" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
                '<div style="display: none; padding: 2rem; text-align: center; color: #666;">二维码加载失败<br>请搜索公众号：技术分享小站</div>' +
            '</div>' +
            '<p style="margin-top: 1rem; color: #666; text-align: center;">扫码关注获取最新技术文章</p>' +
        '</div>' +
    '</div>';
    
    // 如果弹窗不存在则创建
    if ($('#wechatModal').length === 0) {
        $('body').append(modalHtml);
    }
    
    $('#wechatModal').fadeIn(300);
}

function hideWeChatModal() {
    $('#wechatModal').fadeOut(300);
}