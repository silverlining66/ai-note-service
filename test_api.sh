#!/bin/bash

# 测试脚本

BASE_URL="http://localhost:8080"

echo "=========================================="
echo "AI Note Service API 测试"
echo "=========================================="
echo ""

# 1. 健康检查
echo "1. 测试健康检查接口..."
curl -s "${BASE_URL}/health" | jq .
echo -e "\n"

# 2. 简化聊天接口
echo "2. 测试简化聊天接口..."
curl -s --location "${BASE_URL}/api/v1/chat/simple" \
--header 'Content-Type: application/json' \
--data '{
    "message": "你好，请用一句话介绍你自己"
}' | jq .
echo -e "\n"

# 3. 完整聊天接口
echo "3. 测试完整聊天接口..."
curl -s --location "${BASE_URL}/api/v1/chat" \
--header 'Content-Type: application/json' \
--data '{
    "model": "gemini-3-flash",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "你是谁？"
        }
    ]
}' | jq .
echo -e "\n"

# 4. 测试多轮对话
echo "4. 测试多轮对话..."
curl -s --location "${BASE_URL}/api/v1/chat" \
--header 'Content-Type: application/json' \
--data '{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "我叫小明"
        },
        {
            "role": "assistant",
            "content": "你好小明！很高兴认识你。"
        },
        {
            "role": "user",
            "content": "你还记得我叫什么名字吗？"
        }
    ]
}' | jq .
echo -e "\n"

echo "=========================================="
echo "测试完成"
echo "=========================================="

