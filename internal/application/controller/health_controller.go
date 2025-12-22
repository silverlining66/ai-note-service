package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthController 健康检查控制器
type HealthController struct{}

// NewHealthController 创建健康检查控制器
func NewHealthController() *HealthController {
	return &HealthController{}
}

// Check 健康检查
// @Summary 健康检查
// @Description 检查服务是否正常运行
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /health [get]
func (ctrl *HealthController) Check(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"service": "ai-note-service",
	})
}

