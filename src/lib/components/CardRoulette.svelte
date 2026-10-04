<script lang="ts">
  import { gsap } from 'gsap'
  import { onDestroy, onMount } from 'svelte'
  import { pickNextCard } from '../draw'
  import { playDen, playTick, startSpinSound, unlockAudio } from '../sound.svelte'
  import type { Card, Deck } from '../types'
  import PromptCard from './PromptCard.svelte'

  type Props = {
    deck: Deck
    /** 演出中は true。ボタンの無効化に使う */
    busy?: boolean
    /** 今、当選しているカード。抽選中と抽選前は null */
    winner?: Card | null
  }

  let { deck, busy = $bindable(false), winner = $bindable(null) }: Props = $props()

  const CARD_W = 320
  const CARD_H = 416
  const SPIN_TURNS = 3
  const SPIN_SECONDS = 4.6
  /** 回転中にリングを奥へ引く距離。当選時に手前へ出てくる */
  const PULL_BACK = 480
  const SPARK_COLORS = ['#7cc4ea', '#7fd0b3', '#b8a8e6', '#f2a2c3', '#f7c76e', '#f5ae7e']
  const SPARK_SHAPES = ['★', '♪', '♡', '✦']

  const count = $derived(deck.cards.length)
  const step = $derived(360 / count)
  /** カードが隣と重ならない円柱の半径 */
  const radius = $derived((CARD_W * 1.06) / 2 / Math.tan(Math.PI / count))

  let announcement = $state('')

  let stage: HTMLDivElement
  let ring: HTMLDivElement
  let badgeEl: HTMLDivElement

  // リングの状態。GSAP でこのオブジェクトを動かし、onUpdate で DOM に反映する
  const pose = { angle: 0, z: 0 }
  let idleTween: gsap.core.Tween | null = null
  let timeline: gsap.core.Timeline | null = null
  let lastWinnerId: number | null = null

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const items = () => Array.from(ring.querySelectorAll<HTMLElement>('[data-ring-item]'))

  function render() {
    gsap.set(ring, { rotationY: pose.angle, z: pose.z })
  }

  function startIdle() {
    if (reducedMotion()) return
    idleTween = gsap.to(pose, {
      angle: pose.angle - 360,
      duration: 48,
      ease: 'none',
      repeat: -1,
      onUpdate: render,
    })
  }

  onMount(() => {
    pose.z = -radius - PULL_BACK
    render()
    startIdle()
  })

  /** 抽選を始める。演出中は何もしない */
  export function draw() {
    if (busy) return
    busy = true
    announcement = ''
    winner = null
    unlockAudio()
    startSpinSound()

    // 結果は演出の開始時点で決める
    const target = pickNextCard(deck.cards, lastWinnerId)
    lastWinnerId = target.id
    const targetIndex = deck.cards.findIndex((card) => card.id === target.id)

    idleTween?.kill()
    timeline?.kill()

    // i 番目のカードが正面に来る角度は -i * step。今の角度から数周先の、その角度に止める
    const base = -targetIndex * step
    const delta = (((pose.angle - base) % 360) + 360) % 360
    const finalAngle = pose.angle - delta - 360 * SPIN_TURNS

    if (reducedMotion()) {
      pose.angle = finalAngle
      pose.z = -radius + finalForwardZ()
      render()
      gsap.set(items(), { opacity: (i: number) => (i === targetIndex ? 1 : 0) })
      land(target)
      return
    }

    gsap.to(badgeEl, { autoAlpha: 0, duration: 0.15 })
    // カードが正面を通るたびに「でけ」と鳴らす
    let lastSlot = Math.round(-pose.angle / step)
    const tickOnPass = () => {
      render()
      const slot = Math.round(-pose.angle / step)
      if (slot !== lastSlot) {
        lastSlot = slot
        playTick()
      }
    }
    timeline = gsap.timeline({ onComplete: () => land(target) })
    timeline
      // 前回の当選で消したカードを戻し、リングを奥へ引く
      .to(items(), { opacity: 1, duration: 0.3 }, 0)
      .to(pose, { z: -radius - PULL_BACK, duration: 0.5, ease: 'power2.out', onUpdate: render }, 0)
      // 全カードがリングになって回り、減速して止まる
      .to(
        pose,
        { angle: finalAngle, duration: SPIN_SECONDS, ease: 'power3.out', onUpdate: tickOnPass },
        0,
      )

    // 止まる少し前から、当選カードを手前に出し始め、他のカードを消す
    timeline
      .to(
        items().filter((_, i) => i !== targetIndex),
        { opacity: 0, duration: 0.45, ease: 'power1.in' },
        SPIN_SECONDS - 0.2,
      )
      .to(
        pose,
        { z: -radius + finalForwardZ(), duration: 0.7, ease: 'back.out(2.2)', onUpdate: render },
        SPIN_SECONDS - 0.35,
      )
  }

  /** 当選カードを前に出す量。画面が広いほど大きく見せる */
  function finalForwardZ() {
    return window.innerWidth >= 640 ? 160 : 40
  }

  function land(target: Card) {
    announcement = describe(target)
    winner = target
    playDen()
    if (reducedMotion()) {
      busy = false
      return
    }

    const winnerEl = items().find((el) => el.dataset.cardId === String(target.id))
    gsap
      .timeline({ onComplete: () => (busy = false) })
      .fromTo(
        badgeEl,
        { autoAlpha: 1, scale: 0, rotation: -24 },
        { scale: 1, rotation: -8, duration: 0.45, ease: 'back.out(3)' },
        0,
      )
      .fromTo(
        winnerEl?.firstElementChild ?? [],
        { scale: 1 },
        { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' },
        0,
      )
    burst()
  }

  /** 星と紙吹雪を少しだけ出して、すぐ消す */
  function burst() {
    const total = 22
    for (let i = 0; i < total; i += 1) {
      const spark = document.createElement('span')
      const isStar = i % 2 === 0
      spark.setAttribute('aria-hidden', 'true')
      spark.className = 'pointer-events-none absolute left-1/2 top-1/2 z-10 block'
      spark.style.color = SPARK_COLORS[i % SPARK_COLORS.length] ?? '#7cc4ea'
      if (isStar) {
        spark.textContent = SPARK_SHAPES[(i / 2) % SPARK_SHAPES.length | 0] ?? '★'
        spark.style.fontSize = `${gsap.utils.random(1, 1.7)}rem`
      } else {
        spark.style.width = '0.6rem'
        spark.style.height = i % 2 ? '0.6rem' : '0.3rem'
        spark.style.borderRadius = i % 2 ? '9999px' : '0.15rem'
        spark.style.background = 'currentColor'
      }
      stage.appendChild(spark)

      const angle = (Math.PI * 2 * i) / total + gsap.utils.random(-0.25, 0.25)
      const distance = gsap.utils.random(150, 300)
      gsap.fromTo(
        spark,
        { x: 0, y: 0, scale: 0.4, rotation: 0, opacity: 1 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          scale: 1,
          rotation: gsap.utils.random(-200, 200),
          duration: 0.7,
          ease: 'power2.out',
        },
      )
      gsap.to(spark, {
        opacity: 0,
        y: `+=${gsap.utils.random(20, 50)}`,
        duration: 0.5,
        delay: 0.55,
        ease: 'power1.in',
        onComplete: () => spark.remove(),
      })
    }
  }

  function describe(card: Card) {
    return `${String(card.id).padStart(2, '0')} ${card.category}：${card.prompt}`
  }

  onDestroy(() => {
    idleTween?.kill()
    timeline?.kill()
    gsap.killTweensOf([pose, badgeEl, ...(ring ? items() : [])])
  })
</script>

<!-- 横にはみ出す奥のカードはここで切る。perspective は stage に持たせる -->
<div class="w-full overflow-x-clip">
  <div
    bind:this={stage}
    class="relative mx-auto"
    style="perspective: 1400px; height: {CARD_H + 80}px; width: {CARD_W}px"
  >
    <div
      bind:this={ring}
      class="absolute left-0 will-change-transform"
      style="top: 40px; width: {CARD_W}px; height: {CARD_H}px; transform-style: preserve-3d"
    >
      {#each deck.cards as card, i (card.id)}
        <!-- 外側は円柱上の位置、内側は演出用の拡大。表は正面、裏は ping! の裏面 -->
        <div
          data-ring-item
          data-card-id={card.id}
          class="absolute left-0 top-0"
          style="width: {CARD_W}px; height: {CARD_H}px; transform: rotateY({i * step}deg) translateZ({radius}px); transform-style: preserve-3d"
        >
          <div class="h-full w-full" style="transform-style: preserve-3d">
            <div class="absolute inset-0" style="backface-visibility: hidden">
              <PromptCard {card} />
            </div>
            <div
              class="absolute inset-0"
              style="backface-visibility: hidden; transform: rotateY(180deg)"
            >
              <PromptCard card={null} />
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div
      bind:this={badgeEl}
      aria-hidden="true"
      class="pointer-events-none absolute -top-1 right-0 z-10 invisible rounded-full border-2 border-ink bg-[#f9dca4] px-4 py-1 font-display text-xl text-ink opacity-0"
    >
      でん！
    </div>
  </div>

  <p class="sr-only" aria-live="polite">{announcement}</p>
</div>
