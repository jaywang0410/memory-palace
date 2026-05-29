import { useState, useCallback, useRef } from 'react'
import { useUIStore } from '../stores/useUIStore'
import RoomScene from './room/RoomScene'
import StarfieldContainer from './starfield/StarfieldContainer'

type FadeState = 'visible' | 'fading-out' | 'fading-in'

const FADE_DURATION = 300

export default function SceneSwitcher() {
  const currentScene = useUIStore((s) => s.currentScene)
  const setScene = useUIStore((s) => s.setScene)

  const [fadeState, setFadeState] = useState<FadeState>('visible')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
          onFurnitureClick={(id) => console.log('Furniture clicked:', id)}
        />
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
