import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth-store'
import {
  LoginCredentials,
  RegisterCredentials,
  ChangePasswordData,
  ApiErrorResponse,
} from '@/types/auth.types'

/**
 * Custom hook for authentication operations
 * Provides login, register, logout, and other auth-related functions
 */
export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      // Store token and user data
      auth.setAccessToken(response.data.access_token)
      auth.setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        tenant_id: response.data.user.tenant_id,
        role: response.data.user.roles?.map((role) => role.name) || [],
        exp: new Date(response.data.expires_at).getTime(),
      })

      toast.success(response.message || 'Login successful!')

      // Get redirect URL from current location search params
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirect')

      // Navigate to redirect URL or dashboard
      if (redirectTo) {
        window.location.href = redirectTo
      } else {
        navigate({ to: '/', replace: true })
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)

      // Handle validation errors
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((errors) => {
          errors.forEach((err) => toast.error(err))
        })
      }
    },
  })

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authService.register(credentials),
    onSuccess: (response) => {
      // Store token and user data
      auth.setAccessToken(response.data.access_token)
      auth.setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        tenant_id: response.data.user.tenant_id,
        role: response.data.user.roles?.map((role) => role.name) || [],
        exp: new Date(response.data.expires_at).getTime(),
      })

      toast.success(response.message || 'Registration successful!')

      // Get redirect URL from current location search params
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get('redirect')

      // Navigate to redirect URL or dashboard
      if (redirectTo) {
        window.location.href = redirectTo
      } else {
        navigate({ to: '/', replace: true })
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      toast.error(message)

      // Handle validation errors
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((errors) => {
          errors.forEach((err) => toast.error(err))
        })
      }
    },
  })

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear auth state
      auth.reset()

      // Clear all queries
      queryClient.clear()

      toast.success('Logged out successfully')

      // Navigate to login
      navigate({ to: '/sign-in', replace: true })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      // Even if logout fails on server, clear local state
      auth.reset()
      queryClient.clear()

      const message =
        error.response?.data?.message || 'Logout failed. Please try again.'
      toast.error(message)

      navigate({ to: '/sign-in', replace: true })
    },
  })

  /**
   * Change password mutation
   */
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => authService.changePassword(data),
    onSuccess: (response) => {
      toast.success(response.message || 'Password changed successfully!')
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        'Password change failed. Please try again.'
      toast.error(message)

      // Handle validation errors
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((errors) => {
          errors.forEach((err) => toast.error(err))
        })
      }
    },
  })

  /**
   * Get current user query
   */
  const userQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: !!auth.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  return {
    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    changePassword: changePasswordMutation.mutate,
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,

    // User data
    user: auth.user,
    currentUser: userQuery.data?.data,
    isLoadingUser: userQuery.isLoading,
    refetchUser: userQuery.refetch,

    // Token
    accessToken: auth.accessToken,
    isAuthenticated: !!auth.accessToken,
  }
}
