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

// KnowledgeAnalysisResponse 图片分析响应
type KnowledgeAnalysisResponse struct {
	Summary        []KnowledgePoint `json:"summary"`
	Graph          KnowledgeGraph   `json:"graph"`
	Prerequisites  []KnowledgePoint `json:"prerequisites"`
	Postrequisites []KnowledgePoint `json:"postrequisites"`
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

