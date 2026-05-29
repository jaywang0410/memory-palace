# 记忆宫殿 Memory Palace

为用户与 AI 的共同记忆，搭建一个从"温馨居家房间"到"治愈系记忆星空"的完整叙事空间。

## 项目概述

- **短期记忆**：以温暖具象的物品存在于 3D 卡通房间中
- **长期记忆**：以星辰形态存在于 2D Obsidian 式知识图谱星空中
- **场景切换**：通过天花板天窗，淡入淡出直接切换

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite
- **3D 渲染**：React Three Fiber (R3F) + Three.js
- **星空图谱**：HTML Canvas 2D + D3-force
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **动画**：GSAP + Framer Motion
- **后处理**：@react-three/postprocessing (Bloom, Vignette)

## 功能特性

### 记忆房间（3D）
- 3D 卡通居家场景，可旋转视角
- AI 小机器人角色（idle 动画、眨眼、呼吸）
- 可交互家具：日记本、书桌、书架、音响、电视、盆栽、软木板
- 每个家具点击弹出专属内容弹窗
- 体积光（阳光光束）+ Bloom 后处理效果

### 记忆星空（2D）
- 300 颗星星按五大区域分布
- D3-force 物理引擎布局
- 情绪星云、AI 星灵、区域导航
- 滚轮缩放、拖拽平移、点击聚焦

### 记忆系统
- 300 条真实故事线记忆（工作、宠物、感情、健康、旅行、学习）
- 记忆间有关联连线
- AI 批注贴合故事上下文

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 项目结构

```
src/
  components/
    room/          # 3D 房间场景
    starfield/     # 2D 星空场景
    ui/            # UI 组件（弹窗、卡片）
  stores/          # Zustand 状态管理
  data/            # Mock 数据
  utils/           # 工具函数
  types/           # TypeScript 类型
```

## 开发计划

- [x] 里程碑 1：端到端骨架（房间 + 星空 + 切换）
- [x] 里程碑 2：AI 角色 + 后处理效果
- [x] 里程碑 3：家具升级 + 交互弹窗
- [x] 里程碑 4：星空区域效果 + AI 星灵 + 导航
- [ ] 里程碑 5：LLM 接入 + 真实记忆提炼
