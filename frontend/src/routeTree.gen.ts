/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AppIndexRouteImport } from './routes/app/index'
import { Route as authRegisterRouteImport } from './routes/(auth)/register'
import { Route as authLoginRouteImport } from './routes/(auth)/login'
import { Route as AppLayoutRouteRouteImport } from './routes/app/_layout/route'
import { Route as AppLayoutReportsRouteImport } from './routes/app/_layout/reports'
import { Route as AppLayoutRecipesRouteImport } from './routes/app/_layout/recipes'
import { Route as AppLayoutInventoryRouteImport } from './routes/app/_layout/inventory'
import { Route as AppLayoutGroceriesRouteImport } from './routes/app/_layout/groceries'
import { Route as AppLayoutDashboardRouteImport } from './routes/app/_layout/dashboard'

const AppRouteImport = createFileRoute('/app')()

const AppRoute = AppRouteImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AppIndexRoute = AppIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRoute,
} as any)
const authRegisterRoute = authRegisterRouteImport.update({
  id: '/(auth)/register',
  path: '/register',
  getParentRoute: () => rootRouteImport,
} as any)
const authLoginRoute = authLoginRouteImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)
const AppLayoutRouteRoute = AppLayoutRouteRouteImport.update({
  id: '/_layout',
  getParentRoute: () => AppRoute,
} as any)
const AppLayoutReportsRoute = AppLayoutReportsRouteImport.update({
  id: '/reports',
  path: '/reports',
  getParentRoute: () => AppLayoutRouteRoute,
} as any)
const AppLayoutRecipesRoute = AppLayoutRecipesRouteImport.update({
  id: '/recipes',
  path: '/recipes',
  getParentRoute: () => AppLayoutRouteRoute,
} as any)
const AppLayoutInventoryRoute = AppLayoutInventoryRouteImport.update({
  id: '/inventory',
  path: '/inventory',
  getParentRoute: () => AppLayoutRouteRoute,
} as any)
const AppLayoutGroceriesRoute = AppLayoutGroceriesRouteImport.update({
  id: '/groceries',
  path: '/groceries',
  getParentRoute: () => AppLayoutRouteRoute,
} as any)
const AppLayoutDashboardRoute = AppLayoutDashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AppLayoutRouteRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/app': typeof AppLayoutRouteRouteWithChildren
  '/login': typeof authLoginRoute
  '/register': typeof authRegisterRoute
  '/app/': typeof AppIndexRoute
  '/app/dashboard': typeof AppLayoutDashboardRoute
  '/app/groceries': typeof AppLayoutGroceriesRoute
  '/app/inventory': typeof AppLayoutInventoryRoute
  '/app/recipes': typeof AppLayoutRecipesRoute
  '/app/reports': typeof AppLayoutReportsRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/app': typeof AppIndexRoute
  '/login': typeof authLoginRoute
  '/register': typeof authRegisterRoute
  '/app/dashboard': typeof AppLayoutDashboardRoute
  '/app/groceries': typeof AppLayoutGroceriesRoute
  '/app/inventory': typeof AppLayoutInventoryRoute
  '/app/recipes': typeof AppLayoutRecipesRoute
  '/app/reports': typeof AppLayoutReportsRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/app': typeof AppRouteWithChildren
  '/app/_layout': typeof AppLayoutRouteRouteWithChildren
  '/(auth)/login': typeof authLoginRoute
  '/(auth)/register': typeof authRegisterRoute
  '/app/': typeof AppIndexRoute
  '/app/_layout/dashboard': typeof AppLayoutDashboardRoute
  '/app/_layout/groceries': typeof AppLayoutGroceriesRoute
  '/app/_layout/inventory': typeof AppLayoutInventoryRoute
  '/app/_layout/recipes': typeof AppLayoutRecipesRoute
  '/app/_layout/reports': typeof AppLayoutReportsRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/app'
    | '/login'
    | '/register'
    | '/app/'
    | '/app/dashboard'
    | '/app/groceries'
    | '/app/inventory'
    | '/app/recipes'
    | '/app/reports'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/app'
    | '/login'
    | '/register'
    | '/app/dashboard'
    | '/app/groceries'
    | '/app/inventory'
    | '/app/recipes'
    | '/app/reports'
  id:
    | '__root__'
    | '/'
    | '/app'
    | '/app/_layout'
    | '/(auth)/login'
    | '/(auth)/register'
    | '/app/'
    | '/app/_layout/dashboard'
    | '/app/_layout/groceries'
    | '/app/_layout/inventory'
    | '/app/_layout/recipes'
    | '/app/_layout/reports'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRoute: typeof AppRouteWithChildren
  authLoginRoute: typeof authLoginRoute
  authRegisterRoute: typeof authRegisterRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/app/': {
      id: '/app/'
      path: '/'
      fullPath: '/app/'
      preLoaderRoute: typeof AppIndexRouteImport
      parentRoute: typeof AppRoute
    }
    '/(auth)/register': {
      id: '/(auth)/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof authRegisterRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/app/_layout': {
      id: '/app/_layout'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppLayoutRouteRouteImport
      parentRoute: typeof AppRoute
    }
    '/app/_layout/reports': {
      id: '/app/_layout/reports'
      path: '/reports'
      fullPath: '/app/reports'
      preLoaderRoute: typeof AppLayoutReportsRouteImport
      parentRoute: typeof AppLayoutRouteRoute
    }
    '/app/_layout/recipes': {
      id: '/app/_layout/recipes'
      path: '/recipes'
      fullPath: '/app/recipes'
      preLoaderRoute: typeof AppLayoutRecipesRouteImport
      parentRoute: typeof AppLayoutRouteRoute
    }
    '/app/_layout/inventory': {
      id: '/app/_layout/inventory'
      path: '/inventory'
      fullPath: '/app/inventory'
      preLoaderRoute: typeof AppLayoutInventoryRouteImport
      parentRoute: typeof AppLayoutRouteRoute
    }
    '/app/_layout/groceries': {
      id: '/app/_layout/groceries'
      path: '/groceries'
      fullPath: '/app/groceries'
      preLoaderRoute: typeof AppLayoutGroceriesRouteImport
      parentRoute: typeof AppLayoutRouteRoute
    }
    '/app/_layout/dashboard': {
      id: '/app/_layout/dashboard'
      path: '/dashboard'
      fullPath: '/app/dashboard'
      preLoaderRoute: typeof AppLayoutDashboardRouteImport
      parentRoute: typeof AppLayoutRouteRoute
    }
  }
}

interface AppLayoutRouteRouteChildren {
  AppLayoutDashboardRoute: typeof AppLayoutDashboardRoute
  AppLayoutGroceriesRoute: typeof AppLayoutGroceriesRoute
  AppLayoutInventoryRoute: typeof AppLayoutInventoryRoute
  AppLayoutRecipesRoute: typeof AppLayoutRecipesRoute
  AppLayoutReportsRoute: typeof AppLayoutReportsRoute
}

const AppLayoutRouteRouteChildren: AppLayoutRouteRouteChildren = {
  AppLayoutDashboardRoute: AppLayoutDashboardRoute,
  AppLayoutGroceriesRoute: AppLayoutGroceriesRoute,
  AppLayoutInventoryRoute: AppLayoutInventoryRoute,
  AppLayoutRecipesRoute: AppLayoutRecipesRoute,
  AppLayoutReportsRoute: AppLayoutReportsRoute,
}

const AppLayoutRouteRouteWithChildren = AppLayoutRouteRoute._addFileChildren(
  AppLayoutRouteRouteChildren,
)

interface AppRouteChildren {
  AppLayoutRouteRoute: typeof AppLayoutRouteRouteWithChildren
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppLayoutRouteRoute: AppLayoutRouteRouteWithChildren,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRoute: AppRouteWithChildren,
  authLoginRoute: authLoginRoute,
  authRegisterRoute: authRegisterRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
