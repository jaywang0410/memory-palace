import { create } from 'zustand'
import type { TodoItem } from '../types/todo'
import { MOCK_TODOS } from '../data/todoMockData'

interface TodoState {
  todos: TodoItem[]

  toggleTodo: (id: string) => void
  completeTodo: (id: string) => void
  uncompleteTodo: (id: string) => void
  getTodayTodos: () => TodoItem[]
  getScheduledTodos: () => TodoItem[]
  getCompletedTodos: () => TodoItem[]
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: MOCK_TODOS,

  toggleTodo: (id: string) => {
    set((state) => ({
      todos: state.todos.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'completed' ? 'pending' : 'completed'
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? Date.now() : undefined,
          }
        }
        return t
      }),
    }))
  },

  completeTodo: (id: string) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id
          ? { ...t, status: 'completed' as const, completedAt: Date.now() }
          : t
      ),
    }))
  },

  uncompleteTodo: (id: string) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, status: 'pending' as const, completedAt: undefined } : t
      ),
    }))
  },

  getTodayTodos: () => {
    return get().todos.filter((t) => t.status !== 'completed' && t.category === 'today')
  },

  getScheduledTodos: () => {
    return get().todos.filter((t) => t.status !== 'completed' && t.category === 'scheduled')
  },

  getCompletedTodos: () => {
    return get().todos.filter((t) => t.status === 'completed')
  },
}))