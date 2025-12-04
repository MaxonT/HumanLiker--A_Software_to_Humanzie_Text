# 🚨 Render 模块找不到 - 立即修复

## 错误原因

Render 在错误的目录运行，导致找不到 `backend/src/db/index.js` 文件。

## ✅ 立即执行（3 步修复）

### 步骤 1：设置 Root Directory

1. 登录 Render：https://dashboard.render.com
2. 选择你的服务 → **Settings**
3. 找到 **Root Directory** 字段
4. **输入**：`backend`（只写这个，不要其他字符）
5. 点击保存

### 步骤 2：更新命令

在同一个 Settings 页面：

**Build Command** 设置为：
```
npm install
```

**Start Command** 设置为：
```
npm start
```

### 步骤 3：重新部署

1. 点击 **Save Changes**
2. 清除构建缓存（如果选项可用）
3. 手动触发部署

## 📸 配置截图说明

```
Settings → Build & Deploy

Root Directory: [backend]        ← 这里只写 backend
Build Command:  [npm install]     ← 不要 cd backend &&
Start Command:  [npm start]       ← 不要 cd backend &&
```

## ✅ 正确配置后应该看到的

部署日志应该显示：

```
✅ Installing dependencies...
✅ Found package.json
✅ Running 'npm start'
✅ Server running on port 10000
```

## ❌ 如果 Root Directory = `backend` 不行

尝试设置为：

```
HumanLiker0.5/backend
```

或者检查 Render 显示的实际项目路径，根据实际情况调整。

## 🔍 验证文件是否存在

所有文件都应该存在。如果 Render 仍然找不到，检查：

1. **Git 仓库是否包含所有文件**
   ```bash
   git ls-files backend/src/db/index.js
   ```

2. **文件是否被 .gitignore 排除**
   - 检查 `backend/.gitignore` 没有排除 `src/` 目录

## 📞 如果还不行

提供以下信息：

1. Render 中 Root Directory 的当前设置值
2. 构建日志的完整输出
3. Git 仓库中的文件列表

