<script lang="ts">
  type Props = {
    disabled?: boolean
    onclick?: () => void
  }

  let { disabled = false, onclick }: Props = $props()
</script>

<button
  type="button"
  class="rounded-full border-2 border-ink bg-[#7cc4ea] px-10 py-3.5 font-display text-xl tracking-wider text-ink transition-transform enabled:hover:-translate-y-0.5 enabled:active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
  {disabled}
  {onclick}
>
  カードを引く！
</button>
