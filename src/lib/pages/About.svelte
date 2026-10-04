<script lang="ts">
  import PageHeader from '../components/PageHeader.svelte'

  const steps = [
    { title: '職業を選ぶ', body: 'トップページで、自分たちに合ったカードセットを選びます。' },
    { title: 'カードを引く！', body: 'ボタンを押すと、すべてのカードがくるくる回りはじめます。' },
    { title: '1枚が残る', body: '回転がゆっくりになって、いちばん前に来た1枚が大きく残ります。' },
    { title: '読み上げて話す', body: '残ったお題を読み上げて、ひとり約2分で話してみましょう。' },
  ]
</script>

<PageHeader title="Ping!について" lead="カード1枚から、会話をはじめよう" />

<div class="flex flex-col gap-12 leading-loose">
  <section>
    <h2 class="mb-3 font-display text-xl text-ink">Ping!ってなに？</h2>
    <p class="text-ink/90">
      Ping!は、自己紹介のきっかけになる「お題カード」をランダムに引けるアイスブレイクアプリです。
      初めて会う人どうしや、チームの会のはじまりに、最初のひとことを作ってくれます。
    </p>
    <p class="mt-3 text-ink/90">
      「Ping」は、相手に呼びかけて反応を確かめる合図。
      カードをきっかけに、お互いの「いま」や「好き」に気軽に呼びかけ合える場を目指しています。
    </p>
  </section>

  <section>
    <h2 class="mb-4 font-display text-xl text-ink">使い方</h2>
    <ol class="flex flex-col gap-4">
      {#each steps as step, i (step.title)}
        <li class="flex gap-4">
          <span
            class="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[#b3dcf3] bg-[#e7f5fd] font-display text-ink"
          >
            {i + 1}
          </span>
          <div>
            <p class="font-display text-ink">{step.title}</p>
            <p class="text-sm text-muted">{step.body}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <section>
    <h2 class="mb-3 font-display text-xl text-ink">特長</h2>
    <ul class="list-inside list-disc text-ink/90">
      <li>無料・登録なし。ブラウザだけで使えます</li>
      <li>スマートフォンでもパソコンでも使えます</li>
      <li>画面共有すれば、オンラインの集まりでも使えます</li>
      <li>答えたくないお題は、引き直してもOK</li>
      <li>「みんなで写真を撮る」で、5秒後に集合写真を。引いたお題つきの1枚にして、端末に保存できます（写真は送信されません）</li>
    </ul>
    <p class="mt-4 text-sm text-muted">
      ほかの職業向けのカードセットも、順次追加していく予定です。
      まずは<a class="underline hover:text-ink" href="#/cards">カード図鑑</a>で、どんなお題があるか見てみてください。
    </p>
  </section>

  <section>
    <h2 class="mb-3 font-display text-xl text-ink">開発者・お問い合わせ</h2>
    <dl class="grid grid-cols-[6rem_1fr] gap-y-2 text-ink/90">
      <dt class="text-muted">開発者</dt>
      <dd>Akira Maeda</dd>
      <dt class="text-muted">連絡先</dt>
      <dd><a class="underline hover:text-ink" href="mailto:akira@aiedu.jp">akira@aiedu.jp</a></dd>
    </dl>
    <p class="mt-4 text-sm text-muted">
      ご感想やご要望、不具合のご連絡はメールでお気軽にどうぞ。
      ご利用にあたっては<a class="underline hover:text-ink" href="#/terms">利用規約</a>をご確認ください。
    </p>
  </section>
</div>
