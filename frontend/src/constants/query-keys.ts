export const QueryKeys = {
  UAM_USERS: {
    GET_ALL: ['UAM_USERS_GET_ALL'],
    GET_BY_ID: (id: string) => ['UAM_USERS_GET_BY_ID', id],
    CREATE: ['UAM_USERS_CREATE'],
    UPDATE: ['UAM_USERS_UPDATE'],
    DELETE: ['UAM_USERS_DELETE']
  },
  UAM_ROLES: {
    GET_ALL: ['UAM_ROLES_GET_ALL'],
    GET_BY_ID: (id: string) => ['UAM_ROLES_GET_BY_ID', id],
    CREATE: ['UAM_ROLES_CREATE'],
    UPDATE: ['UAM_ROLES_UPDATE'],
    DELETE: ['UAM_ROLES_DELETE']
  }
};
