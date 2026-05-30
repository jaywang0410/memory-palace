import type { UserInterestProfile, BookDisplay, MovieDisplay, SongDisplay } from '../types/interest'

// ===== Content Template Libraries =====

const BOOK_TEMPLATES: Record<string, { title: string; author: string; cover: string }[]> = {
  '钢琴入门': [
    { title: '钢琴基础教程', author: '李民雄', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '流行钢琴速成', author: '约翰·汤普森', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '音乐理论基础', author: '晏成佺', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
  '编程入门': [
    { title: 'JavaScript高级程序设计', author: '马特·弗里斯比', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '代码整洁之道', author: '罗伯特·马丁', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '人月神话', author: '弗雷德里克·布鲁克斯', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
  '摄影教程': [
    { title: '美国纽约摄影学院教材', author: '美国纽约摄影学院', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '摄影的艺术', author: '布鲁斯·巴恩鲍姆', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '论摄影', author: '苏珊·桑塔格', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
  '心理学': [
    { title: '被讨厌的勇气', author: '岸见一郎', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '思考，快与慢', author: '丹尼尔·卡尼曼', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '社会心理学', author: '戴维·迈尔斯', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
  '科幻': [
    { title: '三体', author: '刘慈欣', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '银河帝国', author: '阿西莫夫', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '沙丘', author: '弗兰克·赫伯特', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
  '通用': [
    { title: '人类简史', author: '尤瓦尔·赫拉利', cover: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' },
    { title: '百年孤独', author: '马尔克斯', cover: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { title: '小王子', author: '圣埃克苏佩里', cover: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  ],
}

const MOVIE_TEMPLATES: Record<string, { title: string; genre: string; posterColor: string }> = {
  '阿凡达': { title: '阿凡达', genre: '科幻', posterColor: '#1a3a2f' },
  '星际穿越': { title: '星际穿越', genre: '科幻', posterColor: '#1a1b3a' },
  '千与千寻': { title: '千与千寻', genre: '动画', posterColor: '#2d5016' },
  '布达佩斯大饭店': { title: '布达佩斯大饭店', genre: '剧情', posterColor: '#c45c7a' },
  '肖申克的救赎': { title: '肖申克的救赎', genre: '剧情', posterColor: '#4a3728' },
  '通用': { title: '星际穿越', genre: '科幻', posterColor: '#1a1b3a' },
}

const SONG_TEMPLATES: Record<string, { title: string; artist: string; genre: string }[]> = {
  '周杰伦': [
    { title: '晴天', artist: '周杰伦', genre: '华语流行' },
    { title: '夜曲', artist: '周杰伦', genre: '华语流行' },
    { title: '稻香', artist: '周杰伦', genre: '华语流行' },
  ],
  '钢琴': [
    { title: '梦中的婚礼', artist: '理查德·克莱德曼', genre: '古典' },
    { title: '卡农', artist: '帕赫贝尔', genre: '古典' },
    { title: '致爱丽丝', artist: '贝多芬', genre: '古典' },
  ],
  '吉他': [
    { title: '平凡之路', artist: '朴树', genre: '民谣' },
    { title: '成都', artist: '赵雷', genre: '民谣' },
    { title: '理想', artist: '赵雷', genre: '民谣' },
  ],
  '通用': [
    { title: 'Blinding Lights', artist: 'The Weeknd', genre: '流行' },
    { title: 'Don\'t Stop Me Now', artist: 'Queen', genre: '摇滚' },
    { title: 'Tadow', artist: 'Masego & FKJ', genre: '爵士' },
  ],
}

// ===== Generators =====

export function generateBookContent(profile: UserInterestProfile): BookDisplay[] {
  const books: BookDisplay[] = []

  // Book 1: Direct interest match
  const primaryBook = profile.books[0]
  if (primaryBook?.topic && BOOK_TEMPLATES[primaryBook.topic]) {
    const template = BOOK_TEMPLATES[primaryBook.topic][0]
    books.push({
      ...template,
      reason: '你最近提到的',
    })
  } else {
    const template = BOOK_TEMPLATES['通用'][0]
    books.push({
      ...template,
      reason: '推荐阅读',
    })
  }

  // Book 2: Related extension
  if (primaryBook?.topic && BOOK_TEMPLATES[primaryBook.topic]) {
    const template = BOOK_TEMPLATES[primaryBook.topic][1]
    books.push({
      ...template,
      reason: '延伸阅读',
    })
  } else {
    const template = BOOK_TEMPLATES['通用'][1]
    books.push({
      ...template,
      reason: '延伸阅读',
    })
  }

  // Book 3: Cross-interest recommendation
  const hobby = profile.hobbies[0]
  const crossTopic = hobby?.name === '看电影' ? '科幻' : '通用'
  const template = BOOK_TEMPLATES[crossTopic]?.[2] || BOOK_TEMPLATES['通用'][2]
  books.push({
    ...template,
    reason: '换个心情',
  })

  return books
}

export function generateMovieContent(profile: UserInterestProfile): MovieDisplay {
  const primaryMovie = profile.movies[0]
  const movieName = primaryMovie?.name || '通用'

  const template = MOVIE_TEMPLATES[movieName] || MOVIE_TEMPLATES['通用']

  // Determine status based on confidence
  const status: 'watching' | 'finished' | 'want_to_watch' =
    primaryMovie?.confidence === 1.0 ? 'watching' : 'want_to_watch'

  const progress = status === 'want_to_watch' ? 0 : status === 'watching' ? 65 : 100

  return {
    title: template.title,
    genre: template.genre,
    status,
    progress,
    posterColor: template.posterColor,
  }
}

export function generateSongContent(profile: UserInterestProfile): SongDisplay[] {
  const songs: SongDisplay[] = []

  // Song 1: Direct interest match
  const primaryMusic = profile.music[0]
  const musicName = primaryMusic?.name || '通用'
  const templates = SONG_TEMPLATES[musicName] || SONG_TEMPLATES['通用']
  songs.push({
    ...templates[0],
    reason: '你最近喜欢的',
  })

  // Song 2: Same genre recommendation
  songs.push({
    ...templates[1],
    reason: '同风格推荐',
  })

  // Song 3: Cross recommendation
  const crossTemplates = primaryMusic?.instrument === '钢琴'
    ? SONG_TEMPLATES['钢琴']
    : SONG_TEMPLATES['通用']
  songs.push({
    ...crossTemplates[2],
    reason: '场景搭配',
  })

  return songs
}
