import type { ReactNode } from 'react'
import { AppRouterContext, type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname, useSearchParams } from 'next/navigation'

export const AppRouterContextProviderMock = ({ router, children }: {
  router?: Partial<AppRouterInstance>
  children: ReactNode
}) => {
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const asPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

  const mockedRouter = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname,
    asPath,
    isReady: true,
    searchParams,
    ...router
  }

  return <AppRouterContext.Provider value={mockedRouter}>
    { children }
  </AppRouterContext.Provider>
}