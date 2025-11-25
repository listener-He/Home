# Honesty's Personal Website

一个轻量、优雅、现代化个人主页，融合科技感与个性化元素，展示个人技术栈、开源项目和博客文章。白天模式强调阅读与信息密度，夜间模式带来渐变与微光的沉浸视觉。

<div align="center">

[![GitHub](https://img.shields.io/github/license/listener-He/Home?color=blue)](https://github.com/listener-He/Home/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/listener-He/Home)](https://github.com/listener-He/Home/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/listener-He/Home)](https://github.com/listener-He/Home/issues)

</div>

## 🌟 项目亮点

现代、响应式个人站点，融合美学设计与技术实力，打造专业个人品牌形象。

### 🎨 视觉设计特色

- **渐变美学**：精心设计的渐变色彩方案，营造现代感视觉体验
- **玻璃态效果**：白天柔和透明，夜间深色半透明，层次分明
- **沉浸式夜间模式**：微光特效与深色主题，保护视力同时提升质感
- **响应式布局**：完美适配桌面、平板、手机等各种设备

### 🚀 核心功能

- ✨ **渐变标题与微光夜间视觉**：仅标题保留渐变，正文统一实色，确保阅读清晰
- 🧊 **玻璃态卡片**：白天柔和、夜间半透明深色，兼顾层次与审美
- 🪐 **技术栈宇宙**：PC 端 3D 标签球；移动端三行无缝横向滚动
- 📦 **内容聚合**：GitHub 开源仓库（星标/分支信息）、RSS 最新文章聚合
- 💬 **评论互动**：Artalk 评论组件，移动端支持折叠/展开，桌/移端自适配样式
- 📊 **网站统计**：集成多种统计服务（不蒜子、百度统计、Google Analytics、51.LA），统一配置管理
- 🌗 **主题与语言**：一键切换 Day/Night 与 CN/EN，自动缓存记忆
- ⚡ **性能与体验**：缓存字段精简、骨架占位与淡入过渡、异步抓取避免阻塞
- 📱 **PWA 支持**：支持安装为本地应用，离线访问核心功能

## 🚀 一键部署

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flistener-He%2FHome)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/listener-He/Home)
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/listener-He/Home)

</div>

## 🖼️ 页面预览

<div align="center">
  <img src="images/home.png" alt="主页" width="32%" />
  <img src="images/about-day.png" alt="关于 · 白天" width="32%" />
  <img src="images/about-night.png" alt="关于 · 夜间" width="32%" />
</div>

## 🧩 页面结构

### 🏠 主页（index）
- 简洁直观的内容入口与导航
- 轻量、清晰、直达的用户体验
- **网站统计**：集成多种统计服务（不蒜子、百度统计、Google Analytics、51.LA）

### 👤 关于页面（about）
- **Profile**：头像、在线状态、个性化标题与社交链接
- **Bio**：简介与格言，支持折叠/展开
- **Stats**：编程年限、开源项目数、关注者
- **MBTI**：人格代码、名称与四元素标签（白天实色高对比；夜间渐变微光）
- **Tech Universe**：PC 3D 标签球；移动端三行滚动标签
- **Interests**：两列卡片，圆角玻璃态，白天清爽、夜间半透明深色
- **Open Source**：GitHub 仓库列表，星标与分支信息
- **Latest Posts**：RSS 文文章列表，标题/日期/分类
- **Comments**：Artalk 评论区域，桌/移端响应式优化
- **网站统计**：集成多种统计服务（不蒜子、百度统计、Google Analytics、51.LA）

## ⚙️ 技术栈与工程细节

- **前端技术**：原生 JS、CSS 与 HTML，无框架依赖
- **评论系统**：Artalk 评论组件（HTTPS 环境启用；本地或非 HTTPS 显示关闭提示）
- **数据获取**：GitHub REST API 拉取用户与仓库信息（写缓存前字段精简）
- **内容聚合**：RSS 解析通过 DOMParser，失败时降级本地 JSON 或默认数据
- **交互体验**：骨架加载与淡入动画、移动端可拖拽悬浮工具、ARIA 辅助属性

## 📁 项目结构

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

## 🎨 CSS 规范

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

## 🚀 快速开始

``shell
# 克隆项目
git clone https://github.com/listener-He/Home.git

# 进入项目目录
cd Home

# 直接打开 HTML 文件预览
open index.html
open about.html
```

站点配置位于 `js/config.js`，用于设置 GitHub 用户名、RSS 地址、缓存策略、Artalk 服务等。

## 📦 部署与自定义

请阅读《部署与自定义指南》获取详细说明：
- [DEPLOY.md](./DEPLOY.md)

详细的部署与自定义指南包含了：
- 一键部署到主流平台（Vercel、Netlify、Cloudflare Pages）
- 本地预览方法
- 生产环境部署配置
- CSS 规范和结构规范
- 拓展功能指南
- 待办事项清单

## 📋 TODO List

### 已完成
- [x] 实现响应式布局，适配桌面、平板和手机设备
- [x] 开发白天/夜间主题切换功能
- [x] 实现中英文国际化支持
- [x] 集成 Artalk 评论系统
- [x] 添加 GitHub 项目展示功能
- [x] 添加博客文章展示功能
- [x] 实现技术栈 3D 球体效果
- [x] 添加一键部署到 Vercel、Netlify 等平台的支持
- [x] 实现移动端优化，包括可拖拽悬浮按钮
- [x] 添加骨架屏加载效果
- [x] 实现数据缓存机制，提升页面加载速度
- [x] 添加淡入动画效果，提升用户体验
- [x] 实现 PWA 支持，支持离线访问

### 待完成
- [ ] 添加更多数据源（如 Twitter、知乎等）
- [ ] 实现技术栈标签的交互功能（点击跳转链接等）
- [ ] 添加文章详情页与分页列表功能
- [ ] 实现更多的个性化定制选项
- [ ] 添加键盘快捷键支持
- [ ] 增加更多动画效果和交互细节
- [ ] 添加更多主题选项（如高对比度模式等）
- [ ] 实现深色模式下的图片优化处理
- [ ] 添加无障碍访问支持（ARIA 属性完善）

## 🙏 鸣谢与致敬

本项目在开发过程中参考和借鉴了以下开源项目：

- [dmego/home.github.io](https://github.com/dmego/home.github.io) - 提供了个人主页的基础框架和设计思路
- [lqbby/Tech-Home](https://github.com/lqbby/Tech-Home) - 提供了技术实现方案和部分UI设计元素

向这些项目的作者表示诚挚的感谢！

同时感谢以下开源项目的支持：

- [Artalk](https://artalk.js.org/) - 评论系统
- [Remix Icon](https://remixicon.com/) - 图标库
- [Normalize.css](https://necolas.github.io/normalize.css/) 与 [BootCDN](https://www.bootcdn.cn/) - 页面基础与加速
- [GitHub](https://github.com/) 与 [RSS](https://www.rssboard.org/) 生态 - 内容聚合支持

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。

## 👨‍💻 作者

**Honesty (HeHouHui)**

- 博客: [blog.hehouhui.cn](https://blog.hehouhui.cn)
- GitHub: [@listener-He](https://github.com/listener-He)
- 邮箱: [hehouhui@foxmail.com](mailto:hehouhui@foxmail.com)

---

<div align="center">

欢迎提出改进建议，或将该站点作为你的个人主页模板进行自定义与二次开发。
</div>