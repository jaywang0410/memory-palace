import { useUnifiedMemoryStore } from '../../stores/useUnifiedMemoryStore'
import { CONSTELLATION_CONFIG } from '../../types/memory'

export default function StarDetailPanel() {
  const selectedId = useUnifiedMemoryStore((s) => s.selectedStarId)
  const selectStar = useUnifiedMemoryStore((s) => s.selectStar)
  const getMemoryById = useUnifiedMemoryStore((s) => s.getMemoryById)

  const star = selectedId ? getMemoryById(selectedId) : undefined

  if (!star || !star.constellation) return null

  const config = CONSTELLATION_CONFIG[star.constellation]

  return (
    <div
      className="absolute z-50"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 380,
        maxHeight: '80vh',
        overflowY: 'auto',
        background: 'rgba(10, 15, 30, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${config.color}40`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${config.color}20`,
        color: '#e2e8f0',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: config.color, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            {config.label}星座
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
            {star.title}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {star.date}
          </div>
        </div>
        <button
          onClick={() => selectStar(null)}
          style={{ background: 'none', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer' }}
        >
          &times;
        </button>
      </div>

      {/* Scene & People tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12, background: `${config.color}20`, color: config.color, border: `1px solid ${config.color}40` }}>
          {star.scene}
        </span>
        {star.people.map((person) => (
          <span key={person} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
            {person}
          </span>
        ))}
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
          {star.emotion}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

      {/* Event content */}
      <div style={{ fontSize: 14, lineHeight: 1.8, color: '#e2e8f0' }}>
        {star.event}
      </div>

      {/* Related stars hint */}
      {star.relatedMemoryIds.length > 0 && (
        <>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
          <div style={{ fontSize: 11, color: '#64748b' }}>
            与 {star.relatedMemoryIds.length} 颗星星有关联
          </div>
        </>
      )}
    </div>
  )
}
