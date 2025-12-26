import { createFileRoute, redirect } from '@tanstack/react-router'
import { ForgotPassword } from '@/features/auth/forgot-password'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    // Redirect to dashboard if already authenticated
    if (auth.accessToken) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: ForgotPassword,
})
