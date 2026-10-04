<script lang="ts">
  import { cardArtSize } from '../data/card-art'
  import { CARD_DURATION_LABEL } from '../data/cards'
  import type { Card } from '../types'

  type Props = {
    /** null のときは裏面（抽選前） */
    card: Card | null
  }

  let { card }: Props = $props()

  const base = import.meta.env.BASE_URL
</script>

{#if card}
  <article
    data-accent={card.accent}
    class="flex h-full w-full flex-col gap-5 rounded-blob border-2 border-(--a-line) bg-(--a-soft) px-7 py-7 sm:px-9 sm:py-9"
  >
    <div class="flex items-center justify-between gap-3 text-sm text-muted">
      <span class="font-display text-base tabular-nums">{String(card.id).padStart(2, '0')}</span>
      <span class="shrink-0 whitespace-nowrap">{card.category}</span>
    </div>

    <p class="font-display text-xl leading-relaxed text-ink sm:text-2xl">{card.prompt}</p>

    <div class="mt-auto flex items-end justify-between gap-3">
      <div class="min-w-0 flex-1" style="aspect-ratio: {cardArtSize.width} / {cardArtSize.height}">
        <img
          src="{base}{card.image}"
          alt=""
          width={cardArtSize.width}
          height={cardArtSize.height}
          class="h-full w-full object-contain object-bottom"
          draggable="false"
        />
      </div>
      <p class="shrink-0 whitespace-nowrap pb-1 text-sm leading-none text-muted">{CARD_DURATION_LABEL}</p>
    </div>
  </article>
{:else}
  <article
    data-accent="sky"
    class="flex h-full w-full flex-col items-center justify-center gap-3 rounded-blob border-2 border-(--a-line) bg-(--a-soft) px-7 py-9"
  >
    <p class="font-display text-5xl text-ink sm:text-6xl">Ping!</p>
    <span class="size-3 rounded-full bg-(--a-solid)"></span>
  </article>
{/if}
