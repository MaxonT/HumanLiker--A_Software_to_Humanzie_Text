# 🚨 修复 "Cannot find module" 错误

## 错误信息

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 
'/opt/render/project/src/HumanLiker0.5/backend/src/db/index.js'
```

## ✅ 验证结果

**所有文件都存在！** 诊断脚本已确认：
- ✅ `backend/src/db/index.js` 存在
- ✅ `backend/server.js` 存在  
- ✅ `backend/package.json` 存在
- ✅ 所有其他模块文件都存在

**问题不在文件缺失，而在 Render 配置！**

## 🔧 解决方案（必须执行）

### 步骤 1：在 Render 仪表板设置 Root Directory

**这是最关键的一步！**

1. 登录 Render 仪表板：https://dashboard.render.com
2. 选择你的服务 → **Settings**
3. 找到 **Build & Deploy** 部分
4. 找到 **Root Directory** 字段
5. **设置为**：`backend`
   - ⚠️ 只写 `backend`，不要其他字符
   - ⚠️ 不要写 `/backend` 或 `./backend` 或 `backend/`
   - ⚠️ 就只写：`backend`

### 步骤 2：更新构建和启动命令

在同一页面，确保：

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

⚠️ **重要**：删除任何 `cd backend &&` 前缀，因为 Root Directory 已经设置为 backend 了。

### 步骤 3：保存并重新部署

1. 点击 **Save Changes**
2. 清除构建缓存（如果有选项）
3. 手动触发部署

## 🔍 为什么会出现这个错误？

错误路径显示：
```
/opt/render/project/src/HumanLiker0.5/backend/src/db/index.js
```

这说明：
- ✅ Render 知道文件应该在 `backend/` 目录
- ❌ 但 Render 从错误的目录运行命令
- ❌ 没有设置 Root Directory，所以找不到文件

**解决**：设置 Root Directory = `backend`，Render 就会在正确的目录运行所有命令。

## 📋 完整配置示例

在 Render 仪表板中应该看到：

```
Settings → Build & Deploy:

Root Directory: backend
Build Command:  npm install
Start Command:  npm start
```

```
Settings → Environment:

NODE_VERSION=20
NODE_ENV=production
PORT=10000
```

## ✅ 验证修复

部署后，日志应该显示：

```
✅ Installing dependencies...
✅ Running 'npm start'
✅ Database initialized successfully
✅ Server running on port 10000
```

## ⚠️ 如果 Root Directory = "backend" 不行

尝试以下路径（根据你的 Git 仓库结构）：

1. `HumanLiker0.5/backend`
2. 检查 Render 显示的实际项目路径
3. 查看构建日志中的 "Working directory" 信息

## 📞 需要更多帮助？

如果问题仍然存在，请提供：
1. Render 中 Root Directory 的实际设置值
2. 完整的构建日志
3. 错误发生的具体时间点

## 🎯 关键点总结

1. **文件都存在** - 问题不在文件缺失
2. **Root Directory 必须设置** - 这是解决的关键
3. **设置为 `backend`** - 相对于 Git 仓库根目录
4. **移除 `cd` 命令** - Root Directory 已经处理了目录切换

