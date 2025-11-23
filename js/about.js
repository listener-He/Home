/* about.js - Aurora Nexus Core */

$(document).ready(function() {
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
                "nav.home": "首页", "nav.about": "关于", "nav.blog": "博客",
                "status.online": "在线", "profile.name": "Honesty", "profile.role": "Java后端 & AI探索者", "profile.location": "上海, 中国",
                "bio.label": "关于我",
                "bio.text": "我是一名充满热情的Java后端开发工程师，专注于AI技术的探索与应用。来自湖南，现在上海工作，享受在这座充满活力的城市中追求技术梦想。",
                "bio.quote": "我追求技术的深度理解而非广度堆砌，每一项技术的学习都源于解决实际问题的内在驱动。",
                "stats.exp": "编程年限", "stats.repos": "开源项目", "stats.followers": "关注者",
                "mbti.name": "提倡者", "mbti.desc": "理想主义与道德感，果断决绝的行动力。深度洞察与创意，关怀与同理心。",
                "mbti.tag1": "理想主义", "mbti.tag2": "深度洞察", "mbti.tag3": "同理心",
                "tech.title": "技术栈宇宙", "interest.title": "个人兴趣",
                "interest.cycling": "骑行", "interest.cycling_desc": "用车轮丈量世界",
                "interest.reading": "阅读", "interest.reading_desc": "记录思考的轨迹",
                "interest.opensource": "开源", "interest.opensource_desc": "分享代码与力量",
                "interest.learning": "持续学习", "interest.learning_desc": "保持好奇心",
                "github.title": "开源贡献", "blog.title": "最新文章", "blog.more": "查看更多",
                "comment.title": "留言板", "modal.wechat": "微信公众号", "modal.desc": "扫码关注获取干货"
            },
            en: {
                "nav.home": "Home", "nav.about": "About", "nav.blog": "Blog",
                "status.online": "Available", "profile.name": "Honesty", "profile.role": "Java Backend & AI Dev", "profile.location": "Shanghai, China",
                "bio.label": "About Me",
                "bio.text": "I am a passionate Java Backend Engineer focused on AI exploration. Based in Shanghai, originally from Hunan, I enjoy pursuing my technical dreams in this vibrant city.",
                "bio.quote": "I seek deep understanding over broad stacking. Every skill I learn is driven by the need to solve real problems.",
                "stats.exp": "Years Exp", "stats.repos": "Projects", "stats.followers": "Followers",
                "mbti.name": "Advocate", "mbti.desc": "Idealism and morality, decisive action. Deep insight and creativity, care and empathy.",
                "mbti.tag1": "Idealism", "mbti.tag2": "Insight", "mbti.tag3": "Empathy",
                "tech.title": "Tech Universe", "interest.title": "Interests",
                "interest.cycling": "Cycling", "interest.cycling_desc": "Measuring the world",
                "interest.reading": "Reading", "interest.reading_desc": "Tracks of thought",
                "interest.opensource": "Open Source", "interest.opensource_desc": "Sharing power",
                "interest.learning": "Learning", "interest.learning_desc": "Stay curious",
                "github.title": "Open Source", "blog.title": "Latest Posts", "blog.more": "View All",
                "comment.title": "Message Board", "modal.wechat": "WeChat Account", "modal.desc": "Scan for tech insights"
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
        });
    }

    apply() {
        const t = this.dict[this.lang];
        $('[data-i18n]').each(function() {
            const k = $(this).data('i18n');
            if(t[k]) $(this).text(t[k]);
        });
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
        const saved = localStorage.getItem('theme') || 'day';
        if(saved === 'night') this.root.setAttribute('data-theme', 'night');

        $('#theme-btn').on('click', () => {
            const curr = this.root.getAttribute('data-theme');
            const next = curr === 'night' ? 'day' : 'night';
            if(next === 'night') this.root.setAttribute('data-theme', 'night');
            else this.root.removeAttribute('data-theme');
            localStorage.setItem('theme', next);
        });
    }
}

/* ===========================
   3. Data Manager (Robust)
   =========================== */
class DataManager {
    constructor() {
        // Fallback Data if APIs fail
        this.defaults = {
            repos: [
                {name: "yunxiao-LLM-reviewer", desc: "AI Code Reviewer based on LLM", stars: 9, url: "#"},
                {name: "hexo-theme-stellar", desc: "Comprehensive Hexo theme", stars: 5, url: "#"},
                {name: "Universal-IoT-Java", desc: "IoT Platform Demo", stars: 2, url: "#"}
            ],
            posts: [
                {title: "Vector Database Guide", date: "2025-01-02", cat: "Tech", url: "#"},
                {title: "Spring Boot 3.0 Features", date: "2024-12-30", cat: "Java", url: "#"},
                {title: "Microservices Patterns", date: "2024-12-28", cat: "Arch", url: "#"}
            ],
            user: { repos: 165, followers: 6, created: "2018-05-14" }
        };
        this.init();
    }

    init() {
        this.fetchGithub();
        this.fetchBlog();
    }

    // 优先缓存 -> API -> 默认值
    async fetchGithub() {
        const user = (window.SiteConfig?.github?.username) || 'listener-He';
        const cacheKey = 'gh_data_v2';
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        const now = Date.now();

        // Check Cache (1 hour)
        if(cached && (now - cached.time < 3600000)) {
            this.renderUser(cached.user);
            this.renderRepos(cached.repos);
            return;
        }

        try {
            // Parallel Fetch
            const [uRes, rRes] = await Promise.allSettled([
                fetch(`https://api.github.com/users/${user}`),
                fetch(`https://api.github.com/users/${user}/repos?sort=stars&per_page=6`)
            ]);

            const userData = uRes.status === 'fulfilled' ? await uRes.value.json() : this.defaults.user;
            const repoData = rRes.status === 'fulfilled' ? await rRes.value.json() : this.defaults.repos;

            // Cache & Render
            localStorage.setItem(cacheKey, JSON.stringify({
                user: userData, repos: repoData, time: now
            }));
            this.renderUser(userData);
            this.renderRepos(repoData);

        } catch (e) {
            console.warn("GH API Fail", e);
            this.renderUser(this.defaults.user);
            this.renderRepos(this.defaults.repos);
        }
    }

    renderUser(data) {
        const years = new Date().getFullYear() - new Date(data.created_at || this.defaults.user.created).getFullYear();
        $('#coding-years').text(years + "+");
        $('#github-repos').text(data.public_repos || this.defaults.user.repos);
        $('#github-followers').text(data.followers || this.defaults.user.followers);
    }

    renderRepos(list) {
        if(!Array.isArray(list)) list = this.defaults.repos;
        let html = '';
        list.slice(0, 5).forEach(repo => {
            // Fix: API field compatibility
            const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : (repo.stars || 0);
            const desc = repo.description || repo.desc || 'No description.';
            const url = repo.html_url || repo.url || '#';

            html += `
            <div class="repo-card" onclick="window.open('${url}')">
                <div class="repo-head">
                    <span>${repo.name}</span>
                    <span style="color:#f1c40f"><i class="ri-star-fill"></i> ${stars}</span>
                </div>
                <div class="repo-desc">${desc}</div>
            </div>`;
        });
        $('#projects-container').html(html);
    }

    fetchBlog() {
        fetch('data/articles.json')
            .then(r => r.json())
            .then(data => this.renderBlog(data))
            .catch(() => this.renderBlog(this.defaults.posts));
    }

    renderBlog(list) {
        let html = '';
        list.slice(0, 5).forEach(post => {
            const date = (post.pubDate || post.date || '').split('T')[0];
            const cat = post.category || post.cat || 'Tech';
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
    }

    initModal() {
        window.toggleWechat = () => {
            const m = $('#wechat-modal');
            m.is(':visible') ? m.fadeOut(200) : m.css('display','flex').hide().fadeIn(200);
        };
        $('#wechat-modal').on('click', function(e) {
            if(e.target === this) toggleWechat();
        });
    }

    initArtalk() {
        // Safe initialization
        if(typeof Artalk !== 'undefined' && window.SiteConfig?.artalk) {
            try {
                Artalk.init({
                    el: '#artalk-container',
                    pageKey: '/about',
                    pageTitle: 'About Me',
                    server: window.SiteConfig.artalk.server,
                    site: window.SiteConfig.artalk.site,
                    darkMode: document.documentElement.getAttribute('data-theme') === 'night'
                });
            } catch(e) { console.error("Artalk Error", e); }
        } else {
            $('#artalk-container').html('<div style="text-align:center;color:#999;padding:20px;">Message board loading...</div>');
        }
    }

    initTechCloud() {
        const container = document.getElementById('tech-container');
        if(!container) return;

        const techStack = window.SiteConfig?.techStack || [
            {name:'Java'},{name:'Spring'},{name:'Docker'},{name:'K8s'},{name:'Python'},{name:'Redis'},
            {name:'React'},{name:'Vue'},{name:'MySQL'},{name:'MongoDB'},{name:'Linux'},{name:'Git'}
        ];

        const isMobile = window.innerWidth < 768;
        container.innerHTML = '';

        if(isMobile) {
            // Mobile: Horizontal Scroll Snap (Compact 3 rows)
            container.classList.add('mobile-scroll');
            techStack.forEach(item => {
                const el = document.createElement('span');
                el.className = 'tech-tag-mobile';
                el.innerText = item.name;
                container.appendChild(el);
            });
        } else {
            // PC: 3D Sphere
            container.classList.remove('mobile-scroll');
            const tags = [];

            techStack.forEach(item => {
                const el = document.createElement('a');
                el.className = 'tech-tag-3d';
                el.innerText = item.name;
                container.appendChild(el);
                tags.push({ el, x:0, y:0, z:0 });
            });

            let radius = 120; // Smaller radius to fit
            const dtr = Math.PI/180;
            let lasta=1, lastb=1;
            let active=false, mouseX=0, mouseY=0;

            // Init positions
            tags.forEach((tag, i) => {
                let phi = Math.acos(-1 + (2*i+1)/tags.length);
                let theta = Math.sqrt(tags.length * Math.PI) * phi;
                tag.x = radius * Math.cos(theta) * Math.sin(phi);
                tag.y = radius * Math.sin(theta) * Math.sin(phi);
                tag.z = radius * Math.cos(phi);
            });

            container.onmouseover = () => active=true;
            container.onmouseout = () => active=false;
            container.onmousemove = (e) => {
                let rect = container.getBoundingClientRect();
                mouseX = (e.clientX - (rect.left + rect.width/2)) / 5;
                mouseY = (e.clientY - (rect.top + rect.height/2)) / 5;
            };

            const update = () => {
                let a, b;
                if(active) {
                    a = (-Math.min(Math.max(-mouseY, -200), 200)/radius) * 2;
                    b = (Math.min(Math.max(-mouseX, -200), 200)/radius) * 2;
                } else {
                    a = lasta * 0.98; // Auto rotate
                    b = lastb * 0.98;
                }
                lasta=a; lastb=b;

                if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01 && !active) a=0.5; // Keep spinning slowly

                let sa=Math.sin(a*dtr), ca=Math.cos(a*dtr);
                let sb=Math.sin(b*dtr), cb=Math.cos(b*dtr);

                tags.forEach(tag => {
                    let rx1=tag.x, ry1=tag.y*ca - tag.z*sa, rz1=tag.y*sa + tag.z*ca;
                    let rx2=rx1*cb + rz1*sb, ry2=ry1, rz2=rx1*-sb + rz1*cb;
                    tag.x=rx2; tag.y=ry2; tag.z=rz2;

                    let scale = (tag.z + radius)/(2*radius) + 0.5;
                    let opacity = (tag.z + radius)/(2*radius) + 0.2;

                    tag.el.style.opacity = Math.min(Math.max(opacity, 0.1), 1);
                    tag.el.style.zIndex = parseInt(scale*100);
                    let left = tag.x + container.offsetWidth/2 - tag.el.offsetWidth/2;
                    let top = tag.y + container.offsetHeight/2 - tag.el.offsetHeight/2;
                    tag.el.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
                });
                requestAnimationFrame(update);
            };
            update();
        }
    }
}