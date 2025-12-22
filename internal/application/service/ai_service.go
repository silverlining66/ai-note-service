package service

import (
	"ai-note-service/internal/application/global"
	"ai-note-service/internal/application/schema"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// AIService AI服务接口
type AIService struct {
	client  *http.Client
	baseURL string
	apiKey  string
	model   string
}

// NewAIService 创建AI服务实例
func NewAIService() *AIService {
	cfg := global.Config.AI
	return &AIService{
		client: &http.Client{
			Timeout: time.Duration(cfg.Timeout) * time.Second,
		},
		baseURL: cfg.BaseURL,
		apiKey:  cfg.APIKey,
		model:   cfg.DefaultModel,
	}
}

// Chat 调用聊天接口
func (s *AIService) Chat(req *schema.ChatRequest) (*schema.ChatResponse, error) {
	// 如果请求中没有指定模型，使用默认模型
	if req.Model == "" {
		req.Model = s.model
	}

	// 构建请求URL
	url := fmt.Sprintf("%s/chat/completions", s.baseURL)

	// 序列化请求体
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal request failed: %w", err)
	}

	// 创建HTTP请求
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	// 设置请求头
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.apiKey))

	// 发送请求
	resp, err := s.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("send request failed: %w", err)
	}
	defer resp.Body.Close()

	// 读取响应体
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read response failed: %w", err)
	}

	// 检查HTTP状态码
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-200 status: %d, body: %s", resp.StatusCode, string(respBody))
	}

	// 解析响应
	var chatResp schema.ChatResponse
	if err := json.Unmarshal(respBody, &chatResp); err != nil {
		return nil, fmt.Errorf("unmarshal response failed: %w, body: %s", err, string(respBody))
	}

	return &chatResp, nil
}

