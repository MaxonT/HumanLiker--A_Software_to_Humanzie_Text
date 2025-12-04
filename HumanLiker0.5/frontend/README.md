# Frontend - HumanLiker

HumanLiker 前端应用。

## 文件说明

- `index.html` - 主页面
- `core.js` - 核心前端逻辑，包含所有交互功能
- `style.css` - 样式文件
- `api.js` - API 客户端模块（可选，目前 API 调用集成在 core.js 中）
- `config.js` - API 配置文件
- `vercel.json` - Vercel 部署配置
- `assets/` - 静态资源目录（图片等）

## 运行方式

### 方式 1: Python HTTP Server

```bash
python3 -m http.server 8080
```

### 方式 2: Node.js http-server

```bash
npx http-server -p 8080
```

### 方式 3: VS Code Live Server

使用 VS Code 的 Live Server 扩展，右键点击 `index.html` 选择 "Open with Live Server"

## 配置

### API 基础 URL 配置

前端默认连接 `http://localhost:3000/api`。可以通过以下方式修改：

#### 方式 1: 修改 config.js（推荐）

编辑 `config.js` 文件，修改 `API_BASE_URL`：

```javascript
window.__API_CONFIG__ = {
  API_BASE_URL: 'https://your-backend-url.com/api'
};
```

#### 方式 2: 在 index.html 中直接设置

在 `index.html` 的 script 标签中设置：

```javascript
window.__API_URL__ = 'https://your-backend-url.com/api';
```

## Vercel 部署

### 部署步骤

1. **在 Vercel 中导入项目**
   - 访问 https://vercel.com
   - 导入 Git 仓库
   - 设置 Root Directory 为 `frontend`

2. **配置环境变量（重要！）**

   在 Vercel 项目设置中添加环境变量：

   - **变量名**: `VITE_API_URL` 或 `NEXT_PUBLIC_API_URL`
   - **变量值**: 你的后端 API URL（例如：`https://your-backend.onrender.com/api`）

3. **构建配置**

   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: （留空或 `echo "No build needed"`）
   - **Output Directory**: `.`

4. **手动配置 API URL（如果环境变量不可用）**

   由于静态 HTML 无法直接读取 Vercel 环境变量，你需要：

   - **选项 A**: 在部署前手动编辑 `config.js`，设置生产环境的 API URL
   - **选项 B**: 使用 Vercel 的 Build Command 在构建时替换配置
   - **选项 C**: 在 `index.html` 中直接硬编码生产环境的 API URL

### Vercel 配置示例

```json
{
  "buildCommand": "echo 'Building frontend...'",
  "outputDirectory": ".",
  "framework": null
}
```

### 修复 404 错误

如果部署后出现 404 错误：

1. **检查 vercel.json 配置**
   - 确保 `vercel.json` 存在并配置了 SPA 路由重写规则

2. **检查 API URL 配置**
   - 确保 `config.js` 中设置了正确的生产环境 API URL
   - 或确保 `index.html` 中设置了 `window.__API_URL__`

3. **检查后端 CORS 配置**
   - 确保后端允许你的 Vercel 域名访问
   - 在 `backend/.env` 中设置 `CORS_ORIGIN=https://your-frontend.vercel.app`

## 特性

- 响应式设计
- 8 种语言支持
- 主题切换（浅色/深色/自动）
- 实时文本改写
- KPI 指标显示
- Toast 通知系统

