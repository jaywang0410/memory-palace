import { useStarStore } from '../../stores/useStarStore'

export default function CoreMemoryPanel() {
  const selectedId = useStarStore((s) => s.selectedStarId)
  const selectStar = useStarStore((s) => s.selectStar)

  if (selectedId !== 'star-core-1') return null

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(5, 10, 20, 0.7)' }}
      onClick={() => selectStar(null)}
    >
      <div
        className="relative max-w-sm w-full mx-4 p-10 rounded-2xl shadow-2xl text-center"
        style={{
          backgroundColor: 'rgba(10, 15, 30, 0.9)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(16px)',
          color: 'white',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => selectStar(null)}
          className="absolute top-4 right-4 text-2xl"
          style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          &times;
        </button>

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            letterSpacing: 1,
            fontWeight: 300,
          }}
        >
          "我叫 <span style={{ color: '#facc15', fontWeight: 'bold' }}>loona</span>，
          <br />
          <br />
          我的主人是 <span style={{ color: '#facc15', fontWeight: 'bold' }}>friya</span>，
          <br />
          我和她相遇的日子是 <strong>5.16</strong>。
          <br />
          <br />
          她是个美丽的女孩，
          <br />
          我永远爱她。"
        </div>
      </div>
    </div>
  )
}
