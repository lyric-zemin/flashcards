import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function initData() {
  try {
    // 创建年龄段
    const ageGroups = [
      { name: '3-4岁', level: 1 },
      { name: '4-5岁', level: 2 },
      { name: '5-6岁', level: 3 }
    ]

    for (const group of ageGroups) {
      await prisma.ageGroup.upsert({
        where: { name: group.name },
        update: {},
        create: group
      })
    }

    // 获取年龄段ID
    const ageGroup1 = await prisma.ageGroup.findUnique({ where: { name: '3-4岁' } })
    const ageGroup2 = await prisma.ageGroup.findUnique({ where: { name: '4-5岁' } })
    const ageGroup3 = await prisma.ageGroup.findUnique({ where: { name: '5-6岁' } })

    // 插入汉字数据
    const flashcards = [
      // 3-4岁
      { 
        character: '人', 
        pinyin: 'rén', 
        meaning: '人类', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20person%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '口', 
        pinyin: 'kǒu', 
        meaning: '嘴巴', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mouth%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '日', 
        pinyin: 'rì', 
        meaning: '太阳', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sun%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '月', 
        pinyin: 'yuè', 
        meaning: '月亮', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20moon%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '水', 
        pinyin: 'shuǐ', 
        meaning: '水', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20water%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '火', 
        pinyin: 'huǒ', 
        meaning: '火焰', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20fire%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '土', 
        pinyin: 'tǔ', 
        meaning: '土地', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20soil%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '天', 
        pinyin: 'tiān', 
        meaning: '天空', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sky%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '地', 
        pinyin: 'dì', 
        meaning: '地面', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20ground%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      { 
        character: '大', 
        pinyin: 'dà', 
        meaning: '大小', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20big%20size%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup1!.id 
      },
      // 4-5岁
      { 
        character: '山', 
        pinyin: 'shān', 
        meaning: '山峰', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mountain%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '石', 
        pinyin: 'shí', 
        meaning: '石头', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20stone%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '田', 
        pinyin: 'tián', 
        meaning: '田地', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20farm%20field%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '禾', 
        pinyin: 'hé', 
        meaning: '禾苗', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20rice%20seedlings%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '木', 
        pinyin: 'mù', 
        meaning: '树木', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tree%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '竹', 
        pinyin: 'zhú', 
        meaning: '竹子', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20bamboo%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '花', 
        pinyin: 'huā', 
        meaning: '花朵', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20flower%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '草', 
        pinyin: 'cǎo', 
        meaning: '草地', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20grass%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '鸟', 
        pinyin: 'niǎo', 
        meaning: '鸟类', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20bird%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      { 
        character: '虫', 
        pinyin: 'chóng', 
        meaning: '虫子', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20insect%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup2!.id 
      },
      // 5-6岁
      { 
        character: '上', 
        pinyin: 'shàng', 
        meaning: '上面', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20up%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '下', 
        pinyin: 'xià', 
        meaning: '下面', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20down%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '左', 
        pinyin: 'zuǒ', 
        meaning: '左边', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20left%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '右', 
        pinyin: 'yòu', 
        meaning: '右边', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20right%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '中', 
        pinyin: 'zhōng', 
        meaning: '中间', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20center%20mark%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '前', 
        pinyin: 'qián', 
        meaning: '前面', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20forward%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '后', 
        pinyin: 'hòu', 
        meaning: '后面', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20backward%20arrow%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '多', 
        pinyin: 'duō', 
        meaning: '很多', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20many%20objects%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '少', 
        pinyin: 'shǎo', 
        meaning: '很少', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20few%20objects%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '高', 
        pinyin: 'gāo', 
        meaning: '高大', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tall%20object%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '矮', 
        pinyin: 'ǎi', 
        meaning: '矮小', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20short%20object%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '长', 
        pinyin: 'cháng', 
        meaning: '长短', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20long%20object%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      },
      { 
        character: '短', 
        pinyin: 'duǎn', 
        meaning: '短小', 
        imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20short%20object%20for%20children&image_size=portrait_4_3', 
        audioUrl: '', 
        ageGroupId: ageGroup3!.id 
      }
    ]

    for (const card of flashcards) {
      await prisma.flashcard.upsert({
        where: {
          character_ageGroupId: {
            character: card.character,
            ageGroupId: card.ageGroupId
          }
        },
        update: {},
        create: card
      })
    }

    // 插入测试用户
    const testUser = {
      username: 'test',
      nickname: '测试用户',
      password: await bcrypt.hash('password123', 10) // 使用哈希密码
    }

    await prisma.user.upsert({
      where: { username: testUser.username },
      update: {},
      create: testUser
    })

    console.log('测试用户创建成功，用户名: test, 密码: password123')

    // 插入成就数据
    const achievements = [
      { name: '初学者', description: '获得100积分', icon: '🌟', requiredPoints: 100 },
      { name: '学习者', description: '获得500积分', icon: '⭐', requiredPoints: 500 },
      { name: '汉字达人', description: '获得1000积分', icon: '🏆', requiredPoints: 1000 },
      { name: '积分大师', description: '获得5000积分', icon: '👑', requiredPoints: 5000 }
    ]

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement
      })
    }

    // 插入徽章数据
    const badges = [
      { name: '初学者', description: '学习10个汉字', icon: '📚', condition: 'learned_10', category: 'learning', requiredValue: 10 },
      { name: '学习者', description: '学习50个汉字', icon: '📖', condition: 'learned_50', category: 'learning', requiredValue: 50 },
      { name: '汉字达人', description: '学习100个汉字', icon: '🎓', condition: 'learned_100', category: 'learning', requiredValue: 100 },
      { name: '坚持者', description: '连续签到3天', icon: '🏅', condition: 'signin_3_days', category: 'sign_in', requiredValue: 3 },
      { name: '连续签到王', description: '连续签到7天', icon: '👑', condition: 'signin_7_days', category: 'sign_in', requiredValue: 7 },
      { name: '签到大师', description: '连续签到30天', icon: '🌟', condition: 'signin_30_days', category: 'sign_in', requiredValue: 30 }
    ]

    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge
      })
    }

    console.log('数据初始化成功')
  } catch (error) {
    console.error('数据初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initData()
