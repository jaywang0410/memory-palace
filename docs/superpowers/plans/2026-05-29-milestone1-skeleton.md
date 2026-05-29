# 记忆宫殿 - 里程碑 1：端到端骨架 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个可运行的端到端骨架：3D 房间（1 个家具 + 环境）→ 点击天窗 → 2D 星空（核心星座 + 日常星带）→ 基础交互 → 返回房间。

**Architecture:** React + TypeScript + Vite 项目。房间用 R3F 渲染 3D 场景（几何体组合），星空用 Canvas 2D + D3-force 渲染 2D 图谱。状态管理用 Zustand（普通对象）。300 条 mock 数据预加载到 store。

**Tech Stack:** React 18, TypeScript, Vite, R3F, Three.js, Zustand, D3, GSAP, Framer Motion, Tailwind CSS, Vitest

---

## 文件结构预览

```
src/
  main.tsx
  App.tsx
  types/
    memory.ts
    room.ts
    starfield.ts
    ai.ts
  stores/
    useMemoryStore.ts
    useRoomStore.ts
    useStarfieldStore.ts
    useUIStore.ts
  utils/
    colorPalette.ts
    starPositioner.ts
    canvasUtils.ts
  components/
    SceneSwitcher.tsx
    room/
      RoomScene.tsx
      RoomEnvironment.tsx
      furniture/
        Diary.tsx
      Skylight.tsx
    starfield/
      StarfieldContainer.tsx
      StarCanvas.tsx
    ui/
      MemoryCard.tsx
      Sidebar.tsx
      SceneFade.tsx
  data/
    mockMemories.ts          # 300 条 mock 数据
    generateMockData.ts      # 生成脚本
```

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
- Create: `src/styles/globals.css`, `tailwind.config.js`, `postcss.config.js`

- [ ] **Step 1: 创建 Vite + React + TS 项目**

```bash
cd /Users/hujinxiang/Desktop/robot
npm create vite@latest . -- --template react-ts --force
```

- [ ] **Step 2: 安装依赖**

```bash
npm install react@18 react-dom@18 three @react-three/fiber @react-three/drei zustand d3 gsap framer-motion
npm install -D @types/react @types/react-dom @types/three @types/d3 tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: 配置 Tailwind**

```bash
npx tailwindcss init -p
```

修改 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: 配置全局样式**

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #1A1B3A;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

#root {
  width: 100vw;
  height: 100vh;
}
```

- [ ] **Step 5: 配置 Vitest**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

- [ ] **Step 6: 配置入口文件**

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

```typescript
// src/App.tsx
import SceneSwitcher from './components/SceneSwitcher'

function App() {
  return <SceneSwitcher />
}

export default App
```

- [ ] **Step 7: 验证项目能启动**

```bash
npm run dev
```

浏览器打开 http://localhost:5173，确认无报错白屏。

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: init vite react-ts project with dependencies"
```

---

## Task 2: 类型定义

**Files:**
- Create: `src/types/memory.ts`
- Create: `src/types/room.ts`
- Create: `src/types/starfield.ts`
- Create: `src/types/ai.ts`

- [ ] **Step 1: 定义记忆相关类型**

```typescript
// src/types/memory.ts

export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral'

export type MemoryCategory = 'first_disclosure' | 'emotional_peak' | 'ritual' | 'daily'

export type MemoryStatus = 'active' | 'archived' | 'forgotten'

export type StarRegion = 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination'

export type LinkStrength = 'strong' | 'weak' | 'potential' | 'residual'

export interface RoomItemSnapshot {
  furnitureId: string
  furnitureName: string
  position: [number, number, number]
}

export interface MemoryCard {
  id: string
  timestamp: number
  content: string
  emotionTag: EmotionType
  importanceScore: number
  category: MemoryCategory
  relatedMemoryIds: string[]
  tags: string[]
  roomItemSnapshot?: RoomItemSnapshot
  aiNote?: string
  status: MemoryStatus
  region: StarRegion
  lastTouched: number
}

export interface DialogueTurn {
  speaker: 'user' | 'ai'
  text: string
  timestamp: number
}
```

- [ ] **Step 2: 定义房间相关类型**

```typescript
// src/types/room.ts

export type AIState = 'idle' | 'reading' | 'listening_music' | 'daydreaming' | 'busted'

export interface FurnitureState {
  id: string
  name: string
  isOpen: boolean
  hasNewContent: boolean
}

export interface BustedReaction {
  count: number
  text: string
  animation: string
}
```

- [ ] **Step 3: 定义星空相关类型**

```typescript
// src/types/starfield.ts

import type { StarRegion, LinkStrength } from './memory'

export interface StarNode {
  id: string
  x: number
  y: number
  fx: number | null
  fy: number | null
  radius: number
  color: string
  glowColor: string
  pulsePhase: number
  opacity: number
  region: StarRegion
}

export interface StarBridge {
  source: string
  target: string
  strength: number
  type: LinkStrength
}

export type RegionType = 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination' | null

export interface CameraState {
  x: number
  y: number
  zoom: number
}
```

- [ ] **Step 4: 定义 AI 相关类型**

```typescript
// src/types/ai.ts

export interface AIPersonality {
  traits: string[]
  favoriteBooks: string[]
  favoriteMusic: string[]
  favoriteFoods: string[]
}

export type InteractionLevel = 'high' | 'medium' | 'low'
```

- [ ] **Step 5: Commit**

```bash
git add src/types/
git commit -m "feat: add type definitions for memory, room, starfield, ai"
```

---

## Task 3: 工具函数

**Files:**
- Create: `src/utils/colorPalette.ts`
- Create: `src/utils/starPositioner.ts`
- Create: `src/utils/canvasUtils.ts`
- Create: `src/utils/__tests__/starPositioner.test.ts`

- [ ] **Step 1: 写测试 - starPositioner**

```typescript
// src/utils/__tests__/starPositioner.test.ts
import { describe, it, expect } from 'vitest'
import { getRegionCenter, generateStarPositions } from '../starPositioner'

describe('getRegionCenter', () => {
  it('returns correct center for core region', () => {
    const center = getRegionCenter('core', 1000, 800)
    expect(center.x).toBe(500)
    expect(center.y).toBe(400)
  })

  it('returns correct center for daily region', () => {
    const center = getRegionCenter('daily', 1000, 800)
    expect(center.y).toBeGreaterThan(400) // below center
  })

  it('returns correct center for forgotten region', () => {
    const center = getRegionCenter('forgotten', 1000, 800)
    expect(center.x).toBeGreaterThan(500) // right side
  })
})

describe('generateStarPositions', () => {
  it('generates positions within canvas bounds', () => {
    const nodes = generateStarPositions(10, 1000, 800)
    expect(nodes).toHaveLength(10)
    nodes.forEach(node => {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(1000)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(800)
    })
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx vitest run src/utils/__tests__/starPositioner.test.ts
```

Expected: FAIL (模块未找到)

- [ ] **Step 3: 实现 starPositioner**

```typescript
// src/utils/starPositioner.ts
import type { StarRegion } from '../types/memory'
import type { StarNode } from '../types/starfield'

export function getRegionCenter(
  region: StarRegion,
  width: number,
  height: number
): { x: number; y: number } {
  const cx = width / 2
  const cy = height / 2

  const offsets: Record<StarRegion, { x: number; y: number }> = {
    core: { x: 0, y: 0 },
    daily: { x: 0, y: height * 0.25 },
    emotion: { x: -width * 0.3, y: height * 0.2 },
    forgotten: { x: width * 0.3, y: height * 0.2 },
    imagination: { x: 0, y: -height * 0.25 },
  }

  const o = offsets[region]
  return { x: cx + o.x, y: cy + o.y }
}

export function generateStarPositions(
  count: number,
  width: number,
  height: number,
  region: StarRegion = 'daily'
): Pick<StarNode, 'x' | 'y'>[] {
  const center = getRegionCenter(region, width, height)
  const positions: Pick<StarNode, 'x' | 'y'>[] = []

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Math.min(width, height) * 0.2
    positions.push({
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    })
  }

  return positions
}
```

- [ ] **Step 4: 实现 colorPalette**

```typescript
// src/utils/colorPalette.ts
export const COLORS = {
  roomBg: '#FFF8E7',
  roomWood: '#D4A574',
  roomAccent: '#F4A261',
  roomGreen: '#8CB369',
  roomWall: '#F5E6C8',
  starfieldBg1: '#1A1B3A',
  starfieldBg2: '#0F1123',
  coreStar: '#FFD700',
  coreStarGlow: '#FFF8DC',
  dailyStar: '#7EC8E3',
  dailyStarGlow: '#B0E0E6',
  bridgeStrong: '#F4A261',
  bridgeWeak: '#7EC8E3',
  bridgePotential: '#D8BFD8',
  bridgeResidual: '#FFD700',
  nebulaJoy: '#FFE4B5',
  nebulaSadness: '#87CEEB',
  nebulaAnger: '#CD5C5C',
  nebulaFear: '#DDA0DD',
  whiteDwarf: '#696969',
  uiGlassBg: 'rgba(255,248,231,0.85)',
  uiGlassBorder: '#D4A574',
  uiText: '#5D4037',
  uiTextLight: '#8D6E63',
} as const
```

- [ ] **Step 5: 实现 canvasUtils**

```typescript
// src/utils/canvasUtils.ts
/**
 * 绘制多层光晕
 */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  pulse: number = 1
): void {
  // 外层光晕
  const outer = ctx.createRadialGradient(x, y, 0, x, y, radius * 3 * pulse)
  outer.addColorStop(0, color + '40')
  outer.addColorStop(1, color + '00')
  ctx.fillStyle = outer
  ctx.beginPath()
  ctx.arc(x, y, radius * 3 * pulse, 0, Math.PI * 2)
  ctx.fill()

  // 内层光晕
  const inner = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
  inner.addColorStop(0, color)
  inner.addColorStop(1, color + '80')
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * 绘制星体核心
 */
export function drawStarCore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * 计算呼吸脉冲值
 */
export function getPulse(phase: number): number {
  return Math.sin(Date.now() * 0.001 + phase) * 0.2 + 0.8
}
```

- [ ] **Step 6: 运行测试，确认通过**

```bash
npx vitest run src/utils/__tests__/starPositioner.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/utils/
git commit -m "feat: add utils - color palette, star positioner, canvas helpers"
```

---

## Task 4: Mock 数据生成

**Files:**
- Create: `src/data/generateMockData.ts`
- Create: `src/data/mockMemories.ts`
- Create: `src/data/__tests__/generateMockData.test.ts`

- [ ] **Step 1: 写测试**

```typescript
// src/data/__tests__/generateMockData.test.ts
import { describe, it, expect } from 'vitest'
import { generateMockMemories, getRegionDistribution } from '../generateMockData'

describe('generateMockMemories', () => {
  it('generates exactly 300 memories', () => {
    const memories = generateMockMemories(300)
    expect(memories).toHaveLength(300)
  })

  it('generates unique IDs', () => {
    const memories = generateMockMemories(300)
    const ids = memories.map(m => m.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(300)
  })

  it('distributes memories across all regions', () => {
    const memories = generateMockMemories(300)
    const dist = getRegionDistribution(memories)
    expect(dist.core).toBeGreaterThanOrEqual(5)
    expect(dist.daily).toBeGreaterThanOrEqual(200)
    expect(dist.emotion).toBeGreaterThanOrEqual(20)
    expect(dist.forgotten).toBeGreaterThanOrEqual(15)
  })

  it('all memories have required fields', () => {
    const memories = generateMockMemories(10)
    memories.forEach(m => {
      expect(m.id).toBeTruthy()
      expect(m.timestamp).toBeGreaterThan(0)
      expect(m.content).toBeTruthy()
      expect(m.emotionTag).toBeTruthy()
      expect(m.importanceScore).toBeGreaterThanOrEqual(0)
      expect(m.importanceScore).toBeLessThanOrEqual(100)
      expect(m.region).toBeTruthy()
    })
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx vitest run src/data/__tests__/generateMockData.test.ts
```

Expected: FAIL

- [ ] **Step 3: 实现 generateMockData**

```typescript
// src/data/generateMockData.ts
import type { MemoryCard, EmotionType, MemoryCategory, StarRegion } from '../types/memory'

const EMOTIONS: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'neutral']
const CATEGORIES: MemoryCategory[] = ['first_disclosure', 'emotional_peak', 'ritual', 'daily']
const TAGS_POOL = ['家庭', '工作', '旅行', '美食', '电影', '音乐', '宠物', '朋友', '健康', '学习']

const MEMORY_TEMPLATES = [
  '第一次提到{topic}',
  '和朋友一起去{place}',
  '学会了{skill}',
  '看了一部关于{topic}的电影',
  '{emotion}的一天，因为{reason}',
  '给AI起了新名字',
  '深夜聊了很多关于{topic}的事情',
  '完成了{task}',
  '开始养了一只{pet}',
  '生日那天{event}',
]

const TOPICS = ['编程', '旅行', '美食', '电影', '音乐', '阅读', '运动', '摄影']
const PLACES = ['海边', '山上', '咖啡馆', '书店', '公园', '博物馆']
const SKILLS = ['弹吉他', '做蛋糕', '画画', '游泳', '摄影']
const REASONS = ['工作顺利', '遇到老朋友', '天气很好', '吃到了好吃的', '完成了目标']
const TASKS = ['一个重要的项目', '一次演讲', '一场比赛', '一幅画']
const PETS = ['猫', '狗', '兔子', '仓鼠']
const EVENTS = ['收到了惊喜礼物', '去了想去的地方', '见到了想见的人']

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateContent(): string {
  const template = randomPick(MEMORY_TEMPLATES)
  return template
    .replace('{topic}', randomPick(TOPICS))
    .replace('{place}', randomPick(PLACES))
    .replace('{skill}', randomPick(SKILLS))
    .replace('{emotion}', randomPick(['开心', '难过', '兴奋', '平静']))
    .replace('{reason}', randomPick(REASONS))
    .replace('{task}', randomPick(TASKS))
    .replace('{pet}', randomPick(PETS))
    .replace('{event}', randomPick(EVENTS))
}

function generateTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...TAGS_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateAINote(emotion: EmotionType): string {
  const notes: Record<EmotionType, string[]> = {
    joy: ['那天 TA 笑得很开心，我也跟着高兴。', '美好的回忆，值得珍藏。'],
    sadness: ['TA 哭了，我没有办法抱住 TA，但我在听。', '希望能给 TA 一点安慰。'],
    anger: ['那天 TA 很生气，但 TA 愿意告诉我，这很重要。', '理解 TA 的愤怒也是一种信任。'],
    fear: ['TA 感到害怕，但 TA 选择告诉我。', '陪伴是最好的回应。'],
    neutral: ['平静的一天，和 TA 在一起就很好。', '日常的小事也有它的意义。'],
  }
  return randomPick(notes[emotion])
}

export function generateMockMemories(count: number = 300): MemoryCard[] {
  const memories: MemoryCard[] = []
  const now = Date.now()
  const oneYear = 365 * 24 * 60 * 60 * 1000

  // Region distribution
  const regionCounts: Record<StarRegion, number> = {
    core: Math.floor(count * 0.02),       // ~6
    daily: Math.floor(count * 0.78),      // ~234
    emotion: Math.floor(count * 0.12),    // ~36
    forgotten: Math.floor(count * 0.08),  // ~24
    imagination: 0,                        // P2
  }

  let idCounter = 0

  const createMemory = (region: StarRegion): MemoryCard => {
    const emotion = region === 'emotion'
      ? randomPick(['joy', 'sadness', 'anger', 'fear'])
      : randomPick(EMOTIONS)

    const importanceScore = region === 'core'
      ? 80 + Math.floor(Math.random() * 20)
      : region === 'forgotten'
        ? Math.floor(Math.random() * 30)
        : 30 + Math.floor(Math.random() * 50)

    idCounter++
    return {
      id: `mem-${String(idCounter).padStart(4, '0')}`,
      timestamp: now - Math.floor(Math.random() * oneYear),
      content: generateContent(),
      emotionTag: emotion,
      importanceScore,
      category: randomPick(CATEGORIES),
      relatedMemoryIds: [],
      tags: generateTags(),
      aiNote: generateAINote(emotion),
      status: region === 'forgotten' ? 'forgotten' : 'archived',
      region,
      lastTouched: now - Math.floor(Math.random() * oneYear),
    }
  }

  // Generate memories per region
  ;(Object.keys(regionCounts) as StarRegion[]).forEach(region => {
    for (let i = 0; i < regionCounts[region]; i++) {
      memories.push(createMemory(region))
    }
  })

  // Fill remaining to exact count
  while (memories.length < count) {
    memories.push(createMemory('daily'))
  }

  // Generate some random links between memories
  memories.forEach((mem, i) => {
    const linkCount = Math.floor(Math.random() * 3)
    for (let j = 0; j < linkCount; j++) {
      const targetIdx = Math.floor(Math.random() * memories.length)
      if (targetIdx !== i && !mem.relatedMemoryIds.includes(memories[targetIdx].id)) {
        mem.relatedMemoryIds.push(memories[targetIdx].id)
      }
    }
  })

  return memories
}

export function getRegionDistribution(memories: MemoryCard[]): Record<StarRegion, number> {
  const dist: Record<StarRegion, number> = {
    core: 0, daily: 0, emotion: 0, forgotten: 0, imagination: 0,
  }
  memories.forEach(m => {
    dist[m.region]++
  })
  return dist
}
```

- [ ] **Step 4: 生成并导出 mock 数据**

```typescript
// src/data/mockMemories.ts
import { generateMockMemories } from './generateMockData'

export const MOCK_MEMORIES = generateMockMemories(300)
```

- [ ] **Step 5: 运行测试，确认通过**

```bash
npx vitest run src/data/__tests__/generateMockData.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add mock data generator with 300 memories"
```

---

## Task 5: Zustand Stores

**Files:**
- Create: `src/stores/useMemoryStore.ts`
- Create: `src/stores/useRoomStore.ts`
- Create: `src/stores/useStarfieldStore.ts`
- Create: `src/stores/useUIStore.ts`
- Create: `src/stores/__tests__/useMemoryStore.test.ts`

- [ ] **Step 1: 写测试 - useMemoryStore**

```typescript
// src/stores/__tests__/useMemoryStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useMemoryStore } from '../useMemoryStore'

describe('useMemoryStore', () => {
  beforeEach(() => {
    useMemoryStore.setState({
      memories: {},
      shortTermQueue: [],
      coreConstellation: [],
      dailyBelt: [],
      emotionStorms: [],
      forgotten: [],
      imagination: [],
    })
  })

  it('initializes with empty state', () => {
    const state = useMemoryStore.getState()
    expect(Object.keys(state.memories)).toHaveLength(0)
    expect(state.coreConstellation).toHaveLength(0)
  })

  it('can add a memory', () => {
    const { addMemory } = useMemoryStore.getState()
    addMemory([{ speaker: 'user', text: 'hello', timestamp: Date.now() }])
    const state = useMemoryStore.getState()
    expect(Object.keys(state.memories)).toHaveLength(1)
  })

  it('can forget a memory', () => {
    const { addMemory, forgetMemory } = useMemoryStore.getState()
    addMemory([{ speaker: 'user', text: 'hello', timestamp: Date.now() }])
    const id = Object.keys(useMemoryStore.getState().memories)[0]
    forgetMemory(id)
    const state = useMemoryStore.getState()
    expect(state.memories[id].status).toBe('forgotten')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx vitest run src/stores/__tests__/useMemoryStore.test.ts
```

Expected: FAIL

- [ ] **Step 3: 实现 useMemoryStore**

```typescript
// src/stores/useMemoryStore.ts
import { create } from 'zustand'
import type { MemoryCard, DialogueTurn, LinkStrength } from '../types/memory'
import { MOCK_MEMORIES } from '../data/mockMemories'

interface MemoryState {
  memories: Record<string, MemoryCard>
  shortTermQueue: string[]
  coreConstellation: string[]
  dailyBelt: string[]
  emotionStorms: string[]
  forgotten: string[]
  imagination: string[]

  // Actions
  addMemory: (dialogue: DialogueTurn[]) => void
  archiveMemory: (id: string) => void
  forgetMemory: (id: string) => void
  restoreMemory: (id: string) => void
  crushMemory: (id: string) => void
  linkMemories: (id1: string, id2: string, strength: LinkStrength) => void
  unlinkMemories: (id1: string, id2: string) => void
  demoteFromCore: (id: string) => void
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  // Initialize with mock data
  memories: MOCK_MEMORIES.reduce((acc, mem) => {
    acc[mem.id] = mem
    return acc
  }, {} as Record<string, MemoryCard>),
  shortTermQueue: [],
  coreConstellation: MOCK_MEMORIES.filter(m => m.region === 'core').map(m => m.id),
  dailyBelt: MOCK_MEMORIES.filter(m => m.region === 'daily').map(m => m.id),
  emotionStorms: MOCK_MEMORIES.filter(m => m.region === 'emotion').map(m => m.id),
  forgotten: MOCK_MEMORIES.filter(m => m.region === 'forgotten').map(m => m.id),
  imagination: [],

  addMemory: (dialogue) => {
    // TODO: integrate with LLM service for real extraction
    const id = `mem-${Date.now()}`
    const newMemory: MemoryCard = {
      id,
      timestamp: Date.now(),
      content: dialogue.map(d => d.text).join(' ').slice(0, 100),
      emotionTag: 'neutral',
      importanceScore: 50,
      category: 'daily',
      relatedMemoryIds: [],
      tags: [],
      status: 'active',
      region: 'daily',
      lastTouched: Date.now(),
    }
    set(state => ({
      memories: { ...state.memories, [id]: newMemory },
      shortTermQueue: [...state.shortTermQueue, id],
    }))
  },

  archiveMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'archived' },
      },
    }))
  },

  forgetMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'forgotten', region: 'forgotten' },
      },
      forgotten: [...state.forgotten, id],
    }))
  },

  restoreMemory: (id) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id]: { ...state.memories[id], status: 'archived', region: 'daily' },
      },
      forgotten: state.forgotten.filter(fid => fid !== id),
      dailyBelt: [...state.dailyBelt, id],
    }))
  },

  crushMemory: (id) => {
    set(state => {
      const { [id]: _, ...rest } = state.memories
      return {
        memories: rest,
        forgotten: state.forgotten.filter(fid => fid !== id),
      }
    })
  },

  linkMemories: (id1, id2, strength) => {
    // Links are stored on the memory card itself
    set(state => ({
      memories: {
        ...state.memories,
        [id1]: {
          ...state.memories[id1],
          relatedMemoryIds: [...state.memories[id1].relatedMemoryIds, id2],
        },
      },
    }))
  },

  unlinkMemories: (id1, id2) => {
    set(state => ({
      memories: {
        ...state.memories,
        [id1]: {
          ...state.memories[id1],
          relatedMemoryIds: state.memories[id1].relatedMemoryIds.filter(rid => rid !== id2),
        },
      },
    }))
  },

  demoteFromCore: (id) => {
    set(state => ({
      coreConstellation: state.coreConstellation.filter(cid => cid !== id),
      dailyBelt: [...state.dailyBelt, id],
    }))
  },
}))
```

- [ ] **Step 4: 实现 useRoomStore**

```typescript
// src/stores/useRoomStore.ts
import { create } from 'zustand'
import type { AIState } from '../types/room'

interface RoomState {
  aiState: AIState
  aiPosition: [number, number, number]
  aiTarget: string | null
  bustedCount: Record<string, number>
  skylightGlow: number
  isUserInRoom: boolean

  setAIState: (state: AIState) => void
  setAITarget: (target: string | null) => void
  triggerBusted: (furnitureId: string) => number
  setSkylightGlow: (glow: number) => void
  enterRoom: () => void
  leaveRoom: () => void
}

export const useRoomStore = create<RoomState>((set) => ({
  aiState: 'idle',
  aiPosition: [0, 0, 0],
  aiTarget: null,
  bustedCount: {},
  skylightGlow: 0,
  isUserInRoom: true,

  setAIState: (state) => set({ aiState: state }),
  setAITarget: (target) => set({ aiTarget: target }),
  triggerBusted: (furnitureId) => {
    let newCount = 1
    set((state) => {
      newCount = (state.bustedCount[furnitureId] || 0) + 1
      return {
        bustedCount: { ...state.bustedCount, [furnitureId]: newCount },
      }
    })
    return newCount
  },
  setSkylightGlow: (glow) => set({ skylightGlow: glow }),
  enterRoom: () => set({ isUserInRoom: true }),
  leaveRoom: () => set({ isUserInRoom: false }),
}))
```

- [ ] **Step 5: 实现 useStarfieldStore**

```typescript
// src/stores/useStarfieldStore.ts
import { create } from 'zustand'
import type { RegionType } from '../types/starfield'

interface StarfieldState {
  currentRegion: RegionType
  focusedStarId: string | null
  zoomLevel: number
  cameraPosition: { x: number; y: number }
  filterTags: string[]
  filterTimeRange: string | null
  searchQuery: string
  showConstellationNames: boolean

  focusStar: (id: string | null) => void
  zoomToRegion: (region: RegionType) => void
  applyFilter: (tags: string[], timeRange?: string | null) => void
  panCamera: (deltaX: number, deltaY: number) => void
  zoomCamera: (factor: number) => void
  setSearchQuery: (query: string) => void
}

export const useStarfieldStore = create<StarfieldState>((set) => ({
  currentRegion: null,
  focusedStarId: null,
  zoomLevel: 1,
  cameraPosition: { x: 0, y: 0 },
  filterTags: [],
  filterTimeRange: null,
  searchQuery: '',
  showConstellationNames: true,

  focusStar: (id) => set({ focusedStarId: id }),
  zoomToRegion: (region) => set({ currentRegion: region }),
  applyFilter: (tags, timeRange = null) => set({ filterTags: tags, filterTimeRange: timeRange }),
  panCamera: (deltaX, deltaY) => set((state) => ({
    cameraPosition: {
      x: state.cameraPosition.x + deltaX / state.zoomLevel,
      y: state.cameraPosition.y + deltaY / state.zoomLevel,
    },
  })),
  zoomCamera: (factor) => set((state) => ({
    zoomLevel: Math.max(0.1, Math.min(5, state.zoomLevel * factor)),
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
```

- [ ] **Step 6: 实现 useUIStore**

```typescript
// src/stores/useUIStore.ts
import { create } from 'zustand'

type SceneType = 'room' | 'starfield'

interface UIState {
  currentScene: SceneType
  toast: { message: string; type: 'info' | 'success' | 'warning' } | null

  setScene: (scene: SceneType) => void
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void
  hideToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  currentScene: 'room',
  toast: null,

  setScene: (scene) => set({ currentScene: scene }),
  showToast: (message, type = 'info') => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}))
```

- [ ] **Step 7: 运行测试，确认通过**

```bash
npx vitest run src/stores/__tests__/useMemoryStore.test.ts
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/stores/
git commit -m "feat: add zustand stores for memory, room, starfield, ui"
```

---

## Task 6: 房间场景基础

**Files:**
- Create: `src/components/room/RoomScene.tsx`
- Create: `src/components/room/RoomEnvironment.tsx`
- Create: `src/components/room/InteractionRaycaster.tsx`

- [ ] **Step 1: 实现 RoomEnvironment（地板 + 墙壁 + 灯光）**

```tsx
// src/components/room/RoomEnvironment.tsx
import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function RoomEnvironment() {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  // Subtle light animation
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshToonMaterial color="#D4A574" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -5]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color="#F5E6C8" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color="#F5E6C8" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshToonMaterial color="#F5E6C8" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshToonMaterial color="#FFF8E7" />
      </mesh>

      {/* Window frame */}
      <mesh position={[0, 5, -4.9]}>
        <planeGeometry args={[6, 4]} />
        <meshToonMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.4} color="#FFF8E7" />
      <directionalLight
        ref={lightRef}
        position={[10, 8, 5]}
        intensity={1.2}
        color="#FFE4B5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 4, -2]} intensity={0.3} color="#F5E6C8" />
    </>
  )
}
```

- [ ] **Step 2: 实现 InteractionRaycaster**

```tsx
// src/components/room/InteractionRaycaster.tsx
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

interface Props {
  onInteract?: (objectName: string) => void
}

export default function InteractionRaycaster({ onInteract }: Props) {
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        // Find the first object with a name
        const hit = intersects.find(i => i.object.name)
        if (hit) {
          onInteract?.(hit.object.name)
        }
      }
    }

    gl.domElement.addEventListener('click', handleClick)
    return () => gl.domElement.removeEventListener('click', handleClick)
  }, [camera, gl, scene, onInteract])

  return null
}
```

- [ ] **Step 3: 实现 RoomScene**

```tsx
// src/components/room/RoomScene.tsx
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
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 8], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <RoomEnvironment />
      <Diary onClick={() => onFurnitureClick?.('diary')} />
      <Skylight onClick={onEnterStarfield} />
      <InteractionRaycaster onInteract={onFurnitureClick} />
    </Canvas>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/room/
git commit -m "feat: add room base scene with environment, lighting, raycaster"
```

---

## Task 7: 日记本家具 + 天窗

**Files:**
- Create: `src/components/room/furniture/Diary.tsx`
- Create: `src/components/room/Skylight.tsx`

- [ ] **Step 1: 实现 Diary 组件**

```tsx
// src/components/room/furniture/Diary.tsx
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoomStore } from '../../../stores/useRoomStore'

interface Props {
  onClick?: () => void
}

export default function Diary({ onClick }: Props) {
  const meshRef = useRef<THREE.Group>(null)
  const [isOpen, setIsOpen] = useState(false)
  const bustedCount = useRoomStore((state) => state.bustedCount['diary'] || 0)

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.005
    }
  })

  const handleClick = () => {
    setIsOpen(!isOpen)
    onClick?.()
  }

  return (
    <group
      ref={meshRef}
      position={[2, 0.15, 1]}
      name="diary"
      onClick={(e) => {
        e.stopPropagation()
        handleClick()
      }}
    >
      {/* Book cover - bottom */}
      <mesh position={[0, 0, 0]} rotation={isOpen ? [0, 0.3, 0] : [0, 0, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.9]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Book pages */}
      <mesh position={[0, 0.06, 0]} rotation={isOpen ? [0, 0.3, 0] : [0, 0, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.85]} />
        <meshToonMaterial color="#FFF8E7" />
      </mesh>

      {/* Book cover - top (opens when clicked) */}
      <mesh
        position={[0, 0.12, 0]}
        rotation={isOpen ? [0, -0.5, 0] : [0, 0, 0]}
      >
        <boxGeometry args={[1.2, 0.04, 0.9]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>

      {/* Bookmark ribbon */}
      <mesh position={[0.3, -0.05, 0.45]}>
        <boxGeometry args={[0.08, 0.01, 0.3]} />
        <meshToonMaterial color="#CD5C5C" />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 2: 实现 Skylight 组件**

```tsx
// src/components/room/Skylight.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoomStore } from '../../stores/useRoomStore'

interface Props {
  onClick?: () => void
}

export default function Skylight({ onClick }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)
  const skylightGlow = useRoomStore((state) => state.skylightGlow)

  // Pulsing glow animation
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 + 0.8
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = skylightGlow * pulse * 0.5
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 9.99, 0]}
      name="skylight"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      <planeGeometry args={[3, 3]} />
      <meshStandardMaterial
        color="#1A1B3A"
        emissive="#FFD700"
        emissiveIntensity={skylightGlow * 0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/room/furniture/ src/components/room/Skylight.tsx
git commit -m "feat: add diary furniture and skylight entrance"
```

---

## Task 8: 星空场景（Canvas 2D + D3-force）

**Files:**
- Create: `src/components/starfield/StarfieldContainer.tsx`
- Create: `src/components/starfield/StarCanvas.tsx`

- [ ] **Step 1: 实现 StarCanvas 核心渲染器**

```tsx
// src/components/starfield/StarCanvas.tsx
import { useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import { useMemoryStore } from '../../stores/useMemoryStore'
import { useStarfieldStore } from '../../stores/useStarfieldStore'
import { COLORS } from '../../utils/colorPalette'
import { getRegionCenter } from '../../utils/starPositioner'
import { getPulse } from '../../utils/canvasUtils'
import type { StarNode, StarBridge } from '../../types/starfield'
import type { MemoryCard } from '../../types/memory'

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<StarNode[]>([])
  const linksRef = useRef<StarBridge[]>([])
  const simulationRef = useRef<d3.Simulation<StarNode, undefined> | null>(null)

  const memories = useMemoryStore((state) => state.memories)
  const camera = useStarfieldStore((state) => ({
    x: state.cameraPosition.x,
    y: state.cameraPosition.y,
    zoom: state.zoomLevel,
  }))
  const focusedStarId = useStarfieldStore((state) => state.focusedStarId)

  // Convert memories to star nodes
  const initNodes = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const memArray = Object.values(memories)
    const nodes: StarNode[] = memArray.map((mem) => {
      const isCore = mem.region === 'core'
      const isForgotten = mem.region === 'forgotten'
      const center = getRegionCenter(mem.region, canvas.width, canvas.height)

      return {
        id: mem.id,
        x: center.x + (Math.random() - 0.5) * 200,
        y: center.y + (Math.random() - 0.5) * 200,
        fx: null,
        fy: null,
        radius: isCore ? 8 : isForgotten ? 3 : 5,
        color: isCore ? COLORS.coreStar : isForgotten ? COLORS.whiteDwarf : COLORS.dailyStar,
        glowColor: isCore ? COLORS.coreStarGlow : isForgotten ? '#A9A9A9' : COLORS.dailyStarGlow,
        pulsePhase: Math.random() * Math.PI * 2,
        opacity: 1,
        region: mem.region,
      }
    })

    // Create links from relatedMemoryIds
    const links: StarBridge[] = []
    memArray.forEach((mem) => {
      mem.relatedMemoryIds.forEach((targetId) => {
        if (memories[targetId]) {
          links.push({
            source: mem.id,
            target: targetId,
            strength: Math.random() * 0.5 + 0.5,
            type: mem.region === 'core' ? 'strong' : 'weak',
          })
        }
      })
    })

    nodesRef.current = nodes
    linksRef.current = links

    // D3-force simulation
    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    simulationRef.current = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(80)
      )
      .force('collide', d3.forceCollide().radius((d: any) => d.radius + 3))
      .force(
        'regionX',
        d3.forceX((d: any) => getRegionCenter(d.region, canvas.width, canvas.height).x).strength(0.05)
      )
      .force(
        'regionY',
        d3.forceY((d: any) => getRegionCenter(d.region, canvas.width, canvas.height).y).strength(0.05)
      )
      .on('tick', () => {
        render()
      })
  }, [memories])

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.save()
    ctx.clearRect(0, 0, width, height)

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, COLORS.starfieldBg1)
    bgGradient.addColorStop(1, COLORS.starfieldBg2)
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Apply camera transform
    ctx.translate(width / 2, height / 2)
    ctx.scale(camera.zoom, camera.zoom)
    ctx.translate(-camera.x, -camera.y)

    const nodes = nodesRef.current
    const links = linksRef.current

    // Draw links
    links.forEach((link) => {
      const sourceNode = nodes.find((n) => n.id === (link.source as any).id || n.id === link.source)
      const targetNode = nodes.find((n) => n.id === (link.target as any).id || n.id === link.target)
      if (!sourceNode || !targetNode) return

      ctx.beginPath()
      ctx.moveTo(sourceNode.x, sourceNode.y)
      ctx.lineTo(targetNode.x, targetNode.y)

      if (link.type === 'strong') {
        ctx.strokeStyle = COLORS.bridgeStrong
        ctx.lineWidth = 2 * link.strength
        ctx.globalAlpha = 0.6
      } else {
        ctx.strokeStyle = COLORS.bridgeWeak
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
      }

      ctx.stroke()
      ctx.globalAlpha = 1
    })

    // Draw nodes
    nodes.forEach((node) => {
      // Focus mode: non-focused nodes dimmed
      const isFocused = focusedStarId === node.id
      const isRelated = focusedStarId
        ? links.some(
            (l) =>
              ((l.source as any).id || l.source) === focusedStarId &&
                ((l.target as any).id || l.target) === node.id
          ) ||
          links.some(
            (l) =>
              ((l.target as any).id || l.target) === focusedStarId &&
                ((l.source as any).id || l.source) === node.id
          )
        : false

      const shouldDim = focusedStarId && !isFocused && !isRelated
      const opacity = shouldDim ? 0.3 : 1

      if (opacity < 0.3) return

      ctx.globalAlpha = opacity

      // Pulse
      const pulse = getPulse(node.pulsePhase)

      // Outer glow
      const outerGradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        node.radius * 3 * pulse
      )
      outerGradient.addColorStop(0, node.glowColor + '40')
      outerGradient.addColorStop(1, node.glowColor + '00')
      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 3 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Inner glow
      const innerGradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        node.radius * 1.5
      )
      innerGradient.addColorStop(0, node.color)
      innerGradient.addColorStop(1, node.glowColor + '80')
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
    })

    ctx.restore()
  }, [camera, focusedStarId])

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initNodes()
    }

    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [initNodes])

  // Re-render on camera/focus changes
  useEffect(() => {
    render()
  }, [camera, focusedStarId, render])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
}
```

- [ ] **Step 2: 实现 StarfieldContainer**

```tsx
// src/components/starfield/StarfieldContainer.tsx
import StarCanvas from './StarCanvas'

interface Props {
  onBackToRoom?: () => void
}

export default function StarfieldContainer({ onBackToRoom }: Props) {
  return (
    <div className="relative w-full h-full">
      <StarCanvas />

      {/* Back button */}
      <button
        onClick={onBackToRoom}
        className="absolute top-4 left-4 px-4 py-2 rounded-lg text-sm"
        style={{
          background: 'rgba(255,248,231,0.85)',
          border: '1px solid #D4A574',
          color: '#5D4037',
        }}
      >
        返回房间
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/starfield/
git commit -m "feat: add starfield canvas renderer with d3-force physics"
```

---

## Task 9: 场景切换 + UI 组件

**Files:**
- Create: `src/components/SceneSwitcher.tsx`
- Create: `src/components/ui/SceneFade.tsx`
- Create: `src/components/ui/MemoryCard.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 实现 SceneSwitcher**

```tsx
// src/components/SceneSwitcher.tsx
import { useState } from 'react'
import RoomScene from './room/RoomScene'
import StarfieldContainer from './starfield/StarfieldContainer'
import { useUIStore } from '../stores/useUIStore'

export default function SceneSwitcher() {
  const currentScene = useUIStore((state) => state.currentScene)
  const setScene = useUIStore((state) => state.setScene)
  const [fadeState, setFadeState] = useState<'visible' | 'fading-out' | 'fading-in'>('visible')

  const switchScene = (target: 'room' | 'starfield') => {
    if (fadeState !== 'visible') return

    setFadeState('fading-out')
    setTimeout(() => {
      setScene(target)
      setFadeState('fading-in')
      setTimeout(() => setFadeState('visible'), 300)
    }, 300)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Room Scene */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: currentScene === 'room' && fadeState === 'visible' ? 1 : 0,
          pointerEvents: currentScene === 'room' ? 'auto' : 'none',
        }}
      >
        <RoomScene
          onEnterStarfield={() => switchScene('starfield')}
          onFurnitureClick={(id) => console.log('Clicked:', id)}
        />
      </div>

      {/* Starfield Scene */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: currentScene === 'starfield' && fadeState === 'visible' ? 1 : 0,
          pointerEvents: currentScene === 'starfield' ? 'auto' : 'none',
        }}
      >
        <StarfieldContainer onBackToRoom={() => switchScene('room')} />
      </div>

      {/* Fade overlay */}
      {(fadeState === 'fading-out' || fadeState === 'fading-in') && (
        <div
          className="absolute inset-0 z-50 transition-opacity duration-300"
          style={{
            background: '#1A1B3A',
            opacity: fadeState === 'fading-out' ? 1 : 0,
          }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: 实现 MemoryCard**

```tsx
// src/components/ui/MemoryCard.tsx
import { useMemoryStore } from '../../stores/useMemoryStore'

interface Props {
  memoryId: string
  onClose?: () => void
}

export default function MemoryCard({ memoryId, onClose }: Props) {
  const memory = useMemoryStore((state) => state.memories[memoryId])

  if (!memory) return null

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl max-w-sm"
      style={{
        background: 'rgba(255,248,231,0.9)',
        border: '1px solid #D4A574',
        backdropFilter: 'blur(10px)',
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-lg"
        style={{ color: '#8D6E63' }}
      >
        ×
      </button>

      <div className="text-xs mb-2" style={{ color: '#8D6E63' }}>
        {new Date(memory.timestamp).toLocaleDateString('zh-CN')}
      </div>

      <p className="text-sm mb-3" style={{ color: '#5D4037' }}>
        {memory.content}
      </p>

      {memory.aiNote && (
        <p className="text-xs italic" style={{ color: '#8D6E63' }}>
          "{memory.aiNote}"
        </p>
      )}

      <div className="flex gap-2 mt-3 flex-wrap">
        {memory.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: '#F5E6C8',
              color: '#5D4037',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 更新 App.tsx**

```tsx
// src/App.tsx
import SceneSwitcher from './components/SceneSwitcher'

function App() {
  return <SceneSwitcher />
}

export default App
```

- [ ] **Step 4: 验证完整链路**

```bash
npm run dev
```

验证步骤：
1. 浏览器打开 http://localhost:5173，看到 3D 房间场景
2. 房间中有地板、墙壁、灯光、日记本（棕色书本）
3. 点击日记本，控制台输出 "Clicked: diary"
4. 点击天花板天窗，场景淡出后显示星空
5. 星空中有不同颜色的星星（金色核心、淡蓝绿日常、灰色遗忘）
6. 星星之间有连线
7. 点击"返回房间"按钮，回到房间场景

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/App.tsx
git commit -m "feat: add scene switcher, memory card UI, end-to-end skeleton"
```

---

## Task 10: 星空交互（拖拽 + 缩放 + 点击聚焦）

**Files:**
- Modify: `src/components/starfield/StarCanvas.tsx`

- [ ] **Step 1: 添加交互事件处理到 StarCanvas**

在 StarCanvas 组件中，在 canvas 元素上添加事件处理：

```tsx
// 添加到 StarCanvas 组件中，在 return 之前

const handleWheel = useCallback(
  (e: WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    useStarfieldStore.getState().zoomCamera(factor)
  },
  []
)

const handleMouseDown = useCallback((e: MouseEvent) => {
  const canvas = canvasRef.current
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = (e.clientX - rect.left - canvas.width / 2) / camera.zoom + camera.x
  const y = (e.clientY - rect.top - canvas.height / 2) / camera.zoom + camera.y

  // Check if clicked on a node
  const clickedNode = nodesRef.current.find((n) => {
    const dx = n.x - x
    const dy = n.y - y
    return Math.sqrt(dx * dx + dy * dy) < n.radius * 3
  })

  if (clickedNode) {
    useStarfieldStore.getState().focusStar(clickedNode.id)
  } else {
    // Start panning
    useStarfieldStore.getState().focusStar(null)
  }
}, [camera])
```

在 useEffect 中绑定事件：

```tsx
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  canvas.addEventListener('wheel', handleWheel, { passive: false })
  canvas.addEventListener('mousedown', handleMouseDown)

  return () => {
    canvas.removeEventListener('wheel', handleWheel)
    canvas.removeEventListener('mousedown', handleMouseDown)
  }
}, [handleWheel, handleMouseDown])
```

- [ ] **Step 2: Commit**

```bash
git commit -am "feat: add starfield interactions - zoom, click to focus"
```

---

## 自检清单

**1. Spec 覆盖检查：**

| Spec 要求 | 对应任务 |
|-----------|---------|
| Vite + React + TS | Task 1 |
| R3F 3D 房间 | Task 6, 7 |
| Canvas 2D 星空 | Task 8 |
| D3-force 物理引擎 | Task 8 |
| Zustand 状态管理 | Task 5 |
| 300 条 mock 数据 | Task 4 |
| 场景切换（淡入淡出） | Task 9 |
| 配色常量 | Task 3 |
| 日记本家具 | Task 7 |
| 天窗入口 | Task 7 |
| 核心星座 + 日常星带 | Task 8 |
| 工具函数 + 测试 | Task 3 |

**2. 占位符扫描：** 无 TBD/TODO/占位符 ✅

**3. 类型一致性：** 所有类型引用一致 ✅

---

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-05-29-milestone1-skeleton.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - 每个 task 派一个子代理执行，我在中间 review，快速迭代

**2. Inline Execution** - 在本会话中用 executing-plans 技能顺序执行任务

**Which approach?**
