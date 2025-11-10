<template>
  <div id="app" class="min-h-screen flex flex-col" :class="appClasses">
    <AppHeader />
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useDarkMode } from './composables/useDarkMode'

const { isDark } = useDarkMode()

const appClasses = computed(() => {
  return isDark.value
    ? 'bg-dark-bg text-white'
    : 'bg-light-bg text-gray-900'
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
