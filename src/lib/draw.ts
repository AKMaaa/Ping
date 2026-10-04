import type { Card } from './types'

function pickOne<T>(items: readonly T[]): T {
  const item = items[Math.floor(Math.random() * items.length)]
  if (item === undefined) {
    throw new Error('質問カードがありません')
  }
  return item
}

/** 直前のカードを避けて1枚選ぶ。カードが1枚しかないときだけ同じものを返す。 */
export function pickNextCard(cards: readonly Card[], previousId: number | null): Card {
  const candidates = cards.filter((card) => card.id !== previousId)
  return pickOne(candidates.length > 0 ? candidates : cards)
}

/**
 * 回転中に表示するカードの並びを作る。
 * 先頭は今の表示、末尾は抽選結果。隣り合うカードは重ならない。
 */
export function buildSpinSequence(
  cards: readonly Card[],
  startId: number | null,
  target: Card,
  length: number,
): Card[] {
  const sequence: Card[] = []
  let previousId = startId
  for (let i = 0; i < length; i += 1) {
    // 最後の1つ手前は、結果と同じカードにならないようにする
    const avoid = i === length - 1 ? [previousId, target.id] : [previousId]
    const pool = cards.filter((card) => !avoid.includes(card.id))
    const card = pickOne(pool.length > 0 ? pool : cards)
    sequence.push(card)
    previousId = card.id
  }
  sequence.push(target)
  return sequence
}
