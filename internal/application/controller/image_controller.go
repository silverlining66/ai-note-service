package controller

import (
	"ai-note-service/internal/application/common"
	"ai-note-service/internal/application/errcode"
	"ai-note-service/internal/application/service"
	"log"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

// ImageController 图片控制器
type ImageController struct {
	mockService          *service.MockKnowledgeService
	imageAnalysisService *service.ImageAnalysisService
	useMockData          bool // 控制是否使用假数据
}

// NewImageController 创建图片控制器
func NewImageController() *ImageController {
	return &ImageController{
		mockService:          service.NewMockKnowledgeService(),
		imageAnalysisService: service.NewImageAnalysisService(),
		useMockData:          false, // 使用真实AI分析
	}
}

// AnalyzeImage 分析图片并提取知识点
// @Summary 图片知识点分析
// @Description 上传图片文件，分析图片内容并返回检测到的知识点及其关系
// @Tags 图片分析
// @Accept multipart/form-data
// @Produce json
// @Param image formData file true "图片文件"
// @Success 200 {object} schema.Response{data=schema.KnowledgeAnalysisResponse}
// @Router /api/analyze/image [post]
func (ctrl *ImageController) AnalyzeImage(c *gin.Context) {
	// 1. 接收图片文件
	file, err := c.FormFile("image")
	if err != nil {
		common.ErrorResponse(c, errcode.InvalidParams, "请上传图片文件")
		return
	}

	// 2. 验证图片格式
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
	valid := false
	for _, allowed := range allowedExts {
		if ext == allowed {
			valid = true
			break
		}
	}
	if !valid {
		common.ErrorResponse(c, errcode.InvalidParams, "不支持的图片格式，请上传 jpg, jpeg, png, gif 或 webp 格式的图片")
		return
	}

	// 3. 验证文件大小（最大 10MB）
	maxSize := int64(10 * 1024 * 1024) // 10MB
	if file.Size > maxSize {
		common.ErrorResponse(c, errcode.InvalidParams, "图片文件过大，最大支持 10MB")
		return
	}

	// 4. 如果使用假数据模式
	if ctrl.useMockData {
		mockData := ctrl.mockService.GetMockKnowledgeAnalysis()
		common.SuccessResponse(c, mockData)
		return
	}

	// 5. 使用真实AI服务分析图片
	log.Printf("开始分析图片: %s (大小: %d bytes)", file.Filename, file.Size)
	
	analysisResult, err := ctrl.imageAnalysisService.AnalyzeImage(file)
	if err != nil {
		log.Printf("图片分析失败: %v", err)
		common.ErrorResponse(c, errcode.AIServiceError, err.Error())
		return
	}

	log.Printf("图片分析成功，识别到 %d 个重点知识点", len(analysisResult.KeyPoints))

	// 6. 返回成功响应
	common.SuccessResponse(c, analysisResult)
}
