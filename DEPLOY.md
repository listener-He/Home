# 部署与自定义指南

本文档详细介绍如何在不同环境下部署站点，以及如何自定义配置、样式与数据源。阅读完成后，你可以将本项目快速上线并按需个性化。

## 环境要求

- 任意静态站点环境（Nginx/Apache/Node 静态服务、Vercel、Netlify、GitHub Pages 等）
- 现代浏览器（移动/桌面）

## 本地预览

- 直接在本地打开 `index.html` 与 `about.html` 即可（双击或使用任意静态服务器）
- 推荐使用简易静态服务器（任选其一）：
  - Python：`python3 -m http.server 8080`
  - Node：`npx serve -s .`
  - Nginx：配置示例见下文

## 生产部署

### Vercel/Netlify

- 新建项目并选择本仓库（或上传构建产物）
- 框架选择：None（静态），构建命令：无，输出目录：根目录（包含 HTML/CSS/JS）
- 部署后即可通过平台提供的域名访问；可绑定自定义域名

### GitHub Pages

- 将仓库设置为公开
- 在仓库 Settings → Pages：选择 `Branch: main` 与根目录
- 等待构建完成后，使用生成的 `https://<username>.github.io/<repo>/` 访问

### Nginx

```
server {
    listen 80;
    server_name your.domain.com;
    root /var/www/your-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(css|js|png|jpg|gif|ico)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

## 站点配置（js/config.js）

- GitHub 与 RSS
  - `SiteConfig.github.username`：GitHub 用户名
  - `SiteConfig.cacheKeys.github`：缓存键与过期时间（毫秒）
  - `SiteConfig.blog.rssUrl`：RSS 接口地址
  - `SiteConfig.cacheKeys.blog`：缓存键与过期时间（毫秒）
- Artalk 评论
  - `SiteConfig.artalk.server` 与 `SiteConfig.artalk.site`
  - `dev.isLocal`：本地或非 HTTPS 环境下自动显示“评论区已关闭”提示
- 主题与语言
  - 主题缓存：`SiteConfig.cacheKeys.theme.key/ttlMs`
  - 语言存取：使用 `localStorage('lang')`，页面内可切换 CN/EN

> 安全提示：请勿在 `config.js` 中硬编码敏感信息（如 Token）。本项目不需要服务端密钥；如需扩展 API，请在后端代理或使用服务端环境变量。

## 自定义样式

- 主题变量（css/about.css 顶部 `:root` 与 `[data-theme="night"]`）
  - 白天：`--text-primary/secondary/tertiary`、`--glass-bg`、`--accent`
  - 夜间：深色背景、微光强度、边框透明度等
- 视觉模块
  - 兴趣卡片：圆角、边框与阴影在白天/夜间分别优化，可调整对比
  - 技术栈标签：PC 3D 球、移动端三行滚动；可修改渐变方案与速度
  - 标题渐变：仅在白天保留轻微渐变，正文统一实色以提升可读性
- 评论组件（Artalk）
  - 桌/移端响应式：容器 `#artalk-container` 自动加 `.atk-mobile/.atk-desktop`
  - 移动端折叠：评论内容默认折叠，按钮“展开/收起”交互

## 数据缓存与性能

- GitHub 与 RSS 均采用前端缓存（`localStorage`）与过期策略
- GitHub 数据已在写入缓存前进行精简（仅保留页面所需字段）
- 渲染时添加淡入过渡与骨架占位，保证加载过程的平滑体验

## 常见问题

- 评论区在本地或非 HTTPS 环境显示“评论区已关闭”
  - 这是预期行为；上线到 HTTPS 环境并设置 `SiteConfig.artalk` 可开启
- 夜间兴趣文本未显示渐变
  - 清理浏览器缓存后重试；检查 CSS 覆盖是否被自定义样式覆盖
- GitHub/RSS 数据为空
  - 检查 `SiteConfig` 中的用户名与 RSS 接口；或查看浏览器控制台网络请求

## 进一步扩展

- 接入更多数据源（如 Twitter/知乎/掘金）
- 为 3D 技术栈添加交互（点击跳链接、标签分组）
- 增加文章详情页与分页列表

---

如果你在部署或自定义过程中遇到问题，欢迎提 Issue 或进行二次开发贡献。