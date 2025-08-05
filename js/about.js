// 关于页面JavaScript功能 - 现代动态版本

$(document).ready(function() {
    // 初始化所有功能
    initGitHubStats();
    initBlogArticles();
    initVisitorStats();
    initArtalkComments();
    initPageAnimations();
    initTechCloud();
    initScrollEffects();
});

// GitHub 统计信息
function initGitHubStats() {
    const username = 'listener-He'; // 替换为实际的GitHub用户名
    
    // 获取用户基本信息
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            const profileHtml = `
                <div class="github-profile">
                    <div class="github-avatar">
                        <img src="${data.avatar_url}" alt="${data.name}">
                    </div>
                    <div class="github-info">
                        <h3>${data.name || data.login}</h3>
                        <p class="github-bio">${data.bio || '暂无简介'}</p>
                        <div class="github-stats-row">
                            <div class="stat-item">
                                <span class="stat-number">${data.public_repos}</span>
                                <span class="stat-label">仓库</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${data.followers}</span>
                                <span class="stat-label">关注者</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${data.following}</span>
                                <span class="stat-label">关注</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#github-profile').html(profileHtml);
        })
        .catch(error => {
            console.error('获取GitHub用户信息失败:', error);
            $('#github-profile').html('<div class="error">加载GitHub信息失败</div>');
        });
    
    // 获取提交统计（使用GitHub API的限制，这里模拟数据）
    const commitsHtml = `
        <div class="commits-stats">
            <h3>提交统计</h3>
            <div class="commits-chart">
                <div class="commit-item">
                    <span class="commit-date">本周</span>
                    <div class="commit-bar">
                        <div class="commit-fill" style="width: 80%"></div>
                    </div>
                    <span class="commit-count">24</span>
                </div>
                <div class="commit-item">
                    <span class="commit-date">本月</span>
                    <div class="commit-bar">
                        <div class="commit-fill" style="width: 65%"></div>
                    </div>
                    <span class="commit-count">156</span>
                </div>
                <div class="commit-item">
                    <span class="commit-date">今年</span>
                    <div class="commit-bar">
                        <div class="commit-fill" style="width: 90%"></div>
                    </div>
                    <span class="commit-count">1,247</span>
                </div>
            </div>
        </div>
    `;
    $('#github-commits').html(commitsHtml);
}

// 优质项目展示
function initProjects() {
    const username = 'listener-He';
    
    fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`)
        .then(response => response.json())
        .then(repos => {
            const projectsHtml = repos.map(repo => {
                const languages = repo.language ? [repo.language] : [];
                return `
                    <div class="project-card" onclick="window.open('${repo.html_url}', '_blank')">
                        <div class="project-header">
                            <div>
                                <h3 class="project-title">${repo.name}</h3>
                                <p class="project-description">${repo.description || '暂无描述'}</p>
                            </div>
                            <div class="project-stats">
                                <span><i class="iconfont icon-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="iconfont icon-fork"></i> ${repo.forks_count}</span>
                            </div>
                        </div>
                        <div class="project-languages">
                            ${languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                        </div>
                        <div class="project-updated">
                            更新于 ${new Date(repo.updated_at).toLocaleDateString('zh-CN')}
                        </div>
                    </div>
                `;
            }).join('');
            
            $('#projects-container').html(projectsHtml);
        })
        .catch(error => {
            console.error('获取GitHub项目失败:', error);
            $('#projects-container').html('<div class="error">加载项目信息失败</div>');
        });
}

// 博客文章RSS解析
function initBlogArticles() {
    const rssUrl = 'https://blog.hehouhui.cn/rss/feed.xml';
    const cacheKey = 'blog_articles_cache';
    const cacheTimeKey = 'blog_articles_cache_time';
    
    // 检查缓存
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    const today = new Date().toDateString();
    
    if (cachedData && cacheTime === today) {
        // 使用缓存数据
        displayBlogArticles(JSON.parse(cachedData));
        return;
    }
    
    // 清除过期缓存并重新获取
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheTimeKey);
    
    // 使用代理服务获取RSS数据
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    
    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            const articles = Array.from(items).slice(0, 6).map(item => {
                const title = item.querySelector('title')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const category = item.querySelector('category')?.textContent || '技术分享';
                
                // 提取摘要（去除HTML标签）
                const excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                
                return {
                    title,
                    excerpt,
                    link,
                    pubDate: new Date(pubDate).toLocaleDateString('zh-CN'),
                    category
                };
            });
            
            // 缓存数据
            localStorage.setItem(cacheKey, JSON.stringify(articles));
            localStorage.setItem(cacheTimeKey, today);
            
            displayBlogArticles(articles);
        })
        .catch(error => {
            console.error('获取RSS数据失败:', error);
            // 降级到模拟数据
            const fallbackArticles = [
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
                }
            ];
            displayBlogArticles(fallbackArticles);
        });
}

function displayBlogArticles(articles) {
    const articlesHtml = articles.map(article => `
        <div class="article-card" onclick="window.open('${article.link}', '_blank')">
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-meta">
                <span class="article-category">${article.category}</span>
                <span class="article-date">${new Date(article.pubDate).toLocaleDateString('zh-CN')}</span>
            </div>
        </div>
    `).join('');
    
    $('#blog-container').html(articlesHtml);
}

// 访问统计（百度统计集成）
function initVisitorStats() {
    // 这里需要集成百度统计API
    // 由于百度统计API需要认证，这里使用模拟数据
    const mockStats = {
        totalVisitors: 12580,
        totalVisits: 25640,
        todayVisitors: 156,
        todayVisits: 234
    };
    
    // 动画显示数字
    animateNumber('#total-visitors', mockStats.totalVisitors);
    animateNumber('#total-visits', mockStats.totalVisits);
    animateNumber('#today-visitors', mockStats.todayVisitors);
    animateNumber('#today-visits', mockStats.todayVisits);
}

// 数字动画效果
function animateNumber(selector, targetNumber) {
    const element = $(selector);
    const duration = 2000;
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    
    const timer = setInterval(() => {
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
        const artalk = Artalk.init({
            el: '#artalk-container',
            pageKey: window.location.pathname,
            pageTitle: document.title,
            server: 'https://your-artalk-server.com', // 替换为实际的Artalk服务器地址
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
            const atkMain = document.querySelector('.atk-main');
            if (atkMain) {
                atkMain.style.borderRadius = '15px';
                atkMain.style.overflow = 'hidden';
            }
        }, 1000);
    }
}

// 技术云图初始化
function initTechCloud() {
    const techItems = [
        // 内层轨道 - 核心技能
        { name: 'JavaScript', level: 'primary', orbit: 1 },
        { name: 'Python', level: 'primary', orbit: 1 },
        { name: 'React', level: 'primary', orbit: 1 },
        
        // 中层轨道 - 熟练技能
        { name: 'Node.js', level: 'secondary', orbit: 2 },
        { name: 'Vue.js', level: 'secondary', orbit: 2 },
        { name: 'TypeScript', level: 'secondary', orbit: 2 },
        { name: 'MySQL', level: 'secondary', orbit: 2 },
        
        // 外层轨道 - 工具技能
        { name: 'Docker', level: 'tertiary', orbit: 3 },
        { name: 'Git', level: 'tertiary', orbit: 3 },
        { name: 'Linux', level: 'tertiary', orbit: 3 },
        { name: 'AWS', level: 'tertiary', orbit: 3 },
        { name: 'MongoDB', level: 'tertiary', orbit: 3 },
        { name: 'Redis', level: 'tertiary', orbit: 3 }
    ];

    // 动态生成技术项目
    techItems.forEach((tech, index) => {
        const orbit = $(`.orbit-${tech.orbit}`);
        const techElement = $(`<div class="tech-item ${tech.level}">${tech.name}</div>`);
        orbit.append(techElement);
    });
}

// 滚动效果
function initScrollEffects() {
    // 导航栏滚动效果
    let lastScrollTop = 0;
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        const navbar = $('.navbar');
        
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
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
            const $this = $(this);
            const target = parseInt($this.text().replace(/[^0-9]/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
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
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// 添加GitHub统计的CSS样式
const githubStyles = `
<style>
.github-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.github-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}

.github-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.github-bio {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.github-stats-row {
    display: flex;
    gap: 1rem;
}

.stat-item {
    text-align: center;
}

.stat-item .stat-number {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
}

.stat-item .stat-label {
    font-size: 0.8rem;
    color: #666;
}

.commits-stats h3 {
    margin-bottom: 1rem;
    color: #333;
}

.commit-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.8rem;
}

.commit-date {
    width: 60px;
    font-size: 0.9rem;
    color: #666;
}

.commit-bar {
    flex: 1;
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.commit-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.commit-count {
    width: 40px;
    text-align: right;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
}

.error {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 2rem;
}

.project-updated {
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #888;
}

.article-category {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
}
</style>
`;

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