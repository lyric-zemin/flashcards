import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import type { Flashcard } from '../utils/api'
import { getFlashcardById, getFlashcardsByAgeGroup } from '../utils/api'

/**
 * 文字详情页组件
 */
const FlashcardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null)
  const [allCards, setAllCards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  // const audioRef = useRef<HTMLAudioElement | null>(null)
  const navigate = useNavigate()

  /**
   * 获取汉字详情和同年龄段的所有汉字
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取当前汉字详情
        const cardData = await getFlashcardById(Number(id))
        setCurrentCard(cardData)

        // 获取同年龄段的所有汉字
        const cardsData = await getFlashcardsByAgeGroup(cardData.ageGroupId)
        setAllCards(cardsData)
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  /**
   * 处理发音播放
   */
  const handlePlayAudio = () => {
    // 这里简化处理，实际项目中应该使用真实的音频文件
    console.log(`播放 ${currentCard?.character} 的发音`)
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 1000)
  }

  /**
   * 切换到上一张卡片
   */
  const handlePreviousCard = () => {
    if (!currentCard) return

    const currentIndex = allCards.findIndex(card => card.id === currentCard.id)
    if (currentIndex > 0) {
      const previousCard = allCards[currentIndex - 1]
      navigate(`/flashcard/${previousCard.id}`)
    }
  }

  /**
   * 切换到下一张卡片
   */
  const handleNextCard = () => {
    if (!currentCard) return

    const currentIndex = allCards.findIndex(card => card.id === currentCard.id)
    if (currentIndex < allCards.length - 1) {
      const nextCard = allCards[currentIndex + 1]
      navigate(`/flashcard/${nextCard.id}`)
    }
  }

  /**
   * 返回列表页
   */
  const handleBackToList = () => {
    if (currentCard) {
      navigate(`/flashcards/${currentCard.ageGroupId}`)
    } else {
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">加载中...</div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light">
        <div className="text-2xl font-bold text-primary">汉字不存在</div>
      </div>
    )
  }

  return (
    <>
      {/* 头部 */}
      <Header 
        title={currentCard.ageGroup?.name || ''}
        showBackButton={true}
        backButtonText="← 返回列表"
        onBackClick={handleBackToList}
      />

      {/* 主要内容 */}
      <div className="flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* 卡片 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500">
              {/* 图片部分 */}
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <img 
                  src={currentCard.imageUrl} 
                  alt={currentCard.character} 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 文字部分 */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-6xl font-bold text-primary">{currentCard.character}</h2>
                    <p className="text-2xl text-gray-500 mt-2">{currentCard.pinyin}</p>
                  </div>
                  <button 
                    className={`bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl hover:bg-opacity-90 transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
                    onClick={handlePlayAudio}
                  >
                    🔊
                  </button>
                </div>
                <p className="text-xl text-dark mb-8">{currentCard.meaning}</p>

                {/* 导航按钮 */}
                <div className="flex justify-between">
                  <button 
                    className="bg-gray-200 text-dark px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePreviousCard}
                    disabled={allCards.findIndex(card => card.id === currentCard.id) === 0}
                  >
                    上一张
                  </button>
                  <button 
                    className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleNextCard}
                    disabled={allCards.findIndex(card => card.id === currentCard.id) === allCards.length - 1}
                  >
                    下一张
                  </button>
                </div>
              </div>
            </div>

            {/* 卡片导航指示器 */}
            <div className="flex justify-center mt-8">
              {allCards.map((card) => (
                <button
                  key={card.id}
                  className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${card.id === currentCard.id ? 'bg-primary w-8' : 'bg-gray-300'}`}
                  onClick={() => navigate(`/flashcard/${card.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FlashcardDetailPage
