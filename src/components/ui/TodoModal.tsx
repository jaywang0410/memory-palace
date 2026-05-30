import { useState } from 'react'
import { useTodoStore } from '../../stores/useTodoStore'
import type { TodoItem } from '../../types/todo'

type TabType = 'today' | 'scheduled' | 'completed'

interface Props {
  onClose: () => void
}

export default function TodoModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('today')
  const todos = useTodoStore((s) => s.todos)
  const toggleTodo = useTodoStore((s) => s.toggleTodo)

  const todayTodos = todos.filter((t) => t.status !== 'completed' && t.category === 'today')
  const scheduledTodos = todos.filter((t) => t.status !== 'completed' && t.category === 'scheduled')
  const completedTodos = todos.filter((t) => t.status === 'completed')

  const displayTodos: Record<TabType, TodoItem[]> = {
    today: todayTodos,
    scheduled: scheduledTodos,
    completed: completedTodos,
  }

  const tabLabels: Record<TabType, string> = {
    today: '今天',
    scheduled: '计划',
    completed: '已完成',
  }

  const currentList = displayTodos[activeTab]

  return (
    <div
      className="absolute z-30"
      style={{
        top: '20%',
        left: '78%',
        transform: 'translateX(-50%)',
        width: 320,
        background: '#f5f5f7',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1)',
        color: '#1c1c1e',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            color: '#1c1c1e',
            letterSpacing: '-0.5px',
          }}
        >
          备忘录
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#8e8e93',
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            ;(e.target as HTMLButtonElement).style.background = 'rgba(0,0,0,0.05)'
          }}
          onMouseLeave={(e) => {
            ;(e.target as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          &times;
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          padding: '0 16px 12px',
          gap: 8,
        }}
      >
        {(Object.keys(tabLabels) as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              fontSize: 13,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#fff' : '#8e8e93',
              background: activeTab === tab ? '#ff9500' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tabLabels[tab]}
            <span
              style={{
                marginLeft: 4,
                fontSize: 11,
                opacity: 0.7,
              }}
            >
              {displayTodos[tab].length}
            </span>
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div
        style={{
          padding: '0 12px 12px',
          maxHeight: 340,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {currentList.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: 'center',
                color: '#c7c7cc',
                fontSize: 14,
              }}
            >
              没有事项
            </div>
          ) : (
            currentList.map((todo, index) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                isLast={index === currentList.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function TodoRow({
  todo,
  onToggle,
  isLast,
}: {
  todo: TodoItem
  onToggle: () => void
  isLast: boolean
}) {
  const isCompleted = todo.status === 'completed'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '0.5px solid #e5e5ea',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.02)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: isCompleted ? 'none' : '1.5px solid #c7c7cc',
          background: isCompleted ? '#ff9500' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
          transition: 'all 0.2s',
        }}
      >
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.4,
            color: isCompleted ? '#c7c7cc' : '#1c1c1e',
            textDecoration: isCompleted ? 'line-through' : 'none',
            transition: 'color 0.2s',
            wordBreak: 'break-word',
          }}
        >
          {todo.content}
        </div>

        {/* Reminder message for pending items */}
        {!isCompleted && todo.reminderMessage && (
          <div
            style={{
              fontSize: 12,
              color: '#8e8e93',
              marginTop: 4,
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            {todo.reminderMessage}
          </div>
        )}

        {/* Source tag */}
        <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span
            style={{
              fontSize: 10,
              color: todo.source === 'ai_observation' ? '#34c759' : '#007aff',
              background:
                todo.source === 'ai_observation'
                  ? 'rgba(52,199,89,0.1)'
                  : 'rgba(0,122,255,0.1)',
              padding: '2px 8px',
              borderRadius: 10,
              fontWeight: 500,
            }}
          >
            {todo.source === 'ai_observation' ? 'AI记录' : '主人提醒'}
          </span>

          {todo.remindAt && !isCompleted && (
            <span style={{ fontSize: 10, color: '#ff9500' }}>
              {todo.remindAt > Date.now()
                ? `提醒：${formatRelativeTime(todo.remindAt)}`
                : '今天提醒'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatRelativeTime(timestamp: number): string {
  const diff = timestamp - Date.now()
  const days = Math.round(diff / 86400000)
  if (days === 0) return '今天'
  if (days === 1) return '明天'
  if (days === 2) return '后天'
  if (days < 7) return `${days}天后`
  return `${Math.round(days / 7)}周后`
}
