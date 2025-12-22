package service

import (
	"ai-note-service/internal/application/schema"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
)

// ImageAnalysisService 图片分析服务
type ImageAnalysisService struct {
	aiService *AIService
}

// NewImageAnalysisService 创建图片分析服务实例
func NewImageAnalysisService() *ImageAnalysisService {
	return &ImageAnalysisService{
		aiService: NewAIService(),
	}
}

// AnalyzeImage 分析图片并提取知识点
func (s *ImageAnalysisService) AnalyzeImage(file *multipart.FileHeader) (*schema.KnowledgeAnalysisResponse, error) {
	// 1. 读取图片文件
	imageData, err := s.readImageFile(file)
	if err != nil {
		return nil, fmt.Errorf("读取图片失败: %w", err)
	}

	// 2. 将图片转换为base64
	base64Image := base64.StdEncoding.EncodeToString(imageData)
	
	// 3. 构建图片URL（data URI格式）
	imageURL := fmt.Sprintf("data:image/jpeg;base64,%s", base64Image)

	// 4. 构建提示词
	systemPrompt := s.buildAnalysisPrompt()
	userPrompt := s.buildUserPrompt()

	// 5. 构建包含图片的消息（使用 Vision API 标准格式）
	messages := []schema.Message{
		schema.NewTextMessage("system", systemPrompt),
		schema.NewVisionMessage("user", userPrompt, imageURL),
	}

	// 6. 调用AI服务
	chatReq := &schema.ChatRequest{
		Messages: messages,
	}

	chatResp, err := s.aiService.Chat(chatReq)
	if err != nil {
		return nil, fmt.Errorf("AI分析失败: %w", err)
	}

	// 7. 解析AI响应
	if len(chatResp.Choices) == 0 {
		return nil, fmt.Errorf("AI未返回任何响应")
	}

	aiResponse := chatResp.Choices[0].Message.Content
	
	// Content 可能是 string 或其他类型，需要转换
	var aiResponseStr string
	switch v := aiResponse.(type) {
	case string:
		aiResponseStr = v
	default:
		return nil, fmt.Errorf("AI返回的内容格式不正确")
	}

	// 8. 解析JSON响应
	knowledgeData, err := s.parseAIResponse(aiResponseStr)
	if err != nil {
		return nil, fmt.Errorf("解析AI响应失败: %w", err)
	}

	return knowledgeData, nil
}

// readImageFile 读取图片文件
func (s *ImageAnalysisService) readImageFile(file *multipart.FileHeader) ([]byte, error) {
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	return io.ReadAll(src)
}

// buildAnalysisPrompt 构建分析提示词
func (s *ImageAnalysisService) buildAnalysisPrompt() string {
	return `你是一个专业的教育内容分析助手。你的任务是分析图片中的知识点，并提取结构化信息。

分析要求：
1. 识别图片中的主要知识点（1-3个核心知识点）
2. 为每个知识点生成5个前置知识点（学习这个知识点需要先掌握的内容）
3. 为每个知识点生成5个后置知识点（掌握这个知识点后可以学习的内容）
4. 所有ID必须唯一，格式为：kp-001, kp-002（主要知识点），kp-p001（前置），kp-n001（后置）
5. 置信度（confidence）范围：0-1，表示识别的准确性

注意：
- 必须严格按照JSON格式返回
- 前置知识点和后置知识点各必须有且仅有5个
- 分类（category）要准确，如：数学、物理、化学、编程、人工智能等
- 描述要清晰、准确、简洁`
}

// buildUserPrompt 构建用户提示词
func (s *ImageAnalysisService) buildUserPrompt() string {
	return `请分析这张图片中的知识点内容。

要求：
1. 提供一段完整的详细解释（detailedExplanation），解释图片中的主要知识内容
2. 识别图片中的重点知识点（keyPoints），2-5个
3. 为每个重点知识点提供一个趣味示例（funExamples），帮助理解
4. 提供5个前置知识点（prerequisites），学习所需的基础
5. 提供5个后置知识点（postrequisites），掌握后可以学习的内容
6. 提供一段总结（conclusion），汇总学习建议

请严格按照以下JSON格式返回（只返回JSON，不要其他说明文字）：

{
  "detailedExplanation": "这是一段完整的详细解释，介绍图片中的主要知识内容...",
  "keyPoints": [
    {
      "id": "kp-001",
      "title": "重点知识点标题",
      "description": "详细描述",
      "category": "分类名称",
      "confidence": 0.95
    }
  ],
  "funExamples": [
    {
      "knowledgePointId": "kp-001",
      "title": "趣味示例标题",
      "content": "生动有趣的示例内容，帮助理解知识点..."
    }
  ],
  "prerequisites": [
    {"id": "kp-p001", "title": "前置知识1", "description": "描述", "category": "分类"},
    {"id": "kp-p002", "title": "前置知识2", "description": "描述", "category": "分类"},
    {"id": "kp-p003", "title": "前置知识3", "description": "描述", "category": "分类"},
    {"id": "kp-p004", "title": "前置知识4", "description": "描述", "category": "分类"},
    {"id": "kp-p005", "title": "前置知识5", "description": "描述", "category": "分类"}
  ],
  "postrequisites": [
    {"id": "kp-n001", "title": "后置知识1", "description": "描述", "category": "分类"},
    {"id": "kp-n002", "title": "后置知识2", "description": "描述", "category": "分类"},
    {"id": "kp-n003", "title": "后置知识3", "description": "描述", "category": "分类"},
    {"id": "kp-n004", "title": "后置知识4", "description": "描述", "category": "分类"},
    {"id": "kp-n005", "title": "后置知识5", "description": "描述", "category": "分类"}
  ],
  "conclusion": "总结：通过学习这些知识点，你将能够..."
}`
}

// parseAIResponse 解析AI响应
func (s *ImageAnalysisService) parseAIResponse(aiResponse string) (*schema.KnowledgeAnalysisResponse, error) {
	// 尝试提取JSON（AI可能在JSON前后添加了其他文字）
	jsonStr := s.extractJSON(aiResponse)
	
	var result schema.KnowledgeAnalysisResponse
	err := json.Unmarshal([]byte(jsonStr), &result)
	if err != nil {
		return nil, fmt.Errorf("JSON解析失败: %w, 响应内容: %s", err, aiResponse)
	}

	// 验证数据完整性
	if len(result.Prerequisites) != 5 {
		return nil, fmt.Errorf("前置知识点数量不正确，期望5个，实际%d个", len(result.Prerequisites))
	}
	if len(result.Postrequisites) != 5 {
		return nil, fmt.Errorf("后置知识点数量不正确，期望5个，实际%d个", len(result.Postrequisites))
	}

	return &result, nil
}

// extractJSON 从文本中提取JSON
func (s *ImageAnalysisService) extractJSON(text string) string {
	// 查找第一个 { 和最后一个 }
	start := -1
	end := -1
	
	for i, ch := range text {
		if ch == '{' && start == -1 {
			start = i
		}
		if ch == '}' {
			end = i
		}
	}
	
	if start != -1 && end != -1 && end > start {
		return text[start : end+1]
	}
	
	return text
}

