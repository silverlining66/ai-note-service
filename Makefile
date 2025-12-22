.PHONY: help run build test clean tidy

help: ## 显示帮助信息
	@echo "可用命令:"
	@echo "  make run     - 运行服务"
	@echo "  make build   - 编译二进制文件"
	@echo "  make test    - 运行测试"
	@echo "  make tidy    - 整理依赖"
	@echo "  make clean   - 清理编译文件"

run: ## 运行服务
	@echo "启动服务..."
	go run main.go

build: ## 编译二进制文件
	@echo "编译中..."
	go build -o ai-note-service main.go
	@echo "编译完成: ./ai-note-service"

test: ## 运行测试
	go test -v ./...

tidy: ## 整理依赖
	go mod tidy

clean: ## 清理编译文件
	rm -f ai-note-service
	@echo "清理完成"

