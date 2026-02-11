import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { shuffleArray } from '../../utils/gameUtils'

interface ConnectCard {
  id: number
  character: string
  pinyin: string
  image: string
  isFlipped: boolean
  isMatched: boolean
}

/**
 * 汉字连连看游戏
 * 连接相关的汉字
 */
const ConnectGame: React.FC = () => {
  const [cards, setCards] = useState<ConnectCard[]>([])
  const [selectedCards, setSelectedCards] = useState<ConnectCard[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [points, setPoints] = useState<number | undefined>(undefined)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 默认游戏数据（当API调用失败时使用）
  const defaultGameData = [
    { character: '人', pinyin: 'rén', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20person%20for%20children&image_size=portrait_4_3' },
    { character: '口', pinyin: 'kǒu', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mouth%20for%20children&image_size=portrait_4_3' },
    { character: '日', pinyin: 'rì', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sun%20for%20children&image_size=portrait_4_3' },
    { character: '月', pinyin: 'yuè', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20moon%20for%20children&image_size=portrait_4_3' },
    { character: '水', pinyin: 'shuǐ', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20water%20for%20children&image_size=portrait_4_3' },
    { character: '火', pinyin: 'huǒ', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20fire%20for%20children&image_size=portrait_4_3' },
    { character: '山', pinyin: 'shān', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20mountain%20for%20children&image_size=portrait_4_3' },
    { character: '石', pinyin: 'shí', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20stone%20for%20children&image_size=portrait_4_3' },
    { character: '木', pinyin: 'mù', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tree%20for%20children&image_size=portrait_4_3' },
    { character: '金', pinyin: 'jīn', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20gold%20for%20children&image_size=portrait_4_3' }
  ]

  // 从API获取游戏数据
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true)
        const data = await getAllFlashcards()
        setFlashcards(data)
      } catch (error) {
        console.error('获取游戏数据失败:', error)
        // API调用失败时使用默认数据
      } finally {
        setLoading(false)
        initializeGame()
      }
    }

    fetchGameData()
  }, [])

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
    // 准备游戏数据
    let gameDataToUse = defaultGameData
    
    // 如果从API获取到了数据，转换为游戏数据格式
    if (flashcards.length > 0) {
      gameDataToUse = flashcards.map(card => ({
        character: card.character,
        pinyin: card.pinyin,
        image: card.imageUrl
      })).filter(item => item.character && item.pinyin)
      
      // 如果转换后没有有效数据，使用默认数据
      if (gameDataToUse.length === 0) {
        gameDataToUse = defaultGameData
      }
    }

    // 生成卡片对
    const newCards: ConnectCard[] = []
    let id = 0

    // 为每个汉字创建两张卡片
    gameDataToUse.forEach((item) => {
      // 创建第一张卡片（显示汉字）
      newCards.push({
        id: id++,
        character: item.character,
        pinyin: item.pinyin,
        image: item.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20chinese%20character%20for%20children&image_size=portrait_4_3',
        isFlipped: false,
        isMatched: false
      })

      // 创建第二张卡片（显示拼音或图片）
      newCards.push({
        id: id++,
        character: item.character,
        pinyin: item.pinyin,
        image: item.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20chinese%20character%20for%20children&image_size=portrait_4_3',
        isFlipped: false,
        isMatched: false
      })
    })

    // 打乱卡片顺序
    const shuffledCards = shuffleArray(newCards)
    setCards(shuffledCards)
    setSelectedCards([])
    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setTotalCount(newCards.length / 2)
    setPoints(undefined)
  }



  /**
   * 处理卡片点击
   */
  const handleCardClick = (card: ConnectCard) => {
    // 如果卡片已经翻开或已匹配，不处理点击
    if (card.isFlipped || card.isMatched) return

    // 如果已经选择了两张卡片，不处理点击
    if (selectedCards.length === 2) return

    // 翻开卡片
    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )
    setCards(updatedCards)

    // 添加到选择的卡片数组
    const updatedSelectedCards = [...selectedCards, card]
    setSelectedCards(updatedSelectedCards)

    // 如果已经选择了两张卡片，检查是否匹配
    if (updatedSelectedCards.length === 2) {
      setTimeout(() => checkMatch(updatedSelectedCards), 1000)
    }
  }

  /**
   * 检查两张卡片是否匹配
   */
  const checkMatch = (selected: ConnectCard[]) => {
    const [card1, card2] = selected
    let updatedCards = [...cards]

    if (card1.character === card2.character) {
      // 匹配成功
      updatedCards = updatedCards.map(c =>
        c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true, isFlipped: true} : c
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
    setSelectedCards([])

    // 检查游戏是否结束
    const allMatched = updatedCards.every(card => card.isMatched)
    if (allMatched) {
      // 游戏结束，计算积分
      saveGamePoints(score, 'connect')
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

  return (
    <div className="min-h-screen bg-light flex flex-col">
      {/* 头部 */}
      <Header 
        title="汉字连连看" 
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
          {loading ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-dark">加载中...</h2>
              <p className="text-gray-600 mt-2">正在获取游戏数据，请稍候</p>
            </div>
          ) : gameOver ? (
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
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-dark mb-6 text-center">连接相同的汉字</h2>
                <p className="text-gray-600 mb-8 text-center">点击卡片找到配对的汉字，消除所有卡片获得分数！</p>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {cards.map((card) => (
                    <div 
                      key={card.id}
                      className={`aspect-square rounded-lg cursor-pointer transform transition-all duration-300 ${
                        card.isMatched 
                          ? 'opacity-50 scale-95'
                          : card.isFlipped
                          ? 'scale-105'
                          : 'hover:scale-105'
                      }`}
                      onClick={() => handleCardClick(card)}
                    >
                      {/* 卡片背面 */}
                      <div className={`absolute inset-0 bg-primary rounded-lg flex items-center justify-center backface-hidden ${
                        !card.isFlipped ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="text-3xl font-bold text-white">?</div>
                      </div>
                      
                      {/* 卡片正面 */}
                      <div className={`absolute inset-0 bg-white rounded-lg shadow-md flex items-center justify-center backface-hidden ${
                        card.isFlipped ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {Math.random() > 0.5 ? (
                          <div className="text-4xl font-bold text-primary">{card.character}</div>
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-2">{card.pinyin}</div>
                            <img 
                              src={card.image} 
                              alt={card.character} 
                              className="w-full h-20 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ConnectGame