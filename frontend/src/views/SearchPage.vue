<template>
  <div class="search-page py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8 text-center">検索</h1>

      <!-- Search Input -->
      <div class="card elevation-3 p-6 rounded-lg mb-8" :class="cardClasses">
        <div class="relative">
          <span class="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 opacity-50">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="チャット名、メッセージ、ユーザー名で検索..."
            class="input-field pl-12"
            :class="inputClasses"
            @input="handleSearch"
          />
        </div>

        <!-- Filters -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter.id"
            @click="activeFilter = filter.id"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="activeFilter === filter.id ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'"
          >
            <span class="material-icons text-sm align-middle mr-1">{{ filter.icon }}</span>
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery">
        <div class="mb-4 opacity-70">
          {{ results.length }} 件の結果が見つかりました
        </div>

        <div v-if="results.length > 0" class="space-y-4">
          <div v-for="result in results" :key="result.id" class="card elevation-2 p-4 rounded-lg cursor-pointer hover:bg-opacity-80" :class="cardClasses" @click="navigateToResult(result)">
            <div class="flex items-start gap-3">
              <span class="material-icons text-primary">{{ getResultIcon(result.type) }}</span>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-1 bg-primary bg-opacity-20 text-primary rounded text-xs">
                    {{ getResultTypeLabel(result.type) }}
                  </span>
                  <span class="text-sm opacity-50">{{ result.date }}</span>
                </div>
                <h3 class="font-bold mb-1">{{ result.title }}</h3>
                <p class="text-sm opacity-80" v-html="highlightQuery(result.content)"></p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 opacity-50">
          <span class="material-icons text-6xl mb-4 block">search_off</span>
          <p>検索結果が見つかりませんでした</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 opacity-50">
        <span class="material-icons text-6xl mb-4 block">search</span>
        <p>検索キーワードを入力してください</p>
      </div>

      <!-- Recent Searches -->
      <div v-if="!searchQuery && recentSearches.length > 0" class="mt-8">
        <h2 class="text-xl font-bold mb-4">最近の検索</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(search, index) in recentSearches"
            :key="index"
            @click="searchQuery = search"
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            <span class="material-icons text-xs align-middle mr-1">history</span>
            {{ search }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDarkMode } from '../composables/useDarkMode'

const router = useRouter()
const { isDark } = useDarkMode()

const searchQuery = ref('')
const activeFilter = ref('all')
const results = ref([])
const recentSearches = ref(['デモチャット', 'プライバシー', 'マークダウン'])

const filters = [
  { id: 'all', label: 'すべて', icon: 'select_all' },
  { id: 'chats', label: 'チャット', icon: 'chat' },
  { id: 'messages', label: 'メッセージ', icon: 'message' },
  { id: 'users', label: 'ユーザー', icon: 'person' }
]

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})

const inputClasses = computed(() => {
  return isDark.value
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900'
})

const mockResults = [
  {
    id: 1,
    type: 'chat',
    title: 'サンプルチャット',
    content: 'これはデモチャットルームです',
    date: '2024-01-15',
    link: '/chat/chat_demo'
  },
  {
    id: 2,
    type: 'message',
    title: 'メッセージ from User1',
    content: 'マークダウン形式でメッセージを送信できます',
    date: '2024-01-14',
    link: '/chat/chat_demo'
  },
  {
    id: 3,
    type: 'info',
    title: 'プライバシーポリシー',
    content: 'ユーザーのプライバシーを最優先に考えています',
    date: '2024-01-10',
    link: '/policy'
  }
]

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    return
  }

  // Mock search
  results.value = mockResults.filter(item => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesFilter =
      activeFilter.value === 'all' ||
      item.type === activeFilter.value ||
      (activeFilter.value === 'chats' && item.type === 'chat') ||
      (activeFilter.value === 'messages' && item.type === 'message')

    return matchesQuery && matchesFilter
  })

  // Add to recent searches
  if (!recentSearches.value.includes(searchQuery.value)) {
    recentSearches.value.unshift(searchQuery.value)
    if (recentSearches.value.length > 5) {
      recentSearches.value.pop()
    }
  }
}

const getResultIcon = (type) => {
  const icons = {
    chat: 'chat_bubble',
    message: 'message',
    user: 'person',
    info: 'info'
  }
  return icons[type] || 'description'
}

const getResultTypeLabel = (type) => {
  const labels = {
    chat: 'チャット',
    message: 'メッセージ',
    user: 'ユーザー',
    info: '情報'
  }
  return labels[type] || 'その他'
}

const highlightQuery = (text) => {
  if (!searchQuery.value) return text
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700">$1</mark>')
}

const navigateToResult = (result) => {
  if (result.link) {
    router.push(result.link)
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors;
}
</style>
