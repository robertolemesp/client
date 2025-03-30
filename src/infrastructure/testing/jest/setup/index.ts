import '@testing-library/jest-dom'
import { jest } from '@jest/globals'
import { axiosMock } from '../__mocks__/axios.ts'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    asPath: '/',
    isReady: true
  })),
  usePathname: jest.fn(() => '/form'),
  useSearchParams: jest.fn(() => new URLSearchParams('')),
  redirect: jest.fn()
}))

jest.mock('@/infrastructure/api/http-client', () => ({
  __esModule: true,
  default: { getInstance: () => axiosMock }
}))
