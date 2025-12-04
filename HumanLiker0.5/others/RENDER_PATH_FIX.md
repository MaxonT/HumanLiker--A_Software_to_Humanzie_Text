# Render 路径问题修复

## 问题描述

Render 部署时出现路径错误：
```
cd: /opt/render/project/src/HumanLiker0.5/backend: No such file or directory
Cannot find module '/opt/render/project/src/HumanLiker0.5/backend/src/db/index.js'
```

## 原因

Render 在项目根目录（`HumanLiker0.5/`）运行构建命令，但构建命令尝试 `cd backend`，导致路径问题。

## ✅ 解决方案

### 方案 1：在 Render 仪表板设置根目录（推荐）

1. 登录 Render 仪表板
2. 进入你的服务 → **Settings**
3. 找到 **Root Directory** 设置
4. 设置为：`backend`
5. 更新构建和启动命令：
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 保存并重新部署

### 方案 2：使用 render.yaml（如果使用 Blueprint）

项目根目录已创建 `render.yaml`，包含正确的配置：

```yaml
services:
  - type: web
    name: humanliker-backend
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
```

如果使用 Render Blueprint，确保：
1. `render.yaml` 在项目根目录（`HumanLiker0.5/render.yaml`）
2. 连接 Git 仓库时选择 "Blueprint"

### 方案 3：调整构建命令（如果无法设置根目录）

如果无法设置根目录，修改构建命令：

**Build Command:**
```bash
cd HumanLiker0.5/backend && npm install
```

**Start Command:**
```bash
cd HumanLiker0.5/backend && npm start
```

但这种方法依赖于 Render 的项目结构，不推荐。

## 📝 推荐配置

### 在 Render 仪表板中设置：

**Root Directory:** `backend`

**Build Command:** 
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
NODE_VERSION=20
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

## 🔍 验证

部署后检查日志，应该看到：
- ✅ 在正确的目录中运行 `npm install`
- ✅ 找到 `server.js` 和所有依赖
- ✅ 服务器成功启动

## 📞 需要帮助？

如果问题仍然存在：
1. 检查 Render 的 "Events" 日志查看完整错误
2. 确认项目的 Git 仓库结构
3. 查看 Render 文档：https://render.com/docs/build-settings


