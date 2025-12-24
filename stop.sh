#!/bin/bash

# AI Note Service - 停止脚本
# 用于停止前后端服务

echo "🛑 正在停止 AI Note Service..."

# 停止后端 Go 进程
echo "停止后端服务..."
pkill -f "go run main.go" || pkill -f "ai-note-service/backend/main"
if [ $? -eq 0 ]; then
    echo "✅ 后端服务已停止"
else
    echo "⚠️  未找到运行中的后端进程"
fi

# 停止前端 Vite 进程
echo "停止前端服务..."
pkill -f "vite" || pkill -f "npm run dev"
if [ $? -eq 0 ]; then
    echo "✅ 前端服务已停止"
else
    echo "⚠️  未找到运行中的前端进程"
fi

# 停止任何相关的 node 进程（5173 端口）
echo "检查并停止占用 5173 端口的进程..."
lsof -ti:5173 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 5173 端口已释放"
fi

# 停止占用 8080 端口的进程
echo "检查并停止占用 8080 端口的进程..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 8080 端口已释放"
fi

echo ""
echo "✅ 所有服务已停止！"

