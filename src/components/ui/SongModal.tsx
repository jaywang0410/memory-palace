import { MOCK_SONGS } from '../../data/mockFurnitureData'
import FurnitureModal from './FurnitureModal'

interface Props {
  onClose: () => void
}

export default function SongModal({ onClose }: Props) {
  return (
    <FurnitureModal title="最近在听的歌" icon="🎵" onClose={onClose}>
      <div className="space-y-3">
        {MOCK_SONGS.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'rgba(212, 165, 116, 0.1)' }}
          >
            {/* Album art placeholder */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: song.color }}
            >
              🎶
            </div>
            {/* Song info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#3E2723' }}>
                {song.title}
              </p>
              <p className="text-xs" style={{ color: '#8B7355' }}>
                {song.artist}
              </p>
            </div>
            {/* Mood tag */}
            <span
              className="text-xs px-2 py-1 rounded-full flex-shrink-0"
              style={{
                backgroundColor: song.color + '40',
                color: '#5D4037',
              }}
            >
              {song.mood}
            </span>
            {/* Playing indicator */}
            {index === 0 && (
              <div className="flex gap-0.5 items-end h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full animate-pulse"
                    style={{
                      backgroundColor: '#F4A261',
                      height: `${8 + Math.random() * 8}px`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </FurnitureModal>
  )
}
