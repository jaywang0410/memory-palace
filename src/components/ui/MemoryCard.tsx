import { useMemoryStore } from '../../stores/useMemoryStore'

interface Props {
  memoryId: string
  onClose?: () => void
}

export default function MemoryCard({ memoryId, onClose }: Props) {
  const memory = useMemoryStore((s) => s.memories[memoryId])

  if (!memory) {
    return null
  }

  const formattedDate = new Date(memory.timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full p-6 rounded-2xl shadow-lg"
      style={{
        backgroundColor: 'rgba(255, 248, 231, 0.9)',
        border: '1px solid #D4A574',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-xl leading-none transition-colors hover:bg-black/10"
        style={{ color: '#5D4037' }}
        aria-label="Close"
      >
        &times;
      </button>

      {/* Date */}
      <p
        className="text-sm mb-3"
        style={{ color: '#8B7355' }}
      >
        {formattedDate}
      </p>

      {/* Content */}
      <p
        className="text-base leading-relaxed mb-4"
        style={{ color: '#3E2723' }}
      >
        {memory.content}
      </p>

      {/* AI Note */}
      {memory.aiNote && (
        <p
          className="text-sm italic mb-4"
          style={{ color: '#8B7355' }}
        >
          {memory.aiNote}
        </p>
      )}

      {/* Tags */}
      {memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {memory.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-xs rounded-full"
              style={{
                backgroundColor: 'rgba(212, 165, 116, 0.25)',
                color: '#5D4037',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
