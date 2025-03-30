import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { errorService } from '@/application/services/error'
import { AuthenticationService } from '@/application/services/authentication'

class HttpClient {
  private static instance: AxiosInstance
  private static PUBLIC_ROUTES_PREFIXES = [
    '/api/auth', '/sign-in', '/customer/exists', '/customer/credentials'
  ]

  private static PROXY_PATH = '/api/proxy'

  private constructor() {}

  private static isPublicRoute(url: string): boolean {
    return this.PUBLIC_ROUTES_PREFIXES.some(prefix => url.startsWith(prefix))
  }

  public static getInstance(): AxiosInstance {
    if (!HttpClient.instance) {
      HttpClient.instance = axios.create({
        baseURL: this.PROXY_PATH,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        withCredentials: true
      })

      HttpClient.instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
          const url = config.url || ''

          config.headers['x-proxy-path'] = url
          config.url = ''

          if (!this.isPublicRoute(url)) {
            try {
              const authenticationService = new AuthenticationService()
              const authenticationToken = await authenticationService.getSessionAccessToken()
  
              if (authenticationToken) 
                config.headers.Authorization = `Bearer ${authenticationToken}`
            } catch (error) {
              throw error
            }
          }
          
          return config
        },
        (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
      )

      HttpClient.instance.interceptors.response.use(
        (response: AxiosResponse): AxiosResponse => response,
        (error: AxiosError): Promise<AxiosError> => {
          throw errorService.generateInfrastructureError('Infrastructure Api', error, error.message)
        }
      )

    }

    return HttpClient.instance
  }
}

export default HttpClient
