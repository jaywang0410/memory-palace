export interface InterestItem {
  name: string
  confidence: number
  source: 'mentioned' | 'inferred'
}

export interface MovieInterest extends InterestItem {
  type?: string
}

export interface MusicInterest extends InterestItem {
  genre?: string
  artist?: string
  instrument?: string
}

export interface BookInterest extends InterestItem {
  topic?: string
  title?: string
}

export interface UserInterestProfile {
  movies: MovieInterest[]
  music: MusicInterest[]
  books: BookInterest[]
  hobbies: InterestItem[]
  mood: string
  lastUpdated: number
}

export interface BookDisplay {
  title: string
  author: string
  cover: string
  reason: string
}

export interface MovieDisplay {
  title: string
  genre: string
  status: 'watching' | 'finished' | 'want_to_watch'
  progress: number
  posterColor: string
}

export interface SongDisplay {
  title: string
  artist: string
  genre: string
  reason: string
}
