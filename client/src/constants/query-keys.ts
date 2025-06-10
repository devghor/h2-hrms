export const QueryKeys = {
  UAM_USERS: {
    GET_ALL: ['USERS_GET_ALL'],
    GET_BY_ID: (id: string) => ['USERS_GET_BY_ID', id],
    CREATE: ['USERS_CREATE'],
    UPDATE: ['USERS_UPDATE'],
    DELETE: ['USERS_DELETE']
  }
};
