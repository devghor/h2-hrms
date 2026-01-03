import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof AxiosError) {
    const response = error.response?.data
    
    // Handle permission errors
    if (response?.errors?.exception?.includes('PermissionDoesNotExist')) {
      errMsg = 'You do not have permission to perform this action.'
    } 
    // Handle validation errors
    else if (response?.errors && typeof response.errors === 'object' && !response.errors.exception) {
      const firstError = Object.values(response.errors)[0]
      errMsg = Array.isArray(firstError) ? firstError[0] : String(firstError)
    }
    // Handle general error messages
    else if (response?.message) {
      errMsg = response.message
    }
    // Fallback to title
    else if (response?.title) {
      errMsg = response.title
    }
    // Handle 403 Forbidden
    else if (error.response?.status === 403) {
      errMsg = 'You do not have permission to perform this action.'
    }
    // Handle 401 Unauthorized
    else if (error.response?.status === 401) {
      errMsg = 'You are not authorized. Please login again.'
    }
  }

  toast.error(errMsg)
}
