<template>
  <div class="error-page py-20">
    <div class="container mx-auto px-4 text-center max-w-2xl">
      <span class="material-icons text-9xl text-red-500 mb-6 block">error_outline</span>
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <h2 class="text-3xl font-bold mb-4">ページが見つかりません</h2>
      <p class="text-lg opacity-80 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div class="flex gap-4 justify-center">
        <router-link to="/" class="btn-primary px-6 py-3 rounded-lg inline-flex items-center">
          <span class="material-icons mr-2">home</span>
          ホームへ戻る
        </router-link>
        <router-link to="/dashboard" class="btn-secondary px-6 py-3 rounded-lg inline-flex items-center">
          <span class="material-icons mr-2">dashboard</span>
          ダッシュボード
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.btn-primary {
  @apply bg-primary text-white hover:bg-purple-700 transition-colors font-medium;
}

.btn-secondary {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium;
}
</style>
