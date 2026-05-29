// ===== Mock Data for Furniture Content =====
// Designed to feel like a real person's life over time

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface MovieItem {
  id: string
  title: string
  progress: number // 0-100
  quote: string
  color: string
}

export interface SongItem {
  id: string
  title: string
  artist: string
  mood: string
  color: string
}

export interface BookItem {
  id: string
  title: string
  author: string
  progress: number
  quote: string
}

// Realistic todo list - mix of work, life, pet
export const MOCK_TODOS: TodoItem[] = [
  { id: 'todo-1', text: '完成下周三的方案汇报 PPT，需要包含数据图表', completed: false, priority: 'high' },
  { id: 'todo-2', text: '给汤圆预约年度体检，去年也是这家医院', completed: true, priority: 'medium' },
  { id: 'todo-3', text: '周末去海边走走，带上相机', completed: false, priority: 'low' },
  { id: 'todo-4', text: '读完《被讨厌的勇气》最后两章，笔记还没整理', completed: false, priority: 'medium' },
  { id: 'todo-5', text: '整理衣柜，冬天的衣服该收起来了', completed: true, priority: 'low' },
  { id: 'todo-6', text: '回复客户邮件，对方催了三次了', completed: false, priority: 'high' },
  { id: 'todo-7', text: '买猫粮，汤圆快吃完了', completed: true, priority: 'medium' },
  { id: 'todo-8', text: '学那首《晴天》的扫弦部分', completed: false, priority: 'low' },
]

// Movies - mix of watching now and queued
export const MOCK_MOVIES: MovieItem[] = [
  {
    id: 'movie-1',
    title: '星际穿越',
    progress: 65,
    quote: '"爱是唯一可以穿越时间与空间的事物。"',
    color: '#1A1B3A',
  },
  {
    id: 'movie-2',
    title: '千与千寻',
    progress: 100,
    quote: '"不管前方的路有多苦，只要走的方向正确。"',
    color: '#2D5016',
  },
  {
    id: 'movie-3',
    title: '肖申克的救赎',
    progress: 30,
    quote: '"希望是美好的，也许是人间至善。"',
    color: '#4A3728',
  },
]

// Songs - reflecting mood and taste over time
export const MOCK_SONGS: SongItem[] = [
  {
    id: 'song-1',
    title: '晴天',
    artist: '周杰伦',
    mood: '怀旧',
    color: '#FFE4B5',
  },
  {
    id: 'song-2',
    title: '夜曲',
    artist: '周杰伦',
    mood: '安静',
    color: '#B0C4DE',
  },
  {
    id: 'song-3',
    title: '小幸运',
    artist: '田馥甄',
    mood: '温暖',
    color: '#FFB6C1',
  },
  {
    id: 'song-4',
    title: '起风了',
    artist: '买辣椒也用券',
    mood: '感慨',
    color: '#87CEEB',
  },
]

// Books - reading journey with realistic progress
export const MOCK_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: '被讨厌的勇气',
    author: '岸见一郎',
    progress: 78,
    quote: '所谓的自由，就是被别人讨厌。',
  },
  {
    id: 'book-2',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    progress: 45,
    quote: '历史的铁律就是：事后看来无可避免的事，在当时看来总是毫不明显。',
  },
  {
    id: 'book-3',
    title: '挪威的森林',
    author: '村上春树',
    progress: 12,
    quote: '死并非生的对立面，而作为生的一部分永存。',
  },
]
