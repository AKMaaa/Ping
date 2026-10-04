<script lang="ts">
  type Props = {
    title: string
    lead?: string
  }

  let { title, lead }: Props = $props()
</script>

<header class="mb-10 text-center">
  <h1 class="font-display text-3xl tracking-wider text-ink sm:text-4xl">{title}</h1>
  {#if lead}
    <p class="mt-3 text-sm leading-relaxed text-muted sm:text-base">{lead}</p>
  {/if}
</header>
