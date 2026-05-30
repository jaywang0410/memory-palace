import StarCanvas from './StarCanvas'
import { useStarfieldStore } from '../../stores/useStarfieldStore'
import type { ConstellationType } from '../../types/starfield'

interface Props {
  onBackToRoom?: () => void
}

const REGIONS: { id: ConstellationType; label: string; color: string }[] = [
  { id: 'core', label: '核心', color: '#FFD700' },
  { id: 'daily', label: '日常', color: '#7EC8E3' },
  { id: 'emotion', label: '情感', color: '#FFB6C1' },
  { id: 'travel', label: '旅行', color: '#90EE90' },
  { id: 'growth', label: '成长', color: '#DDA0DD' },
  { id: 'social', label: '人际', color: '#FFA07A' },
]

export default function StarfieldContainer({ onBackToRoom }: Props) {
  const zoomToRegion = useStarfieldStore((s) => s.zoomToRegion)
  const currentRegion = useStarfieldStore((s) => s.currentRegion)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(#1A1B3A, #0F1123)',
      }}
    >
      <StarCanvas />

      {/* Back to Room button */}
      <button
        onClick={onBackToRoom}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255,248,231,0.85)',
          border: '1px solid #D4A574',
          borderRadius: '0.5rem',
          color: '#5D4037',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10,
        }}
      >
        返回房间
      </button>

      {/* Region Navigation */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10,
        }}
      >
        {REGIONS.map((region) => (
          <button
            key={region.id}
            onClick={() => zoomToRegion(region.id)}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor:
                currentRegion === region.id
                  ? 'rgba(255,248,231,0.95)'
                  : 'rgba(255,248,231,0.7)',
              border: `2px solid ${currentRegion === region.id ? region.color : 'transparent'}`,
              borderRadius: '1rem',
              color: '#5D4037',
              fontSize: '0.8rem',
              fontWeight: currentRegion === region.id ? 600 : 400,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: region.color,
                marginRight: 6,
              }}
            />
            {region.label}
          </button>
        ))}
      </div>
    </div>
  )
}
