package service

import (
	"ai-note-service/internal/application/schema"
	"time"
)

// MockKnowledgeService 假数据服务
type MockKnowledgeService struct{}

// NewMockKnowledgeService 创建假数据服务实例
func NewMockKnowledgeService() *MockKnowledgeService {
	return &MockKnowledgeService{}
}

// GetMockKnowledgeAnalysis 返回假的知识点分析数据
func (s *MockKnowledgeService) GetMockKnowledgeAnalysis() *schema.KnowledgeAnalysisResponse {
	confidence1 := 0.95
	confidence2 := 0.88

	return &schema.KnowledgeAnalysisResponse{
		DetailedExplanation: "这张图片展示了机器学习和线性代数的核心概念。机器学习是人工智能的重要分支，通过算法让计算机从数据中学习规律。线性代数提供了处理高维数据的数学工具，包括矩阵运算、向量空间等基础概念，是机器学习算法的数学基础。",
		KeyPoints: []schema.KnowledgePoint{
			{
				ID:          "kp-001",
				Title:       "线性代数基础",
				Description: "矩阵运算和向量空间的基本概念",
				Category:    "数学",
				Confidence:  &confidence1,
			},
			{
				ID:          "kp-002",
				Title:       "机器学习入门",
				Description: "监督学习和无监督学习的基本原理",
				Category:    "计算机科学",
				Confidence:  &confidence2,
			},
		},
		FunExamples: []schema.FunExample{
			{
				KnowledgePointID: "kp-001",
				Title:            "矩阵就像数据表格",
				Content:          "想象一个Excel表格，每一行代表一个学生，每一列代表一门课程的成绩。这个表格就是一个矩阵！矩阵运算就是对这些数据进行各种计算和变换。",
			},
			{
				KnowledgePointID: "kp-002",
				Title:            "机器学习就像教小孩认字",
				Content:          "就像你给小孩看很多张猫和狗的照片，告诉他们哪些是猫哪些是狗，慢慢地小孩就能自己分辨了。机器学习也是这样，给计算机看很多数据和答案，它就能学会规律。",
			},
		},
		Prerequisites: []schema.KnowledgePoint{
			{
				ID:          "kp-p001",
				Title:       "高等数学",
				Description: "微积分和数学分析基础",
				Category:    "数学",
			},
			{
				ID:          "kp-p002",
				Title:       "概率论",
				Description: "概率分布和统计推断",
				Category:    "数学",
			},
			{
				ID:          "kp-p003",
				Title:       "统计学",
				Description: "描述性统计和假设检验",
				Category:    "数学",
			},
			{
				ID:          "kp-p004",
				Title:       "Python编程",
				Description: "Python基础语法和常用库",
				Category:    "编程",
			},
			{
				ID:          "kp-p005",
				Title:       "数据结构",
				Description: "数组、链表、树等数据结构",
				Category:    "计算机科学",
			},
		},
		Postrequisites: []schema.KnowledgePoint{
			{
				ID:          "kp-n001",
				Title:       "深度学习",
				Description: "神经网络和反向传播算法",
				Category:    "人工智能",
			},
			{
				ID:          "kp-n002",
				Title:       "自然语言处理",
				Description: "文本处理和语言模型",
				Category:    "人工智能",
			},
			{
				ID:          "kp-n003",
				Title:       "计算机视觉",
				Description: "图像识别和目标检测",
				Category:    "人工智能",
			},
			{
				ID:          "kp-n004",
				Title:       "强化学习",
				Description: "Q学习和策略梯度方法",
				Category:    "人工智能",
			},
			{
				ID:          "kp-n005",
				Title:       "模型优化",
				Description: "超参数调优和模型压缩",
				Category:    "人工智能",
			},
		},
		Conclusion: "通过掌握线性代数和机器学习的基础知识，你将能够理解现代AI技术的核心原理。建议先巩固数学基础，然后通过实际项目来深化理解。持续学习和实践是掌握这些知识的关键。",
	}
}

// GetMockDialogueResponse 返回假的对话响应
func (s *MockKnowledgeService) GetMockDialogueResponse(knowledgePointId string, message string) *schema.DialogueResponse {
	// 根据不同的知识点ID返回不同的回复
	responses := map[string]string{
		"kp-001": "线性代数基础是机器学习的重要数学基础。它主要涉及矩阵运算、向量空间、特征值和特征向量等概念。矩阵运算包括矩阵的加法、乘法、转置等基本操作，这些操作在机器学习算法中广泛应用，例如在神经网络的前向传播和反向传播过程中。",
		"kp-002": "机器学习是人工智能的一个重要分支，主要研究如何让计算机从数据中学习规律。它分为监督学习、无监督学习和强化学习三大类。监督学习使用标注数据训练模型，无监督学习从未标注数据中发现模式，强化学习通过与环境交互学习最优策略。",
	}

	response := responses[knowledgePointId]
	if response == "" {
		response = "这是一个很好的问题！" + message + " 让我来为你详细解答。这个知识点涉及多个方面的内容，包括基本概念、应用场景和学习方法等。建议你先掌握相关的前置知识，这样会更容易理解。"
	}

	return &schema.DialogueResponse{
		Message:   response,
		Timestamp: getCurrentTimestamp(),
	}
}

// getCurrentTimestamp 获取当前时间戳（ISO 8601格式）
func getCurrentTimestamp() string {
	return time.Now().Format(time.RFC3339)
}

