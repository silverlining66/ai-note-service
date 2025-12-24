# 启动后端，放在后台运行
cd backend
go run main.go &

# 启动前端，放在当前终端输出执行
cd ../frontend
npm run dev
