/**
 * 动画工具函数和组件
 */

/**
 * 数字增长动画
 * @param element 目标元素
 * @param start 起始值
 * @param end 结束值
 * @param duration 动画持续时间（毫秒）
 */
export function animateNumber(element: HTMLElement, start: number, end: number, duration: number = 1000) {
  let startTime: number | null = null
  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const value = Math.floor(progress * (end - start) + start)
    element.textContent = value.toString()
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

/**
 * 卡片翻转动画类
 */
export class CardFlipAnimation {
  private element: HTMLElement
  private isFlipped: boolean = false

  constructor(element: HTMLElement) {
    this.element = element
    this.element.style.transition = 'transform 0.6s'
    this.element.style.transformStyle = 'preserve-3d'
  }

  /**
   * 翻转卡片
   */
  flip() {
    if (this.isFlipped) {
      this.element.style.transform = 'rotateY(0deg)'
    } else {
      this.element.style.transform = 'rotateY(180deg)'
    }
    this.isFlipped = !this.isFlipped
  }

  /**
   * 重置卡片状态
   */
  reset() {
    this.element.style.transform = 'rotateY(0deg)'
    this.isFlipped = false
  }
}

/**
 * 弹跳动画类
 */
export class BounceAnimation {
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  /**
   * 执行弹跳动画
   */
  bounce() {
    this.element.style.animation = 'bounce 0.5s'
    setTimeout(() => {
      this.element.style.animation = ''
    }, 500)
  }
}

/**
 * 淡入动画类
 */
export class FadeInAnimation {
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    this.element.style.opacity = '0'
  }

  /**
   * 执行淡入动画
   * @param duration 动画持续时间（毫秒）
   */
  fadeIn(duration: number = 500) {
    this.element.style.transition = `opacity ${duration}ms`
    this.element.style.opacity = '1'
  }
}

/**
 * 缩放动画类
 */
export class ScaleAnimation {
  private element: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
  }

  /**
   * 执行缩放动画
   * @param scale 缩放比例
   * @param duration 动画持续时间（毫秒）
   */
  scale(scale: number = 1.1, duration: number = 300) {
    this.element.style.transition = `transform ${duration}ms`
    this.element.style.transform = `scale(${scale})`
    setTimeout(() => {
      this.element.style.transform = 'scale(1)'
    }, duration)
  }
}
