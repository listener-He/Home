// 关于页面JavaScript功能 - 现代动态版本

$(document).ready(function() {
    initThemeByTime();
    initMotionController();
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
    var cards = $('.social-card');
    var rings = [130, 180, 230];
    var golden = 137.5;
    var speedBase = 16;
    cards.each(function(idx) {
        var ring = rings[idx % rings.length];
        var angle = (idx * golden) % 360;
        var speed = speedBase + (idx % rings.length) * 4;
        $(this).css({
            '--radius': ring + 'px',
            '--phase': angle + 'deg',
            '--speed': speed + 's'
        });
        this.style.setProperty('animation', 'orbit var(--speed) linear infinite');
        this.style.setProperty('transform', 'translate(-50%, -50%) rotate(var(--phase)) translateX(var(--radius)) rotate(calc(-1 * var(--phase)))');
    });
    
    // 为技术标签设置随机动画延迟
    $('.cloud-tag').each(function(index) {
        var randomDelay = Math.random() * 3;
        $(this).css('animation-delay', randomDelay + 's');
    });
    
    $('.timeline-item').each(function(index) {
        var randomDelay = index * 0.2 + Math.random() * 0.5;
        $(this).css('transition-delay', randomDelay + 's');
    });
}

function initMotionController() {
    var isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var supportsBackdrop = (window.CSS && (CSS.supports('backdrop-filter: blur(1px)') || CSS.supports('-webkit-backdrop-filter: blur(1px)')));

    var root = document.documentElement;
    root.setAttribute('data-motion', reduced ? 'reduced' : (isMobile ? 'mobile' : 'desktop'));
    root.classList.toggle('motion-mobile', isMobile && !reduced);
    root.classList.toggle('motion-desktop', !isMobile && !reduced);
    root.classList.toggle('motion-reduced', reduced);

    if (!supportsBackdrop) {
        root.style.setProperty('--glass-blur', '0px');
        root.style.setProperty('--glass-alpha', '0.18');
    }
}

// GitHub 统计信息
function initGitHubStats() {
    var username = 'listener-He';
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
        error: function() {
            fetch('data/github_user.json')
                .then(function(res) { return res.json(); })
                .then(function(json) { displayGitHubProfile(json); })
                .catch(function() {
                    var fallbackData = {
                        name: 'Honesty',
                        login: 'listener-He',
                        bio: '开发者',
                        avatar_url: 'https://avatars.githubusercontent.com/u/39252579?v=4',
                        public_repos: 0,
                        followers: 0,
                        following: 0
                    };
                    displayGitHubProfile(fallbackData);
                });
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
    $('#github-repos').text(data.public_repos);
    $('#github-followers').text(data.followers);
    
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
        error: function() {
            fetch('data/github_repos.json')
                .then(function(res) { return res.json(); })
                .then(function(json) { displayProjects(json); })
                .catch(function() { displayProjects([]); });
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
        
        var starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Star" role="img"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"></path></svg>';
        var forkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Fork" role="img"><path d="M7 4a3 3 0 106 0 3 3 0 00-6 0zm10 0a3 3 0 106 0 3 3 0 00-6 0v6a3 3 0 01-3 3H7"></path></svg>';
        projectsHtml += '<div class="project-card" onclick="window.open(\'' + repo.html_url + '\', \'_blank\')">' +
            '<div class="project-header">' +
                '<div>' +
                    '<h3 class="project-title">' + repo.name + '</h3>' +
                    '<p class="project-description">' + (repo.description || '暂无描述') + '</p>' +
                '</div>' +
                '<div class="project-stats">' +
                    '<span>' + starSvg + ' ' + (repo.stargazers_count || 0) + '</span>' +
                    '<span>' + forkSvg + ' ' + (repo.forks_count || 0) + '</span>' +
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
    
    fetch('data/articles.json')
        .then(function(res) { return res.json(); })
        .then(function(json) {
            localStorage.setItem(cacheKey, JSON.stringify(json));
            localStorage.setItem(cacheTimeKey, now.toString());
            displayBlogArticles(json);
        })
        .catch(function() { displayBlogArticles([]); });
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
    try {
        var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (isLocal) {
            renderCommentsFallback('评论系统暂不可用');
            return;
        }
        if (typeof Artalk === 'undefined') {
            renderCommentsFallback('评论系统加载失败');
            return;
        }
        var controller = new AbortController();
        var timer = setTimeout(function() { controller.abort(); }, 5000);
        fetch('https://artalk.hehouhui.cn/api/v2/conf', { signal: controller.signal })
          .then(function(res) {
            clearTimeout(timer);
            if (!res.ok) throw new Error('conf fetch failed');
            return res.json();
          })
          .then(function() {
            Artalk.init({
                el: '#artalk-container',
                pageKey: window.location.pathname,
                pageTitle: document.title,
                server: 'https://artalk.hehouhui.cn',
                site: 'Honesty的主页',
                placeholder: '来说点什么吧...',
                noComment: '暂无评论',
                sendBtn: '发送',
                darkMode: false,
                gravatar: { mirror: 'https://cravatar.cn/avatar/' },
                pagination: { pageSize: 20, readMore: true, autoLoad: true },
                heightLimit: { content: 300, children: 400 },
                imgUpload: false,
                preview: true,
                versionCheck: true
            });
          })
          .catch(function() { renderCommentsFallback('评论系统暂不可用'); });
    } catch (e) {
        renderCommentsFallback('评论系统异常');
    }
}

function renderCommentsFallback(msg) {
    var container = document.getElementById('artalk-container');
    if (!container) return;
    container.innerHTML = '<div class="error">' + (msg || '评论系统不可用') + '</div>';
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

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    if (!reduced && !isMobile) {
        initTechSphere(techItems);
        return;
    }
    var container = $('.cloud-wrapper');
    techItems.forEach(function(tech) {
        var el = $('<span class="cloud-tag" data-category="' + (categoryOf(tech.level)) + '" data-weight="' + weightOf(tech.level) + '">' + tech.name + '</span>');
        container.append(el);
    });
}

function categoryOf(level) {
    if (level === 'primary') return 'core';
    if (level === 'secondary') return 'backend';
    return 'ops';
}

function weightOf(level) {
    if (level === 'primary') return 5;
    if (level === 'secondary') return 3;
    return 2;
}

function initTechSphere(items) {
    var container = document.querySelector('.cloud-wrapper');
    if (!container) return;
    container.classList.add('sphere');
    var N = items.length;
    var tags = [];
    for (var i = 0; i < N; i++) {
        var item = items[i];
        var el = document.createElement('span');
        el.className = 'cloud-tag';
        el.textContent = item.name;
        el.setAttribute('data-category', categoryOf(item.level));
        el.setAttribute('data-weight', weightOf(item.level));
        el.style.left = '50%';
        el.style.top = '50%';
        container.appendChild(el);
        tags.push(el);
    }
    var radius = 220;
    var phiStep = Math.PI * (3 - Math.sqrt(5)); // golden angle
    tags.forEach(function(el, idx) {
        var y = 1 - (idx / (N - 1)) * 2;
        var r = Math.sqrt(1 - y * y);
        var theta = idx * phiStep;
        var x = Math.cos(theta) * r;
        var z = Math.sin(theta) * r;
        var tx = x * radius;
        var ty = y * radius;
        var tz = z * radius;
        el.style.position = 'absolute';
        el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,' + tz + 'px) translate(-50%, -50%)';
        el.style.willChange = 'transform';
        var depth = (z + 1) / 2; // 0..1
        var scale = 0.85 + depth * 0.3;
        var opacity = 0.7 + depth * 0.3;
        el.style.opacity = String(opacity);
        el.style.transform += ' scale(' + scale + ')';
        el.style.zIndex = String(Math.floor(100 + depth * 100));
    });
    var rotY = 0;
    var rotX = 8;
    function animate() {
        rotY += 0.3;
        container.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        requestAnimationFrame(animate);
    }
    container.style.transformStyle = 'preserve-3d';
    requestAnimationFrame(animate);
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

    var itemObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-entered');
                itemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.timeline-item').forEach(function(el) {
        itemObserver.observe(el);
    });

    // 数字动画
    function animateNumbers() {
        var root = document.documentElement;
        var reduced = root.classList.contains('motion-reduced');
        var isMobile = root.classList.contains('motion-mobile');
        $('.stat-number').each(function() {
            var $this = $(this);
            var target = parseInt($this.text().replace(/[^0-9]/g, ''));
            if (!target || reduced || isMobile) {
                if (!isNaN(target)) {
                    $this.text(target.toLocaleString());
                }
                return;
            }
            var start = 0;
            var startTs;
            var duration = 1200;
            function step(ts) {
                if (!startTs) startTs = ts;
                var p = Math.min(1, (ts - startTs) / duration);
                var val = Math.floor(start + (target - start) * p);
                $this.text(val.toLocaleString());
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
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
 '    color: #fff;' +
 '}' +
 '.github-bio {' +
 '    color: rgba(255, 255, 255, 0.8);' +
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
 '    color: #fff;' +
 '}' +
 '.stat-item .stat-label {' +
 '    font-size: 0.8rem;' +
 '    color: rgba(255, 255, 255, 0.8);' +
 '}' +
 '.commits-stats h3 {' +
 '    margin-bottom: 1rem;' +
 '    color: #fff;' +
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
 '    color: rgba(255, 255, 255, 0.8);' +
 '}' +
 '.commit-bar {' +
 '    flex: 1;' +
 '    height: 8px;' +
 '    background: rgba(255, 255, 255, 0.1);' +
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
 '    color: #fff;' +
 '}' +
 '.error {' +
 '    text-align: center;' +
 '    color: rgba(255, 255, 255, 0.5);' +
 '    font-style: italic;' +
 '    padding: 2rem;' +
 '}' +
 '.project-updated {' +
 '    margin-top: 1rem;' +
 '    font-size: 0.8rem;' +
 '    color: rgba(255, 255, 255, 0.8);' +
 '}' +
 '.article-category {' +
 '    background: rgba(102, 126, 234, 0.2);' +
 '    color: #fff;' +
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
                '<img src="https://blog-file.hehouhui.cn/wechat/mp-honesy.jpg" alt="微信公众号二维码" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'block\';">' +
                '<div style="display: none; padding: 2rem; text-align: center; color: rgba(255, 255, 255, 0.8);">二维码加载失败<br>请搜索公众号：技术分享小站</div>' +
            '</div>' +
            '<p style="margin-top: 1rem; color: rgba(255, 255, 255, 0.8); text-align: center;">扫码关注获取最新技术文章</p>' +
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

// 兼容移动端的微信二维码显示功能
function showWechatQR() {
    // 在移动设备上使用模态框
    if (window.innerWidth <= 768) {
        showWeChatModal();
    } else {
        // 在桌面设备上使用原来的弹窗
        var modal = document.getElementById("wechat-modal");
        if (modal) {
            modal.style.display = "block";
        }
    }
}

function hideWechatQR() {
    var modal = document.getElementById("wechat-modal");
    if (modal) {
        modal.style.display = "none";
    }
}
function initThemeByTime() {
    var hour = new Date().getHours();
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var night = hour >= 18 || prefersDark;
    var root = document.documentElement;
    root.classList.toggle('theme-night', night);
    root.classList.toggle('theme-day', !night);
}