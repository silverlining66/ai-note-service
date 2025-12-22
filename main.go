package main

import (
	"ai-note-service/internal/application/common"
	"ai-note-service/internal/application/controller"
	"ai-note-service/internal/application/global"
	"fmt"
	"log"
)

func main() {
	// 加载配置
	if err := initConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化路由
	router := controller.NewRouter()
	engine := router.Setup()

	// 启动服务器
	addr := fmt.Sprintf("%s:%d", global.Config.Server.Host, global.Config.Server.Port)
	log.Printf("Server starting on %s", addr)
	log.Printf("AI Service Base URL: %s", global.Config.AI.BaseURL)
	log.Printf("Default Model: %s", global.Config.AI.DefaultModel)
	
	if err := engine.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// initConfig 初始化配置
func initConfig() error {
	global.Config = &global.AppConfig{}
	return common.LoadConfig("config.yaml", global.Config)
}