<template>
  <div class="stats-page py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-4xl font-bold mb-8 text-center">統計情報</h1>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="card elevation-2 p-6 rounded-lg text-center" :class="cardClasses">
          <span class="material-icons text-5xl text-primary mb-3 block">people</span>
          <div class="text-3xl font-bold mb-1">{{ formatNumber(stats.totalUsers) }}</div>
          <div class="text-sm opacity-70">総ユーザー数</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg text-center" :class="cardClasses">
          <span class="material-icons text-5xl text-primary mb-3 block">chat</span>
          <div class="text-3xl font-bold mb-1">{{ formatNumber(stats.totalChats) }}</div>
          <div class="text-sm opacity-70">作成チャット数</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg text-center" :class="cardClasses">
          <span class="material-icons text-5xl text-primary mb-3 block">message</span>
          <div class="text-3xl font-bold mb-1">{{ formatNumber(stats.totalMessages) }}</div>
          <div class="text-sm opacity-70">送信メッセージ数</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg text-center" :class="cardClasses">
          <span class="material-icons text-5xl text-primary mb-3 block">public</span>
          <div class="text-3xl font-bold mb-1">{{ stats.countries }}</div>
          <div class="text-sm opacity-70">利用国数</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <h2 class="text-xl font-bold mb-4">ユーザー増加推移</h2>
          <div class="h-64 flex items-end justify-between gap-2">
            <div v-for="(value, index) in userGrowth" :key="index" class="flex-1 bg-primary rounded-t" :style="{ height: value + '%' }"></div>
          </div>
          <div class="flex justify-between mt-2 text-xs opacity-70">
            <span>1月</span>
            <span>2月</span>
            <span>3月</span>
            <span>4月</span>
            <span>5月</span>
            <span>6月</span>
          </div>
        </div>

        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <h2 class="text-xl font-bold mb-4">メッセージ送信数 (日別)</h2>
          <div class="h-64 flex items-end justify-between gap-2">
            <div v-for="(value, index) in messageStats" :key="index" class="flex-1 bg-green-500 rounded-t" :style="{ height: value + '%' }"></div>
          </div>
          <div class="flex justify-between mt-2 text-xs opacity-70">
            <span>月</span>
            <span>火</span>
            <span>水</span>
            <span>木</span>
            <span>金</span>
            <span>土</span>
            <span>日</span>
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary">schedule</span>
            アクティブ時間帯
          </h3>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span>22:00 - 24:00</span>
                <span class="font-bold">35%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" style="width: 35%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span>20:00 - 22:00</span>
                <span class="font-bold">28%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" style="width: 28%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span>18:00 - 20:00</span>
                <span class="font-bold">22%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" style="width: 22%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary">devices</span>
            デバイス別利用率
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm">モバイル</span>
              <span class="font-bold">58%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: 58%"></div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">デスクトップ</span>
              <span class="font-bold">32%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: 32%"></div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">タブレット</span>
              <span class="font-bold">10%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary h-2 rounded-full" style="width: 10%"></div>
            </div>
          </div>
        </div>

        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <span class="material-icons text-primary">trending_up</span>
            今週のハイライト
          </h3>
          <div class="space-y-4 text-sm">
            <div>
              <div class="font-bold text-2xl text-primary mb-1">+15%</div>
              <div class="opacity-70">新規ユーザー増加</div>
            </div>
            <div>
              <div class="font-bold text-2xl text-green-500 mb-1">+23%</div>
              <div class="opacity-70">メッセージ送信数</div>
            </div>
            <div>
              <div class="font-bold text-2xl text-blue-500 mb-1">98.5%</div>
              <div class="opacity-70">サーバー稼働率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

const stats = ref({
  totalUsers: 125847,
  totalChats: 45328,
  totalMessages: 2847593,
  countries: 87
})

const userGrowth = ref([45, 52, 61, 70, 85, 100])
const messageStats = ref([65, 70, 75, 80, 90, 85, 95])

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})

const formatNumber = (num) => {
  return num.toLocaleString('ja-JP')
}
</script>
