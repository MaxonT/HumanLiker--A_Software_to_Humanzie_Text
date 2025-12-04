# Render 部署问题修复总结

## 问题描述

在 Render 平台部署时遇到 `better-sqlite3` 编译错误：
- 错误原因：Node.js v25.2.1 与 `better-sqlite3@9.2.2` 不兼容
- 错误类型：V8 API 兼容性问题

## ✅ 已完成的修复

### 1. 升级依赖包
- ✅ `better-sqlite3`: `^9.2.2` → `^11.7.0`（最新版本，支持更多 Node.js 版本）

### 2. 限制 Node.js 版本
- ✅ `package.json` engines 字段：`">=18.0.0 <=20.x"`（限制在 LTS 版本范围内）

### 3. 创建版本配置文件
- ✅ `.nvmrc` - 指定 Node.js 20
- ✅ `.node-version` - 指定 Node.js 20
- ✅ `render.yaml` - Render 平台配置文件

### 4. 创建文档
- ✅ `backend/QUICK_FIX.md` - 快速修复指南
- ✅ `backend/RENDER_DEPLOY.md` - 完整部署指南
- ✅ `others/DEPLOYMENT.md` - 部署问题排查

## 🚀 需要在 Render 中执行的步骤

### 立即操作（必需）

1. **登录 Render 仪表板**
   - 访问 https://dashboard.render.com

2. **选择你的服务**
   - 进入 "HumanLiker Backend" 服务

3. **设置 Node.js 版本**
   - Settings → Environment
   - 添加环境变量：`NODE_VERSION = 20`
   - 保存更改

4. **重新部署**
   - 手动触发部署（Manual Deploy）

### 验证

部署后检查构建日志，应该看到：
```
✅ Using Node version 20.x.x
✅ better-sqlite3 compiled successfully
```

## 📁 修改的文件

```
backend/
├── package.json          # 升级 better-sqlite3, 限制 Node 版本
├── .nvmrc                # 指定 Node 20
├── .node-version         # 指定 Node 20
├── render.yaml           # Render 配置文件
├── QUICK_FIX.md          # 快速修复指南
└── RENDER_DEPLOY.md      # 完整部署指南

others/
└── DEPLOYMENT.md         # 部署问题排查
```

## 🔧 如果问题仍然存在

### 方案 1：使用 PostgreSQL（推荐用于生产环境）

SQLite 在 Render 的文件系统中可能不稳定，建议使用 PostgreSQL：

1. 在 Render 创建 PostgreSQL 数据库
2. 更新环境变量：
   ```
   DB_TYPE=postgres
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```
3. 代码已支持 PostgreSQL（通过 Drizzle ORM）

### 方案 2：清除构建缓存

1. Render Settings → Clear build cache
2. 重新部署

### 方案 3：固定版本

如果需要，可以固定 better-sqlite3 版本：
```json
"better-sqlite3": "11.7.0"
```

## 📝 相关文档

- 快速修复：`backend/QUICK_FIX.md`
- 完整指南：`backend/RENDER_DEPLOY.md`
- 问题排查：`others/DEPLOYMENT.md`

## ✨ 下一步

1. 在 Render 中设置 `NODE_VERSION=20` 环境变量
2. 触发重新部署
3. 检查构建日志确认成功

---

**注意**：如果使用 Render Blueprint，`render.yaml` 文件会被自动读取。否则，需要在仪表板中手动设置 Node.js 版本。

