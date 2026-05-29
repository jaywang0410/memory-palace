import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
        camera={{ position: [0, 6, 12], fov: 50 }}
        shadows
      >
        <RoomEnvironment />
        <Diary onClick={() => onFurnitureClick?.('diary')} />
        <Skylight onClick={onEnterStarfield} />
        <InteractionRaycaster onInteract={handleInteract} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
    </div>
  )
}
