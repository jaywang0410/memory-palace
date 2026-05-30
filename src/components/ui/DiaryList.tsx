import { useState, useMemo } from 'react'
import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'

interface Props {
  onClose?: () => void
}

function parseDate(dateStr: string): Date {
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (!match) return new Date(0)
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function isWithinDays(dateStr: string, days: number): boolean {
  const date = parseDate(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = now.getTime() - date.getTime()
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000
}

export default function DiaryList({ onClose }: Props) {
  const memories = useUnifiedMemoryStore((s) => s.memories)
  const [currentIndex, setCurrentIndex] = useState(0)

  const entries = useMemo(() => {
    const all = memories
      .filter((m) => m.status === 'short_term')
      .slice().reverse()
    return all.filter((e) => isWithinDays(e.date, 7))
  }, [memories])

  const entry = entries[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < entries.length - 1

  const nextEntry = () => {
    if (hasNext) setCurrentIndex(currentIndex + 1)
  }

  const prevEntry = () => {
    if (hasPrev) setCurrentIndex(currentIndex - 1)
  }

  if (entries.length === 0) {
    return (
      <div
        className="absolute z-30"
        style={{
          top: '25%',
          left: '58%',
          transform: 'translateX(-50%)',
          width: 360,
          background: '#faf8f5',
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          color: '#3e2723',
          fontFamily: "'Georgia', 'Songti SC', serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', color: '#8b7355', padding: '40px 0' }}>
          还没有日记记录<br />
          <span style={{ fontSize: 12 }}>和 loona 聊聊天吧～</span>
        </div>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 18, color: '#8b7355', cursor: 'pointer' }}
        >
          &times;
        </button>
      </div>
    )
  }

  return (
    <div
      className="absolute z-30"
      style={{
        top: '25%',
        left: '58%',
        transform: 'translateX(-50%)',
        width: 360,
        background: '#faf8f5',
        borderRadius: 8,
        padding: 0,
        boxShadow: '0 10px 40px rgba(0,0,0,0.25), inset 0 0 60px rgba(139, 119, 101, 0.05)',
        color: '#3e2723',
        fontFamily: "'Georgia', 'Songti SC', serif",
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Paper texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(139,119,101,0.03) 0%, transparent 10%, transparent 90%, rgba(139,119,101,0.03) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(139, 119, 101, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#5d4037' }}>
            {entry.date}
          </div>
          <div style={{ fontSize: 11, color: '#8b7355', marginTop: 2 }}>
            {entry.scene}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            color: '#8b7355',
            cursor: 'pointer',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '16px 20px',
          maxHeight: 320,
          overflowY: 'auto',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 11,
            color: '#8b7355',
            fontStyle: 'italic',
            marginBottom: 16,
            paddingLeft: 8,
            borderLeft: '2px solid #d4a574',
          }}
        >
          {entry.title}
        </div>

        {/* Event content */}
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: '#4e342e',
            whiteSpace: 'pre-line',
          }}
        >
          {entry.event}
        </div>

        {/* Emotion tag */}
        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'rgba(212, 165, 116, 0.08)',
            borderRadius: 6,
            fontSize: 12,
            fontStyle: 'italic',
            color: '#6d4c41',
            lineHeight: 1.6,
          }}
        >
          心情：{entry.emotion}
        </div>
      </div>

      {/* Footer - page navigation */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '12px 20px',
          borderTop: '1px solid rgba(139, 119, 101, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(139, 119, 101, 0.03)',
        }}
      >
        <button
          onClick={prevEntry}
          disabled={!hasPrev}
          style={{
            background: 'none',
            border: '1px solid rgba(139, 119, 101, 0.3)',
            borderRadius: 16,
            padding: '4px 14px',
            fontSize: 12,
            color: hasPrev ? '#5d4037' : '#bcaaa4',
            cursor: hasPrev ? 'pointer' : 'not-allowed',
            fontFamily: "'Georgia', 'Songti SC', serif",
          }}
        >
          ← 上一篇
        </button>

        <span style={{ fontSize: 11, color: '#8b7355' }}>
          {currentIndex + 1} / {entries.length}
        </span>

        <button
          onClick={nextEntry}
          disabled={!hasNext}
          style={{
            background: 'none',
            border: '1px solid rgba(139, 119, 101, 0.3)',
            borderRadius: 16,
            padding: '4px 14px',
            fontSize: 12,
            color: hasNext ? '#5d4037' : '#bcaaa4',
            cursor: hasNext ? 'pointer' : 'not-allowed',
            fontFamily: "'Georgia', 'Songti SC', serif",
          }}
        >
          下一篇 →
        </button>
      </div>
    </div>
  )
}
