import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const toggle = () => {
    isDark.value = !isDark.value
  }

  const setDark = (value) => {
    isDark.value = value
  }

  // Watch for changes and update localStorage and document class
  watch(isDark, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('sphylics_theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('sphylics_theme', 'light')
    }
  })

  // Initialize theme on mount
  onMounted(() => {
    const savedTheme = localStorage.getItem('sphylics_theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = prefersDark
    }

    // Apply initial theme
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    isDark,
    toggle,
    setDark
  }
}
