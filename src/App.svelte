<script lang="ts">
  import SiteFooter from './lib/components/SiteFooter.svelte'
  import { findDeck } from './lib/data/decks'
  import { router } from './lib/router.svelte'
  import About from './lib/pages/About.svelte'
  import Catalog from './lib/pages/Catalog.svelte'
  import Home from './lib/pages/Home.svelte'
  import Play from './lib/pages/Play.svelte'
  import Terms from './lib/pages/Terms.svelte'

  const route = $derived(router.route)
  const deck = $derived(route.name === 'play' ? findDeck(route.deckId) : undefined)

  const titles = {
    home: 'Ping!',
    play: 'Ping!',
    catalog: 'カード図鑑 | Ping!',
    about: 'Ping!について | Ping!',
    terms: '利用規約 | Ping!',
    notFound: 'ページが見つかりません | Ping!',
  } as const

  $effect(() => {
    document.title = deck ? `${deck.name} | Ping!` : titles[route.name]
  })
</script>

<div class="flex min-h-svh flex-col items-center">
  {#if route.name !== 'home'}
    <a
      href="#/"
      class="mt-6 font-display text-2xl tracking-wider text-ink hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      Ping!
    </a>
  {/if}

  <main
    class="mx-auto w-full flex-1 px-6 pt-8 sm:pt-10 {route.name === 'home' || route.name === 'play'
      ? 'max-w-3xl'
      : 'max-w-2xl'} {route.name === 'home' ? 'pt-12 sm:pt-16' : ''}"
  >
    {#if route.name === 'home'}
      <Home />
    {:else if route.name === 'play' && deck}
      <Play {deck} />
    {:else if route.name === 'catalog'}
      <Catalog />
    {:else if route.name === 'about'}
      <About />
    {:else if route.name === 'terms'}
      <Terms />
    {:else}
      <div class="py-20 text-center">
        <p class="font-display text-2xl text-ink">ページが見つかりません</p>
        <a class="mt-6 inline-block text-muted underline hover:text-ink" href="#/">トップへ戻る</a>
      </div>
    {/if}
  </main>

  <SiteFooter />
</div>
