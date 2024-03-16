export const CONFIG = {
    KEY: {
        SYSTEM_NAME: 'SOS HUCE',
        LOCALIZATION: 'language',
        TOKEN: `UI`,
        LAST_ACTIVE_TIME: 'lastActiveTime',
        MENU: 'menu-session',
        METHOD_POST: 'POST',
        METHOD_GET: 'GET',
        METHOD_PUT: 'PUT',
        METHOD_DELETE: 'DELETE',
        DEFAULT_REDIRECT: 'default-redirect',
        ROOT_PAGE: '',
        IS_LOGGED_IN: 'ILGI',
        IS_LOGGED_IN_VALUE: '"$1@2#3"',
        TOKEN_EXPIRED: 'TE',
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
        SESSION_TIME_IN_SECONDS: 3600
    },
    ROLE: {
        USER: 'USER',
        ADMIN: 'ADMIN',
        MANAGER: 'MANAGER',
        ROOT: ['MANAGER','ADMIN'],
    }
}
