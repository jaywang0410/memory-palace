import { Canvas } from '@react-three/fiber'
import RoomEnvironment from './RoomEnvironment'
import InteractionRaycaster from './InteractionRaycaster'
import Diary from './furniture/Diary'
import Skylight from './Skylight'

interface Props {
  onEnterStarfield?: () => void
  onFurnitureClick?: (id: string) => void
}

export default function RoomScene({ onEnterStarfield, onFurnitureClick }: Props) {
  const handleInteract = (objectName: string) => {
    if (objectName === 'skylight') {
      onEnterStarfield?.()
    } else {
      onFurnitureClick?.(objectName)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [5, 5, 8], fov: 45 }}
        shadows
      >
        <RoomEnvironment />
        <Diary onClick={() => onFurnitureClick?.('diary')} />
        <Skylight onClick={onEnterStarfield} />
        <InteractionRaycaster onInteract={handleInteract} />
      </Canvas>
    </div>
  )
}
