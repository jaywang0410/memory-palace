import { useState, useCallback, useRef, useEffect } from 'react'
import { useUIStore } from '../stores/useUIStore'
import Room2D, { type HotspotId } from './room2d/Room2D'
import StarfieldContainer from './starfield/StarfieldContainer'
import CoreMemoryPanel from './ui/CoreMemoryPanel'
import StarDetailPanel from './starfield/StarDetailPanel'
import AscensionEffect from './room2d/AscensionEffect'
import { useUnifiedMemoryStore } from '../stores/useUnifiedMemoryStore'

type FadeState = 'visible' | 'fading-out' | 'fading-in'
type ModalType = 'diary' | 'desk' | 'tv' | 'speaker' | 'bookshelf' | null

const FADE_DURATION = 300

export default function SceneSwitcher() {
  const currentScene = useUIStore((s) => s.currentScene)
  const setScene = useUIStore((s) => s.setScene)

  const [fadeState, setFadeState] = useState<FadeState>('visible')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isNightMode, setIsNightMode] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ascendAllShortTerm = useUnifiedMemoryStore((s) => s.ascendAllShortTerm)

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

  // Listen for ascension trigger from ChatWidget
  useEffect(() => {
    const handleTrigger = () => {
      ascendAllShortTerm()
    }
    window.addEventListener('trigger-ascension', handleTrigger)
    return () => window.removeEventListener('trigger-ascension', handleTrigger)
  }, [ascendAllShortTerm])

  const handleAscensionComplete = useCallback(() => {
    setTimeout(() => {
      switchScene('starfield')
      setIsNightMode(true)
    }, 500)
  }, [switchScene])

  const handleHotspotClick = (id: HotspotId) => {
    if (id === 'skylight') {
      switchScene('starfield')
      return
    }

    const modalMap: Record<string, ModalType> = {
      books: 'bookshelf',
      tv: 'tv',
      speaker: 'speaker',
      notebook: 'diary',
      computer: 'desk',
    }
    const modal = modalMap[id]
    if (modal) {
      setActiveModal(modal)
    }
  }

  const isRoomActive = currentScene === 'room'
  const isStarfieldActive = currentScene === 'starfield'

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
        <Room2D
          onHotspotClick={handleHotspotClick}
          isNightMode={isNightMode}
          onNightModeChange={setIsNightMode}
          activeModal={activeModal}
          onCloseModal={() => setActiveModal(null)}
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
        <StarfieldContainer
          onBackToRoom={() => {
            switchScene('room')
            setIsNightMode(false)
          }}
        />
        <CoreMemoryPanel />
        <StarDetailPanel />
      </div>

      {/* Ascension Effect Overlay */}
      <AscensionEffect onAscensionComplete={handleAscensionComplete} />

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
