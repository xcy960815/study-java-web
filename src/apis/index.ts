export * as usersModule from './users'

export * as adminUserModule from './admin-user'

export * as loginModule from './login'

// export {}

// function namespace<T extends Record<string, (...args:any[])=>any>>(module: T, name: string) {
//     return Object.fromEntries(
//         Object.entries(module).map(([key, value]) => [`${name}-${key}`, value]),
//     );
// }
// export const apis = namespace({ ...users, ...adminUser, ...login }, 'apis')
