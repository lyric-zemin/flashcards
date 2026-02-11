import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { generateOptions } from '../../utils/gameUtils'

interface MemoryCard {
  id: number
  character: string
  pinyin: string
  image: string
}

interface Question {
  id: number
  type: 'character' | 'pinyin' | 'image'
  question: string
  options: string[]
  correctAnswer: string
}

/**
 * 记忆挑战游戏
 * 测试用户对汉字的记忆能力
 */
const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [memoryPhase, setMemoryPhase] = useState(true)
  const [memoryTime, setMemoryTime] = useState(10)
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
    { character: '石', pinyin: 'shí', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20stone%20for%20children&image_size=portrait_4_3' }
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
    if (!gameOver && !memoryPhase) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameOver, memoryPhase])

  /**
   * 记忆阶段计时
   */
  useEffect(() => {
    let timer: number
    if (memoryPhase && memoryTime > 0) {
      timer = setInterval(() => {
        setMemoryTime(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            startQuestionPhase()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [memoryPhase, memoryTime])

  /**
   * 初始化游戏，生成卡片和问题
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

    // 随机选择6个汉字
    const shuffledData = [...gameDataToUse].sort(() => Math.random() - 0.5)
    const selectedData = shuffledData.slice(0, 6).map((item, index) => ({
      ...item,
      id: index
    }))
    setCards(selectedData)

    // 生成问题
    const newQuestions: Question[] = []
    selectedData.forEach((item, index) => {
      // 生成汉字-拼音匹配问题
      newQuestions.push({
        id: index * 3,
        type: 'character',
        question: `"${item.character}" 的拼音是什么？`,
        options: generateOptions(item.pinyin, selectedData.map(d => d.pinyin)),
        correctAnswer: item.pinyin
      })

      // 生成拼音-汉字匹配问题
      newQuestions.push({
        id: index * 3 + 1,
        type: 'pinyin',
        question: `"${item.pinyin}" 对应的汉字是什么？`,
        options: generateOptions(item.character, selectedData.map(d => d.character)),
        correctAnswer: item.character
      })

      // 生成图片-汉字匹配问题
      newQuestions.push({
        id: index * 3 + 2,
        type: 'image',
        question: '下图对应的汉字是什么？',
        options: generateOptions(item.character, selectedData.map(d => d.character)),
        correctAnswer: item.character
      })
    })

    // 随机排序问题
    const shuffledQuestions = newQuestions.sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffledQuestions.slice(0, 6)
    setQuestions(selectedQuestions)
    setTotalCount(selectedQuestions.length)

    setCurrentQuestion(0)
    setUserAnswers([])
    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setMemoryPhase(true)
    setMemoryTime(10)
    setPoints(undefined)
  }



  /**
   * 开始问题阶段
   */
  const startQuestionPhase = () => {
    setMemoryPhase(false)
  }

  /**
   * 处理答案选择
   */
  const handleAnswerSelect = (answer: string) => {
    const newUserAnswers = [...userAnswers, answer]
    setUserAnswers(newUserAnswers)

    // 检查答案是否正确
    const currentQ = questions[currentQuestion]
    if (answer === currentQ.correctAnswer) {
      setScore(prevScore => prevScore + 15)
      setCorrectCount(prev => prev + 1)
    }

    // 检查是否还有问题
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
      }, 1000)
    } else {
      // 游戏结束，计算积分
      saveGamePoints(score, 'memory')
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
        title="记忆挑战" 
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
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
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
          ) : memoryPhase ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
                <h2 className="text-2xl font-bold text-dark mb-4">记忆阶段</h2>
                <p className="text-gray-600 mb-4">请在 {memoryTime} 秒内记住以下汉字</p>
                <div className="text-4xl font-bold text-primary mb-4">{memoryTime}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    className="bg-white rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className="text-5xl font-bold text-primary mb-4">{card.character}</div>
                    <div className="text-xl font-medium text-gray-600 mb-2">{card.pinyin}</div>
                    <img 
                      src={card.image} 
                      alt={card.character} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-dark">问题 {currentQuestion + 1}/{questions.length}</h2>
                  <div className="text-lg font-medium text-gray-600">得分: {score}</div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark mb-6">{questions[currentQuestion].question}</h3>
                  
                  {questions[currentQuestion].type === 'image' && (
                    <div className="mb-6">
                      <img 
                        src={cards.find(c => c.character === questions[currentQuestion].correctAnswer)?.image}
                        alt="问题图片"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className="bg-white border-2 border-primary rounded-lg py-4 px-6 text-lg font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                        onClick={() => handleAnswerSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MemoryGame