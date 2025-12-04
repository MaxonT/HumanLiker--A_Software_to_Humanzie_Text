# Render 部署指南

## 快速修复 Node.js 版本问题

### 当前问题

Render 使用了 Node.js v25.2.1，导致 `better-sqlite3` 编译失败。

### 立即修复步骤

#### 在 Render 仪表板中设置 Node.js 版本

1. **登录 Render 仪表板**
   - 访问 https://dashboard.render.com

2. **选择你的服务**
   - 进入 "HumanLiker Backend" 服务

3. **进入设置**
   - 点击左侧菜单的 "Settings"

4. **设置 Node 版本**
   - 找到 "Environment" 部分
   - 添加环境变量：
     ```
     NODE_VERSION = 20
     ```
   - 或者找到 "Build Command" 部分，在构建命令前添加：
     ```
     export NODE_VERSION=20 && cd backend && npm install
     ```

5. **保存并重新部署**
   - 点击 "Save Changes"
   - 手动触发新的部署（"Manual Deploy" → "Deploy latest commit"）

### 配置文件方式

项目已包含以下配置文件：

- `backend/.nvmrc` - 指定 Node 20
- `backend/.node-version` - 指定 Node 20
- `backend/package.json` - engines 字段限制为 18-20

### 验证修复

部署后，检查构建日志：

1. 在 Render 仪表板中找到 "Events" 或 "Logs"
2. 查找构建日志
3. 确认看到：
   ```
   Using Node version 20.x.x
   ```
4. 确认 `better-sqlite3` 编译成功

### 如果问题仍然存在

1. **清除构建缓存**
   - Render 设置 → "Clear build cache"
   - 重新部署

2. **检查 better-sqlite3 版本**
   - 已升级到 `^11.7.0`（最新版本）
   - 如果仍有问题，可以尝试固定版本：`"better-sqlite3": "11.7.0"`

3. **使用 PostgreSQL（生产环境推荐）**
   - SQLite 在 Render 的文件系统中可能不可靠
   - 创建 Render PostgreSQL 服务
   - 更新环境变量使用 PostgreSQL

### 构建命令

如果需要在构建命令中明确指定版本：

**构建命令：**
```bash
cd backend && npm install
```

**启动命令：**
```bash
cd backend && npm start
```

### 环境变量示例

```env
NODE_VERSION=20
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-url.onrender.com
LOG_LEVEL=info
```

### 联系支持

如果所有方法都失败：
- 检查 Render 社区论坛
- 联系 Render 支持团队
- 提供完整的构建日志

