export interface Address {
  id?: number
  customerId?: number 
  street: string
  number: string
  city: string
  state: string
  zipcode: string
}

export type Addresses = Address[]

export interface AddressValidation {
  validate(fieldName: keyof Address, value?: string | null, message?: string): void
}

export interface AddressesValidation {
  validate(value: Addresses | [], message?: string): void
}
