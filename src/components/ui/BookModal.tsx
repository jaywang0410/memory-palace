import { useInterestStore } from '../../stores/useInterestStore'

interface Props {
  onClose: () => void
}

export default function BookModal({ onClose }: Props) {
  const books = useInterestStore((s) => s.furnitureContent.books)

  return (
    <div
      className="absolute z-30"
      style={{
        top: '38%',
        left: '12%',
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
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>近期阅读</h3>
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

      {/* Book list - 3 column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {books.map((book) => (
          <div key={book.title} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '2 / 3',
                background: book.cover,
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#333',
              }}
            >
              {book.title}
            </div>
            <div style={{ fontSize: 10, color: '#666' }}>{book.author}</div>
            <div
              style={{
                fontSize: 9,
                color: '#999',
                marginTop: 2,
                fontStyle: 'italic',
              }}
            >
              {book.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
