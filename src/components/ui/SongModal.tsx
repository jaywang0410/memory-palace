import { useInterestStore } from '../../stores/useInterestStore'

interface Props {
  onClose: () => void
}

export default function SongModal({ onClose }: Props) {
  const songs = useInterestStore((s) => s.furnitureContent.songs)

  return (
    <div
      className="absolute z-30"
      style={{
        top: '65%',
        left: '52%',
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
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>最近播放</h3>
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

      {/* Track list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {songs.map((song, index) => (
          <li
            key={song.title}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(128,128,128,0.1)',
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {index === 0 && (
                <div style={{ display: 'flex', alignItems: 'end', height: 14, gap: 2 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        borderRadius: 1,
                        backgroundColor: '#F4A261',
                        animation: `pulse-cyan ${0.8 + i * 0.2}s infinite alternate`,
                        height: `${6 + i * 4}px`,
                      }}
                    />
                  ))}
                </div>
              )}
              <span style={{ fontWeight: 500 }}>{song.title}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#666', fontSize: 11 }}>{song.artist}</div>
              <div style={{ color: '#999', fontSize: 9, fontStyle: 'italic' }}>{song.reason}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
