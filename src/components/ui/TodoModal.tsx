import { MOCK_TODOS } from '../../data/mockFurnitureData'
import FurnitureModal from './FurnitureModal'

interface Props {
  onClose: () => void
}

export default function TodoModal({ onClose }: Props) {
  return (
    <FurnitureModal title="备忘录" icon="📝" onClose={onClose}>
      <div className="space-y-3">
        {MOCK_TODOS.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              backgroundColor: todo.completed ? 'rgba(140, 179, 105, 0.15)' : 'rgba(212, 165, 116, 0.1)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: todo.completed ? '#8CB369' : 'transparent',
                border: todo.completed ? 'none' : '2px solid #D4A574',
              }}
            >
              {todo.completed && <span className="text-white text-xs">✓</span>}
            </div>
            <span
              className="text-sm flex-1"
              style={{
                color: todo.completed ? '#8B7355' : '#3E2723',
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  todo.priority === 'high'
                    ? 'rgba(205, 92, 92, 0.2)'
                    : todo.priority === 'medium'
                      ? 'rgba(212, 165, 116, 0.3)'
                      : 'rgba(140, 179, 105, 0.2)',
                color:
                  todo.priority === 'high'
                    ? '#CD5C5C'
                    : todo.priority === 'medium'
                      ? '#8B6914'
                      : '#8CB369',
              }}
            >
              {todo.priority === 'high' ? '重要' : todo.priority === 'medium' ? '一般' : '稍后'}
            </span>
          </div>
        ))}
      </div>
    </FurnitureModal>
  )
}
