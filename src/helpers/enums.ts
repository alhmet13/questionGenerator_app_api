const enum API_ROUTES {
  GENERAL = '',
  AUTH = '/auth',
}

const enum API_VERSION {
  V1 = '/v1',
}

const enum HTTP_STATUS_CODE {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

const enum HASH_PREFIX {
  USER_SESSION = 'edu:session',
  VERIFY_PROCESS = 'edu:verify',
}

export { API_ROUTES, API_VERSION, HTTP_STATUS_CODE, HASH_PREFIX };
