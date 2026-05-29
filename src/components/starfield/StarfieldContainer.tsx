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
        background: 'linear-gradient(#1A1B3A, #0F1123)',
      }}
    >
      {/* DEBUG: visible marker to confirm starfield is rendered */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#FFD700',
          fontSize: '2rem',
          fontWeight: 'bold',
          zIndex: 5,
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        <div>✨ 星空加载中...</div>
        <div style={{ fontSize: '1rem', color: '#7EC8E3', marginTop: '1rem' }}>
          如果看不到星星，请检查控制台错误
        </div>
      </div>

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
