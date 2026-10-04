<script lang="ts">
  import PageHeader from '../components/PageHeader.svelte'

  type Article = { title: string; paragraphs?: string[]; items?: string[] }

  const articles: Article[] = [
    {
      title: '第1条（適用）',
      paragraphs: [
        'この利用規約（以下「本規約」）は、Akira Maeda（以下「開発者」）が提供するWebアプリ「Ping!」（以下「本サービス」）の利用条件を定めるものです。',
        '利用者は、本サービスを利用した時点で、本規約に同意したものとみなします。',
      ],
    },
    {
      title: '第2条（サービス内容）',
      paragraphs: [
        '本サービスは、自己紹介や会話のきっかけとなるお題カードをランダムに表示する、アイスブレイク用のWebアプリです。',
        '本サービスは無料で、ユーザー登録なしに利用できます。',
      ],
    },
    {
      title: '第3条（禁止事項）',
      paragraphs: ['利用者は、本サービスの利用にあたり、次の行為をしてはいけません。'],
      items: [
        '法令または公序良俗に反する行為',
        '開発者または第三者の権利（著作権、プライバシーなど）を侵害する行為',
        '本サービスの運営を妨げる行為（過度なアクセス、不正アクセス、改ざんなど）',
        '本サービスのカード、イラスト、文章を、許可なく複製・転載・再配布する行為、または営利目的で利用する行為',
        '本サービスのお題を使って、他者を傷つける、不快にさせる、ハラスメントにあたる言動をする行為',
        'その他、開発者が不適切と判断する行為',
      ],
    },
    {
      title: '第4条（利用上のご注意）',
      paragraphs: [
        'お題に答えることを他の人に強制しないでください。答えたくないお題は、引き直しても、パスしても構いません。',
        '業務上の機密情報や、他人の個人情報を話さないようご注意ください。',
      ],
    },
    {
      title: '第5条（知的財産権）',
      paragraphs: [
        '本サービスのプログラム、デザイン、お題の文章、イラストなどに関する権利は、開発者または正当な権利者に帰属します。',
        '勉強会、研修、懇親会などで本サービスの画面を表示・共有して使うことは、個人・団体を問わずご自由にどうぞ。ただし、第3条の禁止事項に当たる利用はできません。',
      ],
    },
    {
      title: '第6条（個人情報・利用情報の取り扱い）',
      paragraphs: [
        '本サービスにはユーザー登録や入力フォームがなく、開発者が利用者の個人情報を取得・保存することはありません。',
        'ただし、次の外部サービスを利用しており、利用者のアクセス情報（IPアドレス等）が各事業者に送信・記録される場合があります。詳細は各事業者のプライバシーポリシーをご確認ください。',
      ],
      items: ['GitHub Pages（本サービスのホスティング）', 'Google Fonts（フォントの配信）'],
    },
    {
      title: '第6条の2（写真撮影機能）',
      paragraphs: [
        '「みんなで写真を撮る」機能は、利用者の端末のカメラを使用します。カメラの映像と撮影した写真は、利用者の端末のブラウザ内でのみ処理され、開発者や外部のサーバーに送信・保存されることはありません。',
        '写真が端末に保存されるのは、利用者が「保存する」を選んだ場合のみです。',
        '撮影にあたっては、写り込むすべての方の同意を得てください。撮影した写真の取り扱い（共有・公開を含む）は、利用者の責任で行ってください。',
      ],
    },
    {
      title: '第7条（お問い合わせ）',
      paragraphs: [
        'お問い合わせの際にいただいたメールアドレス等は、返信のためにのみ使用し、第三者に提供しません。',
      ],
    },
    {
      title: '第8条（免責事項）',
      paragraphs: [
        '本サービスは現状のまま提供するもので、内容の正確性、有用性、安全性、継続的な提供を保証するものではありません。',
        '本サービスの利用または利用不能によって利用者に生じた損害について、開発者の故意または重過失による場合を除き、責任を負いません。',
      ],
    },
    {
      title: '第9条（サービスの変更・中断・終了）',
      paragraphs: ['開発者は、利用者への事前の通知なく、本サービスの内容を変更、中断、終了することがあります。'],
    },
    {
      title: '第10条（規約の変更）',
      paragraphs: [
        '開発者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本ページに掲載した時点から効力を生じます。',
      ],
    },
    {
      title: '第11条（準拠法）',
      paragraphs: ['本規約は日本法に準拠し、解釈されるものとします。'],
    },
  ]
</script>

<PageHeader title="利用規約" lead="Ping!をご利用いただく前に、お読みください。" />

<div class="flex flex-col gap-9 leading-loose text-ink/90">
  {#each articles as article (article.title)}
    <section>
      <h2 class="mb-2 font-display text-lg text-ink">{article.title}</h2>
      {#each article.paragraphs ?? [] as paragraph (paragraph)}
        <p class="mt-2">{paragraph}</p>
      {/each}
      {#if article.items}
        <ol class="mt-2 list-inside list-decimal">
          {#each article.items as item (item)}
            <li>{item}</li>
          {/each}
        </ol>
      {/if}
    </section>
  {/each}

  <section class="rounded-blob border-2 border-[#b3dcf3] bg-[#e7f5fd] px-6 py-5">
    <h2 class="mb-2 font-display text-lg text-ink">開発者・連絡先</h2>
    <p>開発者：Akira Maeda</p>
    <p>
      連絡先：<a class="underline hover:text-ink" href="mailto:akira@aiedu.jp">akira@aiedu.jp</a>
    </p>
    <p class="mt-3 text-sm text-muted">制定日：2026年10月4日</p>
  </section>
</div>
