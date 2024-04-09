export const CONFIG = {
    KEY: {
        SYSTEM_NAME: 'SOS HUCE',
        LOCALIZATION: 'language',
        TOKEN: `UI`,
        LAST_ACTIVE_TIME: 'lastActiveTime',
        MENU: 'menuSession',
        METHOD_POST: 'POST',
        METHOD_GET: 'GET',
        METHOD_PUT: 'PUT',
        METHOD_DELETE: 'DELETE',
        IS_LOGGED_IN: 'ILGI',
        IS_LOGGED_IN_VALUE: '"$1@2#3"',
        TOKEN_EXPIRED: 'TE',
        DEFAULT_REDIRECT: '/trang-chu',
        ROOT_PAGE: '',
        REMEMBER: 'RM',
    },
    ROUTES: {
        ROOT_ROUTES: 'ROOT_ROUTES',
        AUTHENTICATION_ROUTES: 'AUTHENTICATION_ROUTES',
        USER_ROUTES: 'USER_ROUTES',
        ADMIN_ROUTES: 'ADMIN_ROUTES',
    },
    GUARD: {
        PRIVATE: false,
        PUBLIC: true,
    },
    DEFAULT_VALUE: {
        TIMEOUT_TOAST: 2000,
        TIMEOUT_TOAST_LONG: 5000,
        TIMEOUT_TOAST_SHORT: 1000,
        SESSION_TIME_IN_SECONDS: 3598
    },
    ROLE: {
        GUEST: 'GUEST',
        USER: 'USER',
        CUSTOMER: ['USER','GUEST'],
        ADMIN: 'ADMIN',
        MANAGER: 'MANAGER',
        ROOT: ['MANAGER','ADMIN'],
    }
}
