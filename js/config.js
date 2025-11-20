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
    username: 'listener-He',
    cache: {
      stats: {
        key: 'github_stats_cache',
        timeKey: 'github_stats_cache_time',
        expirationDays: 3
      },
      projects: {
        key: 'github_projects_cache',
        timeKey: 'github_projects_cache_time',
        expirationDays: 3
      },
      commits: {
        key: 'github_commits_cache',
        timeKey: 'github_commits_cache_time',
        expirationHours: 24
      }
    }
  },
  
  blog: {
    rssUrl: 'https://blog.hehouhui.cn/api/rss',
    cache: {
      key: 'blog_articles_cache',
      timeKey: 'blog_articles_cache_time',
      expirationDays: 1
    }
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
    isLocal: location.hostname.indexOf( 'localhost') > -1 || location.hostname.indexOf( '127.0.0.1') > -1
  }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SiteConfig;
} else if (typeof window !== 'undefined') {
  window.SiteConfig = SiteConfig;
}