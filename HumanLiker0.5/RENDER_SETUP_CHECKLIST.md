# ✅ Render 部署设置检查清单

## 🚨 当前错误

```
Cannot find module '/opt/render/project/src/HumanLiker0.5/backend/src/db/index.js'
```

## 📋 必须在 Render 仪表板中完成的设置

### 1. Root Directory 设置（最关键！）

**位置**：Settings → Build & Deploy → Root Directory

**设置值**：
```
backend
```

⚠️ **重要**：
- 只写 `backend`，不要写 `/backend` 或 `./backend`
- 不要包含引号
- 这是相对于 Git 仓库根目录的路径

### 2. Build Command

**位置**：Settings → Build & Deploy → Build Command

**设置值**：
```
npm install
```

⚠️ **不要使用**：
- ❌ `cd backend && npm install`
- ❌ `cd HumanLiker0.5/backend && npm install`

### 3. Start Command

**位置**：Settings → Build & Deploy → Start Command

**设置值**：
```
npm start
```

⚠️ **不要使用**：
- ❌ `cd backend && npm start`
- ❌ `node backend/server.js`

### 4. Environment Variables

**位置**：Settings → Environment

**必须设置的变量**：

```
NODE_VERSION = 20
NODE_ENV = production
PORT = 10000
CORS_ORIGIN = https://your-frontend-url.onrender.com
```

## 🔍 验证步骤

设置完成后，执行以下操作：

1. **保存所有更改**
   - 点击 "Save Changes"

2. **清除构建缓存**
   - Settings → "Clear build cache"

3. **手动触发部署**
   - "Manual Deploy" → "Deploy latest commit"

4. **检查构建日志**
   - 查看 "Events" 或 "Logs"
   - 确认看到：
     ```
     Installing dependencies in backend/
     Found package.json
     Running npm install...
     ```

5. **检查运行时日志**
   - 确认看到：
     ```
     Running 'npm start'
     HumanLiker backend server running on port 10000
     ```

## ❌ 常见错误配置

### 错误配置 1：Root Directory 为空或错误

```
Root Directory: (空) 或 . 或 / 
```
**问题**：Render 会在项目根目录运行，找不到 backend 目录

### 错误配置 2：Build Command 包含 cd

```
Build Command: cd backend && npm install
```
**问题**：如果 Root Directory 已经是 backend，cd 会失败

### 错误配置 3：Root Directory 路径错误

```
Root Directory: /backend 或 ./backend 或 backend/
```
**问题**：Render 不接受前导斜杠或尾部斜杠

## ✅ 正确配置示例

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

这样配置后，Render 会：
1. 在 `backend/` 目录中运行所有命令
2. 找到 `backend/package.json`
3. 运行 `npm install` 安装依赖
4. 运行 `npm start` 启动服务器

## 🔧 如果仍然失败

### 检查 Git 仓库结构

确认 Git 仓库包含完整结构：

```bash
git ls-files | grep backend/src
```

应该看到所有 `.js` 文件，包括：
- `backend/src/db/index.js`
- `backend/src/routes/*.js`
- 等等

### 检查 .gitignore

确认 `.gitignore` 没有排除必要文件：

```bash
cd backend
cat .gitignore
```

确保 `src/` 目录没有被忽略。

### 使用 Render Blueprint

如果手动设置不行，使用 Blueprint：

1. 在项目根目录有 `render.yaml`
2. 连接 Git 时选择 "Blueprint"
3. Render 会自动读取配置

## 📞 需要帮助

如果问题仍然存在，提供以下信息：

1. Root Directory 的实际设置值
2. Build Command 的实际设置值
3. 完整的构建日志
4. Git 仓库文件列表（`git ls-files` 输出）

