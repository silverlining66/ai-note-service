package controller

import (
	"ai-note-service/internal/application/common"
	"ai-note-service/internal/application/errcode"
	"ai-note-service/internal/application/schema"
	"ai-note-service/internal/application/service"
	"log"

	"github.com/gin-gonic/gin"
)

// KnowledgeController 知识点控制器
type KnowledgeController struct {
	mockService      *service.MockKnowledgeService
	knowledgeService *service.KnowledgeService
	useMockData      bool // 控制是否使用假数据
}

// NewKnowledgeController 创建知识点控制器
func NewKnowledgeController() *KnowledgeController {
	return &KnowledgeController{
		mockService:      service.NewMockKnowledgeService(),
		knowledgeService: service.NewKnowledgeService(),
		useMockData:      false, // 默认使用真实AI服务
	}
}

// GetDialogue 获取知识点的AI对话响应
// @Summary AI对话接口
// @Description 发送用户消息，获取AI助手关于特定知识点的回复
// @Tags AI对话
// @Accept json
// @Produce json
// @Param knowledgePointId path string true "知识点ID"
// @Param request body schema.DialogueRequest true "对话请求"
// @Success 200 {object} schema.Response{data=schema.DialogueResponse}
// @Router /api/knowledge-points/{knowledgePointId}/dialogue [post]
func (ctrl *KnowledgeController) GetDialogue(c *gin.Context) {
	// 1. 获取知识点ID
	knowledgePointId := c.Param("knowledgePointId")
	if knowledgePointId == "" {
		common.ErrorResponse(c, errcode.InvalidParams, "知识点ID不能为空")
		return
	}

	// 2. 绑定请求参数
	var req schema.DialogueRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ErrorResponse(c, errcode.InvalidParams, err.Error())
		return
	}

	// 3. 如果使用假数据模式
	if ctrl.useMockData {
		mockResponse := ctrl.mockService.GetMockDialogueResponse(knowledgePointId, req.Message)
		common.SuccessResponse(c, mockResponse)
		return
	}

	// 4. 使用真实AI服务
	// 获取知识点信息
	title, description, err := ctrl.knowledgeService.GetKnowledgePointInfo(knowledgePointId)
	if err != nil {
		log.Printf("获取知识点信息失败: %v", err)
		// 即使获取失败，也继续处理，使用通用提示词
	}

	// 调用AI服务获取对话响应
	response, err := ctrl.knowledgeService.GetDialogueResponse(
		knowledgePointId,
		title,
		description,
		req.Message,
		req.ConversationHistory,
	)

	if err != nil {
		log.Printf("AI对话失败: %v", err)
		common.ErrorResponse(c, errcode.AIServiceError, err.Error())
		return
	}

	// 5. 返回成功响应
	common.SuccessResponse(c, response)
}

