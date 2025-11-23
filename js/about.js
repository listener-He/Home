/* about.js - Aurora Nexus Core */

$(document).ready(function () {
    // 启动应用核心
    const app = new AppCore();
});

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
        this.lang = localStorage.getItem('lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
        this.dict = {
            zh: {
                "nav.home": "首页",
                "nav.about": "关于",
                "nav.blog": "博客",
                "status.online": "在线",
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
            localStorage.setItem('lang', this.lang);
            this.apply();
            const label = this.lang === 'zh' ? 'CN' : 'EN';
            $('#lang-btn .btn-text').text(label);
            $('#lang-btn').attr('title', label);
        });
    }

    apply() {
        const t = this.dict[this.lang];
        $('[data-i18n]').each(function () {
            const k = $(this).data('i18n');
            if (t[k]) $(this).text(t[k]);
        });
        const label = this.lang === 'zh' ? 'CN' : 'EN';
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
        const cacheKey = window.SiteConfig?.cacheKeys?.theme?.key || 'theme-v2';
        const timeout = window.SiteConfig?.cacheKeys?.theme?.ttlMs || 360000;
        let saved = localStorage.getItem(cacheKey);
        if (saved == null || new Date().getTime() - timeout > saved.time) {
            var hour = new Date().getHours();
            var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            var night = hour >= 18 || prefersDark;
            saved = night ? 'night' : 'day';
            localStorage.setItem(cacheKey, {time: new Date().getTime(), value: saved});
        }
        if (saved === 'night') this.root.setAttribute('data-theme', 'night');
        $('#theme-btn').toggleClass('is-active', saved === 'night');

        $('#theme-btn').on('click', () => {
            const curr = this.root.getAttribute('data-theme');
            const next = curr === 'night' ? 'day' : 'night';
            if (next === 'night') this.root.setAttribute('data-theme', 'night');
            else this.root.removeAttribute('data-theme');
            localStorage.setItem(cacheKey, {time: new Date().getTime(), value: next});
            $('#theme-btn').toggleClass('is-active', next === 'night');

            // 更新Artalk主题
            if (typeof Artalk !== 'undefined') {
                try {
                    Artalk.reload();
                } catch (e) {
                    console.error('重新加载评论组件异常：', e);
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
        this.fetchGithub();
        this.fetchBlog();
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

            // Cache & Render
            localStorage.setItem(cacheKey, JSON.stringify({
                user: userData, repos: repoData, time: now
            }));
            this.renderUser(userData);
            this.renderRepos(repoData);

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
            const desc = repo.description || repo.desc || 'No description.';
            const url = repo.html_url || repo.url || '#';
            const dShort = (desc || '').length > 120 ? (desc.slice(0, 117) + '...') : desc;

            html += `
            <div class="repo-card" onclick="window.open('${url}')">
                <div class="repo-head">
                    <span class="gradient-text">${repo.name}</span>
                    <span>
                        <i class="ri-star-fill"></i> ${stars}
                        <i class="ri-git-branch-fill"></i> ${forks}
                    </span>
                </div>
                <div class="repo-desc">${dShort}</div>
            </div>`;
        });
        $('#projects-container').html(html);
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
        const lang = localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('zh') ? 'zh' : 'en');
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
            <div class="blog-item" onclick="window.open('${link}')">
                <div class="b-info">
                    <div class="b-title">${post.title}</div>
                    <div class="b-date">${date}</div>
                </div>
                <div class="b-cat">${cat}</div>
            </div>`;
        });
        $('#blog-container').html(html);
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
        this.initBioToggle();
        this.initNavInteraction();
        this.initProfileGradient();
        this.initAudio();
        this.initFab();
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.initTechCloud(), 150);
        });
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
        // Safe initialization
        const isHttps = location.protocol === 'https:';
        const isLocal = !!(window.SiteConfig?.dev?.isLocal);
        if(!isHttps || isLocal) {
            $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${(new I18nManager()).dict[(localStorage.getItem('lang') || 'zh')]['comment.closed']}</div>`);
            return;
        }
        if (typeof Artalk !== 'undefined' && window.SiteConfig?.artalk) {
            try {
                Artalk.init({
                    el: '#artalk-container',
                    pageKey: '/about',
                    pageTitle: 'About Me',
                    server: window.SiteConfig.artalk.server,
                    site: window.SiteConfig.artalk.site,
                    darkMode: document.documentElement.getAttribute('data-theme') === 'night'
                });
            } catch (e) {
                console.error("Artalk Error", e);
                $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${(new I18nManager()).dict[(localStorage.getItem('lang') || 'zh')]['comment.closed']}</div>`);
            }
        } else {
            $('#artalk-container').html(`<div style="text-align:center;color:#999;padding:20px;">${(new I18nManager()).dict[(localStorage.getItem('lang') || 'zh')]['comment.closed']}</div>`);
        }
    }

    initBioToggle() {
        const el = document.querySelector('.bio-text');
        const btn = document.getElementById('bio-toggle');
        const qEl = document.querySelector('.quote-box p');
        if (!el || !btn) return;
        const assess = () => {
            el.classList.add('collapsed');
            if (qEl) qEl.classList.add('quote-collapsed');
            const needsToggle = (el.scrollHeight > el.clientHeight) || (qEl && qEl.scrollHeight > qEl.clientHeight) || (window.innerWidth < 480 && ((el.textContent || '').length + (qEl?.textContent?.length || 0)) > 120);
            if (needsToggle) {
                btn.style.display = 'inline-block';
            } else {
                btn.style.display = 'none';
                el.classList.remove('collapsed');
                if (qEl) qEl.classList.remove('quote-collapsed');
            }
        };
        assess();
        window.addEventListener('resize', () => assess(), {passive: true});
        btn.addEventListener('click', () => {
            el.classList.toggle('collapsed');
            if (qEl) qEl.classList.toggle('quote-collapsed');
        });
    }

    initNavInteraction() {
        const nav = document.querySelector('.glass-nav');
        if (!nav) return;
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            nav.classList.toggle('nav-scrolled', y > 30);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
    }

    initProfileGradient() {
        const name = document.querySelector('.hero-name');
        const role = document.querySelector('.hero-role');
        const loc = document.querySelector('.location-tag');
        if (name) name.classList.add('grad-text-1', 'night-glow', 'glow-cycle');
        if (role) role.classList.add('grad-text-2', 'night-glow', 'glow-cycle');
        if (loc) loc.classList.add('grad-text-3', 'night-glow', 'glow-cycle');
    }

    initTechCloud() {
        const container = document.getElementById('tech-container');
        if (!container) return;

        const techStackRaw = window.SiteConfig?.techStack || [];
        const techStack = techStackRaw.map((item, idx) => {
            const name = item.name || '';
            const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
            const gid = Number(item.gradientId) && Number.isFinite(Number(item.gradientId))
                ? Math.max(1, Math.min(10, Number(item.gradientId)))
                : (hash % 10) + 1;
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
                    let rx2 = rx1 * cb + rz1 * sb, ry2 = ry1, rz2 = rx1 * -sb + rz1 * cb;
                    tag.x = rx2;
                    tag.y = ry2;
                    tag.z = rz2;

                    let scale = (tag.z + radius) / (2 * radius) + 0.45;
                    scale = Math.min(Math.max(scale, 0.7), 1.15);
                    let opacity = (tag.z + radius) / (2 * radius) + 0.2;

                    tag.el.style.opacity = 1;
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
        const updateLabels = () => {
            const lang = localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('zh') ? 'zh' : 'en');
            const theme = (localStorage.getItem('theme') === 'night') ? 'night' : 'day';
            fLang.querySelector('.fab-text').textContent = lang === 'zh' ? '中文' : 'English';
            fTheme.querySelector('.fab-text').textContent = theme === 'night' ? 'Night' : 'Day';
            const playing = (this.audio && !this.audio.paused);
            fMusic.querySelector('.fab-text').textContent = lang === 'zh' ? (playing ? '暂停' : '播放') : (playing ? 'Pause' : 'Play');
        };
        main.addEventListener('click', () => {
            menu.classList.toggle('open');
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
                    this.audio.play().catch(() => {});
                    // 清除暂停时间记录，允许下次自动播放
                    localStorage.removeItem('musicPauseTime');
                } else {
                    this.audio.pause();
                    // 记录暂停时间
                    localStorage.setItem('musicPauseTime', new Date().getTime().toString());
                }
            }
            updateLabels();
        });
        updateLabels();
    }

    initAudio() {
        const el = document.getElementById('site-audio');
        if (!el) return;
        this.audio = el;
        this.audio.loop = true;
        
        // 检查是否在24小时内用户暂停过音乐
        const pauseTime = localStorage.getItem('musicPauseTime');
        const now = new Date().getTime();
        const shouldAutoPlay = !(pauseTime && (now - parseInt(pauseTime)) < 24 * 60 * 60 * 1000);
        
        const tryPlay = () => { 
            if (shouldAutoPlay) {
                this.audio.play().catch(() => {});
            }
        };
        tryPlay();
    }

    _t(key) {
        try {
            return (new I18nManager()).dict[(localStorage.getItem('lang') || 'zh')][key];
        } catch (_) {
            return null;
        }
    }
}