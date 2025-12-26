import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()

    // Redirect to dashboard if already authenticated
    if (auth.accessToken) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignIn2,
})
