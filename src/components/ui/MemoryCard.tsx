import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'

interface Props {
  memoryId: string
  onClose?: () => void
}

export default function MemoryCard({ memoryId, onClose }: Props) {
  const memory = useUnifiedMemoryStore((s) => s.getMemoryById(memoryId))

  if (!memory) {
    return null
  }

  return (
    <div
      className="absolute z-30"
      style={{
        top: '30%',
        left: '70%',
        transform: 'translateX(-50%)',
        minWidth: 280,
        maxWidth: 320,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRadius: 16,
        padding: 20,
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        color: '#333',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          borderBottom: '1px solid rgba(128,128,128,0.2)',
          paddingBottom: 12,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>珍贵瞬间</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: '#666',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
      </div>

      {/* Date */}
      <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        {memory.date}
      </p>

      {/* Title */}
      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        {memory.title}
      </p>

      {/* Content */}
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
        {memory.event}
      </p>

      {/* Scene & Emotion */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 12,
            backgroundColor: 'rgba(212, 165, 116, 0.25)',
            color: '#5D4037',
          }}
        >
          {memory.scene}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 12,
            backgroundColor: 'rgba(147, 197, 253, 0.25)',
            color: '#4A6FA5',
          }}
        >
          {memory.emotion}
        </span>
      </div>
    </div>
  )
}
