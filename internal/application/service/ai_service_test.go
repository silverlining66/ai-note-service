package service

import (
	"ai-note-service/internal/application/global"
	"ai-note-service/internal/application/schema"
	"testing"
)

func TestNewAIService(t *testing.T) {
	// 初始化配置
	global.Config = &global.AppConfig{
		AI: global.AIConfig{
			BaseURL:      "http://test.example.com",
			APIKey:       "test-key",
			DefaultModel: "test-model",
			Timeout:      30,
		},
	}

	service := NewAIService()
	if service == nil {
		t.Fatal("NewAIService returned nil")
	}

	if service.baseURL != global.Config.AI.BaseURL {
		t.Errorf("Expected baseURL %s, got %s", global.Config.AI.BaseURL, service.baseURL)
	}

	if service.apiKey != global.Config.AI.APIKey {
		t.Errorf("Expected apiKey %s, got %s", global.Config.AI.APIKey, service.apiKey)
	}

	if service.model != global.Config.AI.DefaultModel {
		t.Errorf("Expected model %s, got %s", global.Config.AI.DefaultModel, service.model)
	}
}

func TestChatRequest(t *testing.T) {
	// 测试请求结构验证
	req := &schema.ChatRequest{
		Model: "test-model",
		Messages: []schema.Message{
			{
				Role:    "user",
				Content: "Hello",
			},
		},
	}

	if req.Model != "test-model" {
		t.Errorf("Expected model test-model, got %s", req.Model)
	}

	if len(req.Messages) != 1 {
		t.Errorf("Expected 1 message, got %d", len(req.Messages))
	}

	if req.Messages[0].Role != "user" {
		t.Errorf("Expected role user, got %s", req.Messages[0].Role)
	}
}

