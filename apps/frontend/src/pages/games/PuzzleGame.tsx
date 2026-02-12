import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import GameResult from '../../components/game/GameResult'
import { saveGamePoints } from '../../utils/points'
import { getAllFlashcards } from '../../utils/api'
import type { Flashcard } from '../../utils/api'
import { getRandomNumber, shuffleArray } from '../../utils/gameUtils'

interface Stroke {
  id: number
  content: string
  position: number
  currentPosition: number
}

/**
 * 汉字拼图游戏
 * 将汉字拆解成笔画进行拼图
 */
const PuzzleGame: React.FC = () => {
  const [stokes, setStrokes] = useState<Stroke[]>([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentCharacter, setCurrentCharacter] = useState('')
  const [points, setPoints] = useState<number | undefined>(undefined)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 默认游戏数据 - 汉字笔画（当API调用失败时使用）
  const defaultGameData = [
    {
      character: '人',
      strokes: ['丿', '㇏']
    },
    {
      character: '口',
      strokes: ['丨', '𠃍', '一']
    },
    {
      character: '日',
      strokes: ['丨', '𠃍', '一', '一']
    },
    {
      character: '月',
      strokes: ['丿', '𠃍', '一', '一']
    },
    {
      character: '水',
      strokes: ['亅', '㇇', 'ノ', '㇏']
    }
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
      }
    }

    fetchGameData()
  }, [])

  /**
   * 初始化游戏
   */
  useEffect(() => {
    // if (flashcards.length > 0) {
      initializeGame()
    // }
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
   * 初始化游戏，生成笔画
   */
  const initializeGame = () => {
    // 准备游戏数据
    // TODO: 目前api中不包含笔画数据
    const gameDataToUse = defaultGameData
    
    // 如果从API获取到了数据，转换为游戏数据格式
    // if (flashcards.length > 0) {
    //   gameDataToUse = flashcards.map(card => ({
    //     character: card.character,
    //     strokes: card.character.split('') // 简单处理，将汉字拆分为单个字符作为笔画
    //   })).filter(item => item.strokes.length > 0)
      
    //   // 如果转换后没有有效数据，使用默认数据
    //   if (gameDataToUse.length === 0) {
    //     gameDataToUse = defaultGameData
    //   }
    // }

    // 随机选择一个汉字
    const selectedCharacter = gameDataToUse[getRandomNumber(0, gameDataToUse.length - 1)]
    setCurrentCharacter(selectedCharacter.character)

    // 生成笔画数据
    const newStrokes: Stroke[] = selectedCharacter.strokes.map((stroke, index) => ({
      id: index,
      content: stroke,
      position: index,
      currentPosition: index
    }))

    // 打乱笔画顺序，确保与原始顺序不同
    let shuffledStrokes = shuffleArray([...newStrokes])
    
    // 检查是否与原始顺序相同，如果相同则重新打乱
    let isSameAsOriginal = true
    for (let i = 0; i < shuffledStrokes.length; i++) {
      if (shuffledStrokes[i].position !== i) {
        isSameAsOriginal = false
        break
      }
    }
    
    // 如果与原始顺序相同，重新打乱
    if (isSameAsOriginal && shuffledStrokes.length > 1) {
      shuffledStrokes = shuffleArray([...newStrokes])
    }
    
    // 重新设置打乱后的笔画的 currentPosition
    const finalStrokes = shuffledStrokes.map((stroke, index) => ({
      ...stroke,
      currentPosition: index
    }))
    
    setStrokes(finalStrokes)

    setScore(0)
    setTime(0)
    setGameOver(false)
    setCorrectCount(0)
    setTotalCount(selectedCharacter.strokes.length)
    setPoints(undefined)
  }

  /**
   * 处理笔画点击
   */
  const handleStrokeClick = (stroke: Stroke) => {
    // 检查是否可以移动到正确位置
    if (stroke.currentPosition === stroke.position) {
      return // 已经在正确位置
    }

    // 检查是否所有前面的笔画都已经在正确位置
    const allPreviousCorrect = stokes.every(s => 
      s.position < stroke.position ? s.currentPosition === s.position : true
    )

    if (!allPreviousCorrect) {
      return // 前面的笔画还没放好
    }

    // 更新笔画位置
    const updatedStrokes = stokes.map(s => {
      if (s.id === stroke.id) {
        return { ...s, currentPosition: stroke.position }
      }
      return s
    })

    setStrokes(updatedStrokes)
    setScore(prevScore => prevScore + 5)

    // 检查是否所有笔画都已经在正确位置
    const allCorrect = updatedStrokes.every(s => s.currentPosition === s.position)
    if (allCorrect) {
      setCorrectCount(prev => prev + 1)
      // 游戏结束，计算积分
      saveGamePoints(score, 'puzzle')
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
        title="汉字拼图" 
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
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
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
            <div className="max-w-3xl mx-auto">
              {/* 目标汉字 */}
              <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
                <h2 className="text-2xl font-bold text-dark mb-4">拼出汉字: <span className="text-4xl font-bold text-primary">{currentCharacter}</span></h2>
                <p className="text-gray-600">点击下方笔画，按照正确的顺序拼出汉字</p>
              </div>

              {/* 笔画容器 */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-xl font-bold text-dark mb-4">笔画顺序</h3>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {stokes.sort((a, b) => a.position - b.position).map((stroke) => (
                    <div 
                      key={stroke.id}
                      className={`aspect-square rounded-lg flex items-center justify-center text-3xl font-bold ${stroke.currentPosition === stroke.position ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {stroke.currentPosition === stroke.position ? stroke.content : ''}
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-dark mb-4">可用笔画</h3>
                <div className="grid grid-cols-4 gap-4">
                  {stokes.map((stroke) => (
                    <div 
                      key={stroke.id}
                      className={`aspect-square bg-white border-2 border-primary rounded-lg flex items-center justify-center text-3xl font-bold text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors ${stroke.currentPosition === stroke.position ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => stroke.currentPosition !== stroke.position && handleStrokeClick(stroke)}
                    >
                      {stroke.content}
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

export default PuzzleGame
