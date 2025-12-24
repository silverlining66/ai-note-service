# AI 笔记服务 (AI Note Service)

一个基于 AI 的智能图片知识点分析系统，支持图片上传、知识点提取和 AI 对话功能。

## 📋 项目简介

本项目是一个前后端分离的 AI 笔记服务系统，主要功能包括：

- **图片分析**：上传图片后，使用 AI 模型分析图片内容并提取知识点
- **知识点提取**：自动识别重点知识点、前置知识点、后置知识点
- **AI 对话**：针对特定知识点进行 AI 对话，获得详细解释和学习建议
- **可视化展示**：美观的界面展示知识点结构和对话内容

## 🏗️ 技术栈

### 后端
- **语言**：Go 1.24+
- **框架**：Gin
- **配置**：YAML
- **部署**：Docker

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **UI 组件**：
  - Framer Motion（动画）
  - React Markdown（Markdown 渲染）
  - React Resizable Panels（可调整面板）
  - KaTeX（数学公式渲染）

## 📁 项目结构

```
ai-note-service/
├── backend/                    # 后端服务
│   ├── config.yaml            # 配置文件
│   ├── main.go                # 入口文件
│   ├── go.mod                 # Go 依赖管理
│   ├── Dockerfile             # Docker 镜像构建
│   ├── docker-compose.yml     # Docker Compose 配置
│   └── internal/
│       └── application/
│           ├── controller/    # 控制器层
│           ├── service/       # 业务逻辑层
│           ├── schema/        # 数据结构定义
│           └── common/        # 公共工具
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── services/          # API 服务
│   │   ├── types/             # TypeScript 类型定义
│   │   └── utils/             # 工具函数
│   ├── package.json
│   └── vite.config.ts
└── start.sh                   # 一键启动脚本
```

## 🚀 快速开始

### 前置要求

- **Go** 1.24 或更高版本
- **Node.js** 16+ 和 npm
- **Docker**（可选，用于容器化部署）

### 方式一：使用一键启动脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x start.sh

# 启动前后端服务
./start.sh
```

脚本会自动：
- 检查依赖环境
- 启动后端服务（端口 8080）
- 启动前端服务（端口 5173）
- 显示服务状态信息

按 `Ctrl+C` 停止所有服务。

### 方式二：手动启动

#### 1. 启动后端服务

```bash
cd backend

# 安装依赖
go mod download

# 配置 AI 服务（编辑 config.yaml）
# 需要配置：
# - ai.base_url: AI 服务地址
# - ai.api_key: API 密钥
# - ai.default_model: 默认模型名称

# 运行服务
go run main.go
# 或使用 Makefile
make run
```

后端服务将在 `http://localhost:8080` 启动。

#### 2. 启动前端服务

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量（可选）
# 创建 .env 文件，设置：
# VITE_API_BASE_URL=http://localhost:8080/api

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173` 启动。

### 方式三：Docker 部署

```bash
cd backend

# 使用 Docker Compose
docker-compose up -d

# 或手动构建和运行
docker build -t ai-note-service .
docker run -p 8080:8080 -v $(pwd)/config.yaml:/root/config.yaml ai-note-service
```

## ⚙️ 配置说明

### 后端配置 (`backend/config.yaml`)

```yaml
server:
  port: 8080          # 服务端口
  host: "0.0.0.0"     # 监听地址

ai:
  base_url: "http://ai-service.tal.com/openai-compatible/v1"  # AI 服务地址
  api_key: "your-api-key"      # API 密钥
  default_model: "gemini-3-flash"  # 默认模型
  timeout: 30         # 请求超时时间（秒）
```

### 前端配置

前端通过环境变量配置，在 `frontend/.env` 文件中设置：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

如果不设置，默认使用 `http://localhost:8080/api`。

## 📡 API 接口

### 1. 健康检查

```
GET /health
```

### 2. 图片分析

```
POST /api/analyze/image
Content-Type: multipart/form-data

参数：
- image: 图片文件（支持 jpg, jpeg, png, gif, webp，最大 10MB）

响应：
{
  "code": 0,
  "message": "success",
  "data": {
    "detailedExplanation": "详细解释...",
    "keyPoints": [...],
    "funExamples": [...],
    "prerequisites": [...],
    "postrequisites": [...],
    "conclusion": "总结..."
  }
}
```

### 3. AI 对话

```
POST /api/knowledge-points/{knowledgePointId}/dialogue
Content-Type: application/json

请求体：
{
  "message": "用户消息",
  "conversationHistory": [
    {"sender": "user", "content": "..."},
    {"sender": "ai", "content": "..."}
  ],
  "knowledgePointTitle": "知识点标题",
  "knowledgePointDesc": "知识点描述"
}

响应：
{
  "code": 0,
  "message": "success",
  "data": {
    "response": "AI 回复内容"
  }
}
```

## 🎯 主要功能

### 1. 图片上传与分析

- 支持拖拽上传或点击上传
- 自动验证图片格式和大小
- 使用 AI 模型分析图片内容
- 提取结构化知识点信息

### 2. 知识点展示

- **详细解释**：图片内容的完整说明
- **重点知识点**：核心知识点列表
- **前置知识点**：学习所需的基础知识（5个）
- **后置知识点**：掌握后可学习的内容（5个）
- **趣味示例**：帮助理解知识点的生动例子
- **总结**：学习建议和总结

### 3. AI 对话

- 针对特定知识点进行对话
- 支持上下文对话历史
- 流式输出（打字机效果）
- Markdown 格式支持

### 4. 界面特性

- 响应式布局
- 可调整面板大小
- 流畅的动画效果
- 支持数学公式渲染（KaTeX）

## 🛠️ 开发指南

### 后端开发

```bash
cd backend

# 运行测试
make test

# 整理依赖
make tidy

# 编译二进制文件
make build

# 查看帮助
make help
```

### 前端开发

```bash
cd frontend

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🐳 Docker 部署

### 构建镜像

```bash
cd backend
docker build -t ai-note-service:latest .
```

### 使用 Docker Compose

```bash
cd backend
docker-compose up -d
```

### 环境变量

可以通过环境变量覆盖配置：

```bash
docker run -e GIN_MODE=release \
  -p 8080:8080 \
  -v $(pwd)/config.yaml:/root/config.yaml \
  ai-note-service
```

## 📝 注意事项

1. **AI 服务配置**：确保 `config.yaml` 中的 AI 服务地址和 API 密钥正确配置
2. **CORS 配置**：后端已配置 CORS，允许跨域请求
3. **文件大小限制**：图片文件最大支持 10MB
4. **支持的图片格式**：jpg, jpeg, png, gif, webp
5. **端口占用**：确保 8080（后端）和 5173（前端）端口未被占用

## 🔧 故障排查

### 后端无法启动

1. 检查 Go 版本：`go version`（需要 1.24+）
2. 检查配置文件：确保 `config.yaml` 存在且格式正确
3. 检查端口占用：`lsof -i :8080`
4. 查看日志：检查 `/tmp/backend.log` 或控制台输出

### 前端无法启动

1. 检查 Node.js 版本：`node -v`（需要 16+）
2. 重新安装依赖：`rm -rf node_modules && npm install`
3. 检查端口占用：`lsof -i :5173`
4. 查看日志：检查 `/tmp/frontend.log` 或控制台输出

### API 请求失败

1. 检查后端服务是否运行：访问 `http://localhost:8080/health`
2. 检查前端 API 配置：确认 `VITE_API_BASE_URL` 正确
3. 检查 CORS 设置：确保后端 CORS 中间件正常工作
4. 查看浏览器控制台和网络请求

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过 Issue 反馈。

