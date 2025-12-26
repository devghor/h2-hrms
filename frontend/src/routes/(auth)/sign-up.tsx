import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUp } from '@/features/auth/sign-up'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-up')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    // Redirect to dashboard if already authenticated
    if (auth.accessToken) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignUp,
})
