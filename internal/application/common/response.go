package common

import (
	"ai-note-service/internal/application/errcode"
	"ai-note-service/internal/application/schema"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SuccessResponse 成功响应
func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, schema.Response{
		Code:    errcode.Success.Code,
		Message: errcode.Success.Message,
		Data:    data,
	})
}

// ErrorResponse 错误响应
func ErrorResponse(c *gin.Context, err *errcode.ErrCode, detail string) {
	message := err.Message
	if detail != "" {
		message = message + ": " + detail
	}
	c.JSON(http.StatusOK, schema.Response{
		Code:    err.Code,
		Message: message,
	})
}

// InternalErrorResponse 内部错误响应
func InternalErrorResponse(c *gin.Context, err error) {
	c.JSON(http.StatusOK, schema.Response{
		Code:    errcode.InternalError.Code,
		Message: errcode.InternalError.Message,
		Data:    err.Error(),
	})
}

