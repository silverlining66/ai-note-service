#!/bin/bash

# 演示脚本 - 展示 AI Note Service 的基本功能

BASE_URL="http://localhost:8080"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}AI Note Service 功能演示${NC}"
echo -e "${BLUE}================================${NC}\n"

# 检查服务是否运行
echo -e "${YELLOW}正在检查服务状态...${NC}"
if curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 服务正在运行${NC}\n"
else
    echo -e "❌ 服务未运行，请先启动服务: go run main.go"
    exit 1
fi

# 演示1: 简单问候
echo -e "${BLUE}演示1: 简单问候${NC}"
echo -e "${YELLOW}请求: 你好${NC}"
RESPONSE=$(curl -s --location "${BASE_URL}/api/v1/chat/simple" \
--header 'Content-Type: application/json' \
--data '{
    "message": "你好，用一句话介绍你自己"
}')
echo -e "${GREEN}响应:${NC}"
echo "$RESPONSE" | jq -r '.data.choices[0].message.content'
echo ""

# 演示2: 专业问题
echo -e "${BLUE}演示2: 询问技术问题${NC}"
echo -e "${YELLOW}请求: Go语言的特点${NC}"
RESPONSE=$(curl -s --location "${BASE_URL}/api/v1/chat/simple" \
--header 'Content-Type: application/json' \
--data '{
    "message": "请用3点概括Go语言的主要特点"
}')
echo -e "${GREEN}响应:${NC}"
echo "$RESPONSE" | jq -r '.data.choices[0].message.content'
echo ""

# 演示3: 多轮对话
echo -e "${BLUE}演示3: 多轮对话（记忆功能）${NC}"
echo -e "${YELLOW}第一轮: 我叫张三${NC}"
RESPONSE=$(curl -s --location "${BASE_URL}/api/v1/chat" \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "我叫张三"}
    ]
}')
echo -e "${GREEN}AI响应:${NC}"
FIRST_RESPONSE=$(echo "$RESPONSE" | jq -r '.data.choices[0].message.content')
echo "$FIRST_RESPONSE"
echo ""

echo -e "${YELLOW}第二轮: 你还记得我叫什么吗？${NC}"
RESPONSE=$(curl -s --location "${BASE_URL}/api/v1/chat" \
--header 'Content-Type: application/json' \
--data "{
    \"messages\": [
        {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},
        {\"role\": \"user\", \"content\": \"我叫张三\"},
        {\"role\": \"assistant\", \"content\": $(echo "$FIRST_RESPONSE" | jq -R .)},
        {\"role\": \"user\", \"content\": \"你还记得我叫什么名字吗？\"}
    ]
}")
echo -e "${GREEN}AI响应:${NC}"
echo "$RESPONSE" | jq -r '.data.choices[0].message.content'
echo ""

# 演示4: 查看Token使用情况
echo -e "${BLUE}演示4: Token 使用统计${NC}"
RESPONSE=$(curl -s --location "${BASE_URL}/api/v1/chat/simple" \
--header 'Content-Type: application/json' \
--data '{
    "message": "你好"
}')
echo -e "${GREEN}Token 使用情况:${NC}"
echo "$RESPONSE" | jq '.data.usage'
echo ""

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}演示完成！${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "更多信息请查看:"
echo -e "  📖 README.md - 完整文档"
echo -e "  🚀 QUICKSTART.md - 快速开始"
echo -e "  📊 PROJECT_SUMMARY.md - 项目总结"

