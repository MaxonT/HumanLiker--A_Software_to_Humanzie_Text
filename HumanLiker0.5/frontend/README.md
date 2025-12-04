# Frontend - HumanLiker

HumanLiker 前端应用。

## 文件说明

- `index.html` - 主页面
- `core.js` - 核心前端逻辑，包含所有交互功能
- `style.css` - 样式文件
- `api.js` - API 客户端模块（可选，目前 API 调用集成在 core.js 中）
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

前端默认连接 `http://localhost:3000/api`，如果需要修改，请编辑 `core.js` 中的 `API_BASE_URL` 常量。

## 特性

- 响应式设计
- 8 种语言支持
- 主题切换（浅色/深色/自动）
- 实时文本改写
- KPI 指标显示
- Toast 通知系统


