# Render 部署指南

## 问题诊断

您遇到的错误是因为 Render 在错误的路径 `/opt/render/project/src/package.json` 查找文件。

## 已修复的问题

✅ **修复了根目录 `package.json` 中的路径错误**
- 旧路径: `HumanLiker-v0.3(Cloud-Test)/backend/server.js`
- 新路径: `backend/server.js`

✅ **创建了 `render.yaml` 配置文件**
- 正确配置了 backend 和 frontend 的构建路径
- 配置了环境变量

✅ **创建了 `frontend/vite.config.js`**
- 确保 Vite 构建正确配置

## 部署选项

### 选项 1: 使用 Blueprint (推荐)

1. 将代码提交到 GitHub 仓库：
```bash
git add .
git commit -m "Fix: 修复 Render 部署配置"
git push
```

2. 在 Render Dashboard:
   - 点击 "New +"
   - 选择 "Blueprint"
   - 连接您的 GitHub 仓库
   - Render 会自动读取 `render.yaml` 并创建两个服务：
     - `humanliker-backend` (Web Service)
     - `humanliker-frontend` (Static Site)

### 选项 2: 仅部署 Backend

如果您只想先部署后端：

1. 在 Render Dashboard 创建 **Web Service**
2. 配置如下：
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: 留空（默认根目录）

3. 添加环境变量：
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render 自动设置)
   - `JWT_SECRET`: 生成一个随机字符串
   - `CORS_ORIGIN`: 您的前端 URL
   - `DATABASE_PATH`: `./data/humanliker.db`
   - `STRIPE_SECRET_KEY`: (可选) 您的 Stripe 密钥
   - `STRIPE_PRICE_MONTHLY_5USD`: (可选) Stripe 价格 ID
   - `STRIPE_WEBHOOK_SECRET`: (可选) Stripe Webhook 密钥

### 选项 3: 部署 Frontend

如果您想单独部署前端：

1. 在 Render Dashboard 创建 **Static Site**
2. 配置如下：
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

3. 添加环境变量：
   - `VITE_API_URL`: 您的后端 API URL (例如: `https://humanliker-backend.onrender.com`)

## 重要注意事项

### 环境变量配置

Backend 需要的环境变量：
- `JWT_SECRET`: 用于 JWT 签名的密钥（必需）
- `CORS_ORIGIN`: 前端的 URL（必需）
- `PORT`: 服务器端口（Render 自动设置为 10000）
- `DATABASE_PATH`: SQLite 数据库路径（默认 `./data/humanliker.db`）

### Stripe 配置（可选）

如果不配置 Stripe，系统会返回模拟的成功流程：
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_MONTHLY_5USD`
- `STRIPE_WEBHOOK_SECRET`

### 数据持久化

⚠️ **重要**: Render 的免费计划**不保证磁盘持久化**。每次重新部署或服务重启时，SQLite 数据库可能会丢失。

解决方案：
1. 升级到付费计划并使用持久化磁盘
2. 使用外部数据库服务（如 PostgreSQL）
3. 使用 Render 的 PostgreSQL 附加服务

## 测试部署

部署成功后，测试以下端点：

```bash
# 健康检查
curl https://your-backend-url.onrender.com/

# Ping 测试
curl https://your-backend-url.onrender.com/api/ping
```

## 常见问题

### 构建失败
- 确保所有 `package.json` 文件中的依赖都是正确的
- 检查 Node.js 版本（当前使用 22.16.0）

### 服务启动失败
- 检查环境变量是否正确设置
- 查看 Render 日志获取详细错误信息

### CORS 错误
- 确保 backend 的 `CORS_ORIGIN` 环境变量设置为前端的 URL
- 如果使用自定义域名，更新 CORS 配置

## 下一步

1. 提交并推送更改到 GitHub
2. 在 Render 上设置 Blueprint 或手动创建服务
3. 配置环境变量
4. 测试部署的应用

如有问题，请查看 Render 的日志输出。

