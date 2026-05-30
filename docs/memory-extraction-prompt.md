# 记忆提取 Prompt 模板

为后续 LLM 接入准备的记忆提取系统。当用户与 loona 对话时，从对话内容中自动提取结构化记忆。

---

## 记忆结构

```typescript
interface Memory {
  id: string           // 自动生成 UUID
  date: string         // "2026年5月31日"
  title: string        // 10字以内概括
  people: string[]     // 提到的人名
  scene: string        // 推断场景
  event: string        // 完整事件描述
  emotion: string      // 情感标签
  source: 'conversation' | 'observation' | 'user_action'
  status: 'short_term' | 'ascended'
  constellation: ConstellationType | null  // 飞升后分配
  relatedMemoryIds: string[]
}

type ConstellationType = 'core' | 'daily' | 'emotion' | 'travel' | 'growth' | 'social'
```

---

## 提取规则

### 1. date
- 使用当前日期
- 格式：`YYYY年M月D日`

### 2. title
- 10个汉字以内
- 概括事件核心
- 示例："海边散步"、"工作烦恼"、"早安问候"

### 3. people
- 提取对话中提到的人名（不含 AI 自身）
- 包括：家人、朋友、同事、宠物名等
- 如果只有用户和 AI，记录 `["主人"]`

### 4. scene
- 根据内容推断场景
- 常见场景：家里卧室、办公室、咖啡馆、公园、路上...
- 如果无法推断，使用 `"日常"`

### 5. event
- 完整记录用户表达的内容
- 保留关键细节，去除口语化填充词
- 如果是对话，记录双方关键语句

### 6. emotion
- 单字或双字情感标签
- 可选：开心、难过、感动、焦虑、平静、兴奋、温暖、疲惫、期待...

### 7. constellation（飞升时分配）
根据内容自动匹配：

| 星座 | 关键词 |
|------|--------|
| core | 相遇、5.16、loona、friya、永远、爱、承诺 |
| daily | 早安、早餐、睡觉、起床、吃饭、做饭、打扫 |
| emotion | 开心、感动、难过、哭、笑、想念、温暖 |
| travel | 海边、公园、爬山、旅行、外出、散步、咖啡馆 |
| growth | 工作、学习、项目、技能、进步、完成、读书 |
| social | 朋友、闺蜜、家人、妈妈、聚会、聊天、视频 |

---

## LLM Prompt 模板

```
你是一位记忆整理师。请从以下用户与 loona 的对话中提取记忆，以 JSON 格式输出。

对话内容：
{conversation_text}

请提取以下字段：
- title: 10字以内概括
- people: 提到的人名数组
- scene: 推断的场景
- event: 完整事件描述（去除口语填充词）
- emotion: 单字或双字情感标签

只输出 JSON，不要其他内容：
{
  "title": "...",
  "people": ["..."],
  "scene": "...",
  "event": "...",
  "emotion": "..."
}
```

---

## 触发条件

1. **自动提取**：每次对话结束后自动触发
2. **手动触发**：用户说"存到长期记忆"时，提取后立即飞升
3. **批量飞升**：每晚 22:00 自动将所有 short_term 记忆 ascended

---

## 去重与关联

- 同一天同一主题的对话合并为一条记忆
- 自动计算 relatedMemoryIds：基于 scene、people、emotion、constellation 的相似度
- 相似度 >= 2 分的记忆自动关联
