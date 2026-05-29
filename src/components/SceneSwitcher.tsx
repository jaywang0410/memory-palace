import { useState, useCallback, useRef, useMemo } from 'react'
import { useUIStore } from '../stores/useUIStore'
import { useMemoryStore } from '../stores/useMemoryStore'
import RoomScene from './room/RoomScene'
import StarfieldContainer from './starfield/StarfieldContainer'
import MemoryCard from './ui/MemoryCard'

type FadeState = 'visible' | 'fading-out' | 'fading-in'

const FADE_DURATION = 300

export default function SceneSwitcher() {
  const currentScene = useUIStore((s) => s.currentScene)
  const setScene = useUIStore((s) => s.setScene)

  const [fadeState, setFadeState] = useState<FadeState>('visible')
  const [showDiary, setShowDiary] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const memories = useMemoryStore((s) => s.memories)
  const diaryMemoryId = useMemo(() => {
    const dailyMemories = Object.values(memories).filter((m) => m.region === 'daily')
    if (dailyMemories.length === 0) return null
    return dailyMemories[Math.floor(Math.random() * dailyMemories.length)].id
  }, [memories])

  const switchScene = useCallback(
    (scene: 'room' | 'starfield') => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      setFadeState('fading-out')

      timerRef.current = setTimeout(() => {
        setScene(scene)
        setFadeState('fading-in')

        timerRef.current = setTimeout(() => {
          setFadeState('visible')
          timerRef.current = null
        }, FADE_DURATION)
      }, FADE_DURATION)
    },
    [setScene]
  )

  const isRoomActive = currentScene === 'room'
  const isStarfieldActive = currentScene === 'starfield'

  const isTransitioning = fadeState !== 'visible'
  const overlayOpacity = fadeState === 'fading-out' ? 1 : fadeState === 'fading-in' ? 1 : 0

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Room Scene */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isRoomActive ? 1 : 0,
          pointerEvents: isRoomActive ? 'auto' : 'none',
        }}
      >
        <RoomScene
          onEnterStarfield={() => switchScene('starfield')}
          onFurnitureClick={(id) => {
            if (id === 'diary' && diaryMemoryId) {
              setShowDiary(true)
            }
          }}
        />
        {showDiary && diaryMemoryId && (
          <MemoryCard memoryId={diaryMemoryId} onClose={() => setShowDiary(false)} />
        )}
        {/* DEBUG: direct button to enter starfield */}
        <button
          onClick={() => switchScene('starfield')}
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255,215,0,0.9)',
            border: '2px solid #FFD700',
            borderRadius: '1rem',
            color: '#1A1B3A',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 100,
          }}
        >
          🌟 进入星空
        </button>
      </div>

      {/* Starfield Scene */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isStarfieldActive ? 1 : 0,
          pointerEvents: isStarfieldActive ? 'auto' : 'none',
        }}
      >
        <StarfieldContainer onBackToRoom={() => switchScene('room')} />
      </div>

      {/* Fade overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: '#1A1B3A',
          opacity: overlayOpacity,
        }}
      />
    </div>
  )
}
