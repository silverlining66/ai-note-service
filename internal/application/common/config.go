package common

import (
	"gopkg.in/yaml.v3"
	"os"
)

// LoadConfig 加载配置文件
func LoadConfig(path string, config interface{}) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	return yaml.Unmarshal(data, config)
}

