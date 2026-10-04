import type { Card } from './types'

const WIDTH = 1200
const INK = '#3a4766'
const MUTED = '#7d88a6'
const PAPER = '#fffdf7'
const WHITE = '#ffffff'
const PINK = '#f2a2c3'
const YELLOW = '#f7c76e'
const MINT = '#7fd0b3'

type Palette = { soft: string; line: string; solid: string }
type Ctx = CanvasRenderingContext2D

/** app.css の data-accent から色を読む（色の定義を二重に持たない） */
function readPalette(accent: string): Palette {
  const probe = document.createElement('div')
  probe.dataset.accent = accent
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const style = getComputedStyle(probe)
  const read = (name: string) => style.getPropertyValue(name).trim()
  const palette = { soft: read('--a-soft'), line: read('--a-line'), solid: read('--a-solid') }
  probe.remove()
  return palette
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function roundedRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** 日本語向けに1文字ずつ折り返す */
function wrapLines(ctx: Ctx, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const char of text) {
    if (ctx.measureText(line + char).width > maxWidth && line) {
      lines.push(line)
      line = char
    } else {
      line += char
    }
  }
  if (line) lines.push(line)
  return lines
}

// ---- 飾り（フォントに依存しないよう、パスで描く） ----

function star(ctx: Ctx, x: number, y: number, r: number, color: string, rotate = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotate)
  ctx.beginPath()
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.48
    const angle = (Math.PI / 5) * i - Math.PI / 2
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineJoin = 'round'
  ctx.lineWidth = r * 0.35
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function heart(ctx: Ctx, x: number, y: number, size: number, color: string, rotate = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotate)
  ctx.scale(size / 20, size / 20)
  ctx.beginPath()
  ctx.moveTo(0, 7)
  ctx.bezierCurveTo(-14, -2, -8, -12, 0, -5)
  ctx.bezierCurveTo(8, -12, 14, -2, 0, 7)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function sparkle(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.quadraticCurveTo(0, 0, 0, r)
  ctx.quadraticCurveTo(0, 0, -r, 0)
  ctx.quadraticCurveTo(0, 0, 0, -r)
  ctx.fillStyle = color
  ctx.fill()
  ctx.restore()
}

function note(ctx: Ctx, x: number, y: number, size: number, color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = size * 0.12
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.28, size * 0.2, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(size * 0.24, -size * 0.06)
  ctx.lineTo(size * 0.24, -size * 0.9)
  ctx.quadraticCurveTo(size * 0.5, -size * 0.7, size * 0.6, -size * 0.5)
  ctx.stroke()
  ctx.restore()
}

/** マスキングテープ */
function tape(ctx: Ctx, x: number, y: number, color: string, rotate: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotate)
  ctx.globalAlpha = 0.85
  ctx.fillStyle = color
  ctx.fillRect(-90, -28, 180, 56)
  ctx.globalAlpha = 0.5
  ctx.fillStyle = WHITE
  for (let i = -70; i < 90; i += 40) ctx.fillRect(i, -28, 14, 56)
  ctx.restore()
}

/** ふちがぷくぷくした台紙（雲のような縁） */
function scallopPaper(ctx: Ctx, x: number, y: number, w: number, h: number, outline: string) {
  const r = 24
  const draw = (radius: number, color: string) => {
    ctx.fillStyle = color
    roundedRect(ctx, x, y, w, h, 40)
    ctx.fill()
    const stepX = w / Math.round(w / (r * 1.7))
    const stepY = h / Math.round(h / (r * 1.7))
    for (let px = x + stepX / 2; px < x + w; px += stepX) {
      for (const py of [y, y + h]) {
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    for (let py = y + stepY / 2; py < y + h; py += stepY) {
      for (const px of [x, x + w]) {
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  // 少し大きい輪郭色を先に、その上に台紙色を重ねて縁取りにする
  ctx.save()
  ctx.translate(0, 0)
  draw(r + 6, outline)
  ctx.restore()
  draw(r, PAPER)
}

/** ぽこぽこの水玉背景 */
function polkaDots(ctx: Ctx, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.globalAlpha = 0.55
  const gap = 96
  for (let row = 0, y = 30; y < h + gap; row += 1, y += gap) {
    for (let x = row % 2 ? gap / 2 : 0; x < w + gap; x += gap) {
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

/** カメラ映像1フレームを、かわいいフレームに入れて PNG にする。映像は左右反転しない */
export async function composePhoto(
  video: HTMLVideoElement,
  card: Card | null,
  deckName: string | null,
  base: string,
): Promise<Blob> {
  await document.fonts.load("40px 'Hachi Maru Pop'")
  await document.fonts.load("40px 'Kiwi Maru'")

  const palette = readPalette(card?.accent ?? 'sky')
  const illustration = card ? await loadImage(`${base}${card.image}`) : null

  // レイアウト（上から：リボン、写真、お題の吹き出し、フッター）
  const paper = { x: 56, y: 76, w: WIDTH - 112 }
  const frame = { x: 104, y: 170, w: WIDTH - 208, h: 790 }
  const photo = { x: frame.x + 28, y: frame.y + 28, w: frame.w - 56, h: frame.h - 56 - 40 }
  const bubbleH = card ? 440 : 0
  const bubbleY = frame.y + frame.h + 76
  const footerY = card ? bubbleY + bubbleH : frame.y + frame.h
  const paperH = footerY + 190 - paper.y
  const height = paper.y + paperH + 76

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas を使えません')

  // 背景：パステルに水玉
  ctx.fillStyle = palette.line
  ctx.fillRect(0, 0, WIDTH, height)
  polkaDots(ctx, WIDTH, height, palette.soft)

  // 台紙
  scallopPaper(ctx, paper.x, paper.y, paper.w, paperH, WHITE)

  // 写真フレーム（ほんの少し傾ける）
  ctx.save()
  ctx.translate(frame.x + frame.w / 2, frame.y + frame.h / 2)
  ctx.rotate(-0.018)
  ctx.translate(-(frame.x + frame.w / 2), -(frame.y + frame.h / 2))

  ctx.fillStyle = WHITE
  roundedRect(ctx, frame.x, frame.y, frame.w, frame.h, 36)
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = palette.solid
  ctx.setLineDash([2, 16])
  ctx.lineCap = 'round'
  roundedRect(ctx, frame.x + 8, frame.y + 8, frame.w - 16, frame.h - 16, 30)
  ctx.stroke()
  ctx.setLineDash([])

  // 映像：中央を切り出す
  const vw = video.videoWidth
  const vh = video.videoHeight
  const ratio = photo.w / photo.h
  let sw = vw
  let sh = vw / ratio
  if (sh > vh) {
    sh = vh
    sw = vh * ratio
  }
  ctx.save()
  roundedRect(ctx, photo.x, photo.y, photo.w, photo.h, 22)
  ctx.clip()
  ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, photo.x, photo.y, photo.w, photo.h)
  ctx.restore()

  // フレーム下の余白に、ひとこと
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = INK
  ctx.font = "34px 'Hachi Maru Pop', sans-serif"
  ctx.fillText('みんなで、はい、チーズ！', frame.x + frame.w / 2, frame.y + frame.h - 38)

  // テープ
  tape(ctx, frame.x + 70, frame.y + 6, palette.solid, -0.5)
  tape(ctx, frame.x + frame.w - 70, frame.y + 6, PINK, 0.5)
  ctx.restore()

  // リボンの「Ping!」
  ctx.fillStyle = palette.solid
  roundedRect(ctx, WIDTH / 2 - 190, 34, 380, 108, 54)
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = INK
  ctx.stroke()
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = "78px 'Hachi Maru Pop', sans-serif"
  ctx.fillText('Ping!', WIDTH / 2, 92)

  // お題の吹き出し
  if (card) {
    const bx = frame.x
    const bw = frame.w
    ctx.fillStyle = palette.soft
    ctx.strokeStyle = palette.solid
    ctx.lineWidth = 6
    ctx.setLineDash([2, 16])
    ctx.lineCap = 'round'
    roundedRect(ctx, bx, bubbleY, bw, bubbleH, 56)
    ctx.fill()
    roundedRect(ctx, bx, bubbleY, bw, bubbleH, 56)
    ctx.stroke()
    ctx.setLineDash([])

    // 番号バッジとカテゴリ
    ctx.fillStyle = palette.solid
    ctx.beginPath()
    ctx.arc(bx + 88, bubbleY + 84, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.font = "40px 'Hachi Maru Pop', sans-serif"
    ctx.fillText(String(card.id).padStart(2, '0'), bx + 88, bubbleY + 86)
    ctx.textAlign = 'left'
    ctx.fillStyle = MUTED
    ctx.font = "34px 'Kiwi Maru', sans-serif"
    ctx.fillText(card.category, bx + 148, bubbleY + 86)

    // お題
    ctx.fillStyle = INK
    ctx.textBaseline = 'alphabetic'
    ctx.font = "58px 'Hachi Maru Pop', sans-serif"
    const lines = wrapLines(ctx, card.prompt, bw - 96 - (illustration ? 300 : 0))
    lines.slice(0, 4).forEach((line, i) => ctx.fillText(line, bx + 56, bubbleY + 195 + i * 82))

    if (illustration) {
      const iw = 330
      const ih = (illustration.height / illustration.width) * iw
      ctx.save()
      ctx.translate(bx + bw - iw / 2 - 30, bubbleY + bubbleH - ih / 2 - 26)
      ctx.rotate(0.06)
      ctx.drawImage(illustration, -iw / 2, -ih / 2, iw, ih)
      ctx.restore()
    }
  }

  // フッター
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = MUTED
  ctx.font = "32px 'Kiwi Maru', sans-serif"
  const now = new Date()
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
  ctx.fillText(deckName ? `${deckName}のアイスブレイク ・ ${date}` : date, WIDTH / 2, footerY + 100)

  // 飾り
  star(ctx, 96, 250, 34, YELLOW, -0.3)
  heart(ctx, WIDTH - 96, 330, 44, PINK, 0.3)
  sparkle(ctx, 150, 120, 28, palette.solid)
  sparkle(ctx, WIDTH - 160, 150, 22, YELLOW)
  star(ctx, WIDTH - 90, frame.y + frame.h - 20, 30, MINT, 0.4)
  heart(ctx, 90, frame.y + frame.h + 10, 40, PINK, -0.25)
  note(ctx, WIDTH - 84, footerY + 60, 70, palette.solid)
  star(ctx, 100, footerY + 70, 30, YELLOW, 0.25)
  sparkle(ctx, WIDTH / 2 - 330, footerY + 140, 22, PINK)
  sparkle(ctx, WIDTH / 2 + 330, footerY + 140, 26, MINT)
  // 紙の外側（背景）にも少しだけ
  star(ctx, 28, height - 30, 22, WHITE, 0)
  heart(ctx, WIDTH - 30, height - 34, 30, WHITE, 0.2)
  sparkle(ctx, 30, 40, 22, WHITE)
  sparkle(ctx, WIDTH - 30, 40, 22, WHITE)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('画像を作れませんでした'))), 'image/png')
  })
}
