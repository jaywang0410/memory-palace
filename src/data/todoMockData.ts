import type { TodoItem } from '../types/todo'

function dayOffset(days: number): number {
  return Date.now() - days * 86400000
}

function dayOffsetFuture(days: number): number {
  return Date.now() + days * 86400000
}

export const MOCK_TODOS: TodoItem[] = [
  // === 用户直接提醒 ===
  {
    id: 'todo-1',
    content: '明天出门记得带充电器',
    source: 'user_reminder',
    createdAt: dayOffset(1),
    remindAt: dayOffsetFuture(0),
    status: 'pending',
    category: 'today',
    reminderMessage: '主人，你昨天说要带充电器的，我帮你记着呢～',
  },
  {
    id: 'todo-2',
    content: '周五前把报告发给老板',
    source: 'user_reminder',
    createdAt: dayOffset(2),
    remindAt: dayOffsetFuture(2),
    status: 'pending',
    category: 'scheduled',
    reminderMessage: '报告的事情别忘了哦，还有两天时间，需要我帮你整理资料吗？',
  },
  {
    id: 'todo-3',
    content: '周末记得给妈妈打电话',
    source: 'user_reminder',
    createdAt: dayOffset(3),
    remindAt: dayOffsetFuture(3),
    status: 'pending',
    category: 'scheduled',
    reminderMessage: '周末快到了，阿姨上次说很想你呢。',
  },
  {
    id: 'todo-4',
    content: '明天早上8点闹钟，要早起开会',
    source: 'user_reminder',
    createdAt: dayOffset(1),
    remindAt: dayOffsetFuture(0),
    status: 'pending',
    category: 'today',
    reminderMessage: '明天要早起哦，我已经帮你把闹钟设好了。',
  },
  // === AI 主动记录 ===
  {
    id: 'todo-5',
    content: '买的草莓要快点吃，别放坏了',
    source: 'ai_observation',
    createdAt: dayOffset(2),
    remindAt: dayOffsetFuture(0),
    status: 'pending',
    category: 'today',
    reminderMessage: '主人，你前天买的草莓还在冰箱里呢，再不吃就要坏啦～',
  },
  {
    id: 'todo-6',
    content: '预约了下周三去洗牙',
    source: 'ai_observation',
    createdAt: dayOffset(5),
    remindAt: dayOffsetFuture(5),
    status: 'pending',
    category: 'scheduled',
    reminderMessage: '下周三要去洗牙哦，我提前一天再提醒你。',
  },
  {
    id: 'todo-7',
    content: '阳台上的绿植该浇水了',
    source: 'ai_observation',
    createdAt: dayOffset(3),
    remindAt: dayOffsetFuture(0),
    status: 'pending',
    category: 'today',
    reminderMessage: '小绿和阿萝看起来有点蔫了，是不是该浇水啦？',
  },
  {
    id: 'todo-8',
    content: '快递到了，记得去取',
    source: 'ai_observation',
    createdAt: dayOffset(0),
    remindAt: dayOffsetFuture(0),
    status: 'pending',
    category: 'today',
    reminderMessage: '快递小哥刚刚打电话了，说包裹放在驿站了，下班记得拿哦。',
  },
  // === 已完成的 ===
  {
    id: 'todo-9',
    content: '预订周末瑜伽课',
    source: 'user_reminder',
    createdAt: dayOffset(5),
    completedAt: dayOffset(3),
    status: 'completed',
    category: 'all',
  },
  {
    id: 'todo-10',
    content: '整理衣柜',
    source: 'user_reminder',
    createdAt: dayOffset(7),
    completedAt: dayOffset(4),
    status: 'completed',
    category: 'all',
  },
]

export function getTodayTodos(): TodoItem[] {
  return MOCK_TODOS.filter((t) => t.category === 'today' && t.status !== 'completed')
}

export function getScheduledTodos(): TodoItem[] {
  return MOCK_TODOS.filter((t) => t.category === 'scheduled' && t.status !== 'completed')
}

export function getCompletedTodos(): TodoItem[] {
  return MOCK_TODOS.filter((t) => t.status === 'completed')
}
