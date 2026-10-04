// 効果音は Web Audio API で合成する（音声ファイルなし）。
// ブラウザの制約で、最初のクリックのあとにしか鳴らせない。
const STORAGE_KEY = 'ping:sound'

function loadEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export const sound = $state({ enabled: loadEnabled() })

export function setSoundEnabled(enabled: boolean) {
  sound.enabled = enabled
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch {
    // 保存できなくても、このタブでは設定が効く
  }
}

let context: AudioContext | null = null

/** ボタンのクリック内で呼ぶ。AudioContext を用意して再開する */
export function unlockAudio() {
  if (!sound.enabled) return
  try {
    context ??= new AudioContext()
    if (context.state === 'suspended') void context.resume()
  } catch {
    context = null
  }
}

const hz = (semitonesFromC5: number) => 523.25 * 2 ** (semitonesFromC5 / 12)

/** マリンバ風のぽん。基音に1オクターブ上を少し混ぜる */
function pluck(freq: number, delay: number, length: number, volume: number) {
  if (!context) return
  const start = context.currentTime + delay
  for (const [mult, vol] of [
    [1, volume],
    [2, volume * 0.28],
  ] as const) {
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq * mult
    gain.gain.setValueAtTime(vol, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
    osc.connect(gain).connect(context.destination)
    osc.start(start)
    osc.stop(start + length + 0.02)
  }
}

/** 低い太鼓 */
function thump(delay: number, volume: number) {
  if (!context) return
  const start = context.currentTime + delay
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(190, start)
  osc.frequency.exponentialRampToValueAtTime(55, start + 0.4)
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45)
  osc.connect(gain).connect(context.destination)
  osc.start(start)
  osc.stop(start + 0.5)
}

/** ノイズのぱしゅっ。シャッターや紙吹雪に使う */
function noise(delay: number, length: number, volume: number, centerHz: number) {
  if (!context) return
  const start = context.currentTime + delay
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * length), context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  source.buffer = buffer
  filter.type = 'bandpass'
  filter.frequency.value = centerHz
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
  source.connect(filter).connect(gain).connect(context.destination)
  source.start(start)
}

// 回転中の音階。ドレミソラを2オクターブ。回るほどにぽろぽろ上がっていく
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21]
let tickCount = 0

export function startSpinSound() {
  tickCount = 0
}

/** 「でけ」。カードが正面を通るたびに、音階を1つ進める */
export function playTick() {
  if (!sound.enabled || !context) return
  const note = SCALE[tickCount % SCALE.length] ?? 0
  tickCount += 1
  pluck(hz(note), 0, 0.16, 0.2)
}

/** 「でん！」。太鼓、ファンファーレ和音、きらきら */
export function playDen() {
  if (!sound.enabled || !context) return
  thump(0, 0.55)
  noise(0, 0.25, 0.18, 4500)
  for (const note of [0, 4, 7, 12]) pluck(hz(note), 0.02, 0.9, 0.16)
  ;[16, 19, 24, 28].forEach((note, i) => pluck(hz(note), 0.12 + i * 0.07, 0.5, 0.1))
}

/** 音をオンにした直後の「ぽん」。鳴るようになったことを知らせる */
export function playPreview() {
  if (!sound.enabled || !context) return
  pluck(hz(12), 0, 0.18, 0.2)
  pluck(hz(19), 0.09, 0.3, 0.2)
}

/** カウントダウン。最後の1つだけ高く */
export function playCountBeep(last: boolean) {
  if (!sound.enabled || !context) return
  pluck(hz(last ? 19 : 7), 0, last ? 0.4 : 0.2, 0.22)
}

/** シャッター */
export function playShutter() {
  if (!sound.enabled || !context) return
  noise(0, 0.05, 0.4, 3000)
  noise(0.07, 0.09, 0.3, 2000)
  pluck(hz(24), 0.1, 0.5, 0.12)
}
