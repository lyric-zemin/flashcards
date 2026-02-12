import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { generateOptions, getRandomElements } from '../../utils/gameUtils'
import { defaultGameData, DEFAULT_IMAGE_URL } from '../../utils/gameConfig'

interface FillQuestion {
  id: number
  character: string
  pinyin: string
  imageUrl: string
  meaning: string
  options: string[]
  correctAnswer: string
}

/**
 * 汉字填空游戏
 * 根据提示填写汉字
 */
const FillGame: React.FC = () => {
  const [questions, setQuestions] = useState<FillQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackCorrect, setFeedbackCorrect] = useState(false)
  const [points, setPoints] = useState<number | undefined>(undefined)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
        setFlashcards(defaultGameData)
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [])

  /**
   * 初始化游戏
   */
  useEffect(() => {
    if (flashcards.length > 0) {
      initializeGame()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards])

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
   * 初始化游戏，生成问题
   */
  const initializeGame = () => {
    // 准备游戏数据
    const gameDataToUse = flashcards

    const newQuestions: FillQuestion[] = []

    // 为每个汉字生成问题
    gameDataToUse.forEach((item, index) => {
      const question: FillQuestion = {
        id: index,
        character: item.character,
        pinyin: item.pinyin,
        imageUrl: item.imageUrl || DEFAULT_IMAGE_URL,
        meaning: item.meaning || 'meaning',
        options: generateOptions(item.character, gameDataToUse.map(d => d.character)),
        correctAnswer: item.character
      }

      newQuestions.push(question)
    })

    // 随机排序问题
    const selectedQuestions = getRandomElements(newQuestions, 8)
    
    setQuestions(selectedQuestions)
    setTotalCount(selectedQuestions.length)
    setCurrentQuestion(0)
    setUserAnswers([])
    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setShowFeedback(false)
    setPoints(undefined)
  }

  /**
   * 处理答案选择
   */
  const handleAnswerSelect = (answer: string) => {
    const newUserAnswers = [...userAnswers, answer]
    setUserAnswers(newUserAnswers)

    // 检查答案是否正确
    const currentQ = questions[currentQuestion]
    const isCorrect = answer === currentQ.correctAnswer
    
    setFeedbackCorrect(isCorrect)
    setShowFeedback(true)

    if (isCorrect) {
      setScore(prevScore => prevScore + 12)
      setCorrectCount(prev => prev + 1)
    }

    // 检查是否还有问题
    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // 游戏结束，计算积分
        saveGamePoints(score, 'fill')
          .then(earnedPoints => {
            setPoints(earnedPoints)
          })
          .catch(error => {
            console.error('保存游戏积分失败:', error)
            setPoints(0)
          })
        setGameOver(true)
      }
    }, 1500)
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
        title="汉字填空" 
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
          {loading || questions.length === 0 ? (
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
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-dark">问题 {currentQuestion + 1}/{questions.length}</h2>
                  <div className="text-lg font-medium text-gray-600">得分: {score}</div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-dark mb-6 text-center">根据图片和拼音填写正确的汉字</h3>
                  
                  <div className="mb-8">
                    <img 
                      src={questions[currentQuestion].imageUrl} 
                      alt={questions[currentQuestion].character}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-3xl font-bold text-primary mb-4">{questions[currentQuestion].pinyin}</div>
                    <div className="text-lg font-medium text-gray-600">{questions[currentQuestion].meaning}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className={`rounded-lg py-4 px-6 text-lg font-bold transition-colors ${
                          showFeedback
                            ? option === questions[currentQuestion].correctAnswer
                              ? 'bg-green-500 text-white'
                              : option === userAnswers[userAnswers.length - 1]
                              ? 'bg-red-500 text-white'
                              : 'bg-white border-2 border-primary text-primary'
                            : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                        onClick={() => !showFeedback && handleAnswerSelect(option)}
                        disabled={showFeedback}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showFeedback && (
                    <div className={`mt-6 p-4 rounded-lg text-center font-bold ${
                      feedbackCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {feedbackCorrect ? '回答正确！' : '回答错误！'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default FillGame
