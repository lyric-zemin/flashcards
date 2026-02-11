// 通用游戏配置数据

import type { Flashcard } from "./api";

/**
 * 默认图片 URL
 * 当没有提供图片时使用的备用图片
 */
export const DEFAULT_IMAGE_URL = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20chinese%20character%20for%20children&image_size=portrait_4_3';

/**
 * 默认游戏数据
 * 当API调用失败时使用的备用数据
 */
export const defaultGameData: Flashcard[] = [
  { id: 1, character: '人', pinyin: 'rén', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20person%20for%20children&image_size=portrait_4_3', meaning: 'person', audioUrl: '', ageGroupId: 1 },
  { id: 2, character: '口', pinyin: 'kǒu', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mouth%20for%20children&image_size=portrait_4_3', meaning: 'mouth', audioUrl: '', ageGroupId: 1 },
  { id: 3, character: '日', pinyin: 'rì', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sun%20for%20children&image_size=portrait_4_3', meaning: 'sun', audioUrl: '', ageGroupId: 1 },
  { id: 4, character: '月', pinyin: 'yuè', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20moon%20for%20children&image_size=portrait_4_3', meaning: 'moon', audioUrl: '', ageGroupId: 1 },
  { id: 5, character: '水', pinyin: 'shuǐ', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20water%20for%20children&image_size=portrait_4_3', meaning: 'water', audioUrl: '', ageGroupId: 1 },
  { id: 6, character: '火', pinyin: 'huǒ', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20fire%20for%20children&image_size=portrait_4_3', meaning: 'fire', audioUrl: '', ageGroupId: 1 },
  { id: 7, character: '山', pinyin: 'shān', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mountain%20for%20children&image_size=portrait_4_3', meaning: 'mountain', audioUrl: '', ageGroupId: 1 },
  { id: 8, character: '石', pinyin: 'shí', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20stone%20for%20children&image_size=portrait_4_3', meaning: 'stone', audioUrl: '', ageGroupId: 1 },
  { id: 9, character: '木', pinyin: 'mù', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tree%20for%20children&image_size=portrait_4_3', meaning: 'wood', audioUrl: '', ageGroupId: 1 },
  { id: 10, character: '金', pinyin: 'jīn', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20gold%20for%20children&image_size=portrait_4_3', meaning: 'gold', audioUrl: '', ageGroupId: 1 }
]
