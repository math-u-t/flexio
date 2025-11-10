<template>
  <div class="admin-page py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold">管理者ページ</h1>
        <span class="px-4 py-2 bg-red-500 text-white rounded-lg">Admin</span>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="text-sm opacity-70 mb-1">総ユーザー数</div>
          <div class="text-3xl font-bold">{{ adminStats.totalUsers }}</div>
          <div class="text-sm text-green-500 mt-1">+12% 今週</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="text-sm opacity-70 mb-1">アクティブチャット</div>
          <div class="text-3xl font-bold">{{ adminStats.activeChats }}</div>
          <div class="text-sm text-green-500 mt-1">+8% 今週</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="text-sm opacity-70 mb-1">今日のメッセージ</div>
          <div class="text-3xl font-bold">{{ adminStats.todayMessages }}</div>
          <div class="text-sm text-red-500 mt-1">-3% 昨日比</div>
        </div>
        <div class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="text-sm opacity-70 mb-1">報告数</div>
          <div class="text-3xl font-bold text-red-500">{{ adminStats.reports }}</div>
          <div class="text-sm opacity-70 mt-1">要対応</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="flex gap-2 border-b" :class="borderClasses">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 font-medium transition-colors"
            :class="activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'opacity-70 hover:opacity-100'"
          >
            <span class="material-icons text-sm align-middle mr-1">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="card elevation-2 rounded-lg overflow-hidden" :class="cardClasses">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b" :class="borderClasses">
              <tr>
                <th class="text-left p-4">ユーザーID</th>
                <th class="text-left p-4">ユーザー名</th>
                <th class="text-left p-4">登録日</th>
                <th class="text-left p-4">ステータス</th>
                <th class="text-left p-4">アクション</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b" :class="borderClasses">
                <td class="p-4 font-mono text-sm">{{ user.id }}</td>
                <td class="p-4">{{ user.username }}</td>
                <td class="p-4 text-sm">{{ user.createdAt }}</td>
                <td class="p-4">
                  <span class="px-3 py-1 rounded-full text-xs" :class="user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
                    {{ user.status === 'active' ? 'アクティブ' : '停止中' }}
                  </span>
                </td>
                <td class="p-4">
                  <button class="text-primary hover:underline text-sm mr-3">詳細</button>
                  <button class="text-red-500 hover:underline text-sm">停止</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Chats Tab -->
      <div v-if="activeTab === 'chats'" class="card elevation-2 rounded-lg overflow-hidden" :class="cardClasses">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b" :class="borderClasses">
              <tr>
                <th class="text-left p-4">チャットID</th>
                <th class="text-left p-4">名前</th>
                <th class="text-left p-4">メンバー数</th>
                <th class="text-left p-4">作成日</th>
                <th class="text-left p-4">アクション</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chat in chats" :key="chat.id" class="border-b" :class="borderClasses">
                <td class="p-4 font-mono text-sm">{{ chat.id }}</td>
                <td class="p-4">{{ chat.name }}</td>
                <td class="p-4">{{ chat.members }}</td>
                <td class="p-4 text-sm">{{ chat.createdAt }}</td>
                <td class="p-4">
                  <button class="text-primary hover:underline text-sm mr-3">詳細</button>
                  <button class="text-red-500 hover:underline text-sm">削除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports Tab -->
      <div v-if="activeTab === 'reports'" class="space-y-4">
        <div v-for="report in reports" :key="report.id" class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-3 py-1 bg-red-500 text-white rounded text-sm">{{ report.type }}</span>
                <span class="text-sm opacity-50">{{ report.date }}</span>
              </div>
              <p class="font-medium mb-2">{{ report.description }}</p>
              <p class="text-sm opacity-70">報告者: {{ report.reporter }}</p>
            </div>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                対応済み
              </button>
              <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                詳細
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="card elevation-2 p-6 rounded-lg" :class="cardClasses">
        <h2 class="text-2xl font-bold mb-6">システム設定</h2>
        <div class="space-y-6">
          <div>
            <label class="block mb-2 font-medium">メンテナンスモード</label>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="settings.maintenanceMode">
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label class="block mb-2 font-medium">新規登録許可</label>
            <label class="relative inline-block w-12 h-6">
              <input type="checkbox" class="sr-only peer" v-model="settings.allowNewRegistrations">
              <div class="w-full h-full bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label class="block mb-2 font-medium">最大チャットメンバー数</label>
            <input
              v-model="settings.maxChatMembers"
              type="number"
              class="input-field w-32"
              :class="inputClasses"
            />
          </div>

          <button class="btn-primary px-6 py-3 rounded-lg">
            設定を保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

const activeTab = ref('users')

const tabs = [
  { id: 'users', label: 'ユーザー', icon: 'people' },
  { id: 'chats', label: 'チャット', icon: 'chat' },
  { id: 'reports', label: '報告', icon: 'report' },
  { id: 'settings', label: '設定', icon: 'settings' }
]

const adminStats = ref({
  totalUsers: 125847,
  activeChats: 3245,
  todayMessages: 45678,
  reports: 12
})

const users = ref([
  { id: 'user_abc123', username: 'User1', createdAt: '2024-01-15', status: 'active' },
  { id: 'user_def456', username: 'User2', createdAt: '2024-01-14', status: 'active' },
  { id: 'user_ghi789', username: 'User3', createdAt: '2024-01-13', status: 'suspended' }
])

const chats = ref([
  { id: 'chat_abc', name: 'Sample Chat 1', members: 15, createdAt: '2024-01-15' },
  { id: 'chat_def', name: 'Sample Chat 2', members: 8, createdAt: '2024-01-14' },
  { id: 'chat_ghi', name: 'Sample Chat 3', members: 23, createdAt: '2024-01-13' }
])

const reports = ref([
  {
    id: 1,
    type: 'スパム',
    description: 'チャットルームでスパム行為が報告されました',
    reporter: 'user_xyz',
    date: '2024-01-15 14:30'
  },
  {
    id: 2,
    type: '不適切なコンテンツ',
    description: '不適切なメッセージが投稿されました',
    reporter: 'user_abc',
    date: '2024-01-15 12:15'
  }
])

const settings = ref({
  maintenanceMode: false,
  allowNewRegistrations: true,
  maxChatMembers: 100
})

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})

const borderClasses = computed(() => {
  return isDark.value ? 'border-gray-700' : 'border-gray-200'
})

const inputClasses = computed(() => {
  return isDark.value
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900'
})
</script>

<style scoped>
.input-field {
  @apply px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-purple-700 transition-colors font-medium;
}
</style>
