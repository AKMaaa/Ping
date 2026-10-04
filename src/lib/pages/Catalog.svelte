<script lang="ts">
  import PromptCard from '../components/PromptCard.svelte'
  import PageHeader from '../components/PageHeader.svelte'
  import { decks } from '../data/decks'

  const tilts = [-1.2, 0.8, -0.6, 1, -0.9, 0.6]
</script>

<PageHeader title="カード図鑑" lead="すべてのカードをここで見られます。気になるお題を、先に考えておくのもアリ。" />

<div class="flex flex-col gap-14">
  {#each decks as deck (deck.id)}
    <section aria-labelledby="deck-{deck.id}">
      <div class="mb-6 flex items-baseline justify-between gap-4">
        <h2 id="deck-{deck.id}" class="font-display text-2xl text-ink">{deck.name}</h2>
        <a class="text-sm text-muted hover:text-ink hover:underline" href="#/play/{deck.id}">
          このカードで遊ぶ
        </a>
      </div>
      <ul class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        {#each deck.cards as card, i (card.id)}
          <li class="min-h-[26rem]" style="transform: rotate({tilts[i % tilts.length]}deg)">
            <PromptCard {card} />
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
