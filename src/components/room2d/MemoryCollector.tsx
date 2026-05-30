import { useState, useMemo } from 'react'
import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'

export default function MemoryCollector() {
  const [showPanel, setShowPanel] = useState(false)
  const memories = useUnifiedMemoryStore((s) => s.memories)
  const isAscending = useUnifiedMemoryStore((s) => s.isAscending)

  const shortTermMemories = useMemo(() =>
    memories.filter((m) => m.status === 'short_term'),
  [memories])

  const count = shortTermMemories.length

  // Calculate glow intensity based on count (max at 10+)
  const glowIntensity = useMemo(() => {
    const base = Math.min(count / 10, 1)
    return 0.3 + base * 0.7
  }, [count])

  const glowSize = useMemo(() => {
    return 40 + Math.min(count, 10) * 4
  }, [count])

  const todayMemories = useMemo(() => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
    return shortTermMemories.filter((m) => m.date === todayStr)
  }, [shortTermMemories])

  return (
    <>
      {/* Crystal ball */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: isAscending
            ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, rgba(147, 197, 253, 0.6) 30%, rgba(99, 102, 241, 0.4) 70%)'
            : 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(147, 197, 253, 0.3) 30%, rgba(99, 102, 241, 0.2) 70%)',
          cursor: 'pointer',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `
            inset -3px -3px 8px rgba(0,0,0,0.2),
            inset 3px 3px 8px rgba(255,255,255,0.3),
            0 0 ${glowSize}px rgba(147, 197, 253, ${glowIntensity * 0.6}),
            0 0 ${glowSize * 0.5}px rgba(99, 102, 241, ${glowIntensity * 0.4})
          `,
          transition: 'box-shadow 0.8s ease, transform 0.2s',
          animation: isAscending ? 'pulse-glow 1s infinite alternate' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        title={`记忆收集器 (${count} 条短期记忆)`}
      >
        <span style={{ fontSize: 20, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          🔮
        </span>
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 18,
              height: 18,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)',
            }}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Memory panel */}
      {showPanel && (
        <div
          style={{
            position: 'absolute',
            top: 76,
            right: 20,
            width: 280,
            maxHeight: 360,
            background: 'rgba(20, 20, 35, 0.9)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 16,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            zIndex: 100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>
                今日记忆
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {todayMemories.length} 条新记忆
              </div>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: 18,
                cursor: 'pointer',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Memory list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 12px',
            }}
          >
            {todayMemories.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 0',
                  color: '#64748b',
                  fontSize: 13,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔮</div>
                还没有新记忆<br />
                <span style={{ fontSize: 11 }}>和 loona 聊聊天吧～</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {todayMemories.map((memory) => (
                  <div
                    key={memory.id}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#e2e8f0',
                        marginBottom: 4,
                      }}
                    >
                      {memory.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#94a3b8',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {memory.event}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        display: 'flex',
                        gap: 6,
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 10,
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#a5b4fc',
                        }}
                      >
                        {memory.emotion}
                      </span>
                      {memory.source === 'conversation' && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#c4b5fd',
                          }}
                        >
                          对话
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              color: '#64748b',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            说"存到长期记忆"可将记忆珍藏至星空
          </div>
        </div>
      )}
    </>
  )
}
