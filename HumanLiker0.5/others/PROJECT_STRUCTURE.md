# HumanLiker 项目文件结构

本文档说明了 HumanLiker v0.5 的文件组织方式。

## 目录结构

```
HumanLiker0.5/
│
├── frontend/                    # 前端应用目录
│   ├── index.html              # 主 HTML 页面
│   ├── core.js                 # 核心前端逻辑（所有交互功能）
│   ├── style.css               # 样式文件
│   ├── api.js                  # API 客户端模块（可选，目前集成在 core.js 中）
│   ├── assets/                 # 静态资源目录
│   │   ├── placeholder_gauge.png
│   │   ├── placeholder_line.png
│   │   └── placeholder_pie.png
│   └── README.md               # 前端说明文档
│
├── backend/                     # 后端 API 服务目录
│   ├── server.js               # Express 服务器入口
│   ├── package.json            # Node.js 依赖配置
│   ├── .env.example            # 环境变量配置模板
│   ├── .gitignore              # Git 忽略文件配置
│   ├── openapi.yaml            # OpenAPI 规范文档
│   ├── README.md               # 后端说明文档
│   │
│   ├── db/                     # 数据库相关文件
│   │   ├── schema.sql          # SQL 数据库架构
│   │   └── humanliker.db       # SQLite 数据库文件（运行时自动创建）
│   │
│   └── src/                    # 后端源代码
│       ├── routes/             # API 路由
│       │   ├── health.js       # 健康检查端点
│       │   ├── transform.js    # 文本改写端点
│       │   ├── history.js      # 历史记录端点
│       │   ├── sessions.js     # 会话管理端点
│       │   ├── analytics.js    # 统计分析端点
│       │   ├── presets.js      # 预设管理端点
│       │   └── models.js       # 模型配置端点
│       │
│       ├── services/           # 业务逻辑服务
│       │   ├── transformService.js   # 文本改写服务
│       │   └── historyService.js     # 历史记录服务
│       │
│       ├── engines/            # AI 模型引擎
│       │   ├── ModelEngine.js        # 模型引擎基类
│       │   ├── LocalModelEngine.js   # 本地模型适配器（Ollama/LM Studio）
│       │   └── OpenAIModelEngine.js  # OpenAI 适配器
│       │
│       ├── config/             # 配置管理
│       │   └── models.js       # 模型配置管理器
│       │
│       ├── db/                 # 数据库配置
│       │   ├── index.js        # 数据库连接和初始化
│       │   └── schema.js       # Drizzle ORM 数据模型定义
│       │
│       ├── middleware/         # Express 中间件
│       │   └── validation.js   # 请求验证中间件（使用 Zod）
│       │
│       └── utils/              # 工具函数
│           ├── logger.js       # 日志配置（Winston）
│           └── errors.js       # 错误处理工具
│
└── others/                      # 其他文件目录
    └── IMPLEMENTATION_SUMMARY.md  # 实施总结文档
```

## 文件说明

### Frontend（前端）

所有前端相关文件都在 `frontend/` 目录中：

- **index.html**: 主 HTML 页面，包含所有 UI 元素
- **core.js**: 包含所有前端逻辑，包括：
  - 主题切换
  - 语言切换（国际化）
  - API 客户端调用
  - UI 交互逻辑
  - KPI 更新
- **style.css**: 所有样式定义
- **assets/**: 静态资源（图片等）

### Backend（后端）

所有后端相关文件都在 `backend/` 目录中：

- **server.js**: Express 服务器入口，启动 HTTP 服务
- **package.json**: 定义所有 Node.js 依赖
- **src/routes/**: 所有 API 端点定义
- **src/services/**: 业务逻辑层
- **src/engines/**: AI 模型集成
- **src/db/**: 数据库配置和模型

### Others（其他）

文档和其他文件：

- **IMPLEMENTATION_SUMMARY.md**: 详细的实施总结，说明所有实现的功能

## 文件移动历史

所有原始文件都已保留，只是重新组织到新的目录结构中：

- 原来的 `index.html`, `core.js`, `style.css` → 移动到 `frontend/`
- 原来的 `assets/` → 移动到 `frontend/assets/`
- 原来的 `IMPLEMENTATION_SUMMARY.md` → 移动到 `others/`
- `backend/` 目录已经存在，保持不变

## 路径引用

所有路径引用都使用相对路径，因此在文件移动后仍然正常工作：

- HTML 中的 CSS: `href="style.css"` ✓
- HTML 中的 JS: `src="core.js"` ✓
- HTML 中的图片: `src="assets/..."` ✓
- 后端模块导入: 使用相对路径如 `'./src/routes/...'` ✓

## 运行说明

### 启动后端

```bash
cd backend
npm install
npm start
```

### 启动前端

```bash
cd frontend
python3 -m http.server 8080
# 或使用其他静态服务器
```

详细说明请参考：
- 根目录 `README.md` - 快速开始指南
- `frontend/README.md` - 前端说明
- `backend/README.md` - 后端说明

