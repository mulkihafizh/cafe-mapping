import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Using simple mock auth for scaffolding
  const user = ref<{ id: string, email: string, role: 'admin' | 'user' | 'guest' } | null>(null)

  const role = ref<'admin' | 'user' | 'guest'>('guest')

  function loginAsUser(id: string, email: string) {
    user.value = { id, email, role: 'user' }
    role.value = 'user'
  }

  function loginAsAdmin(id: string, email: string) {
    user.value = { id, email, role: 'admin' }
    role.value = 'admin'
  }

  function logout() {
    user.value = null
    role.value = 'guest'
  }

  return { user, role, loginAsUser, loginAsAdmin, logout }
})
