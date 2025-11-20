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
    initTechCloud(); // 初始化技术云图
    initScrollEffects();
    initRandomPositions();
});

// 初始化随机位置
function initRandomPositions() {
    var cards = $('.social-card');
    var rings = SiteConfig.socialCards.rings;
    var golden = SiteConfig.socialCards.goldenAngle;
    var speedBase = SiteConfig.socialCards.baseSpeed;
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
    
    // 监听屏幕尺寸变化，重新初始化技术云
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            var newIsMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                isMobile = newIsMobile;
                initTechCloud();
            }
        }, 250);
    });
}

// GitHub 统计信息
function initGitHubStats() {
    var username = SiteConfig.github.username;
    var cacheKey = SiteConfig.github.cache.stats.key;
    var cacheTimeKey = SiteConfig.github.cache.stats.timeKey;
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = SiteConfig.github.cache.stats.expirationDays * 24 * 60 * 60 * 1000; // 3天的毫秒数
    
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
                        login: SiteConfig.github.username,
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
    initCommitStats(data.login || 'listener-He');
}

// 优质项目展示
function initProjects() {
    var username = SiteConfig.github.username;
    var cacheKey = SiteConfig.github.cache.projects.key;
    var cacheTimeKey = SiteConfig.github.cache.projects.timeKey;
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = SiteConfig.github.cache.projects.expirationDays * 24 * 60 * 60 * 1000; // 3天的毫秒数
    
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
            }).slice(0, 12); // 只取前12个
            
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
        
        // 处理项目描述，如果超过一定字符数则添加折叠功能
        var description = repo.description || '暂无描述';
        var isLongDescription = description.length > 100;
        var displayDescription = isLongDescription ? description.substring(0, 100) + '...' : description;
        
        var starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Star" role="img"><path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"></path></svg>';
        var forkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="Fork" role="img"><path d="M7 4a3 3 0 106 0 3 3 0 00-6 0zm10 0a3 3 0 106 0 3 3 0 00-6 0v6a3 3 0 01-3 3H7"></path></svg>';
        projectsHtml += '<div class="project-card" onclick="window.open(\'' + repo.html_url + '\', \'_blank\')">' +
            '<div class="project-header">' +
                '<div>' +
                    '<h3 class="project-title">' + repo.name + '</h3>' +
                    '<p class="project-description' + (isLongDescription ? ' collapsible' : '') + '" data-full-text="' + description + '" data-short-text="' + (isLongDescription ? description.substring(0, 100) : description) + '">' + displayDescription + 
                    (isLongDescription ? '<button class="toggle-description" onclick="toggleDescription(event, this)">更多<span class="arrow">▼</span></button>' : '') + '</p>' +
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

// 切换项目描述显示状态
function toggleDescription(event, button) {
    event.stopPropagation(); // 阻止事件冒泡，避免触发项目卡片的点击事件
    
    var description = button.parentElement;
    var fullText = description.getAttribute('data-full-text');
    var shortText = description.getAttribute('data-short-text');
    
    if (description.classList.contains('expanded')) {
        // 收起描述
        description.classList.remove('expanded');
        description.innerHTML = shortText + '... <button class="toggle-description" onclick="toggleDescription(event, this)">更多<span class="arrow">▼</span></button>';
    } else {
        // 展开描述
        description.classList.add('expanded');
        description.innerHTML = fullText + ' <button class="toggle-description" onclick="toggleDescription(event, this)">收起<span class="arrow">▲</span></button>';
    }
}

// 博客文章RSS解析
function initBlogArticles() {
    var rssUrl = SiteConfig.blog.rssUrl;
    var cacheKey = SiteConfig.blog.cache.key;
    var cacheTimeKey = SiteConfig.blog.cache.timeKey;
    
    // 检查缓存（3天有效期）
    var cachedData = localStorage.getItem(cacheKey);
    var cacheTime = localStorage.getItem(cacheTimeKey);
    var now = new Date().getTime();
    var threeDaysInMs = SiteConfig.blog.cache.expirationDays * 24 * 60 * 60 * 1000; // 1天的毫秒数
    
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
                server: SiteConfig.artalk.server,
                site: SiteConfig.artalk.site,
                placeholder: SiteConfig.artalk.placeholder,
                noComment: SiteConfig.artalk.noComment,
                sendBtn: SiteConfig.artalk.sendBtn,
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
    // 技术栈数据
    var techStack = SiteConfig.techStack;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    
    // 对于移动端或减少动画的情况，使用横向滚动
    if (isMobile || reduced) {
        initHorizontalTechCloud(techStack);
        return;
    }
    
    // PC端使用球状旋转效果
    initTechSphere(techStack);
}

// 移动端和平板的横向滚动技术云
function initHorizontalTechCloud(items) {
    var container = document.getElementById('tech-cloud-wrapper');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    container.classList.remove('sphere');
    
    // 按权重排序，确保重要的标签优先显示
    var sortedItems = items.slice().sort(function(a, b) {
        return b.weight - a.weight;
    });
    
    // 创建三行容器
    var row1 = document.createElement('div');
    var row2 = document.createElement('div');
    var row3 = document.createElement('div');
    
    row1.className = 'tech-row';
    row2.className = 'tech-row';
    row3.className = 'tech-row';
    
    // 将标签分配到三行中
    sortedItems.forEach(function(item, index) {
        var el = document.createElement('span');
        el.className = 'cloud-tag';
        el.textContent = item.name;
        el.setAttribute('data-category', item.category);
        el.setAttribute('data-weight', item.weight);
        
        // 根据索引分配到不同行
        if (index % 3 === 0) {
            row1.appendChild(el);
        } else if (index % 3 === 1) {
            row2.appendChild(el);
        } else {
            row3.appendChild(el);
        }
        
        // 为每个标签复制一个副本，实现无缝滚动效果
        var elClone = el.cloneNode(true);
        if (index % 3 === 0) {
            row1.appendChild(elClone);
        } else if (index % 3 === 1) {
            row2.appendChild(elClone);
        } else {
            row3.appendChild(elClone);
        }
    });
    
    container.appendChild(row1);
    container.appendChild(row2);
    container.appendChild(row3);
    
    // 设置不同的初始延迟时间
    setTimeout(function() {
        row1.classList.add('scrolling');
    }, 0);
    
    setTimeout(function() {
        row2.classList.add('scrolling');
    }, 500);
    
    setTimeout(function() {
        row3.classList.add('scrolling');
    }, 1000);
}

// PC端3D球状技术云
function initTechSphere(items) {
    var container = document.getElementById('tech-cloud-wrapper');
    if (!container) return;
    
    // 清空容器并添加球体类
    container.innerHTML = '';
    container.classList.add('sphere');
    
    // 创建标签元素
    var tags = [];
    items.forEach(function(item, index) {
        var el = document.createElement('div');
        el.className = 'cloud-tag';
        el.textContent = item.name;
        el.setAttribute('data-category', item.category);
        el.setAttribute('data-weight', item.weight);
        el.setAttribute('data-index', index);
        container.appendChild(el);
        tags.push(el);
    });
    
    // 球体参数
    var radius = 250; // 减小球体半径以适应容器并避免标签被遮挡
    var dtr = Math.PI / 180;
    var d = 300;
    var mcList = [];
    var active = false;
    var lasta = 0; // 初始值设为0
    var lastb = 0; // 初始值设为0
    var distr = true;
    var tspeed = 0.05; // 降低旋转速度，使动画更平滑
    var size = 250;
    var mouseX = 0;
    var mouseY = 0;
    var mouseDown = false;
    
    // 初始化标签位置
    tags.forEach(function(tag, i) {
        var phi = Math.acos(-1 + (2 * i) / tags.length);
        var theta = Math.sqrt(tags.length * Math.PI) * phi;
        
        var x = radius * Math.cos(theta) * Math.sin(phi);
        var y = radius * Math.sin(theta) * Math.sin(phi);
        var z = radius * Math.cos(phi);
        
        tag.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)';
        tag.style.opacity = '0.9';
        
        // 根据权重设置标签大小和最小宽度
        var weight = parseInt(tag.getAttribute('data-weight'));
        var scale = 0.6 + (weight * 0.12);
        // 按照规范设置标签尺寸
        var minWidth, minHeight, fontSize, padding;
        
        switch(weight) {
            case 5:
                minWidth = 120;
                minHeight = 55;
                fontSize = 16;
                padding = '12px 22px';
                break;
            case 4:
                minWidth = 110;
                minHeight = 50;
                fontSize = 15;
                padding = '11px 20px';
                break;
            case 3:
                minWidth = 100;
                minHeight = 45;
                fontSize = 14;
                padding = '10px 18px';
                break;
            case 2:
                minWidth = 90;
                minHeight = 40;
                fontSize = 13;
                padding = '9px 16px';
                break;
            case 1:
            default:
                minWidth = 85;
                minHeight = 38;
                fontSize = 12;
                padding = '8px 15px';
        }
        
        tag.style.transform += ' scale(' + scale + ')';
        tag.style.minWidth = minWidth + 'px';
        tag.style.minHeight = minHeight + 'px';
        tag.style.fontSize = fontSize + 'px';
        tag.style.padding = padding;
        
        // 设置z-index确保正确的层级显示
        tag.style.zIndex = Math.floor(z + radius);
        
        // 存储位置信息
        mcList.push({
            obj: tag,
            x: x,
            y: y,
            z: z
        });
    });
    
    // 鼠标交互
    container.addEventListener('mousedown', function(e) {
        mouseDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        e.preventDefault();
    });
    
    container.addEventListener('mousemove', function(e) {
        if (mouseDown) {
            lasta = (e.clientX - mouseX) * 0.0005; // 降低鼠标影响系数
            lastb = (e.clientY - mouseY) * 0.0005;
            mouseX = e.clientX;
            mouseY = e.clientY;
            e.preventDefault();
        }
    });
    
    container.addEventListener('mouseup', function(e) {
        mouseDown = false;
        e.preventDefault();
    });
    
    container.addEventListener('mouseleave', function() {
        mouseDown = false;
    });
    
    // 触摸交互
    container.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            mouseDown = true;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            e.preventDefault();
        }
    });
    
    container.addEventListener('touchmove', function(e) {
        if (mouseDown && e.touches.length > 0) {
            lasta = (e.touches[0].clientX - mouseX) * 0.0005; // 降低触摸影响系数
            lastb = (e.touches[0].clientY - mouseY) * 0.0005;
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
            e.preventDefault();
        }
    });
    
    container.addEventListener('touchend', function(e) {
        mouseDown = false;
        e.preventDefault();
    });
    
    // 自动旋转动画
    function update() {
        // 添加轻微的自动旋转，即使没有用户交互
        if (!mouseDown) {
            lasta = lasta * 0.98 + 0.0001; // 更轻微的自动旋转，逐渐减速
            lastb = lastb * 0.98;
        }
        
        // 限制旋转速度，防止过快
        lasta = Math.max(Math.min(lasta, 0.01), -0.01); // 限制在更小的范围内
        lastb = Math.max(Math.min(lastb, 0.01), -0.01);
        
        var a = lasta;
        var b = lastb;
        
        var c = 0;
        var sa = Math.sin(a);
        var ca = Math.cos(a);
        var sb = Math.sin(b);
        var cb = Math.cos(b);
        var sc = Math.sin(c);
        var cc = Math.cos(c);
        
        // 更新标签位置
        mcList.forEach(function(mc) {
            var rx = mc.x;
            var ry = mc.y * ca + mc.z * sa;
            var rz = mc.y * -sa + mc.z * ca;
            
            var nx = rx * cb + rz * sb;
            var ny = ry;
            var nz = rx * -sb + rz * cb;
            
            mc.x = nx;
            mc.y = ny;
            mc.z = nz;
            
            // 应用变换
            mc.obj.style.transform = 'translate3d(' + nx + 'px, ' + ny + 'px, ' + nz + 'px)';
            
            // 根据z轴位置设置缩放和透明度
            var scale = (nz + radius) / (2 * radius) * 0.6 + 0.7;
            var weight = parseInt(mc.obj.getAttribute('data-weight'));
            scale = scale * (0.6 + (weight * 0.12));
            
            mc.obj.style.transform += ' scale(' + scale + ')';
            mc.obj.style.opacity = 0.7 + (nz + radius) / (2 * radius) * 0.3;
            
            // 设置z-index确保正确的层级显示
            mc.obj.style.zIndex = Math.floor(nz + radius);
        });
        
        requestAnimationFrame(update);
    }
    
    // 启动动画
    requestAnimationFrame(update);
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
    
    // 确保在主题切换时技术标签颜色正确更新
    updateTechTagColors();
}

// 更新技术标签颜色以适配当前主题
function updateTechTagColors() {
    var root = document.documentElement;
    var isDayTheme = root.classList.contains('theme-day');
    
    var tags = document.querySelectorAll('.cloud-tag');
    tags.forEach(function(tag) {
        if (isDayTheme) {
            tag.style.color = 'var(--text-strong)';
        } else {
            tag.style.color = '#fff';
        }
    });
}

function initCommitStats(username) {
    var cacheKey = SiteConfig.github.cache.commits.key;
    var cacheTimeKey = SiteConfig.github.cache.commits.timeKey;
    var now = new Date().getTime();
    var oneDay = SiteConfig.github.cache.commits.expirationHours * 60 * 60 * 1000;
    var cached = localStorage.getItem(cacheKey);
    var cachedTime = localStorage.getItem(cacheTimeKey);
    if (cached && cachedTime && (now - parseInt(cachedTime)) < oneDay) {
        renderCommitStats(JSON.parse(cached));
        return;
    }
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    fetchCommitCounts(username).then(function(stats){
        localStorage.setItem(cacheKey, JSON.stringify(stats));
        localStorage.setItem(cacheTimeKey, now.toString());
        renderCommitStats(stats);
    }).catch(function(){
        fetch('data/github_commits.json')
            .then(function(res){ return res.json(); })
            .then(function(json){ renderCommitStats(json); })
            .catch(function(){ renderCommitStats({week:0,month:0,year:0}); });
    });
}

function fetchCommitCounts(username) {
    function fmt(d){
        var y=d.getFullYear();
        var m=('0'+(d.getMonth()+1)).slice(-2);
        var s=('0'+d.getDate()).slice(-2);
        return y+'-'+m+'-'+s;
    }
    var today = new Date();
    var weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()-6);
    var monthStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()-29);
    var yearStart = new Date(today.getFullYear(), 0, 1);
    var h = { 'Accept': 'application/vnd.github.cloak-preview+json' };
    function q(start,end){
        var url = 'https://api.github.com/search/commits?q=author:'+encodeURIComponent(username)+'+author-date:'+fmt(start)+'..'+fmt(end);
        return fetch(url,{ headers: h, method:'GET' }).then(function(r){ return r.json(); }).then(function(j){ return (j && typeof j.total_count==='number')? j.total_count : 0; });
    }
    return Promise.all([
        q(weekStart,today),
        q(monthStart,today),
        q(yearStart,today)
    ]).then(function(arr){
        return { week: arr[0], month: arr[1], year: arr[2], range: { week:{start:fmt(weekStart),end:fmt(today)}, month:{start:fmt(monthStart),end:fmt(today)}, year:{start:fmt(yearStart),end:fmt(today)} }, generated_at: new Date().toISOString() };
    });
}

function renderCommitStats(stats) {
    var w = parseInt(stats.week||0,10);
    var m = parseInt(stats.month||0,10);
    var y = parseInt(stats.year||0,10);
    function pct(v){
        var p = 0;
        if (y>0) p = Math.min(100, Math.max(5, Math.round(v*100/Math.max(y,1))));
        return p;
    }
    var commitsHtml = '<div class="commits-stats">'+
        '<h3>提交统计</h3>'+
        '<div class="commits-chart">'+
            '<div class="commit-item">'+
                '<span class="commit-date">本周</span>'+
                '<div class="commit-bar">'+
                    '<div class="commit-fill" style="width: '+pct(w)+'%"></div>'+
                '</div>'+
                '<span class="commit-count">'+w+'</span>'+
            '</div>'+
            '<div class="commit-item">'+
                '<span class="commit-date">本月</span>'+
                '<div class="commit-bar">'+
                    '<div class="commit-fill" style="width: '+pct(m)+'%"></div>'+
                '</div>'+
                '<span class="commit-count">'+m+'</span>'+
            '</div>'+
            '<div class="commit-item">'+
                '<span class="commit-date">今年</span>'+
                '<div class="commit-bar">'+
                    '<div class="commit-fill" style="width: 100%"></div>'+
                '</div>'+
                '<span class="commit-count">'+y+'</span>'+
            '</div>'+
        '</div>'+
    '</div>';
    $('#github-commits').html(commitsHtml);
}
