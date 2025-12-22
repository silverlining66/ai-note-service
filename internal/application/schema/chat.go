package schema

import "encoding/json"

// Message 消息结构（支持文本和图片）
type Message struct {
	Role    string      `json:"role" binding:"required"`
	Content interface{} `json:"content" binding:"required"` // 可以是 string 或 []ContentPart
}

// ContentPart 内容部分（用于多模态消息）
type ContentPart struct {
	Type     string    `json:"type"`                // "text" 或 "image_url"
	Text     string    `json:"text,omitempty"`      // 文本内容
	ImageURL *ImageURL `json:"image_url,omitempty"` // 图片URL
}

// ImageURL 图片URL结构
type ImageURL struct {
	URL string `json:"url"` // 支持 http(s):// 或 data:image/...;base64,...
}

// NewTextMessage 创建文本消息
func NewTextMessage(role, content string) Message {
	return Message{
		Role:    role,
		Content: content,
	}
}

// NewVisionMessage 创建包含图片的消息
func NewVisionMessage(role, text, imageURL string) Message {
	return Message{
		Role: role,
		Content: []ContentPart{
			{
				Type: "text",
				Text: text,
			},
			{
				Type: "image_url",
				ImageURL: &ImageURL{
					URL: imageURL,
				},
			},
		},
	}
}

// MarshalJSON 自定义JSON序列化
func (m Message) MarshalJSON() ([]byte, error) {
	type Alias Message
	return json.Marshal(&struct {
		*Alias
	}{
		Alias: (*Alias)(&m),
	})
}

// ChatRequest 聊天请求
type ChatRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages" binding:"required,min=1"`
	Temperature float64   `json:"temperature,omitempty"`
	MaxTokens   int       `json:"max_tokens,omitempty"`
	Stream      bool      `json:"stream,omitempty"`
}

// ChatResponse 聊天响应
type ChatResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

// Choice 选项
type Choice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

// Usage 使用情况
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

