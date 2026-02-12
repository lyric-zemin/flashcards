import express from 'express'
import { 
  getAgeGroups, 
  getFlashcardsByAgeGroup, 
  getFlashcardById,
  getAllFlashcards,
  createFlashcard,
  importFlashcards
} from '../controllers/flashcardController'

const router = express.Router()

// 获取所有年龄段
router.get('/age-groups', getAgeGroups)

// 获取所有汉字卡片
router.get('/flashcards', getAllFlashcards)

// 获取指定年龄段的汉字
router.get('/flashcards/:ageGroupId', getFlashcardsByAgeGroup)

// 获取汉字详情
router.get('/flashcard/:id', getFlashcardById)

// 创建卡片
router.post('/flashcard', createFlashcard)

// 批量导入卡片
router.post('/flashcards/import', importFlashcards)

export default router
