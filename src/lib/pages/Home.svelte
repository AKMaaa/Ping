<script lang="ts">
  import { cardArtSize } from '../data/card-art'
  import { decks } from '../data/decks'

  const base = import.meta.env.BASE_URL
  const tilts = [-1.2, 0.9, -0.6, 1.1]
</script>

<div class="flex flex-col items-center">
  <header class="mb-10 text-center sm:mb-12">
    <h1 class="font-display text-5xl tracking-wider text-ink sm:text-6xl">Ping!</h1>
    <p class="mt-4 text-base text-ink sm:text-lg">カード1枚から、会話をはじめよう</p>
    <p class="mt-2 text-balance text-sm text-muted">自己紹介のきっかけになるお題を、ランダムにひとつ。</p>
  </header>

  <section class="w-full max-w-md" aria-labelledby="deck-heading">
    <h2 id="deck-heading" class="mb-4 text-center font-display text-lg text-ink">職業を選んでね</h2>
    <ul class="flex flex-col gap-5">
      {#each decks as deck, i (deck.id)}
        <li>
          <a
            href="#/play/{deck.id}"
            data-accent={deck.accent}
            class="flex items-center gap-4 rounded-blob border-2 border-(--a-line) bg-(--a-soft) px-5 py-4 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            style="transform: rotate({tilts[i % tilts.length]}deg)"
          >
            <img
              src="{base}{deck.cards[0]?.image}"
              alt=""
              width={cardArtSize.width}
              height={cardArtSize.height}
              class="h-20 w-auto max-w-28 shrink-0 object-contain object-bottom"
              draggable="false"
            />
            <span class="flex flex-col gap-1">
              <span class="font-display text-2xl text-ink">{deck.name}</span>
              <span class="text-sm text-muted">{deck.description}</span>
              <span class="text-xs text-muted">{deck.cards.length}枚</span>
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>
