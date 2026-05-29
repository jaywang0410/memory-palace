import StarCanvas from './StarCanvas'

interface Props {
  onBackToRoom?: () => void
}

export default function StarfieldContainer({ onBackToRoom }: Props) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
    </div>
  )
}
