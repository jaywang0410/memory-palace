export interface DiaryEvent {
  time: string
  content: string
}

export interface DiaryEntry {
  id: string
  date: string
  weekday: string
  weather: string
  userMood: string
  events: DiaryEvent[]
  aiDiary: string
  aiReflection: string
}
