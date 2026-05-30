export interface TodoItem {
  id: string
  content: string
  source: 'user_reminder' | 'ai_observation'
  createdAt: number
  remindAt?: number
  remindedAt?: number
  completedAt?: number
  status: 'pending' | 'reminded' | 'completed'
  reminderMessage?: string
  category: 'today' | 'scheduled' | 'all'
}
