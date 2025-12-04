# HumanLiker v0.5 - Full Stack Application

HumanLiker 是一个全栈应用，将 AI 生成的文本转换为更自然、更人性化的语言。

## 项目结构

```
HumanLiker0.5/
├── frontend/          # 前端应用
│   ├── index.html     # 主页面
│   ├── core.js        # 核心前端逻辑
│   ├── style.css      # 样式文件
│   ├── api.js         # API 客户端（可选）
│   └── assets/        # 静态资源（图片等）
│
├── backend/           # 后端 API 服务
│   ├── server.js      # Express 服务器入口
│   ├── package.json   # 依赖配置
│   ├── src/           # 源代码
│   │   ├── routes/    # API 路由
│   │   ├── services/  # 业务逻辑
│   │   ├── engines/   # AI 模型引擎
│   │   ├── db/        # 数据库配置
│   │   └── ...
│   └── db/            # 数据库文件
│
└── others/            # 其他文件
    └── IMPLEMENTATION_SUMMARY.md  # 实施总结文档
```

## 快速开始

### 1. 后端启动

```bash
cd backend
npm install
npm start
```

后端将在 `http://localhost:3000` 启动。

### 2. 前端启动

打开一个新的终端：

```bash
cd frontend

# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js http-server
npx http-server -p 8080

# 或使用 VS Code Live Server 扩展
```

前端将在 `http://localhost:8080` 启动。

### 3. 配置

复制并编辑环境变量：

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件配置模型端点和 API 密钥
```

## 功能特性

- ✅ **真实 AI 模型集成**：支持 Ollama、LM Studio、OpenAI
- ✅ **数据持久化**：所有改写记录自动保存
- ✅ **历史记录管理**：查看和管理历史记录
- ✅ **会话管理**：支持多个工作会话
- ✅ **统计和分析**：KPI 数据和图表支持
- ✅ **预设管理**：保存和加载常用配置
- ✅ **多语言支持**：8 种语言国际化
- ✅ **主题切换**：浅色/深色/自动主题

## API 文档

详细 API 文档见 `backend/openapi.yaml` 或访问 `http://localhost:3000/api/health`

## 技术栈

- **前端**：原生 JavaScript, HTML5, CSS3, Chart.js
- **后端**：Node.js, Express.js
- **数据库**：SQLite (可升级到 PostgreSQL)
- **ORM**：Drizzle ORM
- **AI 模型**：Ollama, LM Studio, OpenAI API

## 开发说明

- 前端文件位于 `frontend/` 目录
- 后端文件位于 `backend/` 目录
- 所有文件都已保留，未删除任何内容
- 详细实施说明见 `others/IMPLEMENTATION_SUMMARY.md`

## 许可证

ISC


