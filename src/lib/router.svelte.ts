// 依存を増やさないための最小ハッシュルーター。GitHub Pages でも404にならない。
export type Route =
  | { name: 'home' }
  | { name: 'play'; deckId: string }
  | { name: 'catalog' }
  | { name: 'about' }
  | { name: 'terms' }
  | { name: 'notFound' }

function parse(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/'
  const parts = path.split('/').filter(Boolean)
  const [first, second] = parts

  if (parts.length === 0) return { name: 'home' }
  if (first === 'play' && second && parts.length === 2) return { name: 'play', deckId: second }
  if (parts.length === 1 && first === 'cards') return { name: 'catalog' }
  if (parts.length === 1 && first === 'about') return { name: 'about' }
  if (parts.length === 1 && first === 'terms') return { name: 'terms' }
  return { name: 'notFound' }
}

export const router = $state<{ route: Route }>({ route: parse(window.location.hash) })

window.addEventListener('hashchange', () => {
  router.route = parse(window.location.hash)
  window.scrollTo(0, 0)
})
