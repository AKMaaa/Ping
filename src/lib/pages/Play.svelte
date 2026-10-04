<script lang="ts">
  import CardRoulette from '../components/CardRoulette.svelte'
  import DrawButton from '../components/DrawButton.svelte'
  import PhotoBooth from '../components/PhotoBooth.svelte'
  import SoundToggle from '../components/SoundToggle.svelte'
  import type { Card, Deck } from '../types'

  type Props = {
    deck: Deck
  }

  let { deck }: Props = $props()

  let busy = $state(false)
  let winner = $state<Card | null>(null)
  let photoOpen = $state(false)
  let roulette = $state<ReturnType<typeof CardRoulette>>()
</script>

<div class="flex flex-col items-center">
  <header class="mb-4 text-center">
    <p class="text-sm text-muted">{deck.name}のカード</p>
  </header>

  <!-- デッキが変わったらリングを作り直す -->
  {#key deck.id}
    <CardRoulette bind:this={roulette} {deck} bind:busy bind:winner />
  {/key}

  <div class="mt-6 flex flex-col items-center gap-5">
    <DrawButton disabled={busy} onclick={() => roulette?.draw()} />
    <div class="flex items-center gap-6">
      <SoundToggle />
      <a class="text-sm text-muted hover:text-ink hover:underline" href="#/">職業を選びなおす</a>
    </div>
  </div>

  <!-- アイスブレイクの最後に、任意で。目立たせすぎず、一番下に置く -->
  <section
    class="mt-14 flex w-full max-w-md flex-col items-center gap-3 rounded-blob border-2 border-dashed border-[#f5c4d9] bg-[#fdebf3]/60 px-6 py-6 text-center"
    aria-labelledby="photo-heading"
  >
    <h2 id="photo-heading" class="font-display text-lg text-ink">おわりに、写真を撮ってみよう</h2>
    <p class="text-sm leading-relaxed text-muted">
      アイスブレイクの最後に、チームのみんなで集合写真をパシャッ。<br />
      撮らなくても大丈夫。気が向いたらどうぞ。
    </p>
    <button
      type="button"
      class="mt-1 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-6 py-2.5 font-display text-ink transition-transform enabled:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
      disabled={busy}
      onclick={() => (photoOpen = true)}
    >
      <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 8.5h3l1.5-2.5h7L17 8.5h3v10H4z" />
        <circle cx="12" cy="13.5" r="3.2" />
      </svg>
      みんなで写真を撮る
    </button>
  </section>
</div>

{#if photoOpen}
  <PhotoBooth card={winner} deckName={deck.name} onclose={() => (photoOpen = false)} />
{/if}
