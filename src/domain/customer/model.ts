export interface Customer {
  id?: number
  name: string
  email: string
  birthday: string
  password?: string
  cpf: string
  rg: string
  phone: string
}

export const CustomerServiceErrorCodes = {
  CREATE_ERROR: 'CREATE_ERROR',
  UPDATE_ERROR: 'UPDATE_ERROR',
  GET_ERROR: 'GET_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR'
} as const

export type CustomerServiceErrorCode = keyof typeof CustomerServiceErrorCodes
