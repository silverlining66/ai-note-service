package controller

import (
	"github.com/gin-gonic/gin"
)

// Router 路由配置
type Router struct {
	engine              *gin.Engine
	chatController      *ChatController
	healthController    *HealthController
	imageController     *ImageController
	knowledgeController *KnowledgeController
}

// NewRouter 创建路由
func NewRouter() *Router {
	engine := gin.Default()

	// 添加CORS中间件
	engine.Use(corsMiddleware())

	return &Router{
		engine:              engine,
		chatController:      NewChatController(),
		healthController:    NewHealthController(),
		imageController:     NewImageController(),
		knowledgeController: NewKnowledgeController(),
	}
}

// Setup 设置路由
func (r *Router) Setup() *gin.Engine {
	// 健康检查
	r.engine.GET("/health", r.healthController.Check)

	// API路由组
	api := r.engine.Group("/api")
	{
		// 图片分析路由
		analyze := api.Group("/analyze")
		{
			analyze.POST("/image", r.imageController.AnalyzeImage)
		}

		// 知识点相关路由
		knowledgePoints := api.Group("/knowledge-points")
		{
			knowledgePoints.POST("/:knowledgePointId/dialogue", r.knowledgeController.GetDialogue)
		}
	}

	// API v1 路由组（保留原有的聊天接口）
	apiV1 := r.engine.Group("/api/v1")
	{
		// 聊天相关路由
		chat := apiV1.Group("/chat")
		{
			chat.POST("", r.chatController.Chat)
			chat.POST("/simple", r.chatController.SimpleChat)
		}
	}

	return r.engine
}

// corsMiddleware CORS中间件
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
