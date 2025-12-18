# HumanLiker Backend

HumanLiker 后端 API 服务器，提供文本改写、评分、历史记录等功能。

## 快速开始

### 前置要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn

### 安装

```bash
cd backend
npm install
```

### 配置

复制环境变量模板并编辑：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置必要的环境变量。

### 运行

**开发模式**（带自动重启）：

```bash
npm run dev
```

**生产模式**：

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## API 端点

### 健康检查

```
GET /api/health
```

返回服务器健康状态和系统信息。

### Tiger.Humanizer Playground 适配器

```
POST /api/humanizer/playground
```

- **kind**: `string` | `number` | `datetime` | `timespan` | `collection` | `enum`
- **culture**: 文化代码（如 `en`, `zh`, `fr-FR`）
- **value**: 输入内容

当 `kind=string` 时，调用 v0.5 的 transform 管道并返回得分与元数据；其它类型提供示例化的描述，方便 Tiger.Humanizer Playground 在后端模式下演示。

## 项目结构

```
backend/
├── package.json           # 依赖配置
├── .env.example          # 环境变量模板
├── src/
│   ├── server.js         # Express 服务器入口
│   ├── index.js          # 数据库初始化
│   ├── schema.js         # 数据库架构定义
│   ├── routes/           # API 路由
│   │   └── health.js     # 健康检查路由
│   └── utils/            # 工具函数
│       └── logger.js     # 日志配置
└── README.md             # 本文档
```

## 环境变量

- `PORT`: 服务器端口（默认: 3000）
- `NODE_ENV`: 运行环境（development/production）
- `CORS_ORIGIN`: CORS 允许的来源
- `LOG_LEVEL`: 日志级别（默认: info）

更多配置项请参考 `.env.example`。

## 开发计划

这是阶段 1 的实现，仅包含基础骨架和健康检查端点。后续阶段将添加：

- 阶段 2: 数据库架构和 API 契约
- 阶段 3: 模型引擎集成
- 阶段 4: 数据持久化
- 阶段 5: 预设和模型管理
- 阶段 6: 图表和最终打磨

## 许可证

ISC


