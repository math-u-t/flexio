<template>
  <div class="information-page py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8">お知らせ</h1>

      <div class="space-y-6">
        <article v-for="news in newsItems" :key="news.id" class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start gap-4">
            <span class="material-icons text-3xl text-primary">{{ news.icon }}</span>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-medium">
                  {{ news.category }}
                </span>
                <span class="text-sm opacity-50">{{ news.date }}</span>
              </div>
              <h2 class="text-2xl font-bold mb-3">{{ news.title }}</h2>
              <p class="opacity-90 leading-relaxed">{{ news.content }}</p>
              <button v-if="news.link" class="mt-4 text-primary hover:underline flex items-center gap-1">
                詳細を見る
                <span class="material-icons text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center gap-2 mt-8">
        <button class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
          <span class="material-icons">chevron_left</span>
        </button>
        <button class="px-4 py-2 rounded bg-primary text-white">1</button>
        <button class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">2</button>
        <button class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">3</button>
        <button class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

const newsItems = ref([
  {
    id: 1,
    icon: 'new_releases',
    category: '新機能',
    date: '2024-01-15',
    title: 'マークダウンプレビュー機能を追加しました',
    content: 'メッセージ入力時にリアルタイムでマークダウンのプレビューが表示されるようになりました。より快適なメッセージ作成をお楽しみください。',
    link: true
  },
  {
    id: 2,
    icon: 'upgrade',
    category: 'アップデート',
    date: '2024-01-10',
    title: 'パフォーマンス改善アップデート',
    content: 'アプリケーション全体のパフォーマンスを大幅に改善しました。メッセージの送受信がより高速になり、UIの応答性も向上しています。',
    link: true
  },
  {
    id: 3,
    icon: 'security',
    category: 'セキュリティ',
    date: '2024-01-05',
    title: 'セキュリティアップデートのお知らせ',
    content: '暗号化アルゴリズムを最新版にアップデートしました。これにより、さらに安全な通信環境を提供できるようになりました。',
    link: true
  },
  {
    id: 4,
    icon: 'dark_mode',
    category: '新機能',
    date: '2024-01-01',
    title: 'ダークモード対応',
    content: 'ダークモードに対応しました。ヘッダーのアイコンから簡単に切り替えることができます。',
    link: true
  },
  {
    id: 5,
    icon: 'info',
    category: 'お知らせ',
    date: '2023-12-28',
    title: 'メンテナンスのお知らせ',
    content: '2024年1月20日 2:00-4:00（日本時間）にメンテナンスを実施します。この間、サービスをご利用いただけません。ご了承ください。',
    link: false
  }
])

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})
</script>
