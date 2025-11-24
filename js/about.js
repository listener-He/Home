/* about.js - Aurora Nexus Core */

// 公共方法：设置本地存储的语言设置
function setStoredLanguage(lang) {
    localStorage.setItem('lang', lang);
}

// 公共方法：获取本地存储的语言设置
function getStoredLanguage() {
    return localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('zh') ? 'zh' : 'en');
}


// 公共方法：设置本地存储的主题设置
function setStoredTheme(theme) {
    const cacheKey = window.SiteConfig?.cacheKeys?.theme?.key || 'theme-v2';
    localStorage.setItem(cacheKey, JSON.stringify({
        value: theme,  time: new Date().getTime()
    }));
}

// 公共方法：获取本地存储的主题设置
function getStoredTheme() {
    const cacheKey = window.SiteConfig?.cacheKeys?.theme?.key || 'theme-v2';
    const timeout = window.SiteConfig?.cacheKeys?.theme?.ttlMs || 360000;
    const cacheJson = localStorage.getItem(cacheKey);
    const saved = cacheJson ? JSON.parse(cacheJson) : null;
    let theme = 'day';
    if (saved == null || new Date().getTime() - timeout > saved.time) {
        const hour = new Date().getHours();
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const night = hour >= 18 || prefersDark;
        theme = night ? 'night' : 'day';
        setStoredTheme(theme)
    } else if (saved.value) {
        theme = saved.value;
    }
    return theme;
}

$(document).ready(function () {
    const app = new AppCore();
});

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>\"]/g, function (c) {
        return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c];
    });
}

class AppCore {
    constructor() {
        this.i18n = new I18nManager();
        this.theme = new ThemeManager();
        this.data = new DataManager();
        this.ui = new UIManager();
    }
}

/* ===========================
   1. I18n (Language)
   =========================== */
class I18nManager {
    constructor() {
        this.lang = getStoredLanguage();
        this.dict = {
            zh: {
                "nav.home": "首页",
                "nav.about": "关于",
                "nav.blog": "博客",
                "status.online": "活跃",
                "profile.name": "Honesty",
                "profile.role": "Java后端 & AI探索者",
                "profile.location": "上海, 中国",
                "bio.label": "关于我",
                "bio.text": "我是一名充满热情的Java后端开发工程师，专注于AI技术的探索与应用。来自湖南，现在上海工作，享受在这座充满活力的城市中追求技术梦想。",
                "bio.quote": "我追求技术的深度理解而非广度堆砌，每一项技术的学习都源于解决实际问题的内在驱动。作为INFJ人格类型，我善于深度思考，注重细节，喜欢通过代码创造有意义的产品。我相信技术的力量能够改变世界，也热衷于在开源社区中分享知识与经验。",
                "stats.exp": "编程年限",
                "stats.repos": "开源项目",
                "stats.followers": "关注者",
                "mbti.name": "提倡者",
                "mbti.desc": "提倡者人格类型的人非常稀少，只有不到1%的人口属于这种类型，但他们对世界的贡献不容忽视。",
                "mbti.tag1": "理想主义与道德感",
                "mbti.tag2": "果断决绝的行动力",
                "mbti.tag3": "深度洞察与创意",
                "mbti.tag4": "关怀与同理心",
                "tech.title": "技术栈宇宙",
                "interest.title": "兴趣",
                "interest.subtitle": "INFJ · 创造者 · 探索者",
                "interest.cycling": "骑行",
                "interest.cycling_desc": "享受在路上的自由感，用车轮丈量世界，在风景中寻找灵感",
                "interest.reading": "阅读",
                "interest.reading_desc": "通过文字记录思考轨迹，分享技术见解，用代码诠释创意",
                "interest.opensource": "开源",
                "interest.opensource_desc": "热衷于开源项目，相信分享的力量，用代码连接世界",
                "interest.learning": "持续学习",
                "interest.learning_desc": "保持对新技术的好奇心，在变化中成长，在挑战中进步",
                "github.title": "开源贡献",
                "blog.title": "最新文章",
                "blog.more": "查看更多",
                "comment.title": "留言板",
                "modal.wechat": "微信公众号",
                "modal.desc": "扫码关注获取干货",
                "comment.closed": "当前评论区已关闭"
            },
            en: {
                "nav.home": "Home",
                "nav.about": "About",
                "nav.blog": "Blog",
                "status.online": "Available",
                "profile.name": "Honesty",
                "profile.role": "Java Backend & AI Dev",
                "profile.location": "Shanghai, China",
                "bio.label": "About Me",
                "bio.text": "I am a passionate Java Backend Engineer focused on AI exploration. Based in Shanghai, originally from Hunan, I enjoy pursuing my technical dreams in this vibrant city.",
                "bio.quote": "I pursue a deep understanding of technology rather than a broad accumulation, and the learning of every technology stems from the intrinsic drive to solve practical problems. As an INFJ personality type, I am good at deep thinking, pay attention to details, and enjoy creating meaningful products through code. I believe in the power of technology to change the world, and I am passionate about sharing knowledge and experience in the open source community.",
                "stats.exp": "Years Exp",
                "stats.repos": "Projects",
                "stats.followers": "Followers",
                "mbti.name": "Advocate",
                "mbti.desc": "Advocates of this personality type are very rare, with less than 1% of the population belonging to this type, but their contributions to the world cannot be ignored.",
                "mbti.tag1": "Idealism & Morality",
                "mbti.tag2": "Decisive Action",
                "mbti.tag3": "Deep Insight & Creativity",
                "mbti.tag4": "Care & Empathy",
                "tech.title": "Tech Universe",
                "interest.title": "Interests",
                "interest.subtitle": "INFJ · Creator · Explorer",
                "interest.cycling": "Cycling",
                "interest.cycling_desc": "Enjoy the freedom on the road, measure the world with wheels, and find inspiration in the scenery",
                "interest.reading": "Reading",
                "interest.reading_desc": "Record thinking trajectories through text, share technical insights, and interpret creativity with code",
                "interest.opensource": "Open Source",
                "interest.opensource_desc": "Passionate about open source projects, believing in the power of sharing, connecting the world with code",
                "interest.learning": "Learning",
                "interest.learning_desc": "Maintain curiosity about new technologies, grow through change, and progress through challenges",
                "github.title": "Open Source",
                "blog.title": "Latest Posts",
                "blog.more": "View All",
                "comment.title": "Message Board",
                "modal.wechat": "WeChat Account",
                "modal.desc": "Scan for tech insights",
                "comment.closed": "Comments are closed"
            }
        };
        this.init();
    }

    init() {
        this.apply();
        $('#lang-btn').on('click', () => {
            this.lang = this.lang === 'zh' ? 'en' : 'zh';
            setStoredLanguage(this.lang);
            this.apply();
            const label = this.lang === 'zh' ? 'EN' : 'CN';
            $('#lang-btn .btn-text').text(label);
            $('#lang-btn').attr('title', label);
        });
    }

    apply() {
        const t = this.dict[this.lang];
        document.documentElement.setAttribute('data-lang', this.lang)
        $('[data-i18n]').each(function () {
            const k = $(this).data('i18n');
            if (t[k]) $(this).text(t[k]);
        });
        const label = this.lang === 'zh' ? 'EN' : 'CN';
        $('#lang-btn .btn-text').text(label);
        $('#lang-btn').attr('title', label);
    }
}

/* ===========================
   2. Theme Manager
   =========================== */
class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.init();
    }

    init() {
        let theme = getStoredTheme();
        if (theme) this.root.setAttribute('data-theme', theme);
        $('#theme-btn').toggleClass('is-active', theme === 'night');
        const langForTitle = getStoredLanguage();
        const titleText = theme === 'night' ? (langForTitle === 'zh' ? '白天模式' : 'Day') : (langForTitle === 'zh' ? '黑夜模式' : 'Night');
        $('#theme-btn').attr('title', titleText);

        $('#theme-btn').on('click', () => {
            const curr = this.root.getAttribute('data-theme');
            const next = curr === 'night' ? 'day' : 'night';
            if (next) this.root.setAttribute('data-theme', next);
            else this.root.removeAttribute('data-theme');
            setStoredTheme(next)
            $('#theme-btn').toggleClass('is-active', next === 'night');
            const lang = getStoredLanguage();
            const t = next === 'night' ? (lang === 'zh' ? '白天模式' : 'Day') : (lang === 'zh' ? '黑夜模式' : 'Night');
            $('#theme-btn').attr('title', t);

            // 更新Artalk主题
            if (typeof Artalk !== 'undefined') {
                try {
                    Artalk.reload();
                } catch (e) {
                }
            }
        });
    }
}

/* ===========================
   3. Data Manager (Robust)
   =========================== */
class DataManager {
    constructor() {
        this.init();
    }

    init() {
        setTimeout(() => this.fetchGithub(), 0);
        setTimeout(() => this.fetchBlog(), 0);
    }

    // 优先缓存 -> API -> 默认值
    async fetchGithub() {
        const user = (window.SiteConfig?.github?.username) || 'listener-He';
        const cacheKey = (window.SiteConfig?.cacheKeys?.github?.key) || 'gh_data_v2';
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        const now = Date.now();
        const timeout = (window.SiteConfig?.cacheKeys?.github?.ttlMs) || 3600000;

        // Check Cache (1 hour)
        if (cached && (now - cached.time < timeout)) {
            this.renderUser(cached.user);
            this.renderRepos(cached.repos);
            return;
        }

        try {
            // Parallel Fetch
            const uRes = await fetch(`https://api.github.com/users/${user}`);
            const userData = uRes.ok ? await uRes.json() : (window.SiteConfig?.defaults?.user);
            let allRepos = [];
            let page = 1;
            const perPage = 100;
            while (page <= 10) { // 最多抓取1000条，直到满足条件或为空
                const rRes = await fetch(`https://api.github.com/users/${user}/repos?sort=stars&per_page=${perPage}&page=${page}`);
                if (!rRes.ok) break;
                const repos = await rRes.json();
                if (!Array.isArray(repos) || repos.length === 0) break;
                allRepos = allRepos.concat(repos);
                if (repos.length < perPage || allRepos.length >= 1000) break; // 足量
                page++;
            }
            let repoData = allRepos.length ? allRepos : (window.SiteConfig?.defaults?.repos);

            // 过滤掉fork项目并按星数排序
            if (Array.isArray(repoData)) {
                repoData = repoData
                    .filter(repo => !repo.fork && (repo.stargazers_count > 0 || repo.forks_count > 0))
                    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                    .slice(0, 12); // 只取前12个
            }

            const slimUser = {
                created_at: userData.created_at || (window.SiteConfig?.defaults?.user?.created),
                public_repos: userData.public_repos || (window.SiteConfig?.defaults?.user?.repos),
                followers: userData.followers || (window.SiteConfig?.defaults?.user?.followers)
            };
            const slimRepos = Array.isArray(repoData) ? repoData.map(r => ({
                name: r.name || '',
                stargazers_count: (r.stargazers_count !== undefined ? r.stargazers_count : (r.stars || 0)),
                forks_count: (r.forks_count !== undefined ? r.forks_count : (r.forks || 0)),
                description: r.description || r.desc || '',
                html_url: r.html_url || r.url || '#'
            })) : [];

            localStorage.setItem(cacheKey, JSON.stringify({
                user: slimUser, repos: slimRepos, time: now
            }));
            this.renderUser(slimUser);
            this.renderRepos(slimRepos);

        } catch (e) {
            console.warn("GH API Fail", e);
            this.renderUser(window.SiteConfig?.defaults?.user);
            this.renderRepos(window.SiteConfig?.defaults?.repos);
        }
    }

    renderUser(data) {
        const years = new Date().getFullYear() - new Date(data.created_at || (window.SiteConfig?.defaults?.user?.created)).getFullYear();
        $('#coding-years').text(years + "+");
        $('#github-repos').text(data.public_repos || (window.SiteConfig?.defaults?.user?.repos));
        $('#github-followers').text(data.followers || (window.SiteConfig?.defaults?.user?.followers));
    }

    renderRepos(list) {
        if (!Array.isArray(list)) list = window.SiteConfig?.defaults?.repos;
        let html = '';
        list.slice(0, 12).forEach(repo => {
            // Fix: API field compatibility
            const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : (repo.stars || 0);
            const forks = repo.forks_count !== undefined ? repo.forks_count : (repo.forks || 0);
            const descRaw = repo.description || repo.desc || 'No description.';
            const url = repo.html_url || repo.url || '#';
            const dShort = (descRaw || '').length > 120 ? (descRaw.slice(0, 117) + '...') : descRaw;

            html += `
            <div class="repo-card" onclick="window.open('${url}', '_blank', 'noopener,noreferrer')">
                <div class="repo-head">
                    <span class="gradient-text">${escapeHtml(repo.name)}</span>
                    <span>
                        <i class="ri-star-fill"></i> ${stars}
                        <i class="ri-git-branch-fill"></i> ${forks}
                    </span>
                </div>
                <div class="repo-desc">${escapeHtml(dShort)}</div>
            </div>`;
        });
        const pc = $('#projects-container');
        pc.removeClass('fade-in');
        pc.html(html);
        pc.addClass('fade-in');
    }

    // 从RSS获取博客文章
    async fetchBlog() {
        const rssUrl = window.SiteConfig?.blog?.rssUrl || 'https://blog.hehouhui.cn/api/rss';
        const cacheKey = (window.SiteConfig?.cacheKeys?.blog?.key) || 'blog_data_v2';
        const timeout = (window.SiteConfig?.cacheKeys?.blog?.ttlMs) || 3600000;
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        const now = Date.now();

        // Check Cache (1 hour)
        if (cached && (now - cached.time < timeout)) {
            this.renderBlog(cached.posts);
            return;
        }

        try {
            // 尝试从RSS获取
            const response = await fetch(rssUrl);
            if (!response.ok) throw new Error('RSS fetch failed');

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");

            if (xmlDoc.documentElement.nodeName === "parsererror") {
                throw new Error('RSS XML parse error');
            }

            // 解析RSS项目
            const items = xmlDoc.getElementsByTagName("item");
            const posts = [];

            for (let i = 0; i < Math.min(items.length, 5); i++) {
                const item = items[i];
                const title = item.querySelector("title")?.textContent || "无标题";
                const link = item.querySelector("link")?.textContent || "#";
                const pubDate = item.querySelector("pubDate")?.textContent || "";
                const categoryNodes = item.querySelectorAll("category");
                const categories = Array.from(categoryNodes).map(n => (n.textContent || '').trim()).filter(Boolean);

                posts.push({
                    title,
                    link,
                    date: pubDate,
                    cats: categories.length ? categories : [""]
                });
            }

            // Cache & Render
            localStorage.setItem(cacheKey, JSON.stringify({
                posts,
                time: now
            }));
            this.renderBlog(posts);

        } catch (e) {
            console.warn("RSS API Fail", e);
            // 降级到本地JSON文件
            try {
                const response = await fetch('data/articles.json');
                const data = await response.json();
                this.renderBlog(data);
            } catch (e2) {
                console.warn("Local JSON Fail", e2);
                this.renderBlog(window.SiteConfig?.defaults?.posts);
            }
        }
    }

    renderBlog(list) {
        let html = '';
        const lang = getStoredLanguage();
        const fmtDate = (dStr) => {
            if (!dStr) return '';
            const d = new Date(dStr);
            if (isNaN(d.getTime())) {
                try {
                    const parsed = new Date(Date.parse(dStr));
                    if (!isNaN(parsed.getTime())) return lang === 'zh'
                        ? `${parsed.getFullYear()}年${String(parsed.getMonth() + 1).padStart(2, '0')}月${String(parsed.getDate()).padStart(2, '0')}日`
                        : `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
                } catch (_) {
                }
                return dStr;
            }
            return lang === 'zh'
                ? `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`
                : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        list.slice(0, 5).forEach(post => {
            const dateRaw = post.pubDate || post.date || '';
            const date = fmtDate(dateRaw);
            const catsArr = post.categories || post.cats || (post.category ? [post.category] : (post.cat ? [post.cat] : ['Tech']));
            const cat = Array.isArray(catsArr) ? (lang === 'zh' ? catsArr.join('、') : catsArr.join(', ')) : (catsArr || 'Tech');
            const link = post.link || post.url || '#';

            html += `
            <div class="blog-item" onclick="window.open('${link}', '_blank', 'noopener,noreferrer')">
                <div class="b-info">
                    <div class="b-title">${escapeHtml(post.title)}</div>
                    <div class="b-date">${escapeHtml(date)}</div>
                </div>
                <div class="b-cat">${escapeHtml(cat)}</div>
            </div>`;
        });
        const bc = $('#blog-container');
        bc.removeClass('fade-in');
        bc.html(html);
        bc.addClass('fade-in');
    }
}

/* ===========================
   4. UI Manager (Visuals)
   =========================== */
class UIManager {
    constructor() {
        this.initTechCloud();
        this.initModal();
        this.initArtalk();
        this.initAudio();
        this.initFab();
    }


    // 公共方法：获取音乐暂停时间
    getMusicPauseTime() {
        const pauseTime = localStorage.getItem('musicPauseTime');
        return pauseTime ? parseInt(pauseTime) : null;
    }

    // 公共方法：检查音乐是否应在24小时内保持暂停状态
    shouldMusicRemainPaused() {
        const pauseTime = this.getMusicPauseTime();
        if (!pauseTime) return false;

        const now = new Date().getTime();
        return (now - pauseTime) < 24 * 60 * 60 * 1000;
    }

    // 公共方法：设置音乐暂停时间
    setMusicPauseTime() {
        localStorage.setItem('musicPauseTime', new Date().getTime().toString());
    }

    // 公共方法：清除音乐暂停时间
    clearMusicPauseTime() {
        localStorage.removeItem('musicPauseTime');
    }

    initModal() {
        window.toggleWechat = () => {
            const m = $('#wechat-modal');
            m.is(':visible') ? m.fadeOut(200) : m.css('display', 'flex').hide().fadeIn(200);
        };
        $('#wechat-modal').on('click', function (e) {
            if (e.target === this) toggleWechat();
        });
    }

    initArtalk() {
        const isHttps = location.protocol === 'https:';
        const isLocal = !!(window.SiteConfig?.dev?.isLocal);
        if (!isHttps || isLocal) {
            const lang = getStoredLanguage();
            const msg = lang === 'zh' ? '当前评论区已关闭' : 'Comments are closed';
            $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${msg}</div>`);
            return;
        }
        if (typeof Artalk !== 'undefined' && window.SiteConfig?.artalk) {
            try {
                Artalk.init({
                    el: '#artalk-container',
                    pageKey: '/about.html',
                    pageTitle: '关于我 - Honesty',
                    server: window.SiteConfig.artalk.server,
                    site: window.SiteConfig.artalk.site,
                    darkMode: document.documentElement.getAttribute('data-theme') === 'night'
                });
                this.enhanceArtalkUI();
            } catch (e) {
                console.error("Artalk Error", e);
                const lang = getStoredLanguage();
                const msg = lang === 'zh' ? '当前评论区已关闭' : 'Comments are closed';
                $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${msg}</div>`);
            }
        } else {
            const lang = getStoredLanguage();
            const msg = lang === 'zh' ? '当前评论区已关闭' : 'Comments are closed';
            $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${msg}</div>`);
        }
    }

    enhanceArtalkUI() {
        const container = document.getElementById('artalk-container');
        if (!container) return;
        
        // 检测是否为移动端
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        container.classList.toggle('atk-mobile', isMobile);
        container.classList.toggle('atk-desktop', !isMobile);
        
        // 获取当前语言
        const lang = getStoredLanguage();
        
        // 获取当前主题
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // 设置主题
        if (typeof Artalk !== 'undefined') {
            try {
                Artalk.setDarkMode(currentTheme === 'night');
            } catch (e) {
                console.warn('Failed to set Artalk dark mode:', e);
            }
        }
        
        // 移动端增强功能
        if (isMobile) {
            this.enhanceMobileArtalk(container, lang);
        }
        
        // 监听主题变化
        const themeObserver = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme');
            if (typeof Artalk !== 'undefined') {
                try {
                    Artalk.setDarkMode(newTheme === 'night');
                } catch (e) {
                    console.warn('Failed to update Artalk dark mode:', e);
                }
            }
            
            // 更新自定义样式类
            this.updateCustomStyles(container, newTheme);
        });
        
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // 监听语言变化
        const langBtn = document.getElementById('lang-btn');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                // 延迟执行以确保语言已经切换
                setTimeout(() => {
                    const newLang = getStoredLanguage();
                    this.updateArtalkLanguage(container, newLang, isMobile);
                }, 100);
            });
        }
        
        // 初始化自定义样式
        this.updateCustomStyles(container, currentTheme);
    }

    enhanceMobileArtalk(container, lang) {
        const applyMobileStyles = () => {
            container.querySelectorAll('.atk-comment-wrap .atk-content').forEach(el => {
                // 检查是否已经处理过
                if (el.dataset.mobileProcessed) return;
                
                // 添加移动端内容截断
                el.classList.add('clamped');
                
                // 创建展开/收起按钮
                const btn = document.createElement('button');
                btn.className = 'atk-expand-btn';
                const expandText = lang === 'zh' ? '展开' : 'Expand';
                const collapseText = lang === 'zh' ? '收起' : 'Collapse';
                btn.textContent = expandText;
                
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isClamped = el.classList.toggle('clamped');
                    btn.textContent = isClamped ? expandText : collapseText;
                });
                
                // 将按钮插入到适当位置
                const actionsElement = el.closest('.atk-comment').querySelector('.atk-actions');
                if (actionsElement) {
                    actionsElement.parentNode.insertBefore(btn, actionsElement);
                } else {
                    el.parentNode.appendChild(btn);
                }
                
                // 标记为已处理
                el.dataset.mobileProcessed = '1';
            });
        };
        
        // 初始应用
        applyMobileStyles();
        
        // 创建观察器以处理动态添加的评论
        const observer = new MutationObserver(applyMobileStyles);
        observer.observe(container, { 
            childList: true, 
            subtree: true,
            attributes: false
        });
        
        // 添加移动端特定的样式类
        const theme = document.documentElement.getAttribute('data-theme');
        container.classList.add(`atk-theme-${theme || 'day'}`);
    }

    updateArtalkLanguage(container, lang, isMobile) {
        // 更新展开/收起按钮文本
        if (isMobile) {
            const expandButtons = container.querySelectorAll('.atk-expand-btn');
            const expandText = lang === 'zh' ? '展开' : 'Expand';
            const collapseText = lang === 'zh' ? '收起' : 'Collapse';
            
            expandButtons.forEach(btn => {
                // 如果按钮当前显示的是展开文本，保持不变
                // 如果显示的是收起文本，则更新为对应语言的收起文本
                if (btn.textContent === '展开' || btn.textContent === 'Expand') {
                    btn.textContent = expandText;
                } else if (btn.textContent === '收起' || btn.textContent === 'Collapse') {
                    btn.textContent = collapseText;
                }
            });
        }
        
        // 如果有 Artalk 实例，可以在这里更新其实例的语言设置
        if (typeof Artalk !== 'undefined') {
            try {
                // 注意：Artalk 的语言设置通常在初始化时确定，
                // 动态更改语言需要重新初始化或者使用其API（如果支持）
                console.log('Would update Artalk language to:', lang);
            } catch (e) {
                console.warn('Failed to update Artalk language:', e);
            }
        }
    }

    initTechCloud() {
        const container = document.getElementById('tech-container');
        if (!container) return;

        const techStackRaw = window.SiteConfig?.techStack || [];
        const techStack = techStackRaw.map((item, idx) => {
            //const name = item.name || '';
            //const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
            const gid = Number(item.gradientId) && Number.isFinite(Number(item.gradientId))
                ? Math.max(1, Math.min(10, Number(item.gradientId)))
                : (idx % 10) + 1;
            return {...item, gradientId: gid};
        });

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        container.innerHTML = '';

        if (isMobile) {
            // Mobile: 3-row seamless marquee
            container.classList.add('mobile-scroll');
            const rows = 3;
            const buckets = Array.from({length: rows}, () => []);
            techStack.forEach((item, i) => {
                buckets[i % rows].push(item);
            });

            const appendItem = (rowEl, item, idx) => {
                const el = document.createElement('span');
                el.className = 'tech-tag-mobile';
                const colorClass = `tag-color-${item.gradientId || ((idx % 10) + 1)}`;
                el.classList.add(colorClass);
                el.innerText = item.name;
                el.style.border = 'none';
                rowEl.appendChild(el);
            };

            buckets.forEach((items, rIdx) => {
                const rowEl = document.createElement('div');
                rowEl.className = `tech-row row-${rIdx + 1}`;
                rowEl.style.gridRow = `${rIdx + 1}`;
                items.forEach((item, idx) => appendItem(rowEl, item, idx));
                items.forEach((item, idx) => appendItem(rowEl, item, idx + items.length));
                container.appendChild(rowEl);
            });
        } else {
            // PC: 3D Sphere
            container.classList.remove('mobile-scroll');
            container.__animToken = Date.now();
            const tags = [];

            techStack.forEach((item, index) => {
                const el = document.createElement('a');
                el.className = 'tech-tag-3d';
                const colorClass = `tag-color-${item.gradientId || ((index % 10) + 1)}`;
                el.classList.add(colorClass);
                el.innerText = item.name;
                el.style.border = 'none';
                container.appendChild(el);
                tags.push({el, x: 0, y: 0, z: 0});
            });

            // 动态半径，避免容器溢出
            let radius = Math.max(160, Math.min(container.offsetWidth, container.offsetHeight) / 2 - 24);
            const dtr = Math.PI / 180;
            let lasta = 1, lastb = 1;
            let active = false, mouseX = 0, mouseY = 0;

            // Init positions
            tags.forEach((tag, i) => {
                let phi = Math.acos(-1 + (2 * i + 1) / tags.length);
                let theta = Math.sqrt(tags.length * Math.PI) * phi;
                tag.x = radius * Math.cos(theta) * Math.sin(phi);
                tag.y = radius * Math.sin(theta) * Math.sin(phi);
                tag.z = radius * Math.cos(phi);
            });

            container.onmouseover = () => active = true;
            container.onmouseout = () => active = false;
            container.onmousemove = (e) => {
                let rect = container.getBoundingClientRect();
                mouseX = (e.clientX - (rect.left + rect.width / 2)) / 5;
                mouseY = (e.clientY - (rect.top + rect.height / 2)) / 5;
            };

            const update = () => {
                let a, b;
                if (active) {
                    a = (-Math.min(Math.max(-mouseY, -200), 200) / radius) * 2;
                    b = (Math.min(Math.max(-mouseX, -200), 200) / radius) * 2;
                } else {
                    a = lasta * 0.98; // Auto rotate
                    b = lastb * 0.98;
                }
                lasta = a;
                lastb = b;

                if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01 && !active) a = 0.5; // Keep spinning slowly

                let sa = Math.sin(a * dtr), ca = Math.cos(a * dtr);
                let sb = Math.sin(b * dtr), cb = Math.cos(b * dtr);

                tags.forEach(tag => {
                    let rx1 = tag.x, ry1 = tag.y * ca - tag.z * sa, rz1 = tag.y * sa + tag.z * ca;
                    let ry2 = ry1, rz2 = rx1 * -sb + rz1 * cb;
                    tag.x = rx1 * cb + rz1 * sb;
                    tag.y = ry2;
                    tag.z = rz2;

                    let scale = (tag.z + radius) / (2 * radius) + 0.45;
                    scale = Math.min(Math.max(scale, 0.7), 1.15);
                    tag.el.style.opacity = (tag.z + radius) / (2 * radius) + 0.2;
                    tag.el.style.zIndex = parseInt(scale * 100);
                    let left = tag.x + container.offsetWidth / 2 - tag.el.offsetWidth / 2;
                    let top = tag.y + container.offsetHeight / 2 - tag.el.offsetHeight / 2;
                    tag.el.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
                });
                requestAnimationFrame(update);
            };
            update();
        }
    }


    initFab() {
        const main = document.getElementById('fab-main');
        const menu = document.getElementById('fab-menu');
        const fLang = document.getElementById('fab-lang');
        const fTheme = document.getElementById('fab-theme');
        const fMusic = document.getElementById('fab-music');
        if (!main || !menu || !fLang || !fTheme || !fMusic) return;
        
        // 添加拖拽功能
        this.initDraggableFab();
        
        const updateLabels = () => {
            const lang = getStoredLanguage();
            const theme = getStoredTheme();
            fLang.querySelector('.fab-text').textContent = lang === 'zh' ? 'English' : '中文';
            fTheme.querySelector('.fab-text').textContent = theme === 'night' ? 'Day' : 'Night';
            const playing = (this.audio && !this.audio.paused);
            fMusic.querySelector('.fab-text').textContent = lang === 'zh' ? (playing ? '暂停' : '播放') : (playing ? 'Pause' : 'Play');
        };
        main.addEventListener('click', () => {
            menu.classList.toggle('open');
            main.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
            updateLabels();
        });
        fLang.addEventListener('click', () => {
            document.getElementById('lang-btn')?.click();
            updateLabels();
        });
        fTheme.addEventListener('click', () => {
            document.getElementById('theme-btn')?.click();
            updateLabels();
        });
        fMusic.addEventListener('click', () => {
            if (this.audio) {
                if (this.audio.paused) {
                    this.audio.play().catch(() => {
                    });
                    // 清除暂停时间记录，允许下次自动播放
                    this.clearMusicPauseTime();
                } else {
                    this.audio.pause();
                    // 记录暂停时间
                    this.setMusicPauseTime();
                }
            }
            updateLabels();
        });
        updateLabels();
    }

    // 初始化拖拽功能
    initDraggableFab() {
        const fab = document.querySelector('.mobile-fab');
        if (!fab) return;

        let isDragging = false;
        let initialX, initialY, currentX, currentY, xOffset = 0, yOffset = 0;
        fab.style.willChange = 'transform';

        // 拖拽相关方法
        const setTranslate = (xPos, yPos, el) => {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        };

        const dragStart = (e) => {
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            isDragging = true;
        };

        const dragEnd = () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        };

        const drag = (e) => {
            if (isDragging) {
                e.preventDefault();
                if (e.type === 'touchmove') {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                const ww = window.innerWidth;
                const wh = window.innerHeight;
                const rect = fab.getBoundingClientRect();
                const fw = rect.width;
                const fh = rect.height;
                currentX = Math.max(0, Math.min(currentX, ww - fw));
                currentY = Math.max(0, Math.min(currentY, wh - fh));

                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, fab);
            }
        };

        // 绑定事件
        fab.addEventListener('touchstart', dragStart, false);
        fab.addEventListener('touchend', dragEnd, false);
        fab.addEventListener('touchmove', drag, false);
        fab.addEventListener('mousedown', dragStart, false);
        fab.addEventListener('mouseup', dragEnd, false);
        fab.addEventListener('mousemove', drag, false);
    }

    initAudio() {
        const el = document.getElementById('site-audio');
        if (!el) return;
        this.audio = el;
        this.audio.loop = true;

        // 检查是否在24小时内用户暂停过音乐
        const shouldRemainPaused = this.shouldMusicRemainPaused();

        const tryPlay = () => {
            if (!shouldRemainPaused) {
                this.audio.play().catch(() => {
                });
            }
        };
        tryPlay();
    }

    updateCustomStyles(container, theme) {
        // 确保容器具有正确的主题类
        container.classList.remove('atk-theme-day', 'atk-theme-night');
        container.classList.add(`atk-theme-${theme || 'day'}`);
        
        // 更新自定义元素的主题样式
        const customElements = container.querySelectorAll('.atk-expand-btn, .atk-pagination .atk-page-item');
        customElements.forEach(el => {
            el.classList.remove('atk-theme-day', 'atk-theme-night');
            el.classList.add(`atk-theme-${theme || 'day'}`);
        });
    }

}