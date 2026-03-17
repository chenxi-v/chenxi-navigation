# 晨曦导航

一个现代化的个人导航网站，采用 React 19 + Vite 7 + Tailwind CSS 构建，支持深色模式、实时天气显示和自定义书签管理。

## 项目结构

```
chenxidaohang-main/
  ├── public/                      # 静态资源目录
  │   ├── assets/
  │   │   ├── icons/              # 网站图标目录
  │   │   │   ├── github.svg
  │   │   │   ├── gitlab.svg
  │   │   │   └── ...
  │   │   └── backgrounds/        # 背景图片目录
  │   │       ├── kumtanom.jpg
  │   │       ├── kumtanom-dark.png
  │   │       └── ...
  │   └── nav-data.json          # 导航数据配置
  │
  ├── src/
  │   ├── components/             # React 组件
  │   │   ├── BackToTop.jsx
  │   │   ├── CategoryCard.jsx
  │   │   ├── CategoryNav.jsx
  │   │   ├── LinkItem.jsx
  │   │   ├── SearchBox.jsx
  │   │   ├── ThemeToggle.jsx
  │   │   └── WeatherWidget.jsx
  │   ├── context/               # React Context
  │   │   └── ThemeContext.jsx
  │   ├── App.jsx                # 主应用组件
  │   ├── index.css              # 全局样式
  │   └── main.jsx              # 应用入口
  │
  ├── index.html                 # HTML 模板
  ├── package.json              # 项目依赖
  ├── tailwind.config.js        # Tailwind CSS 配置
  ├── vite.config.js            # Vite 配置
  └── README.md                 # 项目说明文档
```

## 功能特性

- 📱 响应式设计，完美支持移动端和桌面端
- 🌓 深色/浅色模式切换
- 🔍 多搜索引擎支持（必应、谷歌、百度）
- 🌤️ 实时天气信息（基于 Open-Meteo API）
- ⏰ 实时时间和日期显示
- 📚 可自定义的书签分类管理
- 🎨 现代化 UI 设计，毛玻璃效果
- ⚡ 快速加载，优化性能
- 🎯 平滑滚动和动画效果

## 技术栈

- **React 19** - 用户界面库
- **Vite 7** - 构建工具和开发服务器
- **Tailwind CSS** - CSS 框架
- **Open-Meteo API** - 天气数据
- **Cloudflare Pages** - 部署平台

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看网站

### 构建生产版本

```bash
npm run build
```

构建后的文件将生成在 `dist` 目录中

### 预览生产构建

```bash
npm run preview
```

## 部署到 Cloudflare Pages

### 方法一：通过 GitHub 集成（推荐）

1. **将项目推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/chenxidaohang-main.git
   git push -u origin main
   ```

2. **在 Cloudflare Pages 创建项目**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Workers & Pages** → **Pages**
   - 点击 **Create application** → **Connect to Git**
   - 选择 GitHub 并授权访问您的仓库
   - 选择 `chenxidaohang-main` 仓库

3. **配置构建设置**
   - **Project name**: chenxidaohang-main（或自定义）
   - **Production branch**: main
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

4. **部署**
   - 点击 **Save and Deploy**
   - 等待构建完成（通常需要 1-2 分钟）
   - 部署成功后，Cloudflare 会提供一个 `.pages.dev` 域名

### 方法二：直接上传 dist 文件夹

1. 构建项目：
   ```bash
   npm run build
   ```

2. 在 Cloudflare Pages 创建项目：
   - 进入 **Workers & Pages** → **Pages**
   - 点击 **Create application** → **Upload assets**
   - 将 `dist` 文件夹中的所有文件上传
   - 点击 **Deploy Site**

### 自定义域名（可选）

1. 在 Pages 项目设置中进入 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（如 `nav.yourdomain.com`）
4. 按照提示配置 DNS 记录

## 自定义配置

### 修改导航数据

编辑 `public/nav-data.json` 文件来添加或修改书签：

```json
{
  "categories": [
    {
      "id": "common",
      "name": "我的常用",
      "icon": "⭐",
      "links": [
        {
          "name": "网站名称",
          "url": "https://example.com",
          "icon": "assets/icons/example.svg",
          "desc": "网站描述"
        }
      ]
    }
  ]
}
```

### 添加自定义图标

1. 将图标文件放入 `public/assets/icons/` 目录
2. 在 `nav-data.json` 中引用图标路径

### 修改背景图片

1. 将背景图片放入 `public/assets/backgrounds/` 目录
2. 在 `src/App.jsx` 中修改背景图片路径：
   ```jsx
   style={{ 
     backgroundImage: isDark 
       ? 'url(/assets/backgrounds/your-dark-bg.jpg)' 
       : 'url(/assets/backgrounds/your-light-bg.jpg)'
   }}
   ```

### 修改主题颜色

编辑 `tailwind.config.js` 文件来自定义主题颜色：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#4ade80',
          500: '#22c55e',
        }
      }
    }
  }
}
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0 (2024)
- 初始版本发布
- 支持 React 19 + Vite 7 + Tailwind CSS
- 深色/浅色模式切换
- 实时天气和时间显示
- 多搜索引擎支持
- 响应式设计
