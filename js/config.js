// 配置文件 - 提取自各个JavaScript文件的关键配置
// 创建日期: 2025-11-20

const SiteConfig = {
  // bj.js 配置
  stars: {
    count: 300,
    refreshInterval: 50
  },

  // main.js 配置
  animation: {
    elementUp: {
      delay: 0,
      increment: 150
    }
  },
  
  background: {
    imagePaths: [
      "/images/bj/1.jpg",
      "/images/bj/2.jpg",
      "/images/bj/3.jpg",
      "/images/bj/4.jpg",
      "/images/bj/5.jpg",
      "/images/bj/6.jpg",
      "/images/bj/7.jpg"
    ]
  },
  
  hitokoto: {
    apiUrl: 'https://v1.hitokoto.cn?c=c&c=d&c=i&c=k'
  },

  // about.js 配置
  github: {
    username: 'listener-He'
  },
  
  blog: {
    rssUrl: 'https://blog.hehouhui.cn/api/rss'
  },

  // 通用缓存键与TTL（毫秒）
  cacheKeys: {
    github: { key: 'gh_data_v2', ttlMs: 3600000 },
    blog: { key: 'blog_data_v2', ttlMs: 3600000 }
  },
  
  techStack: [
    { name: 'Java', category: 'core', weight: 5 },
    { name: 'Spring Boot', category: 'backend', weight: 5 },
    { name: 'JavaScript', category: 'core', weight: 5 },
    { name: 'Python', category: 'core', weight: 4 },
    { name: 'WebFlux', category: 'backend', weight: 5 },
    { name: 'Reactor', category: 'backend', weight: 5 },
    { name: 'TypeScript', category: 'core', weight: 4 },
    { name: 'Spring Cloud', category: 'backend', weight: 4 },
    { name: 'Go', category: 'core', weight: 3 },
    { name: 'MySQL', category: 'data', weight: 4 },
    { name: 'Redis', category: 'data', weight: 4 },
    { name: 'MongoDB', category: 'data', weight: 3 },
    { name: 'Docker', category: 'ops', weight: 4 },
    { name: 'Kubernetes', category: 'ops', weight: 3 },
    { name: 'OpenAI API', category: 'ai', weight: 3 },
    { name: 'LangChain', category: 'ai', weight: 3 },
    { name: 'TensorFlow', category: 'ai', weight: 2 },
    { name: 'PyTorch', category: 'ai', weight: 2 },
    { name: 'Elasticsearch', category: 'data', weight: 3 },
    { name: 'RabbitMQ', category: 'data', weight: 2 },
    { name: 'Kafka', category: 'data', weight: 2 },
    { name: 'Jenkins', category: 'ops', weight: 3 },
    { name: 'Git', category: 'ops', weight: 4 },
    { name: 'Linux', category: 'ops', weight: 3 },
    { name: 'AWS', category: 'ops', weight: 2 },
    { name: 'Nginx', category: 'ops', weight: 2 },
    { name: 'Spring Security', category: 'backend', weight: 3 },
    { name: 'MyBatis', category: 'backend', weight: 3 },
    { name: 'JPA', category: 'backend', weight: 2 },
    { name: 'Dubbo', category: 'backend', weight: 2 },
    { name: 'Netty', category: 'backend', weight: 2 },
    { name: 'Transformers', category: 'ai', weight: 2 },
    { name: 'Scikit-learn', category: 'ai', weight: 2 },
    { name: 'Ollama', category: 'ai', weight: 1 },
    { name: 'Dify', category: 'ai', weight: 1 },
    { name: 'Spring AI', category: 'ai', weight: 1 },
    { name: 'ClickHouse', category: 'data', weight: 1 },
    { name: 'Postgresql', category: 'data', weight: 1 }
  ],

  // 默认数据（当API或RSS不可用时使用）
  defaults: {
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
  },
  
  socialCards: {
    rings: [130, 180, 230],
    goldenAngle: 137.5,
    baseSpeed: 16
  },
  
  artalk: {
    server: 'https://artalk.hehouhui.cn',
    site: 'Honesty的主页',
    placeholder: '来说点什么吧...',
    noComment: '暂无评论',
    sendBtn: '发送'
  },
  
  animationSettings: {
    observerOptions: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    },
    itemObserverOptions: {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    }
  },
  
  // 开发环境配置
  dev: {
    isLocal: (typeof location !== 'undefined') ? (location.hostname.indexOf('localhost') > -1 || location.hostname.indexOf('127.0.0.1') > -1) : false
  }
};

if (Array.isArray(SiteConfig.techStack)) {
  const categoryGradientMap = {
    core: 7,
    backend: 4,
    data: 9,
    ops: 10,
    ai: 3
  };
  const vividSet = [1, 4, 7, 8];

  SiteConfig.techStack = SiteConfig.techStack.map((item) => {
    const name = item.name || '';
    const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (item.gradientId && Number.isFinite(Number(item.gradientId))) {
      return { ...item, gradientId: Math.max(1, Math.min(10, Number(item.gradientId))) };
    }
    let base = categoryGradientMap[item.category] || ((hash % 10) + 1);
    if (Number(item.weight) >= 5) {
      base = vividSet[hash % vividSet.length];
    }
    return { ...item, gradientId: base };
  });
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SiteConfig;
} else if (typeof window !== 'undefined') {
  window.SiteConfig = SiteConfig;
}