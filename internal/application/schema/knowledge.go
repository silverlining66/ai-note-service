package schema

// KnowledgePoint 知识点
type KnowledgePoint struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Category    string   `json:"category,omitempty"`
	Confidence  *float64 `json:"confidence,omitempty"`
}

// Position 位置坐标
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// KnowledgeGraphNode 知识图谱节点
type KnowledgeGraphNode struct {
	ID       string   `json:"id"`
	Label    string   `json:"label"`
	Position Position `json:"position"`
}

// KnowledgeGraphEdge 知识图谱边
type KnowledgeGraphEdge struct {
	ID     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
	Type   string `json:"type"` // "prerequisite" | "postrequisite" | "related"
	Label  string `json:"label,omitempty"`
}

// KnowledgeGraph 知识图谱
type KnowledgeGraph struct {
	Nodes []KnowledgeGraphNode `json:"nodes"`
	Edges []KnowledgeGraphEdge `json:"edges"`
}

// FunExample 趣味示例
type FunExample struct {
	KnowledgePointID string `json:"knowledgePointId"`
	Title            string `json:"title"`
	Content          string `json:"content"`
	ImageURL         string `json:"imageUrl,omitempty"`
}

// KnowledgeAnalysisResponse 图片分析响应（新版本）
type KnowledgeAnalysisResponse struct {
	DetailedExplanation string           `json:"detailedExplanation"` // 完整的对这张图片的知识点详解
	Prerequisites       []KnowledgePoint `json:"prerequisites"`        // 前置知识点
	KeyPoints           []KnowledgePoint `json:"keyPoints"`            // 这张图片中的重点知识点
	FunExamples         []FunExample     `json:"funExamples"`          // 重点知识点对应的趣味示例
	Postrequisites      []KnowledgePoint `json:"postrequisites"`       // 这张图片对应的后置知识点
	Conclusion          string           `json:"conclusion"`           // 最后的汇总
}

// ConversationMessage 对话消息
type ConversationMessage struct {
	ID        string `json:"id"`
	Sender    string `json:"sender"` // "user" | "ai"
	Content   string `json:"content"`
	Timestamp string `json:"timestamp"`
}

// DialogueRequest 对话请求
type DialogueRequest struct {
	Message             string                `json:"message" binding:"required"`
	ConversationHistory []ConversationMessage `json:"conversationHistory,omitempty"`
}

// DialogueResponse 对话响应
type DialogueResponse struct {
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

