import type { ReactNode } from 'react'

interface Props {
  title: string
  icon?: string
  children: ReactNode
  onClose: () => void
}

export default function FurnitureModal({ title, icon, children, onClose }: Props) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(26, 27, 58, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: 'rgba(255, 248, 231, 0.95)',
          border: '2px solid #D4A574',
          backdropFilter: 'blur(12px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: '#5D4037' }}>
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-2xl transition-colors hover:bg-black/10"
            style={{ color: '#8B7355' }}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
