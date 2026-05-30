import { useState, useCallback, useEffect, useRef } from 'react'
import BookModal from '../ui/BookModal'
import MovieModal from '../ui/MovieModal'
import SongModal from '../ui/SongModal'
import DiaryList from '../ui/DiaryList'
import TodoModal from '../ui/TodoModal'
import ChatWidget from './ChatWidget'
import MemoryCollector from './MemoryCollector'

export type HotspotId = 'skylight' | 'books' | 'tv' | 'speaker' | 'notebook' | 'computer'

interface Props {
  onHotspotClick: (id: HotspotId) => void
  isNightMode: boolean
  onNightModeChange: (enabled: boolean) => void
  activeModal?: string | null
  onCloseModal?: () => void
}

const HOTSPOTS: { id: HotspotId; emoji: string; top: string; left: string; isSkylight?: boolean }[] = [
  { id: 'skylight', emoji: '✨', top: '12%', left: '45%', isSkylight: true },
  { id: 'books', emoji: '📖', top: '32%', left: '12%' },
  { id: 'tv', emoji: '🎬', top: '52%', left: '26%' },
  { id: 'speaker', emoji: '🎵', top: '58%', left: '52%' },
  { id: 'notebook', emoji: '📓', top: '62%', left: '73%' },
  { id: 'computer', emoji: '💻', top: '55%', left: '83%' },
]

export default function Room2D({ onHotspotClick, isNightMode, onNightModeChange, activeModal, onCloseModal }: Props) {
  const [showEnvPanel, setShowEnvPanel] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  const handleHotspotClick = useCallback(
    (id: HotspotId) => {
      if (id === 'skylight') {
        setShowEnvPanel(true)
      } else {
        onHotspotClick(id)
      }
    },
    [onHotspotClick]
  )

  // Close panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (showEnvPanel && viewportRef.current && !viewportRef.current.contains(e.target as Node)) {
        setShowEnvPanel(false)
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [showEnvPanel])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0d0d0d',
        overflow: 'hidden',
      }}
    >
      {/* Viewport with fixed aspect ratio */}
      <div
        ref={viewportRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1400,
          aspectRatio: '3062 / 1408',
          borderRadius: 16,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/room-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Cover original image text */}
        <div
          style={{
            position: 'absolute',
            top: '44%',
            left: '42%',
            width: '20%',
            height: '12%',
            background: 'linear-gradient(to right, transparent 0%, #f5e6c8 20%, #f5e6c8 80%, transparent 100%)',
            borderRadius: 20,
            zIndex: 3,
            pointerEvents: 'none',
            mixBlendMode: 'normal',
          }}
        />

        {/* Night mode overlays */}
        {isNightMode && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#2563eb',
                mixBlendMode: 'overlay',
                opacity: 0.6,
                pointerEvents: 'none',
                transition: 'opacity 1.5s ease',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10, 15, 30, 0.35)',
                pointerEvents: 'none',
                transition: 'opacity 1.5s ease',
                zIndex: 1,
              }}
            />
            <div
              className="stars-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                left: '10%',
                width: '80%',
                height: '150%',
                background:
                  'linear-gradient(150deg, rgba(240, 248, 255, 0.25) 0%, rgba(224, 242, 254, 0.02) 60%)',
                transform: 'rotate(15deg)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                transition: 'opacity 1.5s ease',
                zIndex: 2,
              }}
            />
          </>
        )}

        {/* Hotspots */}
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            onClick={(e) => {
              e.stopPropagation()
              handleHotspotClick(spot.id)
            }}
            style={{
              position: 'absolute',
              top: spot.top,
              left: spot.left,
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: isNightMode
                ? '2px solid rgba(255,255,255,0.8)'
                : '2px solid white',
              background: spot.isSkylight
                ? '#facc15'
                : isNightMode
                  ? '#6366f1'
                  : '#26c6da',
              color: 'white',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              transition: 'transform 0.2s ease, background-color 0.5s',
              zIndex: 20,
              animation: spot.isSkylight ? 'pulse-yellow 2s infinite' : 'pulse-cyan 2s infinite',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLButtonElement).style.transform = 'translate(-50%, -50%) scale(1.15)'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLButtonElement).style.transform = 'translate(-50%, -50%) scale(1)'
            }}
          >
            {spot.emoji}
          </button>
        ))}

        {/* Environment Panel */}
        {showEnvPanel && (
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: '45%',
              transform: 'translateX(-50%)',
              background: isNightMode
                ? 'rgba(20, 25, 35, 0.85)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              borderRadius: 16,
              padding: 20,
              minWidth: 280,
              color: isNightMode ? '#f8fafc' : '#333',
              border: isNightMode
                ? '1px solid rgba(255,255,255,0.15)'
                : '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              zIndex: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>环境与氛围</h3>
              <button
                onClick={() => setShowEnvPanel(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  color: isNightMode ? '#94a3b8' : '#666',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <span>星空夜间模式</span>
              <label
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: 50,
                  height: 28,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={isNightMode}
                  onChange={(e) => onNightModeChange(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: isNightMode ? '#3b82f6' : '#ccc',
                    borderRadius: 34,
                    transition: '.4s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '""',
                      height: 20,
                      width: 20,
                      left: 4,
                      bottom: 4,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '.4s',
                      transform: isNightMode ? 'translateX(22px)' : 'translateX(0)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  />
                </span>
              </label>
            </div>

            <p
              style={{
                fontSize: 12,
                color: isNightMode ? '#94a3b8' : '#666',
                marginTop: 10,
                lineHeight: 1.4,
              }}
            >
              开启后，沐浴在自然月光与星空之中。
            </p>

            {isNightMode && (
              <button
                onClick={() => {
                  setShowEnvPanel(false)
                  onHotspotClick('skylight')
                }}
                style={{
                  width: '100%',
                  marginTop: 15,
                  padding: 12,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  ;(e.target as HTMLButtonElement).style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLButtonElement).style.transform = 'scale(1)'
                }}
              >
                深潜入星河 (长期记忆)
              </button>
            )}
          </div>
        )}

        {/* Furniture modals - positioned inside viewport */}
        {activeModal === 'bookshelf' && onCloseModal && <BookModal onClose={onCloseModal} />}
        {activeModal === 'tv' && onCloseModal && <MovieModal onClose={onCloseModal} />}
        {activeModal === 'speaker' && onCloseModal && <SongModal onClose={onCloseModal} />}
        {activeModal === 'diary' && onCloseModal && <DiaryList onClose={onCloseModal} />}
        {activeModal === 'desk' && onCloseModal && <TodoModal onClose={onCloseModal} />}

        {/* Chat Widget */}
        <ChatWidget />

        {/* Memory Collector */}
        <MemoryCollector />
      </div>
    </div>
  )
}
