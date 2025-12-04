# 🔧 Render 部署快速修复

## 问题

`better-sqlite3` 在 Node.js v25.2.1 上编译失败。

## ✅ 已完成的修复

1. ✅ 升级 `better-sqlite3` 到 `^11.7.0`（支持 Node.js 25）
2. ✅ 限制 Node.js 版本为 18-20 LTS
3. ✅ 创建了版本配置文件

## 🚀 在 Render 中修复（立即执行）

### 方法 1：设置环境变量（最简单）

1. 登录 Render 仪表板
2. 选择你的服务
3. 进入 **Settings** → **Environment**
4. 添加环境变量：
   ```
   NODE_VERSION = 20
   ```
5. 点击 **Save Changes**
6. 手动触发重新部署（**Manual Deploy**）

### 方法 2：修改构建命令

1. 进入 **Settings** → **Build & Deploy**
2. 修改 **Build Command** 为：
   ```bash
   export NODE_VERSION=20 && cd backend && npm install
   ```
3. 确保 **Start Command** 为：
   ```bash
   cd backend && npm start
   ```
4. 保存并重新部署

### 方法 3：使用 Render.yaml

如果你使用 Render Blueprint：

1. 确保 `backend/render.yaml` 文件存在
2. 连接 Git 仓库时选择 "Blueprint"
3. Render 会自动读取配置

## 📝 验证修复

部署后检查构建日志：

```
✅ Using Node version 20.x.x
✅ better-sqlite3 compiled successfully
```

## ⚠️ 如果仍然失败

### 选项 A：使用 PostgreSQL（生产环境推荐）

SQLite 在 Render 文件系统中可能不稳定。使用 PostgreSQL：

1. 在 Render 创建 PostgreSQL 数据库
2. 获取连接字符串
3. 设置环境变量：
   ```
   DB_TYPE=postgres
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

### 选项 B：固定 better-sqlite3 版本

在 `package.json` 中固定版本：
```json
"better-sqlite3": "11.7.0"
```

### 选项 C：清除缓存后重试

1. Render Settings → **Clear build cache**
2. 重新部署

## 📞 需要帮助？

查看详细文档：
- `backend/RENDER_DEPLOY.md` - 完整部署指南
- `others/DEPLOYMENT.md` - 部署问题排查

