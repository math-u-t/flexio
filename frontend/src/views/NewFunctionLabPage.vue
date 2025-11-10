<template>
  <div class="lab-page py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="text-center mb-12">
        <span class="material-icons text-6xl text-primary mb-4 block">science</span>
        <h1 class="text-4xl font-bold mb-4">新機能ラボ</h1>
        <p class="text-lg opacity-80">実験的な機能を試してみましょう</p>
      </div>

      <div class="mb-8 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
        <div class="flex items-start gap-3">
          <span class="material-icons">warning</span>
          <div class="text-sm">
            <p class="font-bold mb-1">注意事項</p>
            <p>ここで紹介されている機能は実験的なものです。予期しない動作やバグが発生する可能性があります。</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Voice Messages -->
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
                <span class="material-icons text-primary">mic</span>
                ボイスメッセージ
              </h3>
              <span class="px-2 py-1 bg-blue-500 text-white text-xs rounded">Beta</span>
            </div>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="features.voiceMessages">
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p class="opacity-80 mb-4">
            音声メッセージを録音して送信できます。最大60秒まで対応しています。
          </p>
          <div class="text-sm opacity-70">
            <p><strong>状態:</strong> 開発中</p>
            <p><strong>予定:</strong> 2024年2月リリース</p>
          </div>
        </div>

        <!-- File Sharing -->
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
                <span class="material-icons text-primary">attach_file</span>
                ファイル共有
              </h3>
              <span class="px-2 py-1 bg-green-500 text-white text-xs rounded">Alpha</span>
            </div>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="features.fileSharing">
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p class="opacity-80 mb-4">
            画像やドキュメントをチャットで共有できます。最大10MBまで対応予定。
          </p>
          <div class="text-sm opacity-70">
            <p><strong>状態:</strong> テスト中</p>
            <p><strong>予定:</strong> 2024年3月リリース</p>
          </div>
        </div>

        <!-- AI Assistant -->
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
                <span class="material-icons text-primary">smart_toy</span>
                AIアシスタント
              </h3>
              <span class="px-2 py-1 bg-purple-500 text-white text-xs rounded">計画中</span>
            </div>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="features.aiAssistant" disabled>
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50"></div>
            </label>
          </div>
          <p class="opacity-80 mb-4">
            メッセージの翻訳や要約をサポートするAIアシスタント機能。
          </p>
          <div class="text-sm opacity-70">
            <p><strong>状態:</strong> 企画中</p>
            <p><strong>予定:</strong> 未定</p>
          </div>
        </div>

        <!-- Video Chat -->
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
                <span class="material-icons text-primary">videocam</span>
                ビデオチャット
              </h3>
              <span class="px-2 py-1 bg-purple-500 text-white text-xs rounded">計画中</span>
            </div>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="features.videoChat" disabled>
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50"></div>
            </label>
          </div>
          <p class="opacity-80 mb-4">
            匿名性を保ったままビデオ通話ができる機能。顔フィルター付き。
          </p>
          <div class="text-sm opacity-70">
            <p><strong>状態:</strong> リサーチ中</p>
            <p><strong>予定:</strong> 未定</p>
          </div>
        </div>
      </div>

      <!-- Feedback Section -->
      <section class="mt-12 card elevation-2 p-8 rounded-lg text-center" :class="cardClasses">
        <h2 class="text-2xl font-bold mb-4">フィードバックをお寄せください</h2>
        <p class="mb-6 opacity-80">
          どの機能に興味がありますか？ あなたの意見が次の開発の参考になります。
        </p>
        <router-link to="/inquiry" class="btn-primary px-8 py-3 rounded-lg inline-flex items-center">
          <span class="material-icons mr-2">feedback</span>
          フィードバックを送る
        </router-link>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

const features = ref({
  voiceMessages: false,
  fileSharing: false,
  aiAssistant: false,
  videoChat: false
})

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white hover:bg-purple-700 transition-colors font-medium;
}
</style>
