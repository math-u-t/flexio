<template>
  <div class="inquiry-page py-12">
    <div class="container mx-auto px-4 max-w-2xl">
      <h1 class="text-4xl font-bold mb-8 text-center">お問い合わせ</h1>

      <div class="card elevation-3 p-8 rounded-lg" :class="cardClasses">
        <form @submit.prevent="submitInquiry" class="space-y-6">
          <div>
            <label class="block mb-2 font-medium">
              お名前 (任意)
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="匿名でも可"
              class="input-field"
              :class="inputClasses"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">
              メールアドレス (任意)
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="返信が必要な場合のみ"
              class="input-field"
              :class="inputClasses"
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">
              カテゴリ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              class="input-field"
              :class="inputClasses"
              required
            >
              <option value="">選択してください</option>
              <option value="bug">バグ報告</option>
              <option value="feature">機能リクエスト</option>
              <option value="question">質問</option>
              <option value="feedback">フィードバック</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 font-medium">
              件名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="簡潔な件名"
              class="input-field"
              :class="inputClasses"
              required
            />
          </div>

          <div>
            <label class="block mb-2 font-medium">
              メッセージ <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.message"
              rows="6"
              placeholder="詳細をご記入ください"
              class="input-field"
              :class="inputClasses"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn-submit w-full"
            :disabled="loading"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              <span class="material-icons mr-2">send</span>
              送信
            </span>
            <span v-else>送信中...</span>
          </button>
        </form>
      </div>

      <!-- Success Message -->
      <transition name="fade">
        <div v-if="showSuccess" class="mt-6 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <div class="flex items-center gap-2">
            <span class="material-icons">check_circle</span>
            <span>お問い合わせを受け付けました。ありがとうございます!</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark } = useDarkMode()

const form = ref({
  name: '',
  email: '',
  category: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const showSuccess = ref(false)

const cardClasses = computed(() => {
  return isDark.value ? 'bg-dark-surface' : 'bg-white'
})

const inputClasses = computed(() => {
  return isDark.value
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900'
})

const submitInquiry = async () => {
  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Reset form
  form.value = {
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  }

  loading.value = false
  showSuccess.value = true

  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-primary transition-colors;
}

.btn-submit {
  @apply px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
