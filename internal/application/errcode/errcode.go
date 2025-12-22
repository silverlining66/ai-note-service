package errcode

import "fmt"

// ErrCode 错误码
type ErrCode struct {
	Code    int
	Message string
}

func (e *ErrCode) Error() string {
	return fmt.Sprintf("code: %d, message: %s", e.Code, e.Message)
}

// 定义错误码
var (
	Success            = &ErrCode{Code: 0, Message: "success"}
	InternalError      = &ErrCode{Code: 10001, Message: "internal server error"}
	InvalidParams      = &ErrCode{Code: 10002, Message: "invalid parameters"}
	AIServiceError     = &ErrCode{Code: 20001, Message: "AI service error"}
	AIServiceTimeout   = &ErrCode{Code: 20002, Message: "AI service timeout"}
	ConfigLoadError    = &ErrCode{Code: 30001, Message: "config load error"}
)

// NewError 创建新的错误
func NewError(errCode *ErrCode, detail string) error {
	return fmt.Errorf("%s: %s", errCode.Message, detail)
}

