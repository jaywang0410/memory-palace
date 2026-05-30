import { create } from 'zustand'
import type { UserInterestProfile, BookDisplay, MovieDisplay, SongDisplay } from '../types/interest'
import { generateBookContent, generateMovieContent, generateSongContent } from '../utils/furnitureContentGenerators'

interface InterestState {
  profile: UserInterestProfile
  furnitureContent: {
    books: BookDisplay[]
    movie: MovieDisplay
    songs: SongDisplay[]
  }

  // Simulate extracting interests from dialogue (will be replaced by real LLM call)
  updateFromDialogue: (dialogue: string) => void
  refreshFurnitureContent: () => void
}

const DEFAULT_PROFILE: UserInterestProfile = {
  movies: [
    { name: '科幻', confidence: 0.8, source: 'inferred', type: '科幻' },
  ],
  music: [
    { name: '华语流行', confidence: 0.9, source: 'inferred', genre: '华语流行' },
  ],
  books: [
    { name: '心理学', confidence: 0.7, source: 'inferred', topic: '心理学' },
  ],
  hobbies: [
    { name: '看电影', confidence: 0.8, source: 'inferred' },
    { name: '听音乐', confidence: 0.9, source: 'inferred' },
  ],
  mood: '平静',
  lastUpdated: Date.now(),
}

export const useInterestStore = create<InterestState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  furnitureContent: {
    books: generateBookContent(DEFAULT_PROFILE),
    movie: generateMovieContent(DEFAULT_PROFILE),
    songs: generateSongContent(DEFAULT_PROFILE),
  },

  updateFromDialogue: (dialogue: string) => {
    const currentProfile = get().profile

    // Simulate interest extraction from dialogue keywords
    const newProfile = extractInterestsFromDialogue(dialogue, currentProfile)

    set({
      profile: newProfile,
      furnitureContent: {
        books: generateBookContent(newProfile),
        movie: generateMovieContent(newProfile),
        songs: generateSongContent(newProfile),
      },
    })
  },

  refreshFurnitureContent: () => {
    const { profile } = get()
    set({
      furnitureContent: {
        books: generateBookContent(profile),
        movie: generateMovieContent(profile),
        songs: generateSongContent(profile),
      },
    })
  },
}))

function extractInterestsFromDialogue(dialogue: string, current: UserInterestProfile): UserInterestProfile {
  const lower = dialogue.toLowerCase()
  const newProfile: UserInterestProfile = {
    movies: [...current.movies],
    music: [...current.music],
    books: [...current.books],
    hobbies: [...current.hobbies],
    mood: current.mood,
    lastUpdated: Date.now(),
  }

  // Movie extraction
  if (lower.includes('电影') || lower.includes('看')) {
    const moviePatterns = [
      { name: '阿凡达', type: '科幻' },
      { name: '星际穿越', type: '科幻' },
      { name: '千与千寻', type: '动画' },
      { name: '布达佩斯大饭店', type: '剧情' },
    ]
    for (const p of moviePatterns) {
      if (lower.includes(p.name)) {
        newProfile.movies.unshift({
          name: p.name,
          confidence: 1.0,
          source: 'mentioned',
          type: p.type,
        })
        break
      }
    }
  }

  // Music extraction
  if (lower.includes('歌') || lower.includes('音乐') || lower.includes('听')) {
    const musicPatterns = [
      { name: '周杰伦', genre: '华语流行' },
      { name: '钢琴', genre: '古典', instrument: '钢琴' },
      { name: '吉他', genre: '民谣', instrument: '吉他' },
    ]
    for (const p of musicPatterns) {
      if (lower.includes(p.name)) {
        newProfile.music.unshift({
          name: p.name,
          confidence: 1.0,
          source: 'mentioned',
          genre: p.genre,
          instrument: p.instrument,
        })
        break
      }
    }
  }

  // Book extraction
  if (lower.includes('书') || lower.includes('学') || lower.includes('读')) {
    const bookPatterns = [
      { name: '钢琴', topic: '钢琴入门' },
      { name: '编程', topic: '编程入门' },
      { name: '摄影', topic: '摄影教程' },
      { name: '心理学', topic: '心理学' },
    ]
    for (const p of bookPatterns) {
      if (lower.includes(p.name)) {
        newProfile.books.unshift({
          name: p.name,
          confidence: 1.0,
          source: 'mentioned',
          topic: p.topic,
        })
        break
      }
    }
  }

  return newProfile
}
