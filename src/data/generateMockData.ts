import type { MemoryCard, EmotionType, MemoryCategory, MemoryStatus, StarRegion } from '../types/memory'

const TAG_POOL = ['家庭', '工作', '旅行', '美食', '电影', '音乐', '宠物', '朋友', '健康', '学习']

const EMOTION_TYPES: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'neutral']

const DAILY_CONTENTS: string[] = [
  '早上喝了一杯热豆浆，感觉整个人都暖了起来',
  '今天上班路上遇到了一只橘猫，它蹭了蹭我的裤腿',
  '中午和同事一起去吃了新开的拉面店，汤头很浓郁',
  '下班的时候天还亮着，心情也跟着明亮起来',
  '晚上煮了一锅番茄鸡蛋面，虽然简单但很满足',
  '周末去公园散步，看到了盛开的樱花',
  '今天整理了一下书桌，发现了很多旧照片',
  '早晨的咖啡香气弥漫在整个房间里',
  '下班后在便利店买了一盒草莓，甜得让人开心',
  '今天学会了做一道新菜，虽然卖相一般但味道不错',
  '晚上躺在床上听雨声，感觉特别宁静',
  '今天把冬天的衣服收了起来，衣柜变得清爽了',
  '路过花店的时候买了一束向日葵',
  '今天的工作效率很高，提前完成了任务',
  '晚上看了一部老电影，剧情依然让人感动',
  '周末去爬山，山顶的风景让人心旷神怡',
  '今天帮邻居收了快递，收到了她的感谢',
  '早晨的阳光透过窗帘洒在被子上',
  '今天尝试了新的咖啡口味，意外地好喝',
  '晚上和朋友视频聊天，笑声不断',
  '今天把家里的绿植都浇了水，看着它们生机勃勃的样子',
  '下班路上买了刚出炉的面包，香味一路陪伴',
  '今天读了一本好书，沉浸在故事里忘记了时间',
  '周末去菜市场买菜，和摊主聊了会儿天',
  '今天换了新的床单，晚上睡得很香',
  '早晨跑步的时候看到了日出，金色的光芒很美',
  '今天把攒了很久的衣服都洗了，阳台晒满了',
  '晚上做了瑜伽，身体感觉轻松了很多',
  '今天收到了快递，是期待已久的书',
  '周末去图书馆待了一下午，很安静很充实',
  '今天给远方的家人打了电话，聊了很长时间',
  '下班后在路边摊买了烤红薯，热乎乎的',
  '今天整理了手机相册，翻出了很多回忆',
  '晚上做了面膜，好好犒劳了一下自己',
  '今天天气很好，把被子拿出去晒了',
  '周末去看了画展，有些作品让人深思',
  '今天学会了新的Excel技巧，工作效率提升了',
  '晚上煮了红枣银耳汤，滋补又美味',
  '今天帮同事解决了一个问题，很有成就感',
  '早晨在地铁站听到了一首喜欢的歌',
  '今天把家里的旧物整理出来准备捐赠',
  '周末去郊外野餐，风很温柔',
  '今天尝试了新的发型，同事们都说好看',
  '晚上做了蛋挞，虽然形状不太规则但很好吃',
  '今天在公司楼下的咖啡店坐了一会儿',
  '下班路上看到了晚霞，粉红色的天空很美',
  '今天把冬天的被子换成了薄被',
  '周末去逛了宜家，买了几个收纳盒',
  '今天给植物换了盆，希望它们长得更好',
  '晚上做了红烧排骨，香气飘满了整个楼道',
  '今天收到了朋友从外地寄来的特产',
  '早晨在楼下早餐店吃了热干面',
  '今天把电脑桌面整理得井井有条',
  '周末去游泳馆游了泳，身体感觉很舒展',
  '今天在网上学了一道甜品，打算周末试试',
  '晚上窝在沙发里看综艺，笑到肚子疼',
  '今天把换季的衣服都整理好了',
  '下班后在书店逛了一会儿，买了两本新书',
  '今天天气凉爽，穿了一件喜欢的毛衣',
  '周末去植物园，看到了很多奇花异草',
  '今天给手机换了一张新的壁纸，心情也变好了',
  '晚上做了清蒸鱼，鱼肉鲜嫩可口',
  '今天在公司吃了下午茶，蛋糕很美味',
  '早晨听到了鸟叫声，感觉春天真的来了',
  '今天把家里打扫了一遍，窗明几净',
  '周末去看了话剧，演员的表演很精彩',
  '今天在网上订了一盆多肉植物',
  '晚上做了手工，做了一个小挂件',
  '今天帮妈妈在网上买了她需要的东西',
  '下班后在公园里坐了半小时，看着人来人往',
  '今天把闲置的物品挂到了二手平台',
  '周末去吃了火锅，辣得很过瘾',
  '今天学会了折纸鹤，折了一串挂在窗边',
  '晚上做了南瓜粥，香甜软糯',
  '今天在公司完成了一个重要的汇报',
  '早晨在阳台浇花的时候看到了蝴蝶',
  '今天把冬天的靴子都擦干净了收起来',
  '周末去博物馆参观，了解了很多历史',
  '今天在网上看了一个教程，学会了新的技能',
  '晚上做了可乐鸡翅，孩子们很喜欢',
  '今天收到了信用卡积分兑换的礼物',
  '下班后在商场逛了一圈，什么也没买但很放松',
  '今天把家里的灯泡都换成了暖色调',
  '周末去钓鱼，虽然没钓到但心情很好',
  '今天给冰箱做了一次大扫除',
  '晚上做了水果沙拉，清爽又健康',
  '今天在公司得到了领导的表扬',
  '早晨在地铁上读完了小说的最后一章',
  '今天把窗帘拆下来洗了，阳光照进来更明亮',
  '周末去爬山，在山顶吃了自带的便当',
  '今天在网上买了新的四件套，图案很可爱',
  '晚上做了麻婆豆腐，配米饭绝了',
  '今天把旧书整理出来捐给了社区图书馆',
  '下班后在路边买了糖炒栗子，香甜可口',
  '今天天气晴朗，把鞋子都拿出去晒了',
  '周末去听了音乐会，现场的感觉很震撼',
  '今天学会了用新的APP管理时间',
  '晚上做了紫菜蛋花汤，简单暖胃',
  '今天帮朋友参谋了一下装修方案',
  '早晨在公园打太极，遇到了志同道合的朋友',
]

const EMOTIONAL_CONTENTS: string[] = [
  '那天在车站送别，看着火车慢慢驶离，眼泪止不住地流',
  '收到录取通知的那一刻，激动得双手颤抖',
  '第一次站在舞台上，聚光灯打在身上，紧张又兴奋',
  '外婆离开的那个晚上，整个世界都安静了',
  '和最好的朋友大吵一架，说了很伤人的话，后悔至今',
  '求婚成功的那一刻，感觉拥有了全世界',
  '得知亲人病重的消息，在医院走廊里坐了一整夜',
  '孩子第一次叫妈妈的时候，心都融化了',
  '失业的那天，在公园里坐了很久，不知道未来在哪里',
  '多年未见的老友突然出现在面前，惊喜得说不出话',
  '第一次独自旅行，在陌生的城市里既害怕又自由',
  '被信任的人背叛，那种痛比想象中更难承受',
  '终于还清房贷的那天，感觉肩上卸下了一座山',
  '在急诊室外等待的时候，第一次感到生命的脆弱',
  '养了三年的宠物走丢了，找了整整一周',
  '拿到驾照的那天，觉得自己终于长大了',
  '和初恋分手的那个雨夜，在街头走了很久',
  '第一次出国，语言不通但遇到了很多热心的人',
  '得知自己获奖的消息，第一时间想分享给已故的爷爷',
  '在产房外等待的时候，每一秒都像一年那么长',
  '看到父母白发的时候，突然意识到他们在变老',
  '第一次创业失败，躲在出租屋里哭了很久',
  '在演唱会现场听到偶像唱最喜欢的歌，全场大合唱',
  '收到前任婚礼请柬的时候，心情复杂得说不出话',
  '第一次跳伞，从飞机上跳下去的那一刻大脑一片空白',
  '在医院听到宝宝第一声啼哭，眼泪瞬间涌出',
  '和多年心结和解的那天，感觉心里的一块石头落地了',
  '第一次带父母出国旅行，看到他们像孩子一样开心',
  '在葬礼上致辞，说到一半哽咽得说不出话',
  '买到第一套房拿到钥匙的时候，在空房间里坐了很久',
]

const CORE_CONTENTS: string[] = [
  '第一次意识到，原来父母也会老，也会需要我',
  '明白了幸福不是拥有很多，而是懂得珍惜已有的',
  '学会了原谅不是为了别人，而是放过自己',
  '懂得了真正的勇敢不是不害怕，而是害怕也要前行',
  '明白了人生最重要的不是目的地，而是沿途的风景',
  '学会了在孤独中找到平静，在安静中听见自己',
  '懂得了爱不是占有，而是让对方成为更好的自己',
  '明白了失败不是终点，放弃才是',
]

const FORGOTTEN_CONTENTS: string[] = [
  '那天好像去了什么地方，但具体是哪里想不起来了',
  '记得小时候有一件很重要的事，但怎么也想不起细节',
  '某个夏天发生了一件事，只记得当时很热',
  '好像和某人有过约定，但对方是谁已经模糊了',
  '记得曾经很喜欢一首歌，但现在连旋律都忘了',
  '某次旅行中去了一个小镇，名字已经记不清了',
  '小时候有一个很要好的朋友，现在连名字都想不起来',
  '记得曾经读过一本很感人的书，但内容全忘了',
  '某个冬天发生了一件温暖的事，只记得当时在下雪',
  '好像曾经养过一只小动物，但记不清是什么了',
  '记得有一次考试考得很好，但具体是哪一科忘了',
  '某个节日收到了一份礼物，但送礼的人想不起来了',
  '小时候去过一个地方，只记得那里有很多树',
  '记得曾经学过一项技能，但现在完全不会了',
  '某次聚会上有人说了一句很重要的话，但内容忘了',
  '记得曾经有一个梦想，但现在想不起是什么了',
  '某个雨天发生了一件事，只记得当时心情很平静',
  '好像曾经写过一篇日记，但写了什么完全没印象',
  '记得有一次和家人一起做饭，但做了什么菜忘了',
  '某个晚上看到了很美的星空，但具体在哪里看的忘了',
]

const AI_NOTES: string[] = [
  '这段记忆带着温暖的气息',
  '听起来是个美好的时刻',
  '能感受到当时的心情',
  '这样的日常很珍贵',
  '回忆起来应该会微笑吧',
  '生活中有很多这样的小确幸',
  '这段记忆有着特别的意义',
  '时间会沉淀出这样的美好',
  '平凡的日子里也有光芒',
  '这样的瞬间值得被记住',
  '记忆里的温度依然还在',
  '当时的感受一定很真实',
  '这些细节让回忆变得生动',
  '生活中的点滴都值得珍藏',
  '这段记忆有着独特的色彩',
  '回想起来心里应该是暖暖的',
  '这样的时刻构成了生活的底色',
  '记忆的力量在于它的真实',
  '这些片段串联起了美好的日子',
  '当时的阳光一定很好',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}

function pickRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateId(index: number): string {
  return `mem_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`
}

function getRegionForIndex(index: number, total: number): StarRegion {
  const coreCount = Math.max(5, Math.min(7, Math.round(total * 0.02)))
  const forgottenCount = Math.max(15, Math.min(30, Math.round(total * 0.08)))
  const emotionCount = Math.max(20, Math.min(40, Math.round(total * 0.12)))

  if (index < coreCount) return 'core'
  if (index < coreCount + forgottenCount) return 'forgotten'
  if (index < coreCount + forgottenCount + emotionCount) return 'emotion'
  return 'daily'
}

function getContentForRegion(region: StarRegion): string {
  switch (region) {
    case 'core':
      return pickRandom(CORE_CONTENTS)
    case 'emotion':
      return pickRandom(EMOTIONAL_CONTENTS)
    case 'forgotten':
      return pickRandom(FORGOTTEN_CONTENTS)
    case 'daily':
    default:
      return pickRandom(DAILY_CONTENTS)
  }
}

function getImportanceForRegion(region: StarRegion): number {
  switch (region) {
    case 'core':
      return randomInt(80, 100)
    case 'emotion':
      return randomInt(50, 90)
    case 'forgotten':
      return randomInt(0, 30)
    case 'daily':
    default:
      return randomInt(20, 70)
  }
}

function getCategoryForRegion(region: StarRegion): MemoryCategory {
  switch (region) {
    case 'core':
      return 'ritual'
    case 'emotion':
      return 'emotional_peak'
    case 'forgotten':
      return 'daily'
    case 'daily':
    default:
      return pickRandom(['first_disclosure', 'daily'] as MemoryCategory[])
  }
}

function getStatusForRegion(region: StarRegion): MemoryStatus {
  switch (region) {
    case 'forgotten':
      return 'forgotten'
    case 'core':
      return 'active'
    case 'emotion':
      return pickRandom(['active', 'archived'] as MemoryStatus[])
    case 'daily':
    default:
      return pickRandom(['active', 'archived'] as MemoryStatus[])
  }
}

function getEmotionForRegion(region: StarRegion): EmotionType {
  switch (region) {
    case 'core':
      return pickRandom(['joy', 'neutral'] as EmotionType[])
    case 'emotion':
      return pickRandom(['joy', 'sadness', 'anger', 'fear'] as EmotionType[])
    case 'forgotten':
      return 'neutral'
    case 'daily':
    default:
      return pickRandom(EMOTION_TYPES)
  }
}

export function generateMockMemories(count: number): MemoryCard[] {
  const now = Date.now()
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000
  const memories: MemoryCard[] = []

  for (let i = 0; i < count; i++) {
    const region = getRegionForIndex(i, count)
    const content = getContentForRegion(region)
    const importanceScore = getImportanceForRegion(region)
    const category = getCategoryForRegion(region)
    const status = getStatusForRegion(region)
    const emotionTag = getEmotionForRegion(region)
    const timestamp = randomInt(oneYearAgo, now)
    const lastTouched = randomInt(timestamp, now)

    const memory: MemoryCard = {
      id: generateId(i),
      timestamp,
      content,
      emotionTag,
      importanceScore,
      category,
      relatedMemoryIds: [],
      tags: pickRandomSubset(TAG_POOL, randomInt(1, 3)),
      aiNote: pickRandom(AI_NOTES),
      status,
      region,
      lastTouched,
    }

    memories.push(memory)
  }

  // Assign relatedMemoryIds after all memories are created
  const dailyAndEmotionIndices = memories
    .map((m, i) => ({ index: i, region: m.region }))
    .filter(item => item.region === 'daily' || item.region === 'emotion')
    .map(item => item.index)

  for (let i = 0; i < memories.length; i++) {
    const memory = memories[i]
    if (memory.region === 'daily' || memory.region === 'emotion') {
      const possibleRelated = dailyAndEmotionIndices.filter(idx => idx !== i)
      if (possibleRelated.length > 0 && Math.random() < 0.3) {
        const relatedCount = randomInt(1, Math.min(3, possibleRelated.length))
        const related = pickRandomSubset(
          possibleRelated.map(idx => memories[idx].id),
          relatedCount
        )
        memory.relatedMemoryIds = related
      }
    }
  }

  return memories
}

export function getRegionDistribution(memories: MemoryCard[]): Record<StarRegion, number> {
  const dist: Record<string, number> = {
    core: 0,
    daily: 0,
    emotion: 0,
    forgotten: 0,
    imagination: 0,
  }

  for (const memory of memories) {
    dist[memory.region] = (dist[memory.region] || 0) + 1
  }

  return dist as Record<StarRegion, number>
}
