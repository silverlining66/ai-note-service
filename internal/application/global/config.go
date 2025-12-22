package global

import (
	"sync"
)

// Config 全局配置
var (
	Config     *AppConfig
	configOnce sync.Once
)

// AppConfig 应用配置结构
type AppConfig struct {
	Server ServerConfig `yaml:"server"`
	AI     AIConfig     `yaml:"ai"`
}

// ServerConfig 服务器配置
type ServerConfig struct {
	Port int    `yaml:"port"`
	Host string `yaml:"host"`
}

// AIConfig AI服务配置
type AIConfig struct {
	BaseURL      string `yaml:"base_url"`
	APIKey       string `yaml:"api_key"`
	DefaultModel string `yaml:"default_model"`
	Timeout      int    `yaml:"timeout"` // 超时时间（秒）
}

