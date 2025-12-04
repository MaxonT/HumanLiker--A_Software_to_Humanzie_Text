# 🚨 Render 部署紧急修复

## 当前错误

1. **路径错误**：`cd: /opt/render/project/src/HumanLiker0.5/backend: No such file or directory`
2. **模块找不到**：`Cannot find module '/opt/render/project/src/HumanLiker0.5/backend/src/db/index.js'`

## ✅ 立即修复（3步）

### 步骤 1：在 Render 仪表板设置根目录

1. 登录 https://dashboard.render.com
2. 选择你的服务 → **Settings**
3. 找到 **Root Directory** 字段
4. 设置为：`backend` （或者 `HumanLiker0.5/backend` 如果上面不行）
5. 点击 **Save**

### 步骤 2：更新构建命令

在 **Settings** → **Build & Deploy** 中：

- **Build Command**: `npm install`
- **Start Command**: `npm start`

（移除 `cd backend &&` 部分，因为根目录已经设置为 backend）

### 步骤 3：设置环境变量

在 **Settings** → **Environment** 中添加：

```
NODE_VERSION = 20
NODE_ENV = production
PORT = 10000
```

保存后手动触发部署。

## 📋 完整配置清单

### Root Directory（最重要！）
```
backend
```

### Build Command
```
npm install
```

### Start Command
```
npm start
```

### Environment Variables
```
NODE_VERSION=20
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

## 🔍 如果根目录设置为 `backend` 不行

尝试设置为完整路径：
```
HumanLiker0.5/backend
```

或者检查 Render 的项目结构，根据实际路径调整。

## 📞 更多帮助

- `backend/RENDER_PATH_FIX.md` - 详细路径修复说明
- `backend/QUICK_FIX.md` - Node.js 版本问题

