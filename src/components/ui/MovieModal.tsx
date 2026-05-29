import { MOCK_MOVIES } from '../../data/mockFurnitureData'
import FurnitureModal from './FurnitureModal'

interface Props {
  onClose: () => void
}

export default function MovieModal({ onClose }: Props) {
  return (
    <FurnitureModal title="最近在看的电影" icon="🎬" onClose={onClose}>
      <div className="space-y-4">
        {MOCK_MOVIES.map((movie) => (
          <div key={movie.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(212, 165, 116, 0.1)' }}>
            {/* Poster area */}
            <div
              className="h-24 flex items-end p-3"
              style={{ backgroundColor: movie.color }}
            >
              <h3 className="text-lg font-bold text-white">{movie.title}</h3>
            </div>
            {/* Info */}
            <div className="p-3 space-y-2">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#8B7355' }}>
                  <span>观看进度</span>
                  <span>{movie.progress}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(212, 165, 116, 0.3)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${movie.progress}%`,
                      backgroundColor: '#F4A261',
                    }}
                  />
                </div>
              </div>
              {/* Quote */}
              <p className="text-sm italic" style={{ color: '#8B7355' }}>
                {movie.quote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </FurnitureModal>
  )
}
