<script lang="ts">
  import { playPreview, setSoundEnabled, sound, unlockAudio } from '../sound.svelte'

  function toggle() {
    setSoundEnabled(!sound.enabled)
    if (sound.enabled) {
      unlockAudio()
      playPreview() // オンにした瞬間に「ぽん」と鳴らして、聞こえることを確かめられる
    }
  }
</script>

<button
  type="button"
  class="inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink {sound.enabled
    ? 'border-[#b2e4cf] bg-[#e6f8ef]'
    : 'border-[#e3dccd] bg-[#f6f1e6] text-muted'}"
  aria-pressed={sound.enabled}
  onclick={toggle}
>
  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
    {#if sound.enabled}
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    {:else}
      <path d="M16 9.5l4.5 5" />
      <path d="M20.5 9.5l-4.5 5" />
    {/if}
  </svg>
  <span>{sound.enabled ? '効果音：音が鳴ります' : '効果音：音は鳴りません'}</span>
</button>
