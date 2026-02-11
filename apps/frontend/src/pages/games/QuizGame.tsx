import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import DifficultySelector from '../../components/game/DifficultySelector'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { defaultGameData } from '../../utils/gameConfig'

interface QuizQuestion {
  id: number
  character: string
  pinyin: string
  imageUrl: string
  meaning: string
  options: string[]
  correctAnswer: string
  questionType: 'meaning' | 'pinyin' | 'character'
}

/**
 * 汉字小测验游戏
 * 测试用户对汉字的认识
 */
const QuizGame: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackCorrect, setFeedbackCorrect] = useState(false)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [showDifficultySelector, setShowDifficultySelector] = useState(true)
  const [points, setPoints] = useState<number | undefined>(undefined)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 从API获取的flashcard数据
  const gameData = useMemo(() => {
    return flashcards.map(card => ({
      character: card.character,
      pinyin: card.pinyin,
      imageUrl: card.imageUrl,
      meaning: card.meaning
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
          setFlashcards(defaultGameData)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
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
   * 初始化游戏，生成问题
   */
  const initializeGame = () => {
    const newQuestions: QuizQuestion[] = []
    const questionTypes: Array<'meaning' | 'pinyin' | 'character'> = ['meaning', 'pinyin', 'character']

    // 根据难度选择问题数量
    const questionCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10

    // 为每个汉字生成不同类型的问题
    gameData.forEach((item, index) => {
      // 随机选择问题类型
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      
      let question: QuizQuestion

      switch (questionType) {
        case 'meaning':
          // 生成含义-汉字匹配问题
          question = {
            id: index,
            character: item.character,
            pinyin: item.pinyin,
            imageUrl: item.imageUrl,
            meaning: item.meaning,
            options: generateOptions(item.character, gameData.map(d => d.character)),
            correctAnswer: item.character,
            questionType: 'meaning'
          }
          break
        case 'pinyin':
          // 生成拼音-汉字匹配问题
          question = {
            id: index,
            character: item.character,
            pinyin: item.pinyin,
            imageUrl: item.imageUrl,
            meaning: item.meaning,
            options: generateOptions(item.character, gameData.map(d => d.character)),
            correctAnswer: item.character,
            questionType: 'pinyin'
          }
          break
        case 'character':
          // 生成汉字-含义匹配问题
          question = {
            id: index,
            character: item.character,
            pinyin: item.pinyin,
            imageUrl: item.imageUrl,
            meaning: item.meaning,
            options: generateOptions(item.meaning, gameData.map(d => d.meaning)),
            correctAnswer: item.meaning,
            questionType: 'character'
          }
          break
      }

      newQuestions.push(question)
    })

    // 随机排序问题
    const shuffledQuestions = newQuestions.sort(() => Math.random() - 0.5)
    const selectedQuestions = shuffledQuestions.slice(0, questionCount)
    
    setQuestions(selectedQuestions)
    setTotalCount(selectedQuestions.length)
    setCurrentQuestion(0)
    setUserAnswers([])
    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setShowFeedback(false)
    setShowDifficultySelector(false)
  }

  /**
   * 开始游戏
   */
  const startGame = () => {
    initializeGame()
  }

  /**
   * 生成选项
   */
  const generateOptions = (correct: string, allOptions: string[]): string[] => {
    const options = [correct]
    while (options.length < 4) {
      const randomOption = allOptions[Math.floor(Math.random() * allOptions.length)]
      if (!options.includes(randomOption)) {
        options.push(randomOption)
      }
    }
    return options.sort(() => Math.random() - 0.5)
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
    setTimeout(async () => {
      setShowFeedback(false)
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // 游戏结束，计算积分
        try {
          const earnedPoints = await saveGamePoints(score, 'quiz')
          setPoints(earnedPoints)
        } catch (error) {
          console.error('保存游戏积分失败:', error)
          setPoints(0)
        }
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

  /**
   * 获取问题描述
   */
  const getQuestionDescription = (question: QuizQuestion): string => {
    switch (question.questionType) {
      case 'meaning':
        return `"${question.meaning}" 对应的汉字是什么？`
      case 'pinyin':
        return `"${question.pinyin}" 对应的汉字是什么？`
      case 'character':
        return `"${question.character}" 的含义是什么？`
      default:
        return ''
    }
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
        title="汉字小测验" 
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
                onRetry={() => {
                  setShowDifficultySelector(true)
                  setPoints(undefined)
                }}
                onBack={handleBack}
              />
            </div>
          ) : showDifficultySelector ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-dark mb-6">汉字小测验</h2>
                <p className="text-gray-600 mb-8">选择游戏难度，开始挑战！</p>
                
                <DifficultySelector 
                  difficulty={difficulty}
                  onDifficultyChange={setDifficulty}
                />
                
                <button
                  className="mt-8 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                  onClick={startGame}
                >
                  开始游戏
                </button>
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
                  <h3 className="text-xl font-bold text-dark mb-6">{getQuestionDescription(questions[currentQuestion])}</h3>
                  
                  {questions[currentQuestion].questionType !== 'character' && (
                    <div className="mb-6">
                      <img 
                      src={questions[currentQuestion].imageUrl} 
                      alt={questions[currentQuestion].character}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    </div>
                  )}

                  {questions[currentQuestion].questionType === 'character' && (
                    <div className="mb-6 text-center">
                      <div className="text-6xl font-bold text-primary">{questions[currentQuestion].character}</div>
                      <div className="text-xl font-medium text-gray-600 mt-4">{questions[currentQuestion].pinyin}</div>
                    </div>
                  )}

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

export default QuizGame