/* about.js - Robust Core with i18n & 3D Cloud */

$(document).ready(function() {
    new AppManager();
});

class AppManager {
    constructor() {
        this.i18n = new I18nManager();
        this.theme = new ThemeManager();
        this.data = new DataFetcher();
        this.ui = new UIManager();
    }
}

/* ===========================
   1. Internationalization
   =========================== */
class I18nManager {
    constructor() {
        this.lang = localStorage.getItem('lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
        this.dict = {
            zh: {
                "nav.home": "首页", "nav.about": "关于", "nav.blog": "博客",
                "profile.status": "在线", "profile.name": "Honesty", "profile.role": "Java 后端 & AI 探索者", "profile.location": "上海",
                "bio.title": "关于我", "bio.desc": "我是一名充满热情的Java后端开发工程师，专注于AI技术的探索与应用。来自湖南，现在上海工作，享受在这座充满活力的城市中追求技术梦想。", "bio.quote": "我追求技术的深度理解而非广度堆砌，每一项技术的学习都源于解决实际问题的内在驱动。",
                "stats.exp": "编程年限", "stats.repos": "开源项目", "stats.followers": "关注者",
                "mbti.type": "提倡者", "mbti.desc": "善于深度思考，注重细节，通过代码创造有意义的产品。",
                "mbti.tag1": "理想主义", "mbti.tag2": "深度洞察", "mbti.tag3": "利他精神",
                "tech.title": "技术栈宇宙", "interest.title": "个人兴趣",
                "interest.cycling": "骑行", "interest.cycling_desc": "用车轮丈量城市边界",
                "interest.reading": "阅读", "interest.reading_desc": "记录思考的轨迹",
                "interest.opensource": "开源", "interest.opensource_desc": "用代码连接世界",
                "github.title": "开源贡献", "blog.title": "最新文章", "blog.more": "查看全部", "comment.title": "留言板",
                "modal.wechat_title": "关注公众号", "modal.wechat_desc": "扫码获取技术干货"
            },
            en: {
                "nav.home": "Home", "nav.about": "About", "nav.blog": "Blog",
                "profile.status": "Available", "profile.name": "Honesty", "profile.role": "Java Backend & AI Dev", "profile.location": "Shanghai",
                "bio.title": "About Me", "bio.desc": "I am a passionate Java Backend Engineer focused on AI exploration. Based in Shanghai, originally from Hunan, enjoying the pursuit of technical dreams in this vibrant city.", "bio.quote": "I seek deep understanding over broad stacking. Every skill I learn is driven by the need to solve real problems.",
                "stats.exp": "Years Exp", "stats.repos": "Projects", "stats.followers": "Followers",
                "mbti.type": "Advocate", "mbti.desc": "Deep thinker, detail-oriented, creating meaningful products through code.",
                "mbti.tag1": "Idealism", "mbti.tag2": "Insight", "mbti.tag3": "Altruism",
                "tech.title": "Tech Universe", "interest.title": "Interests",
                "interest.cycling": "Cycling", "interest.cycling_desc": "Measuring the world on wheels",
                "interest.reading": "Reading", "interest.reading_desc": "Recording thoughts via text",
                "interest.opensource": "Open Source", "interest.opensource_desc": "Connecting world with code",
                "github.title": "Open Source", "blog.title": "Latest Posts", "blog.more": "View All", "comment.title": "Message Board",
                "modal.wechat_title": "Official Account", "modal.wechat_desc": "Scan for tech insights"
            }
        };
        this.init();
    }

    init() {
        this.render();
        $('#lang-toggle').on('click', () => {
            this.lang = this.lang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', this.lang);
            this.render();
        });
    }

    render() {
        const t = this.dict[this.lang];
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            if(t[key]) $(this).text(t[key]);
        });
        $('.lang-text').text(this.lang === 'zh' ? 'EN' : '中');
    }
}

/* ===========================
   2. Theme Manager
   =========================== */
class ThemeManager {
    constructor() {
        this.init();
    }
    init() {
        const saved = localStorage.getItem('theme') || 'day';
        if (saved === 'night') document.documentElement.setAttribute('data-theme', 'night');

        $('#theme-toggle').on('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'night' ? 'day' : 'night';
            if (next === 'night') document.documentElement.setAttribute('data-theme', 'night');
            else document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', next);
        });
    }
}

/* ===========================
   3. Data & API (Robust)
   =========================== */
class DataFetcher {
    constructor() {
        this.fallbackRepos = [
            { name: "yunxiao-LLM-reviewer", description: "AI Code Reviewer based on LLM", stargazers_count: 9, html_url: "#" },
            { name: "hexo-theme-stellar", description: "A beautiful Hexo theme", stargazers_count: 5, html_url: "#" },
            { name: "Universal-IoT-Java", description: "IoT Platform implementation", stargazers_count: 2, html_url: "#" }
        ];
        this.fallbackPosts = [
            { title: "Vector Database Guide", pubDate: "2025-01-02", category: "Tech", link: "#" },
            { title: "Spring Boot 3.0 Features", pubDate: "2024-12-30", category: "Java", link: "#" },
            { title: "Microservices Patterns", pubDate: "2024-12-28", category: "Arch", link: "#" }
        ];
        this.init();
    }

    init() {
        this.fetchGitHub();
        this.fetchBlog();
    }

    fetchGitHub() {
        const user = (window.SiteConfig && window.SiteConfig.github) ? window.SiteConfig.github.username : 'listener-He';

        // 1. User Stats
        $.ajax({
            url: `https://api.github.com/users/${user}`,
            timeout: 5000
        }).done(data => {
            const years = new Date().getFullYear() - new Date(data.created_at).getFullYear();
            $('#coding-years').text(years + "+");
            $('#github-repos').text(data.public_repos);
            $('#github-followers').text(data.followers);
        }).fail(() => {
            console.warn("GH API fail, using default stats");
        });

        // 2. Repos
        $.ajax({
            url: `https://api.github.com/users/${user}/repos?sort=stars&per_page=6`,
            timeout: 5000
        }).done(data => this.renderRepos(data))
            .fail(() => this.renderRepos(this.fallbackRepos));
    }

    renderRepos(list) {
        let html = '';
        list.slice(0, 5).forEach(repo => {
            // Fix: handle API field naming differences
            const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : (repo.stars || 0);
            const desc = repo.description || 'No description provided.';
            html += `
            <div class="repo-card" onclick="window.open('${repo.html_url}')">
                <div class="repo-top">
                    <span>${repo.name}</span>
                    <span style="color:#f1c40f">★ ${stars}</span>
                </div>
                <div class="repo-desc" title="${desc}">${desc}</div>
            </div>`;
        });
        $('#projects-container').html(html);
    }

    fetchBlog() {
        // Direct fetch from JSON to avoid CORS issues with RSS
        fetch('data/articles.json')
            .then(res => res.json())
            .then(data => this.renderBlog(data))
            .catch(() => this.renderBlog(this.fallbackPosts));
    }

    renderBlog(list) {
        let html = '';
        list.slice(0, 5).forEach(art => {
            const date = art.pubDate ? art.pubDate.split('T')[0] : 'Recent';
            html += `
            <div class="blog-card" onclick="window.open('${art.link}')">
                <div class="b-title">${art.title}</div>
                <div class="b-meta">
                    <span>${date}</span>
                    <span style="color:var(--accent-color)">#${art.category}</span>
                </div>
            </div>`;
        });
        $('#blog-container').html(html);
    }
}

/* ===========================
   4. UI Manager (Tech Cloud)
   =========================== */
class UIManager {
    constructor() {
        this.initTechCloud();
        this.initModal();
        this.initComments();
    }

    initModal() {
        window.toggleWechat = function() {
            const m = $('#wechat-modal');
            if(m.is(':visible')) m.fadeOut(200);
            else m.css('display','flex').hide().fadeIn(200);
        };
        $('#wechat-modal').on('click', function(e) {
            if(e.target === this) toggleWechat();
        });
    }

    initComments() {
        if(typeof Artalk !== 'undefined' && window.SiteConfig && window.SiteConfig.artalk) {
            try {
                Artalk.init({
                    el: '#artalk-container',
                    pageKey: '/about', // Hardcoded for this page or use window.location.pathname
                    pageTitle: 'About Me',
                    server: window.SiteConfig.artalk.server,
                    site: window.SiteConfig.artalk.site,
                    darkMode: document.documentElement.getAttribute('data-theme') === 'night'
                });
            } catch(e) { console.error("Artalk error", e); }
        } else {
            $('#artalk-container').html('<div style="text-align:center;padding:20px;color:#999">Comments loading...</div>');
        }
    }

    initTechCloud() {
        const container = document.getElementById('tech-cloud-container');
        if(!container) return;

        const isMobile = window.innerWidth < 768;
        const techStack = (window.SiteConfig && window.SiteConfig.techStack) ? window.SiteConfig.techStack : [
            {name:'Java',weight:5},{name:'Spring',weight:5},{name:'Docker',weight:4},
            {name:'K8s',weight:3},{name:'Python',weight:4},{name:'Redis',weight:4}
        ];

        container.innerHTML = '';
        const tags = [];

        // Colors for tags
        const colors = ['#6c5ce7', '#0984e3', '#00b894', '#fdcb6e', '#e17055', '#d63031'];

        techStack.forEach((item, i) => {
            const el = document.createElement('span');
            el.className = 'tech-tag';
            el.innerText = item.name;
            el.style.color = colors[i % colors.length];
            // Mobile: relative positioning handled by CSS Flexbox
            // PC: absolute positioning handled by JS below
            container.appendChild(el);
            tags.push({ el, x:0, y:0, z:0 });
        });

        if(isMobile) return; // CSS flexbox handles mobile

        // PC 3D Logic
        let radius = 130;
        let dtr = Math.PI / 180;
        let mcList = [];
        let active = false;
        let lasta = 1, lastb = 1;
        let size = 200;
        let mouseX = 0, mouseY = 0;

        // Position Tags on Sphere
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
            mouseX = (e.clientX - (rect.left + rect.width/2)) / 5;
            mouseY = (e.clientY - (rect.top + rect.height/2)) / 5;
        };

        function update() {
            let a, b;
            if(active) {
                a = (-Math.min(Math.max(-mouseY, -size), size) / radius) * 2;
                b = (Math.min(Math.max(-mouseX, -size), size) / radius) * 2;
            } else {
                a = lasta * 0.96;
                b = lastb * 0.96;
            }
            lasta = a; lastb = b;

            if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01) return requestAnimationFrame(update);

            let sa=Math.sin(a*dtr), ca=Math.cos(a*dtr);
            let sb=Math.sin(b*dtr), cb=Math.cos(b*dtr);

            tags.forEach(tag => {
                let rx1 = tag.x, ry1 = tag.y*ca + tag.z*-sa, rz1 = tag.y*sa + tag.z*ca;
                let rx2 = rx1*cb + rz1*sb, ry2 = ry1, rz2 = rx1*-sb + rz1*cb;
                tag.x = rx2; tag.y = ry2; tag.z = rz2;

                let alpha = (tag.z + radius) / (2*radius);
                let scale = alpha + 0.6;
                let opacity = alpha + 0.4;

                tag.el.style.opacity = Math.min(Math.max(opacity, 0.2), 1);
                tag.el.style.zIndex = parseInt(scale * 100);

                // Center offset
                let left = tag.x + container.offsetWidth/2 - tag.el.offsetWidth/2;
                let top = tag.y + container.offsetHeight/2 - tag.el.offsetHeight/2;
                tag.el.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
            });
            requestAnimationFrame(update);
        }
        update();
    }
}