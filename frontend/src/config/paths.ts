export const paths = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  TASKS: '/tasks',
  APPS: '/apps',
  CHATS: '/chats',
  UAM: {
    USERS: '/uam/users',
    ROLES: '/uam/roles',
  },
  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_IN_2: '/sign-in-2',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
    OTP: '/otp',
  },
  ERRORS: {
    UNAUTHORIZED: '/errors/unauthorized',
    FORBIDDEN: '/errors/forbidden',
    NOT_FOUND: '/errors/not-found',
    INTERNAL_SERVER_ERROR: '/errors/internal-server-error',
    MAINTENANCE_ERROR: '/errors/maintenance-error',
  },
  SETTINGS: {
    PROFILE: '/settings',
    ACCOUNT: '/settings/account',
    APPEARANCE: '/settings/appearance',
    NOTIFICATIONS: '/settings/notifications',
    DISPLAY: '/settings/display',
  },
  HELP_CENTER: '/help-center',
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
  },
};