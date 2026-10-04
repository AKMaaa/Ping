import type { Deck } from '../types'
import { engineerCards } from './cards'

/** 職業別のデッキ。増やすときはここに足す（画像は public/ 配下に置く） */
export const decks: readonly Deck[] = [
  {
    id: 'engineer',
    name: 'エンジニア',
    description: '技術・開発スタイル・キャリアのお題',
    accent: 'sky',
    cards: engineerCards,
  },
]

export function findDeck(id: string): Deck | undefined {
  return decks.find((deck) => deck.id === id)
}
