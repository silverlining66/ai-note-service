package service

import (
	"ai-note-service/internal/application/schema"
	"fmt"
	"time"
)

// KnowledgeService 知识点服务
type KnowledgeService struct {
	aiService *AIService
}

// NewKnowledgeService 创建知识点服务实例
func NewKnowledgeService() *KnowledgeService {
	return &KnowledgeService{
		aiService: NewAIService(),
	}
}

// GetDialogueResponse 获取知识点的AI对话响应
func (s *KnowledgeService) GetDialogueResponse(
	knowledgePointId string,
	knowledgePointTitle string,
	knowledgePointDesc string,
	userMessage string,
	conversationHistory []schema.ConversationMessage,
) (*schema.DialogueResponse, error) {
	// 1. 构建系统提示词 - 根据知识点定制化
	systemPrompt := s.buildSystemPrompt(knowledgePointTitle, knowledgePointDesc)

	// 2. 构建消息列表
	messages := []schema.Message{
		schema.NewTextMessage("system", systemPrompt),
	}

	// 3. 添加历史对话（如果有）
	for _, msg := range conversationHistory {
		role := "user"
		if msg.Sender == "ai" {
			role = "assistant"
		}
		messages = append(messages, schema.NewTextMessage(role, msg.Content))
	}

	// 4. 添加当前用户消息
	messages = append(messages, schema.NewTextMessage("user", userMessage))

	// 5. 调用AI服务
	chatReq := &schema.ChatRequest{
		Messages: messages,
	}

	chatResp, err := s.aiService.Chat(chatReq)
	if err != nil {
		return nil, fmt.Errorf("AI对话失败: %w", err)
	}

	// 6. 提取AI回复
	if len(chatResp.Choices) == 0 {
		return nil, fmt.Errorf("AI未返回任何响应")
	}

	// Content 可能是 string 或其他类型，需要转换
	aiMessage := chatResp.Choices[0].Message.Content
	var aiMessageStr string
	switch v := aiMessage.(type) {
	case string:
		aiMessageStr = v
	default:
		return nil, fmt.Errorf("AI返回的内容格式不正确")
	}

	// 7. 返回对话响应
	return &schema.DialogueResponse{
		Message:   aiMessageStr,
		Timestamp: time.Now().Format(time.RFC3339),
	}, nil
}

// buildSystemPrompt 构建系统提示词
func (s *KnowledgeService) buildSystemPrompt(title, description string) string {
	return fmt.Sprintf(`你是一个专业的教育助手，擅长解答学生的问题。

当前讨论的知识点是：%s
知识点描述：%s

请遵循以下原则：
1. 用清晰、易懂的语言解释概念
2. 提供具体的例子帮助理解
3. 如果涉及复杂概念，分步骤讲解
4. 鼓励学生提出更多问题
5. 保持友好、耐心的态度
6. 回答要准确、专业，但避免过于学术化
7. 如果学生问的问题超出了当前知识点范围，可以简要说明并引导回到主题

现在请开始回答学生的问题。`, title, description)
}

// GetKnowledgePointInfo 根据ID获取知识点信息（临时实现，从假数据中查找）
func (s *KnowledgeService) GetKnowledgePointInfo(knowledgePointId string) (string, string, error) {
	// 临时方案：使用假数据映射
	// TODO: 后续可以从数据库或缓存中获取
	knowledgeMap := map[string]struct {
		Title       string
		Description string
	}{
		"kp-001": {
			Title:       "线性代数基础",
			Description: "矩阵运算和向量空间的基本概念",
		},
		"kp-002": {
			Title:       "机器学习入门",
			Description: "监督学习和无监督学习的基本原理",
		},
		"kp-p001": {
			Title:       "高等数学",
			Description: "微积分和数学分析基础",
		},
		"kp-p002": {
			Title:       "概率论",
			Description: "概率分布和统计推断",
		},
		"kp-p003": {
			Title:       "统计学",
			Description: "描述性统计和假设检验",
		},
		"kp-p004": {
			Title:       "Python编程",
			Description: "Python基础语法和常用库",
		},
		"kp-p005": {
			Title:       "数据结构",
			Description: "数组、链表、树等数据结构",
		},
		"kp-n001": {
			Title:       "深度学习",
			Description: "神经网络和反向传播算法",
		},
		"kp-n002": {
			Title:       "自然语言处理",
			Description: "文本处理和语言模型",
		},
		"kp-n003": {
			Title:       "计算机视觉",
			Description: "图像识别和目标检测",
		},
		"kp-n004": {
			Title:       "强化学习",
			Description: "Q学习和策略梯度方法",
		},
		"kp-n005": {
			Title:       "模型优化",
			Description: "超参数调优和模型压缩",
		},
	}

	info, exists := knowledgeMap[knowledgePointId]
	if !exists {
		// 如果找不到，返回通用信息
		return "知识点", "相关知识点的详细内容", nil
	}

	return info.Title, info.Description, nil
}

