# 部署说明

## Render 平台部署问题修复

### 问题描述

在 Render 上部署时，`better-sqlite3` 包在 Node.js v25.2.1 上编译失败。这是因为 `better-sqlite3` 与 Node.js 25 不兼容。

### 解决方案

#### 1. 在 Render 中指定 Node.js 版本

**方法 A：通过 Render 仪表板**

1. 登录 Render 仪表板
2. 进入你的服务设置
3. 找到 "Environment" 或 "Build & Deploy" 设置
4. 设置 "Node Version" 为 `20` 或 `18`（LTS 版本）

**方法 B：通过环境变量**

在 Render 的环境变量中添加：
```
NODE_VERSION=20
```

**方法 C：使用 render.yaml（推荐）**

项目已包含 `backend/render.yaml` 配置文件。如果使用 Render Blueprint：

1. 在 Render 创建新服务时选择 "Blueprint"
2. 连接你的 Git 仓库
3. Render 会自动读取 `render.yaml` 配置

#### 2. 已更新的配置

- ✅ 升级 `better-sqlite3` 到 `^11.7.0`（最新版本，更好的兼容性）
- ✅ 限制 Node.js 版本范围：`>=18.0.0 <=20.x`
- ✅ 创建了 `.nvmrc` 文件指定 Node 20
- ✅ 创建了 `.node-version` 文件

### 本地测试

在部署前，建议在本地测试兼容性：

```bash
cd backend

# 使用 Node.js 20
nvm use 20  # 如果使用 nvm
npm install
npm start
```

### 如果仍然失败

如果问题仍然存在，可以考虑：

1. **使用 PostgreSQL 代替 SQLite**（生产环境推荐）
   - SQLite 在 Render 的文件系统中可能不可靠
   - 可以连接到 Render PostgreSQL 数据库

2. **使用预编译的二进制文件**
   - 确保 `better-sqlite3` 使用预编译版本
   - 可能需要设置构建标志

3. **联系 Render 支持**
   - 检查 Render 的构建日志
   - 确认 Node.js 版本是否正确设置

### 替代方案：使用 PostgreSQL

对于生产环境，建议使用 PostgreSQL 而不是 SQLite：

1. 在 Render 创建 PostgreSQL 数据库服务
2. 获取连接字符串
3. 更新 `backend/.env`：
   ```env
   DB_TYPE=postgres
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```
4. 代码已支持 PostgreSQL（通过 Drizzle ORM）

### 构建日志检查

如果部署失败，检查以下内容：

1. Node.js 版本是否在 18-20 范围内
2. `better-sqlite3` 是否成功编译
3. 是否有足够的构建资源（免费计划可能有限制）

### 快速修复步骤

1. 在 Render 服务设置中设置 Node.js 版本为 `20`
2. 触发新的部署
3. 检查构建日志确认版本

### 环境变量配置

确保在 Render 中设置以下环境变量：

```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
DB_TYPE=sqlite
DATABASE_URL=./db/humanliker.db
LOG_LEVEL=info
```

### 支持

如果问题持续，请检查：
- Render 文档：https://render.com/docs/node-version
- better-sqlite3 文档：https://github.com/WiseLibs/better-sqlite3


