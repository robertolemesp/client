import { AuthenticationService } from '@/application/services/authentication'
import { AuthenticationServiceErrors, authenticationServiceErrorMessages } from '@/application/services/authentication/types'

import { authenticationSignIn, authenticationSignOut } from '@/application/services/authentication/next-auth'
import { AuthenticationValidator } from '@/domain/authentication/services/validation'
import { AuthenticationUserEmail } from '@/application/dto/authentication'

jest.mock('@/application/services/error', () => ({
  errorService: {
    isSystemError: jest.fn(() => true),
    generateServiceError: jest.fn((origin, payload, message) => new Error(message)),
    getServiceErrorMessage: jest.fn((map, key) => map[key])
  }
}))

jest.mock('@/application/services/authentication/next-auth', () => ({
  authenticationSignIn: jest.fn(),
  authenticationSignOut: jest.fn()
}))

describe('Authentication Service (Unit)', () => {
  let authService: AuthenticationService

  beforeEach(() => {
    jest.clearAllMocks()
    authService = new AuthenticationService()
  })

  it('gets session access token successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'abc.def.ghi.jkl.mno' })
    })

    const token = await authService.getSessionAccessToken()
    expect(token).toBe('abc.def.ghi.jkl.mno')
  })

  it('returns null when fetching token fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 })

    const token = await authService.getSessionAccessToken()
    
    expect(token).toBeNull()
  })

  it('throws service error when user existence check fails', async () => {
    jest.spyOn(authService['httpClient'], 'post').mockImplementation(() => { throw {} })
    
    await expect(authService.isUserExists('test@email.com' as AuthenticationUserEmail)).rejects.toThrow(
      authenticationServiceErrorMessages[AuthenticationServiceErrors.IS_USER_EXISTS]
    )
  })

  it('returns true when user exists', async () => {
    jest.spyOn(authService['httpClient'], 'post').mockResolvedValue({ data: true })

    const result = await authService.isUserExists('test@email.com' as AuthenticationUserEmail)

    expect(result).toBe(true)
  })

  it('validates credentials successfully', async () => {
    jest.spyOn(authService['httpClient'], 'post').mockResolvedValue({ data: { email: 'test@email.com', password: 'hashed' } })

    const result = await authService.validateAuthenticationCredentials({ email: 'test@email.com' as AuthenticationUserEmail, password: '12345678' })

    expect(result).toEqual({ email: 'test@email.com', password: 'hashed' })
  })

  it('throws service error when credential validation fails', async () => {
    jest.spyOn(AuthenticationValidator, 'validateCredentialsDto').mockImplementation(() => {})
    jest.spyOn(authService['httpClient'], 'post').mockImplementation(() => { throw {} })

    await expect(
      authService.validateAuthenticationCredentials({ email: 'test@email.com' as AuthenticationUserEmail, password: 'wrong' })
    ).rejects.toThrow(
      authenticationServiceErrorMessages[AuthenticationServiceErrors.VALIDATE_AUTHENTICATION_CREDENTIALS]
    )
  })

  it('signs in successfully', async () => {
    const mockResponse = { ok: true, status: 200 }
    jest.spyOn(AuthenticationValidator, 'validateDto').mockImplementation(() => {})
    ;(authenticationSignIn as jest.Mock).mockResolvedValue(mockResponse)

    const result = await authService.signIn({ options: { email: 'test@email.com', password: '12345678' } })

    expect(result).toEqual(mockResponse)
    expect(authenticationSignIn).toHaveBeenCalled()
  })

  it('throws service error when sign in fails', async () => {
    jest.spyOn(AuthenticationValidator, 'validateDto').mockImplementation(() => {})

    ;(authenticationSignIn as jest.Mock).mockImplementation(() => { throw {} })

    await expect(
      authService.signIn({ options: { email: 'fail@email.com', password: 'bad' } })
    ).rejects.toThrow(
      authenticationServiceErrorMessages[AuthenticationServiceErrors.SIGN_IN]
    )
  })

  it('signs out successfully', async () => {
    const mockResponse = { success: true }
    ;(authenticationSignOut as jest.Mock).mockResolvedValue(mockResponse)

    const result = await authService.signOut()
    
    expect(result).toEqual(mockResponse)
    expect(authenticationSignOut).toHaveBeenCalled()
  })

  it('throws error when sign out fails', async () => {
    ;(authenticationSignOut as jest.Mock).mockImplementation(() => {
      throw new Error('Sign out error')
    })

    await expect(authService.signOut()).rejects.toThrow('Sign out error')
  })

  it('checks JWE token format correctly', () => {
    expect(authService.checkIsJweToken('a.b.c.d.e')).toBe(true)
    expect(authService.checkIsJweToken('a.b.c')).toBe(false)
  })

  it('returns service error message by error type', () => {
    const result = authService.getAuthenticationServiceErrorMessage(AuthenticationServiceErrors.SIGN_OUT)

    expect(result).toBe(authenticationServiceErrorMessages[AuthenticationServiceErrors.SIGN_OUT])
  })
})
