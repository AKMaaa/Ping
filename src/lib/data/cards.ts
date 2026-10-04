import type { Card } from '../types'

export const CARD_DURATION_LABEL = '約2分'

const engineerPrompts = [
  { id: 1, category: '技術スタック', prompt: '好きなプログラミング言語は？', accent: 'sky' },
  { id: 2, category: '得意領域', prompt: '自分は何系のエンジニア？', accent: 'mint' },
  {
    id: 3,
    category: 'エンジニアあるある',
    prompt: '最近、技術的にテンションが上がった瞬間は？',
    accent: 'lavender',
  },
  {
    id: 4,
    category: '開発経験',
    prompt: '今までで一番印象に残っている開発経験は？',
    accent: 'apricot',
  },
  {
    id: 5,
    category: '技術的好奇心',
    prompt: '最近、気になって仕方がない技術は？',
    accent: 'aqua',
  },
  {
    id: 6,
    category: '開発スタイル',
    prompt: '自分が開発するときに大切にしていることは？',
    accent: 'pink',
  },
  {
    id: 7,
    category: 'エンジニアの個性',
    prompt: '個人開発するなら、何を作るのが好き？',
    accent: 'purple',
  },
  {
    id: 8,
    category: '趣味・プライベート',
    prompt: '最近、時間を忘れるくらい夢中になったことは？',
    accent: 'mint',
  },
  { id: 9, category: '日常・こだわり', prompt: '実は、ちょっとこだわっていることは？', accent: 'blue' },
  {
    id: 10,
    category: 'キャリア・将来',
    prompt: 'これから、どんなエンジニアになりたい？',
    accent: 'orange',
  },
] as const satisfies readonly Omit<Card, 'image'>[]

/** 画像は public/cards/{id}.png。寸法は npm run normalize-cards で揃える。 */
export const engineerCards: readonly Card[] = engineerPrompts.map((card) => ({
  ...card,
  image: `cards/${card.id}.png`,
}))
