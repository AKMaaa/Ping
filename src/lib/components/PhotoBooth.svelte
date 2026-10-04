<script lang="ts">
  import { gsap } from 'gsap'
  import { onDestroy, onMount } from 'svelte'
  import { composePhoto } from '../photo'
  import { playCountBeep, playShutter, unlockAudio } from '../sound.svelte'
  import type { Card } from '../types'

  type Props = {
    /** 直前に当選したカード。あれば写真のフレームに入る */
    card: Card | null
    deckName: string | null
    onclose: () => void
  }

  let { card, deckName, onclose }: Props = $props()

  type Phase = 'starting' | 'ready' | 'counting' | 'review' | 'error'
  const COUNTDOWN = 5

  let phase = $state<Phase>('starting')
  let errorMessage = $state('')
  let count = $state(COUNTDOWN)
  let photoUrl = $state<string | null>(null)
  let saved = $state(false)

  let dialog: HTMLDialogElement
  let video: HTMLVideoElement
  let numberEl = $state<HTMLElement>()
  let flashEl: HTMLElement
  let stream: MediaStream | null = null
  let blob: Blob | null = null
  let timer: ReturnType<typeof setInterval> | undefined

  const base = import.meta.env.BASE_URL

  function describeError(error: unknown): string {
    const name = error instanceof DOMException ? error.name : ''
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return 'カメラの使用が許可されていません。ブラウザのアドレスバー付近の設定から、カメラを「許可」にして、もう一度お試しください。'
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError') {
      return 'カメラが見つかりませんでした。カメラがつながっているか、確認してください。'
    }
    if (name === 'NotReadableError') {
      return 'カメラを使えませんでした。ほかのアプリがカメラを使っていないか、確認してください。'
    }
    return 'カメラを起動できませんでした。'
  }

  async function startCamera() {
    phase = 'starting'
    if (!navigator.mediaDevices?.getUserMedia) {
      errorMessage = 'このブラウザでは、カメラを使えません。'
      phase = 'error'
      return
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      video.srcObject = stream
      await video.play()
      phase = 'ready'
    } catch (error) {
      errorMessage = describeError(error)
      phase = 'error'
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
  }

  function clearTimer() {
    clearInterval(timer)
    timer = undefined
  }

  function popNumber() {
    if (!numberEl) return
    gsap.fromTo(
      numberEl,
      { scale: 1.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.4)' },
    )
  }

  function startCountdown() {
    if (phase !== 'ready') return
    unlockAudio()
    phase = 'counting'
    count = COUNTDOWN
    playCountBeep(false)
    queueMicrotask(popNumber)
    timer = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearTimer()
        void shoot()
        return
      }
      playCountBeep(count === 1)
      popNumber()
    }, 1000)
  }

  function cancelCountdown() {
    clearTimer()
    phase = 'ready'
  }

  async function shoot() {
    playShutter()
    gsap.fromTo(flashEl, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power2.out' })
    try {
      blob = await composePhoto(video, card, deckName, base)
      photoUrl = URL.createObjectURL(blob)
      saved = false
      phase = 'review'
    } catch {
      errorMessage = '写真を作れませんでした。もう一度お試しください。'
      phase = 'error'
    }
  }

  function save() {
    if (!photoUrl) return
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const name = `ping-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.png`
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = name
    link.click()
    saved = true
  }

  function discardPhoto() {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    photoUrl = null
    blob = null
  }

  function retake() {
    discardPhoto()
    phase = 'ready'
  }

  function close() {
    dialog.close()
  }

  onMount(() => {
    dialog.showModal()
    void startCamera()
  })

  onDestroy(() => {
    clearTimer()
    stopCamera()
    discardPhoto()
  })
</script>

<dialog
  bind:this={dialog}
  onclose={onclose}
  aria-label="みんなで写真を撮る"
  class="m-auto max-h-[94svh] w-[min(94vw,36rem)] overflow-y-auto rounded-blob border-2 border-ink bg-paper p-5 text-ink backdrop:bg-ink/40 sm:p-7"
>
  <div class="mb-4 flex items-center justify-between gap-4">
    <h2 class="font-display text-xl">みんなで写真を撮る</h2>
    <button
      type="button"
      class="rounded-full border-2 border-[#e3dccd] px-3 py-1 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      onclick={close}
    >
      閉じる
    </button>
  </div>

  <!-- カメラ映像。プレビューは鏡のように左右反転（保存する写真は反転しない） -->
  <div
    class="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-2 border-[#b3dcf3] bg-[#e7f5fd] {phase ===
    'review'
      ? 'hidden'
      : ''}"
  >
    <video
      bind:this={video}
      class="size-full -scale-x-100 object-cover"
      autoplay
      muted
      playsinline
    ></video>

    {#if phase === 'starting'}
      <p class="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">
        カメラを準備しています…<br />許可を求められたら「許可」を押してください
      </p>
    {/if}

    {#if phase === 'error'}
      <p class="absolute inset-0 flex items-center justify-center bg-[#fdebf3] px-6 text-center text-sm leading-relaxed">
        {errorMessage}
      </p>
    {/if}

    {#if phase === 'counting'}
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          bind:this={numberEl}
          class="flex size-28 items-center justify-center rounded-full border-2 border-ink bg-paper/90 font-display text-6xl"
        >
          {count}
        </span>
        <span class="rounded-full bg-paper/90 px-4 py-1 text-sm">みんな、カメラに入ってね</span>
      </div>
    {/if}

    <div
      bind:this={flashEl}
      class="pointer-events-none absolute inset-0 bg-white opacity-0"
      aria-hidden="true"
    ></div>
  </div>

  {#if phase === 'review' && photoUrl}
    <img
      src={photoUrl}
      alt="撮影した集合写真"
      class="mx-auto max-h-[56svh] w-auto max-w-full rounded-2xl border-2 border-[#b3dcf3]"
    />
  {/if}

  <div class="mt-5 flex flex-col items-center gap-3">
    {#if phase === 'ready'}
      <button
        type="button"
        class="rounded-full border-2 border-ink bg-[#f2a2c3] px-8 py-3 font-display text-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        onclick={startCountdown}
      >
        5秒後に撮影する！
      </button>
      <p class="text-xs text-muted">ボタンを押したら、全員が写る位置に入ってください</p>
    {:else if phase === 'counting'}
      <button
        type="button"
        class="rounded-full border-2 border-[#e3dccd] px-6 py-2 text-sm text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        onclick={cancelCountdown}
      >
        やめる
      </button>
    {:else if phase === 'review'}
      {#if saved}
        <p class="font-display text-lg">保存しました！</p>
      {:else}
        <p class="font-display text-lg">この写真を端末に保存しますか？</p>
      {/if}
      <div class="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          class="rounded-full border-2 border-ink bg-[#7fd0b3] px-7 py-2.5 font-display hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          onclick={save}
        >
          {saved ? 'もう一度保存する' : '保存する'}
        </button>
        <button
          type="button"
          class="rounded-full border-2 border-ink bg-paper px-6 py-2.5 font-display hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          onclick={retake}
        >
          撮りなおす
        </button>
        <button
          type="button"
          class="px-3 py-2 text-sm text-muted hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          onclick={close}
        >
          {saved ? '閉じる' : '保存しないで閉じる'}
        </button>
      </div>
    {:else if phase === 'error'}
      <button
        type="button"
        class="rounded-full border-2 border-ink bg-paper px-6 py-2.5 font-display focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        onclick={startCamera}
      >
        もう一度試す
      </button>
    {/if}

    <p class="mt-1 text-center text-xs leading-relaxed text-muted">
      写真はこの端末の中だけで処理されます。どこにも送信・保存されません。
    </p>
  </div>
</dialog>
