package controller

import (
	"ai-note-service/internal/application/common"
	"ai-note-service/internal/application/errcode"
	"ai-note-service/internal/application/schema"
	"ai-note-service/internal/application/service"

	"github.com/gin-gonic/gin"
)

// ChatController 聊天控制器
type ChatController struct {
	aiService *service.AIService
}

// NewChatController 创建聊天控制器
func NewChatController() *ChatController {
	return &ChatController{
		aiService: service.NewAIService(),
	}
}

// Chat 处理聊天请求
// @Summary 聊天接口
// @Description 调用AI模型进行聊天
// @Tags chat
// @Accept json
// @Produce json
// @Param request body schema.ChatRequest true "聊天请求"
// @Success 200 {object} schema.Response{data=schema.ChatResponse}
// @Router /api/v1/chat [post]
func (ctrl *ChatController) Chat(c *gin.Context) {
	var req schema.ChatRequest

	// 绑定请求参数
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ErrorResponse(c, errcode.InvalidParams, err.Error())
		return
	}

	// 调用AI服务
	resp, err := ctrl.aiService.Chat(&req)
	if err != nil {
		common.ErrorResponse(c, errcode.AIServiceError, err.Error())
		return
	}

	// 返回成功响应
	common.SuccessResponse(c, resp)
}

// SimpleChat 简化的聊天接口
// @Summary 简化聊天接口
// @Description 只需要传入用户消息，自动添加系统提示词
// @Tags chat
// @Accept json
// @Produce json
// @Param request body map[string]string true "简化聊天请求"
// @Success 200 {object} schema.Response{data=schema.ChatResponse}
// @Router /api/v1/chat/simple [post]
func (ctrl *ChatController) SimpleChat(c *gin.Context) {
	var simpleReq struct {
		Message string `json:"message" binding:"required"`
		Model   string `json:"model"`
	}

	// 绑定请求参数
	if err := c.ShouldBindJSON(&simpleReq); err != nil {
		common.ErrorResponse(c, errcode.InvalidParams, err.Error())
		return
	}

	// 构建完整的聊天请求
	req := schema.ChatRequest{
		Model: simpleReq.Model,
		Messages: []schema.Message{
			schema.NewTextMessage("system", "You are a helpful assistant."),
			schema.NewTextMessage("user", simpleReq.Message),
		},
	}

	// 调用AI服务
	resp, err := ctrl.aiService.Chat(&req)
	if err != nil {
		common.ErrorResponse(c, errcode.AIServiceError, err.Error())
		return
	}

	// 返回成功响应
	common.SuccessResponse(c, resp)
}

