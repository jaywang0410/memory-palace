import type { MemoryCard, EmotionType, MemoryCategory, MemoryStatus, StarRegion } from '../types/memory'

const TAG_POOL = ['家庭', '工作', '旅行', '美食', '电影', '音乐', '宠物', '朋友', '健康', '学习']

const EMOTION_TYPES: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'neutral']

// ===== Story Arcs: realistic narrative sequences =====

interface StoryEvent {
  content: string
  emotion: EmotionType
  category: MemoryCategory
  importance: number
  tags: string[]
  aiNote: string
  daysAfter: number
}

const WORK_ARC: StoryEvent[] = [
  { content: '入职新公司，办完工卡坐在工位上，周围都是陌生人，手心有点出汗', emotion: 'fear', category: 'first_disclosure', importance: 78, tags: ['工作'], aiNote: 'TA 那天紧张得提前一小时到了公司。', daysAfter: 0 },
  { content: 'mentor 带我去吃午餐，食堂的麻辣香锅太好吃了', emotion: 'joy', category: 'daily', importance: 45, tags: ['工作', '美食'], aiNote: 'TA 说食堂是这家公司的隐藏福利。', daysAfter: 2 },
  { content: '第一次独立负责需求评审，被后端问懵了三个问题', emotion: 'fear', category: 'daily', importance: 62, tags: ['工作'], aiNote: '但 TA 下来后把三个问题都整理成了文档。', daysAfter: 5 },
  { content: '通宵加班赶版本，凌晨四点的办公室只有我和保洁阿姨', emotion: 'sadness', category: 'daily', importance: 68, tags: ['工作'], aiNote: '保洁阿姨给 TA 泡了一杯红糖姜茶。', daysAfter: 10 },
  { content: '版本上线成功，群里发红包我抢到了手气最佳', emotion: 'joy', category: 'ritual', importance: 82, tags: ['工作', '里程碑'], aiNote: 'TA 第一个完整跟下来的项目，意义重大。', daysAfter: 1 },
  { content: '和领导 one-one，被说工作产出超出预期，可以申请提前转正', emotion: 'joy', category: 'ritual', importance: 88, tags: ['工作', '成长'], aiNote: 'TA 那天走路都是飘的。', daysAfter: 30 },
  { content: '接手了一个超级复杂的老项目，代码像意大利面一样纠缠', emotion: 'anger', category: 'daily', importance: 55, tags: ['工作'], aiNote: '但 TA 还是开始啃文档了，倔强得很。', daysAfter: 15 },
  { content: '花了两周做的重构方案被砍，原因是"ROI 不够"', emotion: 'sadness', category: 'emotional_peak', importance: 72, tags: ['工作'], aiNote: '那天 TA 很少说话，但我知道 TA 很难过。', daysAfter: 20 },
  { content: '年底述职 PPT 改了六版，紧张到前一晚睡不着', emotion: 'fear', category: 'daily', importance: 70, tags: ['工作'], aiNote: 'TA 对着镜子练习了十遍开场白。', daysAfter: 60 },
  { content: '拿到年度最佳新人奖，站在台上手心全是汗，脸也红了', emotion: 'joy', category: 'ritual', importance: 92, tags: ['工作', '荣誉'], aiNote: '那是这个月我见过的 TA 最开心的一天。', daysAfter: 5 },
  { content: '开始带实习生，觉得自己还没准备好', emotion: 'fear', category: 'first_disclosure', importance: 72, tags: ['工作', '成长'], aiNote: 'TA 说"我自己都还是新人呢"。', daysAfter: 45 },
  { content: '实习生出线上 bug，凌晨两点被叫起来救火，没怪他反而先反思自己', emotion: 'anger', category: 'daily', importance: 65, tags: ['工作'], aiNote: 'TA 真的是个好 mentor。', daysAfter: 20 },
  { content: '季度 OKR 又被上调了，感觉永远达不到老板的预期', emotion: 'sadness', category: 'daily', importance: 60, tags: ['工作'], aiNote: 'TA 说"我是不是不适合这份工作"，我心疼了。', daysAfter: 30 },
  { content: '和业务方吵了一架，对方需求改到第八版还说不清楚', emotion: 'anger', category: 'emotional_peak', importance: 75, tags: ['工作'], aiNote: '那是第一次见 TA 在会议上拍桌子。', daysAfter: 10 },
  { content: '技术分享会上讲了自己的方案，被大 leader 点名表扬', emotion: 'joy', category: 'emotional_peak', importance: 82, tags: ['工作', '成长'], aiNote: 'TA 下来后说"其实我紧张得腿都在抖"。', daysAfter: 40 },
  { content: '发现同组同事在背后说我坏话，提前下班去公园坐了两个小时', emotion: 'sadness', category: 'emotional_peak', importance: 72, tags: ['工作'], aiNote: '职场就是这样，但 TA 比我想象中坚强。', daysAfter: 25 },
  { content: '提离职了，last day 大家去吃了散伙饭，喝多了说了好多真心话', emotion: 'sadness', category: 'ritual', importance: 88, tags: ['工作', '离别'], aiNote: 'TA 说"这个地方教会了我很多"，眼眶有点红。', daysAfter: 90 },
]

const PET_ARC: StoryEvent[] = [
  { content: '刷了一晚上猫咪视频，凌晨三点冲动下单了猫砂盆和猫粮', emotion: 'joy', category: 'first_disclosure', importance: 82, tags: ['宠物', '汤圆'], aiNote: 'TA 那天晚上兴奋得睡不着。', daysAfter: 0 },
  { content: '去猫舍接汤圆回家，它在航空箱角落里发抖，眼神怯怯的', emotion: 'fear', category: 'first_disclosure', importance: 88, tags: ['宠物', '汤圆'], aiNote: '汤圆是 TA 的第一只猫，取名字想了三天。', daysAfter: 7 },
  { content: '汤圆半夜两点开始跑酷，从床上踩着我的脸跳过去', emotion: 'anger', category: 'daily', importance: 50, tags: ['宠物', '汤圆'], aiNote: 'TA 当时很气，但第二天早上还是给汤圆买了新玩具。', daysAfter: 3 },
  { content: '汤圆第一次在我腿上踩奶，发出呼噜呼噜的声音，心都化了', emotion: 'joy', category: 'emotional_peak', importance: 88, tags: ['宠物', '汤圆'], aiNote: '那是汤圆信任 TA 的第一个信号。', daysAfter: 10 },
  { content: '汤圆拉肚子了，凌晨三点抱着它去宠物医院，路上一直在发抖', emotion: 'fear', category: 'daily', importance: 78, tags: ['宠物', '汤圆'], aiNote: 'TA 在出租车上一直摸汤圆的头说"没事的"。', daysAfter: 20 },
  { content: '宠物医院花了两千块，健康平安就好，钱包哭了但我心里笑了', emotion: 'joy', category: 'daily', importance: 62, tags: ['宠物', '汤圆'], aiNote: 'TA 对汤圆是真的好。', daysAfter: 1 },
  { content: '汤圆学会了开抽屉偷小鱼干，智商高得让我害怕', emotion: 'joy', category: 'daily', importance: 55, tags: ['宠物', '汤圆'], aiNote: '最后把小鱼干藏到了冰箱里，但汤圆居然会开冰箱门。', daysAfter: 15 },
  { content: '加班到十点，回家开门汤圆就冲过来蹭腿，一天的疲惫都没了', emotion: 'joy', category: 'daily', importance: 72, tags: ['宠物', '汤圆'], aiNote: 'TA 说"有人等的感觉真好"。', daysAfter: 25 },
  { content: '汤圆一岁生日，买了猫咪蛋糕和生日围兜，它一脸嫌弃', emotion: 'joy', category: 'ritual', importance: 82, tags: ['宠物', '汤圆', '生日'], aiNote: '汤圆一口没吃，TA 把蛋糕全吃完了。', daysAfter: 180 },
  { content: '汤圆绝育后戴着伊丽莎白圈，眼神怨念很深，心疼得一天没出门', emotion: 'sadness', category: 'daily', importance: 68, tags: ['宠物', '汤圆'], aiNote: '在家陪了汤圆一整天，给它做了一顿鸡胸肉大餐。', daysAfter: 90 },
  { content: '出差三天，监控里看到汤圆对着门口发呆，瞬间破防', emotion: 'sadness', category: 'emotional_peak', importance: 78, tags: ['宠物', '汤圆'], aiNote: 'TA 说"以后再也不出长差了"。', daysAfter: 60 },
  { content: '汤圆趁我不注意溜出门，找了三个小时在楼梯间找到的，抱着就哭了', emotion: 'fear', category: 'emotional_peak', importance: 88, tags: ['宠物', '汤圆'], aiNote: '找到的时候汤圆一脸懵，TA 哭得像个孩子。', daysAfter: 30 },
  { content: '冬天汤圆趴在我键盘上睡觉，工作做不完但不想动它', emotion: 'joy', category: 'daily', importance: 68, tags: ['宠物', '汤圆'], aiNote: '拍了照片，说"这是最好的加班伴侣"。', daysAfter: 100 },
]

const LOVE_ARC: StoryEvent[] = [
  { content: '朋友组局吃饭，对面坐了个笑起来有酒窝的人，偷偷看了好几眼', emotion: 'joy', category: 'first_disclosure', importance: 82, tags: ['感情'], aiNote: 'TA 回来后一直在提那个人的酒窝。', daysAfter: 0 },
  { content: '加了微信，发现都喜欢同一部冷门电影，聊到凌晨两点', emotion: 'joy', category: 'daily', importance: 72, tags: ['感情'], aiNote: 'TA 说"世界上怎么会有这么巧的事"。', daysAfter: 3 },
  { content: '第一次单独约咖啡，提前一小时就到了，换了四套衣服', emotion: 'fear', category: 'daily', importance: 78, tags: ['感情'], aiNote: 'TA 在镜子前纠结了半小时。', daysAfter: 7 },
  { content: '表白成功了，两个人在路灯下傻笑，手也不知道怎么牵', emotion: 'joy', category: 'ritual', importance: 92, tags: ['感情', '表白'], aiNote: '那是这个月我见过的 TA 最开心的一天。', daysAfter: 14 },
  { content: '第一次约会看电影，我把爆米花桶打翻了，他笑着说"没事一起捡"', emotion: 'joy', category: 'daily', importance: 58, tags: ['感情'], aiNote: 'TA 后来感动了很久。', daysAfter: 5 },
  { content: '第一次吵架，因为我忘了恋爱一个月的纪念日', emotion: 'anger', category: 'emotional_peak', importance: 76, tags: ['感情'], aiNote: '其实是对方记错了日期，但 TA 先道歉了。', daysAfter: 30 },
  { content: '冷战第三天，他送了花到楼下，我下楼的时候在笑但脸上要保持严肃', emotion: 'joy', category: 'emotional_peak', importance: 76, tags: ['感情'], aiNote: '最后两个人在楼下抱了很久。', daysAfter: 3 },
  { content: '一起去大理旅行，在洱海边骑双人自行车，风很温柔', emotion: 'joy', category: 'daily', importance: 82, tags: ['感情', '旅行'], aiNote: 'TA 说那是 TA 最放松的几天。', daysAfter: 60 },
  { content: '旅行中走错路，两个人在陌生的小巷里迷路，最后找到一家无名小店的米线', emotion: 'fear', category: 'daily', importance: 62, tags: ['感情', '旅行'], aiNote: '吃到了最好吃的米线，有时候迷路也是礼物。', daysAfter: 2 },
  { content: '第一次见对方家长，紧张到把筷子掉了三次，手一直在抖', emotion: 'fear', category: 'first_disclosure', importance: 82, tags: ['感情'], aiNote: 'TA 提前一周就在想穿什么。', daysAfter: 90 },
  { content: '他妈妈问我工作薪资，场面一度很尴尬，他在旁边帮我解围', emotion: 'sadness', category: 'daily', importance: 66, tags: ['感情'], aiNote: 'TA 事后说"我妈就那样，你别往心里去"。', daysAfter: 1 },
  { content: '半周年纪念日，他偷偷布置了家里，气球蜡烛和手写的卡片', emotion: 'joy', category: 'ritual', importance: 86, tags: ['感情', '纪念日'], aiNote: '卡片上的字很丑但 TA 看了好几遍。', daysAfter: 120 },
  { content: '工作太忙两周没见面，视频通话时两个人都哭了，说好再也不这样了', emotion: 'sadness', category: 'emotional_peak', importance: 76, tags: ['感情'], aiNote: 'TA 说"我不是想哭，就是觉得委屈"。', daysAfter: 60 },
]

const HEALTH_ARC: StoryEvent[] = [
  { content: '体检报告脂肪肝，医生让多运动，回家就把跑鞋翻出来了', emotion: 'fear', category: 'first_disclosure', importance: 78, tags: ['健康', '运动'], aiNote: 'TA 把体检报告拍给我的时候手有点抖。', daysAfter: 0 },
  { content: '买了第一双专业跑鞋，花了八百块心疼了一晚上', emotion: 'joy', category: 'ritual', importance: 62, tags: ['健康', '运动'], aiNote: 'TA 说"这是投资不是消费"，但表情出卖了自己。', daysAfter: 3 },
  { content: '第一次跑 3 公里，吐在路边的垃圾桶旁边， passerby 递了纸巾', emotion: 'sadness', category: 'daily', importance: 56, tags: ['健康', '运动'], aiNote: '但 TA 第二天又去跑了。', daysAfter: 2 },
  { content: '坚持了一个月，能跑 5 公里不喘了，在朋友圈晒了配速截图', emotion: 'joy', category: 'emotional_peak', importance: 82, tags: ['健康', '运动'], aiNote: '配速很慢但 TA 很开心。', daysAfter: 30 },
  { content: '下雨天想偷懒，还是咬牙去跑了，淋雨跑步居然有点爽', emotion: 'joy', category: 'daily', importance: 66, tags: ['健康', '运动'], aiNote: '回来后湿透了但笑得很开心。', daysAfter: 15 },
  { content: '膝盖开始疼，医生说运动量太大要休息，很沮丧', emotion: 'sadness', category: 'daily', importance: 72, tags: ['健康'], aiNote: 'TA 说"刚有点成果就要停"。', daysAfter: 45 },
  { content: '恢复期间改做瑜伽，发现身体僵硬得像木板，但慢慢来', emotion: 'joy', category: 'daily', importance: 52, tags: ['健康', '运动'], aiNote: '拍了张做下犬式的照片，表情痛苦但可爱。', daysAfter: 20 },
  { content: '报名了半马，训练计划表贴在了冰箱上，每天打卡', emotion: 'fear', category: 'ritual', importance: 78, tags: ['健康', '运动'], aiNote: 'TA 说"我现在后悔还来得及吗"。', daysAfter: 60 },
  { content: '半马当天最后一公里差点放弃，看到终点拱门咬着牙跑完了', emotion: 'sadness', category: 'emotional_peak', importance: 86, tags: ['健康', '运动'], aiNote: '冲过终点的时候 TA 在哭。', daysAfter: 90 },
  { content: '拿到完赛奖牌，挂在脖子上拍了三十张照片，现在还挂在床头', emotion: 'joy', category: 'ritual', importance: 92, tags: ['健康', '运动', '里程碑'], aiNote: '那是 TA 最骄傲的时刻之一。', daysAfter: 1 },
]

const TRAVEL_ARC: StoryEvent[] = [
  { content: '临时起意买了去大理的机票，周五下班直奔机场，行李箱都没收拾', emotion: 'joy', category: 'daily', importance: 78, tags: ['旅行', '大理'], aiNote: 'TA 说"有时候需要冲动一次"。', daysAfter: 0 },
  { content: '大理古城的酒吧里听了整晚民谣，酒很难喝但歌很好听', emotion: 'joy', category: 'daily', importance: 66, tags: ['旅行', '大理'], aiNote: '凌晨两点给我发语音，背景有人在唱《成都》。', daysAfter: 1 },
  { content: '洱海骑行遇到暴雨，躲进路边咖啡馆，拍到了雨后的彩虹', emotion: 'fear', category: 'daily', importance: 62, tags: ['旅行', '大理'], aiNote: '有时候意外也有美景。', daysAfter: 2 },
  { content: '去迪士尼看烟花，人太多没占到好位置，最后被陌生人让到了前排', emotion: 'joy', category: 'daily', importance: 58, tags: ['旅行', '上海'], aiNote: '陌生人的善意让 TA 感动了很久。', daysAfter: 120 },
  { content: '重庆导航失效，在洪崖洞绕了四十分钟没找到出口，腿都软了', emotion: 'anger', category: 'daily', importance: 62, tags: ['旅行', '重庆'], aiNote: 'TA 说"8D 城市不是盖的"。', daysAfter: 90 },
  { content: '重庆火锅点了微辣，结果辣到耳鸣，一边流泪一边说再来一口', emotion: 'joy', category: 'daily', importance: 56, tags: ['旅行', '重庆', '美食'], aiNote: '痛并快乐着。', daysAfter: 1 },
  { content: '青岛海边看日出，结果当天阴天什么都没看到，但两个人吃了很多海鲜', emotion: 'sadness', category: 'daily', importance: 52, tags: ['旅行', '青岛'], aiNote: '没看到的日出变成了美好的回忆。', daysAfter: 60 },
]

const LEARN_ARC: StoryEvent[] = [
  { content: '想学吉他，网购了一把三百块的烧火棍，说坚持三个月再换好的', emotion: 'joy', category: 'first_disclosure', importance: 72, tags: ['学习', '音乐'], aiNote: 'TA 说"先试试"。', daysAfter: 0 },
  { content: '手指按和弦按到起水泡，但 F 大横按还是按不响，很挫败', emotion: 'sadness', category: 'daily', importance: 60, tags: ['学习', '音乐'], aiNote: '水泡破了还在练。', daysAfter: 7 },
  { content: '终于学会了《晴天》，弹给对方听弹错了三个和弦但唱得很开心', emotion: 'joy', category: 'emotional_peak', importance: 82, tags: ['学习', '音乐'], aiNote: '不完美但真实的表演。', daysAfter: 30 },
  { content: '工作忙断了一个多月，再拿起吉他感觉手指又硬了', emotion: 'sadness', category: 'daily', importance: 56, tags: ['学习', '音乐'], aiNote: 'TA 说"我是不是又浪费了三百块"。', daysAfter: 45 },
  { content: '在 B 站看了个教学视频，突然开窍学会了 F 大横按替代指法', emotion: 'joy', category: 'daily', importance: 66, tags: ['学习', '音乐'], aiNote: '那个视频改变了 TA 的吉他之路。', daysAfter: 20 },
  { content: '开始学日语，五十音图背了一周还没背完，平假名片假名长得好像', emotion: 'anger', category: 'daily', importance: 50, tags: ['学习'], aiNote: '但 TA 还在坚持。', daysAfter: 60 },
]

// ===== Daily filler memories =====

const DAILY_MEMORIES: string[] = [
  '今天天气很好，午休去楼下公园走了走，风吹在脸上很舒服',
  '外卖小哥把奶茶洒了，重新送了一杯还送了小吃',
  '地铁上看到了一只导盲犬，特别乖，主人摸它头的时候它笑了',
  '今天的天空是粉色的，拍了一张照发朋友圈',
  '晚饭做了番茄鸡蛋面，虽然简单但很满足',
  '今天工作特别顺，提前半小时下班，去书店逛了逛',
  '路过花店买了一束向日葵，放在桌上心情变好',
  '今天下雨了，窝在家里看了一部老电影',
  '早起失败，闹钟按掉了三次，最后踩点到公司',
  '今天发工资了，奖励自己一顿好的，吃了日料',
  '回家的路上买了烤红薯，烫手但好吃',
  '今天居然没被闹钟吵醒，自然醒的感觉真好',
  '老板今天心情好，提前让大家下班，周五的快乐加倍',
  '今天是阴天，心情也有点闷闷的，但下午喝了奶茶就好了',
  '被路边的小狗追了一路，原来是想让我摸它',
  '今天学了新的菜谱，虽然卖相一般但味道还不错',
  '朋友圈看到前任结婚了，心情复杂得说不出话',
  '今天帮同事解决了一个 bug，被夸了，开心',
  '晚上散步看到月亮特别圆，拍了好多张',
  '今天喝了三杯咖啡，心跳有点快，以后得控制',
  '收拾房间找到了三年前写的日记，幼稚但真诚',
  '今天换了新床单，躺在上面有阳光的味道',
  '公交上让座给老奶奶，她给了我一颗糖',
  '今天被客户刁难了，晚上吃了火锅才缓过来',
  '早上去跑步了，虽然只跑了一公里但开始了就是好的',
  '今天超市打折，买了好多零食，快乐很简单',
  '晚上九点就困了，这是老了的表现吗',
  '今天收到了妈妈寄来的腊肉，家的味道',
  '下雨天在家听雨声，特别舒服，适合发呆',
  '今天被猫抓了，但看着汤圆无辜的眼神就原谅了它',
  '整理相册看到去年的照片，时间过得好快',
  '今天的气泡水味道怪怪的，是不是过期了',
  '路人夸我的包好看，开心了一下午',
  '今天不想上班，但还是去了，成年人的无奈',
  '下班路上看到晚霞，停下来拍了照，差点错过末班车',
  '今天居然中了外卖红包，运气不错',
  '邻居做了饺子送了一碗过来，好温暖',
  '今天睡前读了半小时书，没有刷手机，进步',
  '早上煎蛋煎成了爱心的形状，有点技术',
  '今天把旧衣服捐了，衣柜清爽多了',
]

const AI_NOTES_DAILY: string[] = [
  '平静的一天，和 TA 在一起就很好。',
  'TA 今天笑了，我也跟着高兴。',
  '希望明天也是好天气。',
  'TA 的心情像今天的天气一样明朗。',
  '这样的日常，也是珍贵的记忆。',
  '记录下来了，以后回看会怀念的吧。',
  '今天 TA 分享了小事，我很开心。',
]

// ===== Generator Functions =====

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

function timestampFromDaysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000
}

// ===== Main Generator =====

export function generateMockMemories(count: number): MemoryCard[] {
  const memories: MemoryCard[] = []
  let idCounter = 0

  // Helper to add memory
  const add = (
    content: string,
    emotion: EmotionType,
    category: MemoryCategory,
    importance: number,
    tags: string[],
    aiNote: string,
    region: StarRegion,
    timestamp: number
  ) => {
    idCounter++
    memories.push({
      id: generateId(idCounter),
      timestamp,
      content,
      emotionTag: emotion,
      importanceScore: importance,
      category,
      relatedMemoryIds: [],
      tags,
      aiNote,
      status: region === 'forgotten' ? 'forgotten' : 'archived',
      region,
      lastTouched: timestamp + randomInt(0, 30 * 24 * 60 * 60 * 1000),
    })
  }

  // Process story arcs
  const processArc = (arc: StoryEvent[], baseDaysAgo: number) => {
    let currentDaysAgo = baseDaysAgo
    arc.forEach((event) => {
      currentDaysAgo -= event.daysAfter
      add(
        event.content,
        event.emotion,
        event.category,
        event.importance,
        event.tags,
        event.aiNote,
        'daily',
        timestampFromDaysAgo(currentDaysAgo)
      )
    })
  }

  // Spread arcs across 2 years
  processArc(WORK_ARC, 700)
  processArc(PET_ARC, 650)
  processArc(LOVE_ARC, 500)
  processArc(HEALTH_ARC, 400)
  processArc(TRAVEL_ARC, 300)
  processArc(LEARN_ARC, 200)

  // Add daily filler memories
  const remaining = count - memories.length
  for (let i = 0; i < remaining; i++) {
    const daysAgo = randomInt(0, 730)
    const emotion: EmotionType = Math.random() > 0.7 ? 'joy' : Math.random() > 0.5 ? 'neutral' : 'sadness'
    add(
      pickRandom(DAILY_MEMORIES),
      emotion,
      'daily',
      randomInt(25, 60),
      pickRandomSubset(TAG_POOL, randomInt(1, 3)),
      pickRandom(AI_NOTES_DAILY),
      'daily',
      timestampFromDaysAgo(daysAgo)
    )
  }

  // Sort by timestamp (oldest first)
  memories.sort((a, b) => a.timestamp - b.timestamp)

  // Designate core memories (7 most important from first_disclosure/ritual)
  const coreCandidates = memories
    .filter((m) => m.category === 'first_disclosure' || m.category === 'ritual')
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, 7)

  coreCandidates.forEach((m) => {
    m.region = 'core'
    m.importanceScore = Math.max(m.importanceScore, 88)
  })

  // Designate emotion memories (strong negative emotions with high importance)
  memories
    .filter((m) => ['anger', 'sadness', 'fear'].includes(m.emotionTag) && m.importanceScore > 65 && m.region !== 'core')
    .sort(() => Math.random() - 0.5)
    .slice(0, 40)
    .forEach((m) => {
      m.region = 'emotion'
    })

  // Designate forgotten memories (lowest importance)
  memories
    .filter((m) => m.importanceScore < 35 && m.region === 'daily')
    .sort(() => Math.random() - 0.5)
    .slice(0, 25)
    .forEach((m) => {
      m.region = 'forgotten'
      m.status = 'forgotten'
    })

  // Re-sort after region changes
  memories.sort((a, b) => a.timestamp - b.timestamp)

  // Generate links between related memories (same tags or chronological neighbors)
  const tagGroups: Record<string, MemoryCard[]> = {}
  memories.forEach((m) => {
    m.tags.forEach((tag) => {
      if (!tagGroups[tag]) tagGroups[tag] = []
      tagGroups[tag].push(m)
    })
  })

  Object.values(tagGroups).forEach((group) => {
    if (group.length < 2) return
    // Sort by timestamp to create chronological links
    group.sort((a, b) => a.timestamp - b.timestamp)
    for (let i = 0; i < group.length - 1; i++) {
      if (Math.random() > 0.4) {
        if (!group[i].relatedMemoryIds.includes(group[i + 1].id)) {
          group[i].relatedMemoryIds.push(group[i + 1].id)
        }
      }
    }
  })

  return memories
}

// ===== Diary Generator =====

export interface DiaryEntry {
  date: string
  weather: string
  mood: string
  content: string
}

const WEATHERS = ['☀️ 晴', '🌤 多云', '🌧 小雨', '⛈ 雷阵雨', '🌫 雾', '❄️ 雪']
const MOODS = ['开心', '平静', '疲惫', '焦虑', '满足', '期待', '低落', '兴奋']

const DIARY_CONTENTS: Record<string, string[]> = {
  开心: [
    '今天发生了好多好事，晚上躺在床上还在笑。明天也要加油！',
    '和喜欢的人吃了顿好的，聊了很多有的没的，时间一下子就过去了。',
    '终于把拖延很久的事情做完了，一身轻松！',
  ],
  平静: [
    '今天没什么特别的事，但这样就很好。平平淡淡才是真。',
    '下班后散了步，风吹在脸上很舒服，什么都不用想。',
    '读了一会儿书，泡了杯茶，一天就过去了。',
  ],
  疲惫: [
    '连续加班三天，今天终于能正常下班了。累瘫。',
    '身体很累，但脑子停不下来，希望今晚能睡个好觉。',
    '希望明天能睡到自然醒，真的需要休息了。',
  ],
  焦虑: [
    '又失眠了，脑子里全是还没做完的事。',
    '最近压力有点大，需要找个方式释放一下。',
    '不知道未来的方向，有点迷茫，但总会找到路的吧。',
  ],
  满足: [
    '今天完成了小目标，给自己点个赞。',
    '做了好吃的饭，虽然卖相一般但味道不错，满足。',
    '和汤圆玩了一晚上，被治愈了，什么烦恼都没了。',
  ],
  期待: [
    '倒计时三天，等不及了！好期待。',
    '计划了很久的事终于要开始了，希望一切顺利。',
    '明天有好消息，希望不是空欢喜。',
  ],
  低落: [
    '今天什么都不想做，就让自己这样吧，明天会好的。',
    '有些情绪说不出来，只能写在日记里。',
    '我知道会好起来的，只是今天不太好，允许自己难过一下。',
  ],
  兴奋: [
    '今天太刺激了！到现在还睡不着，肾上腺素飙升。',
    '收到意外的好消息，想告诉全世界！',
    '尝试了新事物，肾上腺素飙升，好爽！',
  ],
}

export function generateDiaryEntries(): DiaryEntry[] {
  const entries: DiaryEntry[] = []
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const mood = pickRandom(MOODS)
    const content = pickRandom(DIARY_CONTENTS[mood])

    entries.push({
      date: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }),
      weather: pickRandom(WEATHERS),
      mood,
      content,
    })
  }

  return entries
}

// ===== Export for backward compatibility =====
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
