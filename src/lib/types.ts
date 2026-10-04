export const cardAccents = [
  'sky',
  'mint',
  'lavender',
  'apricot',
  'aqua',
  'pink',
  'purple',
  'blue',
  'orange',
] as const

export type CardAccent = (typeof cardAccents)[number]

export type Card = {
  /** デッキ内の番号（1〜）。画面には2桁で表示する */
  id: number
  category: string
  prompt: string
  accent: CardAccent
  /** public/ からの相対パス。例: cards/1.png */
  image: string
}

/** 職業ごとのカードセット */
export type Deck = {
  /** URLに使う。例: engineer → #/play/engineer */
  id: string
  name: string
  description: string
  accent: CardAccent
  cards: readonly Card[]
}
