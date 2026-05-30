import { useInterestStore } from '../../stores/useInterestStore'

interface Props {
  onClose: () => void
}

export default function MovieModal({ onClose }: Props) {
  const movie = useInterestStore((s) => s.furnitureContent.movie)

  const statusText = {
    watching: '正在观看',
    finished: '已看完',
    want_to_watch: '想看',
  }

  return (
    <div
      className="absolute z-30"
      style={{
        top: '58%',
        left: '26%',
        transform: 'translateX(-50%)',
        minWidth: 280,
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
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>播放记录</h3>
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

      {/* Movie poster */}
      <div
        style={{
          width: '100%',
          height: 140,
          backgroundColor: movie.posterColor,
          borderRadius: 8,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 8,
          }}
        />
        <div
          style={{
            zIndex: 1,
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: 2,
            fontSize: 20,
          }}
        >
          {movie.progress < 100 ? '|| PAUSED' : '✓ FINISHED'}
        </div>
      </div>

      {/* Movie info */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
          {movie.title} ({movie.genre})
        </div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
          {statusText[movie.status]}
        </div>
        <div
          style={{
            width: '100%',
            height: 4,
            background: 'rgba(128,128,128,0.3)',
            borderRadius: 2,
            marginTop: 8,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${movie.progress}%`,
              height: '100%',
              background: '#26c6da',
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: '#666', textAlign: 'right', marginTop: 4 }}>
          {movie.progress === 100 ? '已看完' : `进度 ${movie.progress}%`}
        </div>
      </div>
    </div>
  )
}
