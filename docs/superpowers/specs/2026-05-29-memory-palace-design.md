# 记忆宫殿设计文档 v2.2

> 日期：2026-05-29
> 状态：待审核

---

## 1. 项目概述

为用户与 AI 的共同记忆，搭建一个从"温馨居家房间"到"治愈系记忆星空"的完整叙事空间。

- **短期记忆**：以温暖具象的物品存在于 3D 房间
- **长期记忆**：以星辰形态存在于 2D Obsidian 式知识图谱星空
- **切换方式**：点击天窗，淡入淡出直接切换

---

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | React 18 + TypeScript | 组件化开发 |
| 构建 | Vite | 启动快、HMR 快 |
| 3D 房间 | React Three Fiber (R3F) + Three.js | 声明式 3D，几何体组合家具 |
| 星空图谱 | HTML Canvas 2D + D3-force | 2D 平面图谱，分五大区域 |
| 状态管理 | Zustand | 轻量，用普通对象（不用 Map） |
| 动画 | GSAP + Framer Motion + Three.js 原生 | 房间内精确动画控制 |
| 样式 | Tailwind CSS + CSS Modules | 快速开发 + 3D 隔离 |
| LLM | Mock 数据（300 条预设记忆） | 先跑通前端，后续可接入真实 LLM |
| 持久化 | IndexedDB | 本地存储记忆数据 |

---

## 3. 架构设计

```
用户层 (浏览器)
    │
    ▼
场景切换层 (SceneSwitcher.tsx)
    ├─ 房间场景 (R3F Canvas)
    │   ├─ 3D 环境 (地板/墙壁/窗户/灯光)
    │   ├─ AI 角色 (几何体组合 + 状态机)
    │   └─ 家具组件
    │
    └─ 星空场景 (HTML Canvas 2D)
        ├─ 星空渲染器 (节点/连线/光晕/区域背景)
        ├─ 五大区域 (核心/日常/情绪/遗忘/想象)
        └─ Obsidian 交互 (拖拽/缩放/聚焦/搜索)
    │
    ▼
状态管理层 (Zustand)
    ├─ useMemoryStore (记忆卡片 + 归档逻辑)
    ├─ useRoomStore (AI 状态 + 被抓包 + 天窗)
    ├─ useStarfieldStore (相机 + 聚焦 + 过滤)
    └─ useUIStore (当前场景 + Toast)
    │
    ▼
服务层 (Services)
    ├─ llmService (mock：记忆提炼 + 日记生成)
    ├─ memoryService (IndexedDB 持久化)
    └─ assetService (纹理/模型加载)
```

---

## 4. 数据模型

### 4.1 MemoryCard（记忆卡片）

```typescript
interface MemoryCard {
  id: string;
  timestamp: number;
  content: string;           // 记忆摘要（一句话）
  emotionTag: 'joy' | 'sadness' | 'anger' | 'fear' | 'neutral';
  importanceScore: number;   // 0-100
  category: 'first_disclosure' | 'emotional_peak' | 'ritual' | 'daily';
  relatedMemoryIds: string[];
  tags: string[];
  roomItemSnapshot?: RoomItemSnapshot;
  aiNote?: string;           // AI 极简批注
  status: 'active' | 'archived' | 'forgotten';
  region: 'core' | 'daily' | 'emotion' | 'forgotten' | 'imagination';
  lastTouched: number;       // 最后访问时间戳
}
```

### 4.2 300 条 Mock 数据分布

| 区域 | 数量 | 说明 |
|------|------|------|
| 核心星座 | 5-7 | 金色大星，持续明亮，位于中心 |
| 日常星带 | 220-250 | 淡蓝绿，按时间由内向外扩散 |
| 情绪风暴区 | 35-40 | 分布在 4 种情绪星云中 |
| 遗忘坟场 | 25-30 | 白矮星，暗淡有裂纹 |
| 想象星云 | 10-15 | 彩虹色不规则形状（P2） |

### 4.3 StarNode（星空节点渲染数据）

```typescript
interface StarNode {
  id: string;                // 对应 MemoryCard.id
  x: number; y: number;      // D3-force 计算出的位置
  fx: number | null;         // 固定位置（拖拽时）
  fy: number | null;
  radius: number;            // 根据重要度计算
  color: string;             // 星体颜色
  glowColor: string;         // 光晕颜色
  pulsePhase: number;        // 呼吸动画相位
  opacity: number;           // 透明度（聚焦模式用）
  region: StarRegion;
}
```

### 4.4 StarBridge（星桥连线）

```typescript
interface StarBridge {
  source: string;            // 源节点 id
  target: string;            // 目标节点 id
  strength: number;          // 关联强度 0-1
  type: 'strong' | 'weak' | 'potential' | 'residual';
}
```

- `strong`：粗实线，暖金色 #F4A261，3px
- `weak`：细实线，淡青色 #7EC8E3，1.5px
- `potential`：虚线，淡紫色 #D8BFD8，1px
- `residual`：极细虚线，暖金色 #FFD700，0.5px，透明度 0.2（核心降级记忆保留）

---

## 5. 状态管理（Zustand）

### 5.1 useMemoryStore

使用普通对象 `Record<string, MemoryCard>`，不用 Map（避免 Zustand 浅比较问题）。

```typescript
interface MemoryState {
  memories: Record<string, MemoryCard>;
  shortTermQueue: string[];
  coreConstellation: string[];   // 最多 7-9 个
  dailyBelt: string[];
  emotionStorms: string[];
  forgotten: string[];
  imagination: string[];

  addMemory: (dialogue: DialogueTurn[]) => void;
  archiveMemory: (id: string) => void;
  forgetMemory: (id: string) => void;
  restoreMemory: (id: string) => void;
  crushMemory: (id: string) => void;
  linkMemories: (id1: string, id2: string, strength: LinkStrength) => void;
  unlinkMemories: (id1: string, id2: string) => void;
  demoteFromCore: (id: string) => void;
}
```

### 5.2 useRoomStore

```typescript
interface RoomState {
  aiState: 'idle' | 'reading' | 'listening_music' | 'daydreaming' | 'busted';
  aiPosition: [number, number, number];
  aiTarget: string | null;
  furnitureStates: Record<string, FurnitureState>;
  bustedCount: Record<string, number>;
  skylightGlow: number;          // 0-1
  isUserInRoom: boolean;

  interactWithFurniture: (id: string) => void;
  triggerBusted: (id: string) => string;
  setAIState: (state: AIState) => void;
  enterRoom: () => void;
  leaveRoom: () => void;
}
```

### 5.3 useStarfieldStore

```typescript
interface StarfieldState {
  currentRegion: RegionType | null;
  focusedStarId: string | null;
  zoomLevel: number;
  cameraPosition: { x: number; y: number };
  filterTags: string[];
  filterTimeRange: string | null;
  searchQuery: string;
  showConstellationNames: boolean;

  focusStar: (id: string) => void;
  zoomToRegion: (region: RegionType) => void;
  applyFilter: (tags: string[], timeRange?: string) => void;
  panCamera: (deltaX: number, deltaY: number) => void;
  zoomCamera: (factor: number) => void;
}
```

---

## 6. 垂直切片里程碑

### 里程碑 1：端到端骨架（MVP 骨架）

目标：能完整走通一条链路

**房间场景**：
- [ ] 房间基础环境（地板、墙壁、窗户、灯光）——用 R3F 基本几何体
- [ ] 日记本家具——Box + Plane 组合，暖棕色皮质，可点击
- [ ] 点击日记本 → 弹出 UI 面板显示日记内容

**星空场景**：
- [ ] Canvas 2D 渲染器 + D3-force 物理引擎
- [ ] 核心星座（5-7 颗金色大星）
- [ ] 日常星带（~50 颗淡蓝绿星，螺旋分布）
- [ ] 基础交互：滚轮缩放、空白拖拽平移、点击聚焦

**切换**：
- [ ] 天窗入口（点击触发）
- [ ] 淡入淡出切换（CSS transition，300ms）

**Mock 数据**：
- [ ] 生成 300 条记忆数据脚本
- [ ] 预加载到 Zustand store

### 里程碑 2：Room 完整化

- [ ] 书桌 + 电脑（备忘录、切屏动画）
- [ ] 软木板 + 拍立得（可点击查看大图）
- [ ] 书架 + 书籍（点击触发 AI 聊书）
- [ ] 音响 + 曲目（点击播放）
- [ ] AI 角色（几何体组合：圆润机器人，白色身体 + 黑色面罩 + 暖色眼睛）
- [ ] AI 状态机（idle/reading/listening/daydreaming/busted）
- [ ] 被抓包反应系统（台词 + 动画，3-5 次后衰减）

### 里程碑 3：Starfield 完整化 + 记忆流转

- [ ] 情绪风暴区（4 种情绪星云：喜/悲/怒/惧）
- [ ] 遗忘坟场（白矮星，暗淡有裂纹）
- [ ] 星桥关联系统（强/弱/潜在/残线 4 种）
- [ ] 星座自动聚合 + 星座轮廓
- [ ] 搜索 + 标签过滤 + 聚焦模式
- [ ] AI 星灵（金色光晕，区域间流动）
- [ ] 区域快捷导航
- [ ] 记忆归档逻辑（90 天衰减、核心星座降级）

### Mock 数据生成

- `scripts/generateMockData.ts`：生成 300 条符合分布的记忆数据
- 里程碑 1 先加载 50 条（核心 5-7 + 日常 40-45），里程碑 3 加载全部 300 条

### 里程碑 4：Polish

- [ ] 深度缩放（远/中/近三档）
- [ ] 时间滤镜（半年/去年/全部）
- [ ] 动画打磨（被抓包反应衰减、星灵移动、白矮星碰撞闪光）
- [ ] 性能优化（视口裁剪、层级渲染、D3-force 节流）
- [ ] 响应式适配
- [ ] 环境音效（可选）

---

## 7. 300 节点性能策略

### 7.1 视口裁剪

只渲染 camera 视野内的节点 + 20% 边缘缓冲。视野外的节点完全不渲染。

```typescript
function isInViewport(node: StarNode, camera: Camera): boolean {
  const left = camera.x - camera.width / 2 / camera.zoom * 1.2;
  const right = camera.x + camera.width / 2 / camera.zoom * 1.2;
  const top = camera.y - camera.height / 2 / camera.zoom * 1.2;
  const bottom = camera.y + camera.height / 2 / camera.zoom * 1.2;
  return node.x >= left && node.x <= right && node.y >= top && node.y <= bottom;
}
```

### 7.2 层级渲染（LOD）

根据 zoomLevel 决定渲染细节：

| Zoom | 节点渲染 | 连线渲染 | 标签 |
|------|---------|---------|------|
| < 0.3（远景） | 只画核心圆点（无发光） | 只画强关联 | 只显示星座名 |
| 0.3-1.5（中景） | 核心 + 内层光晕 | 强 + 弱关联 | 显示重要节点标签 |
| > 1.5（近景） | 完整光晕（外层+内层+核心） | 全部连线 | 全部标签 |

### 7.3 D3-force 节流

物理模拟每 2-3 帧更新一次，而非每帧。节点稳定后（alpha < 0.01）停止模拟。

### 7.4 聚焦模式优化

点击某节点聚焦时：
- 关联节点：完整渲染
- 非关联节点：只画核心圆点（无光晕），透明度降至 30%
- 非关联连线：不渲染

### 7.5 降级方案

如果 300 节点在目标设备上仍然卡顿，升级到 **Pixi.js** WebGL 渲染器，保持相同的组件接口。

---

## 8. 项目结构

```
memory-palace/
├── public/
│   └── textures/               # 纹理贴图（地板、墙壁等）
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── types/
│   │   ├── memory.ts
│   │   ├── room.ts
│   │   ├── starfield.ts
│   │   └── ai.ts
│   │
│   ├── stores/
│   │   ├── useMemoryStore.ts
│   │   ├── useRoomStore.ts
│   │   ├── useStarfieldStore.ts
│   │   └── useUIStore.ts
│   │
│   ├── components/
│   │   ├── SceneSwitcher.tsx
│   │   │
│   │   ├── room/
│   │   │   ├── RoomScene.tsx
│   │   │   ├── RoomEnvironment.tsx
│   │   │   ├── AICharacter.tsx
│   │   │   ├── furniture/
│   │   │   │   ├── Desk.tsx
│   │   │   │   ├── Diary.tsx
│   │   │   │   ├── CorkBoard.tsx
│   │   │   │   ├── Bookshelf.tsx
│   │   │   │   ├── Speaker.tsx
│   │   │   │   ├── Wardrobe.tsx      # P2
│   │   │   │   ├── TV.tsx            # P2
│   │   │   │   └── Fridge.tsx        # P2
│   │   │   ├── Skylight.tsx
│   │   │   └── InteractionRaycaster.tsx
│   │   │
│   │   ├── starfield/
│   │   │   ├── StarfieldContainer.tsx
│   │   │   ├── StarCanvas.tsx
│   │   │   ├── StarNode.tsx
│   │   │   ├── StarBridge.tsx
│   │   │   ├── Constellation.tsx
│   │   │   ├── EmotionNebula.tsx
│   │   │   ├── RegionBackground.tsx
│   │   │   ├── AISpirit.tsx
│   │   │   └── StarfieldUI.tsx
│   │   │
│   │   └── ui/
│   │       ├── Sidebar.tsx
│   │       ├── MemoryCard.tsx
│   │       ├── Toast.tsx
│   │       ├── SearchBar.tsx
│   │       ├── TagFilter.tsx
│   │       ├── RegionNav.tsx
│   │       └── SceneFade.tsx
│   │
│   ├── hooks/
│   │   ├── useMemoryArchive.ts
│   │   ├── useAIContentGen.ts
│   │   ├── useBustedReaction.ts
│   │   ├── useStarfieldPhysics.ts
│   │   └── useSceneTransition.ts
│   │
│   ├── services/
│   │   ├── llmService.ts
│   │   ├── memoryService.ts
│   │   └── assetService.ts
│   │
│   ├── utils/
│   │   ├── colorPalette.ts
│   │   ├── emotionClassifier.ts
│   │   ├── memoryScorer.ts
│   │   ├── starPositioner.ts
│   │   └── canvasUtils.ts
│   │
│   └── styles/
│       ├── globals.css
│       └── glassmorphism.css
│
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-29-memory-palace-design.md
│
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 9. Git/GitHub 策略

- **主分支**：`main`，始终可运行
- **开发流程**：每个里程碑一个 feature branch → PR → code review → merge
- **提交规范**：Conventional Commits（`feat:`, `fix:`, `refactor:` 等）
- **PR 粒度**：每个里程碑一个 PR，包含完整的可运行状态
- **`.gitignore`**：node_modules、.superpowers、dist、.env
- **README.md**：启动方式、项目说明、截图

---

## 10. 配色常量

```typescript
// utils/colorPalette.ts
export const COLORS = {
  // 房间
  roomBg: '#FFF8E7',
  roomWood: '#D4A574',
  roomAccent: '#F4A261',
  roomGreen: '#8CB369',
  roomWall: '#F5E6C8',

  // 星空背景
  starfieldBg1: '#1A1B3A',
  starfieldBg2: '#0F1123',

  // 星星
  coreStar: '#FFD700',
  coreStarGlow: '#FFF8DC',
  dailyStar: '#7EC8E3',
  dailyStarGlow: '#B0E0E6',

  // 星桥
  bridgeStrong: '#F4A261',
  bridgeWeak: '#7EC8E3',
  bridgePotential: '#D8BFD8',
  bridgeResidual: '#FFD700',

  // 情绪星云
  nebulaJoy: '#FFE4B5',
  nebulaSadness: '#87CEEB',
  nebulaAnger: '#CD5C5C',
  nebulaFear: '#DDA0DD',

  // 遗忘
  whiteDwarf: '#696969',

  // UI
  uiGlassBg: 'rgba(255,248,231,0.85)',
  uiGlassBorder: '#D4A574',
  uiText: '#5D4037',
  uiTextLight: '#8D6E63',
} as const;
```

---

## 11. 风险与备选

| 风险 | 影响 | 备选方案 |
|------|------|---------|
| 300 节点 Canvas 2D 卡顿 | 星空交互不流畅 | 升级到 Pixi.js WebGL 渲染 |
| R3F 学习曲线 | 开发慢 | 降级为 2.5D CSS 3D Transform |
| 移动端性能 | 房间/星空无法运行 | 移动端降级为简化 2D 版本 |
| 3D 模型资源 | 房间场景简陋 | **默认方案**：代码生成几何体组合 |

---

## 12. 决策记录

| 决策 | 选择 | 原因 |
|------|------|------|
| 星空维度 | 2D 平面 | 产品明确为 Obsidian 式 2D 图谱 |
| 房间→星空切换 | 淡入淡出 | 去掉飞升仪式，保持简洁 |
| LLM 集成 | Mock 数据 | 先跑通前端，后续再接入真实 LLM |
| Mock 数据量 | 300 条 | 接近真实使用场景，测试性能边界 |
| 3D 模型 | 代码生成几何体 | 不依赖外部设计师/资产库 |
| 状态管理 Map | 普通对象 Record | Zustand 浅比较对 Map 不敏感 |
| 开发策略 | 垂直切片 | 每轮都能看到端到端效果 |
