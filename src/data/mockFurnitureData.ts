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

export const MOCK_TODOS: TodoItem[] = [
  { id: 'todo-1', text: '完成下周三的方案汇报 PPT', completed: false, priority: 'high' },
  { id: 'todo-2', text: '给汤圆买新猫粮', completed: true, priority: 'medium' },
  { id: 'todo-3', text: '周末去海边走走', completed: false, priority: 'low' },
  { id: 'todo-4', text: '读完《被讨厌的勇气》最后两章', completed: false, priority: 'medium' },
  { id: 'todo-5', text: '整理衣柜', completed: true, priority: 'low' },
]

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
    progress: 30,
    quote: '"不管前方的路有多苦，只要走的方向正确。"',
    color: '#2D5016',
  },
]

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
]

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
]
