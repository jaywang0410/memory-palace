import { MOCK_BOOKS } from '../../data/mockFurnitureData'
import FurnitureModal from './FurnitureModal'

interface Props {
  onClose: () => void
}

export default function BookModal({ onClose }: Props) {
  return (
    <FurnitureModal title="最近在看的书" icon="📚" onClose={onClose}>
      <div className="space-y-4">
        {MOCK_BOOKS.map((book) => (
          <div
            key={book.id}
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(212, 165, 116, 0.1)' }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-bold" style={{ color: '#3E2723' }}>
                  {book.title}
                </h3>
                <p className="text-xs" style={{ color: '#8B7355' }}>
                  {book.author}
                </p>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(244, 162, 97, 0.2)',
                  color: '#8B6914',
                }}
              >
                {book.progress}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'rgba(212, 165, 116, 0.3)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${book.progress}%`,
                  backgroundColor: '#8CB369',
                }}
              />
            </div>
            {/* Quote */}
            <p className="text-sm italic" style={{ color: '#8B7355' }}>
              "{book.quote}"
            </p>
          </div>
        ))}
      </div>
    </FurnitureModal>
  )
}
