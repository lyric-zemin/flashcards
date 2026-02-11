import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { shuffleArray } from '../../utils/gameUtils'

interface Card {
  id: number
  content: string
  type: 'character' | 'image' | 'pinyin'
  matchId: number
  isFlipped: boolean
  isMatched: boolean
}

/**
 * 汉字配对游戏
 * 将汉字与对应的图片或拼音进行配对
 */
const MatchingGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<Card[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [points, setPoints] = useState<number | undefined>(undefined)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 从API获取的flashcard数据
  const gameData = useMemo(() => {
    return flashcards.map(card => ({
      character: card.character,
      pinyin: card.pinyin,
      image: card.imageUrl
    }))
  }, [flashcards])

  /**
   * 初始化游戏
   */
  useEffect(() => {
    // 从API获取flashcard数据
  const fetchFlashcards = async () => {
    try {
      const data = await getAllFlashcards()
      setFlashcards(data)
    } catch (error) {
      console.error('获取flashcard数据失败:', error)
      // 使用默认数据作为备用
      setFlashcards([
        { id: 1, character: '人', pinyin: 'rén', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20person%20for%20children&image_size=portrait_4_3', meaning: 'person', audioUrl: '', ageGroupId: 1 },
        { id: 2, character: '口', pinyin: 'kǒu', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mouth%20for%20children&image_size=portrait_4_3', meaning: 'mouth', audioUrl: '', ageGroupId: 1 },
        { id: 3, character: '日', pinyin: 'rì', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sun%20for%20children&image_size=portrait_4_3', meaning: 'sun', audioUrl: '', ageGroupId: 1 },
        { id: 4, character: '月', pinyin: 'yuè', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20moon%20for%20children&image_size=portrait_4_3', meaning: 'moon', audioUrl: '', ageGroupId: 1 },
        { id: 5, character: '水', pinyin: 'shuǐ', imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20water%20for%20children&image_size=portrait_4_3', meaning: 'water', audioUrl: '', ageGroupId: 1 }
      ])
    } finally {
      setLoading(false)
    }
  }

    fetchFlashcards()
  }, [])

  /**
   * 初始化游戏
   */
  useEffect(() => {
    if (gameData.length > 0) {
      initializeGame()
    }
  }, [gameData])

  /**
   * 游戏计时
   */
  useEffect(() => {
    let timer: number
    if (!gameOver) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameOver])

  /**
   * 初始化游戏，生成卡片
   */
  const initializeGame = () => {
    const newCards: Card[] = []
    let id = 0
    
    // 限制卡片数量，避免难度太大
    const maxPairs = 6 // 最多6对卡片
    
    // 随机选择卡片，增加趣味性
    const shuffledGameData = [...gameData].sort(() => Math.random() - 0.5)
    const limitedGameData = shuffledGameData.slice(0, maxPairs)

    // 为每个汉字创建卡片
    limitedGameData.forEach((item, index) => {
      // 创建汉字卡片
      newCards.push({
        id: id++,
        content: item.character,
        type: 'character',
        matchId: index,
        isFlipped: false,
        isMatched: false
      })

      // 创建图片卡片
      newCards.push({
        id: id++,
        content: item.image,
        type: 'image',
        matchId: index,
        isFlipped: false,
        isMatched: false
      })
    })

    // 打乱卡片顺序
    const shuffledCards = shuffleArray(newCards)
    setCards(shuffledCards)
    setFlippedCards([])
    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setTotalCount(limitedGameData.length)
    setPoints(undefined)
  }



  /**
   * 处理卡片点击
   */
  const handleCardClick = (card: Card) => {
    // 如果卡片已经翻转或已匹配，不处理点击
    if (card.isFlipped || card.isMatched) return

    // 如果已经有两张卡片翻转，不处理点击
    if (flippedCards.length === 2) return

    // 翻转卡片
    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )
    setCards(updatedCards)

    // 添加到翻转卡片数组
    const updatedFlippedCards = [...flippedCards, card]
    setFlippedCards(updatedFlippedCards)

    // 如果已经翻转了两张卡片，检查是否匹配
    if (updatedFlippedCards.length === 2) {
      setTimeout(() => checkMatch(updatedFlippedCards), 1000)
    }
  }

  /**
   * 检查两张卡片是否匹配
   */
  const checkMatch = (flipped: Card[]) => {
    const [card1, card2] = flipped
    let updatedCards = [...cards]

    if (card1.matchId === card2.matchId) {
      // 匹配成功，保持卡片翻转状态并标记为已匹配
      updatedCards = updatedCards.map(c =>
        c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true, isFlipped: true } : c
      )
      setScore(prevScore => prevScore + 10)
      setCorrectCount(prev => prev + 1)
    } else {
      // 匹配失败，翻回卡片
      updatedCards = updatedCards.map(c =>
        c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
      )
    }

    setCards(updatedCards)
    setFlippedCards([])

    // 检查游戏是否结束
    const allMatched = updatedCards.every(card => card.isMatched)
    if (allMatched) {
      // 游戏结束，计算积分
      saveGamePoints(score, 'matching')
        .then(earnedPoints => {
          setPoints(earnedPoints)
        })
        .catch(error => {
          console.error('保存游戏积分失败:', error)
          setPoints(0)
        })
      setGameOver(true)
    }
  }

  /**
   * 返回游戏模式选择页面
   */
  const handleBack = () => {
    navigate('/games')
  }

  // 检查加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* 头部 */}
      <Header 
        title="汉字配对" 
        showBackButton={true}
        onBackClick={handleBack}
        children={
          <div className="flex items-center space-x-4">
            <div className="bg-white text-primary px-4 py-2 rounded-lg font-bold">
              得分: {score}
            </div>
            <div className="bg-white text-primary px-4 py-2 rounded-lg font-bold">
              时间: {time}s
            </div>
          </div>
        }
      />

      {/* 主要内容 */}
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {gameOver ? (
            <div className="max-w-2xl mx-auto">
              <GameResult 
                score={score}
                time={time}
                correctCount={correctCount}
                totalCount={totalCount}
                points={points}
                onRetry={initializeGame}
                onBack={handleBack}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {cards.map((card) => (
                <div 
                  key={card.id}
                  className={`relative w-full aspect-square cursor-pointer transform transition-all duration-300 ${card.isMatched ? 'opacity-70' : ''}`}
                  onClick={() => handleCardClick(card)}
                >
                  {/* 卡片正面 */}
                  <div className={`absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center backface-hidden ${!card.isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-4xl font-bold text-primary">?</div>
                  </div>
                  
                  {/* 卡片背面 */}
                  <div className={`absolute inset-0 bg-white rounded-xl shadow-lg flex items-center justify-center backface-hidden ${card.isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                    {card.type === 'image' ? (
                      <img 
                        src={card.content} 
                        alt="汉字图片" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-primary">{card.content}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MatchingGame
