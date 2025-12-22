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
	knowledgeService *service.KnowledgeService
}

// NewKnowledgeController 创建知识点控制器
func NewKnowledgeController() *KnowledgeController {
	return &KnowledgeController{
		knowledgeService: service.NewKnowledgeService(),
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

	// 3. 验证前端必须传递知识点信息
	if req.KnowledgePointTitle == "" || req.KnowledgePointDesc == "" {
		common.ErrorResponse(c, errcode.InvalidParams, "请求参数不完整：必须提供 knowledgePointTitle 和 knowledgePointDesc")
		return
	}

	log.Printf("对话请求 - ID: %s, Title: %s, Description: %s", knowledgePointId, req.KnowledgePointTitle, req.KnowledgePointDesc)

	// 4. 调用AI服务获取对话响应
	response, err := ctrl.knowledgeService.GetDialogueResponse(
		knowledgePointId,
		req.KnowledgePointTitle,
		req.KnowledgePointDesc,
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
