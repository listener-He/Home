# 部署与自定义指南

本文档详细介绍如何在不同环境下部署站点，以及如何自定义配置、样式与数据源。阅读完成后，你可以将本项目快速上线并按需个性化。

## 环境要求

- 任意静态站点环境（Nginx/Apache/Node 静态服务、Vercel、Netlify、GitHub Pages 等）
- 现代浏览器（移动/桌面）

## 一键部署

### Vercel

点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/listener-He/Home)

或者通过命令行部署：
```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目根目录运行
vercel
```

### Netlify

点击下方按钮一键部署到 Netlify：

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/listener-He/Home)

或者通过命令行部署：
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目根目录运行
netlify deploy
```

### Cloudflare Pages

1. 登录 Cloudflare 控制台
2. 进入 Pages 服务
3. 选择 "Create a project"
4. 连接 GitHub 账户并选择此仓库
5. 配置设置：
   - 构建命令：`echo "No build command needed"`
   - 发布目录：`.`
6. 点击 "Deploy"

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

```textmate
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

## 项目结构规范

```
Home/
├── index.html              # 主页
├── about.html              # 关于页面
├── README.md               # 项目说明文档
├── DEPLOY.md               # 部署与自定义指南
├── LICENSE                 # 开源许可证
├── CNAME                   # 自定义域名配置
├── manifest.json           # PWA 应用清单文件
├── vercel.json             # Vercel 配置文件
├── netlify.toml            # Netlify 配置文件
├── _headers                # Netlify 安全头配置
├── _redirects              # Netlify 重定向配置
├── favicon.ico             # 网站图标
├── apple-touch-icon.png    # iOS 主屏图标
├── css/
│   ├── about.css           # 关于页面样式
│   ├── style.css           # 主页样式
│   ├── artalk.css          # 评论系统样式
│   └── iconfont.css        # 字体图标样式
├── js/
│   ├── config.js           # 全局配置文件（包含网站统计配置）
│   ├── main.js             # 主页脚本
│   ├── about.js            # 关于页面脚本
│   ├── bj.js               # 背景效果脚本
│   └── sw.js               # Service Worker（PWA支持）
├── data/
│   ├── articles.json       # 文章数据
│   └── ...                 # 其他数据文件
└── images/
    ├── home.png            # 主页预览图
    ├── about-day.png       # 关于页面白天模式预览图
    ├── about-night.png     # 关于页面夜间模式预览图
    └── ...                 # 其他图片资源
```

## CSS 规范

### 命名规范
- 使用语义化类名，如 `.profile-content`、`.tech-wrapper`
- 组件相关类名以组件名开头，如 `.bento-card`、`.glass-panel`
- 状态类名使用 `is-*` 或 `has-*` 前缀，如 `.is-active`

### 样式组织
- 使用 CSS 自定义属性（变量）管理主题色和常用值
- 遵循移动优先的响应式设计原则
- 组件样式与全局样式分离，便于维护

### 主题管理
- 白天模式样式定义在 `:root` 选择器下
- 夜间模式样式定义在 `[data-theme="night"]` 选择器下
- 使用 `var(--variable-name)` 引用 CSS 变量

### 第三方组件样式
- 第三方组件样式独立成专门的 CSS 文件（如 artalk.css）
- 避免污染主样式文件，保持样式文件职责单一

## 站点配置（js/config.js）

- GitHub 与 RSS
  - `SiteConfig.github.username`：GitHub 用户名
  - `SiteConfig.cacheKeys.github`：缓存键与过期时间（毫秒）
  - `SiteConfig.blog.rssUrl`：RSS 接口地址
  - `SiteConfig.cacheKeys.blog`：缓存键与过期时间（毫秒）
- Artalk 评论
  - `SiteConfig.artalk.server` 与 `SiteConfig.artalk.site`
  - `dev.isLocal`：本地或非 HTTPS 环境下自动显示"评论区已关闭"提示
- 主题与语言
  - 主题缓存：`SiteConfig.cacheKeys.theme.key/ttlMs`
  - 语言存取：使用 `localStorage('lang')`，页面内可切换 CN/EN
- 网站统计
  - `SiteConfig.analytics`：包含不蒜子、百度统计、Google Analytics和51.LA等统计服务的配置
  - 各统计服务通过配置文件统一管理，便于维护和更新

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
  - 移动端折叠：评论内容默认折叠，按钮"展开/收起"交互

## 数据缓存与性能

- GitHub 与 RSS 均采用前端缓存（`localStorage`）与过期策略
- GitHub 数据已在写入缓存前进行精简（仅保留页面所需字段）
- 渲染时添加淡入过渡与骨架占位，保证加载过程的平滑体验

## 常见问题

- 评论区在本地或非 HTTPS 环境显示"评论区已关闭"
  - 这是预期行为；上线到 HTTPS 环境并设置 `SiteConfig.artalk` 可开启
- 夜间兴趣文本未显示渐变
  - 清理浏览器缓存后重试；检查 CSS 覆盖是否被自定义样式覆盖
- GitHub/RSS 数据为空
  - 检查 `SiteConfig` 中的用户名与 RSS 接口；或查看浏览器控制台网络请求

## 拓展功能

### 添加新的数据源
1. 在 `js/config.js` 中添加新的配置项
2. 在 `js/about.js` 的 DataManager 类中添加新的数据获取方法
3. 创建对应的数据渲染方法
4. 在 HTML 中添加展示区域
5. 在 CSS 中添加样式

### 自定义主题色
1. 修改 `css/about.css` 中的 CSS 变量
2. 调整 `:root`（白天模式）和 `[data-theme="night"]`（夜间模式）下的颜色值
3. 确保颜色搭配符合可访问性标准

### 添加新的语言支持
1. 在 `js/about.js` 的 I18nManager 类中添加新的语言字典
2. 在 HTML 元素上添加对应的数据属性
3. 更新语言切换逻辑

### PWA 自定义
1. 修改 `manifest.json` 文件来自定义应用名称、图标和主题色
2. 更新 `js/sw.js` 文件来调整缓存策略和缓存资源
3. 在 HTML 文件中调整 PWA 相关的 meta 标签

---

如果你在部署或自定义过程中遇到问题，欢迎提 Issue 或进行二次开发贡献。