import { createFileRoute, redirect } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/otp')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    // Redirect to dashboard if already authenticated
    if (auth.accessToken) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Otp,
})
