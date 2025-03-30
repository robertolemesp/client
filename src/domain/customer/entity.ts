import { Customer } from './model'

export class CustomerEntity implements Customer {
  public id?: number
  public name: string
  public birthday: string
  public email: string
  public cpf: string
  public rg: string
  public phone: string

  constructor(customer: Customer) {
    if (customer.id)
      this.id = customer.id

    this.name = customer.name
    this.birthday = customer.birthday
    this.email = customer.email
    this.cpf = customer.cpf
    this.rg = customer.rg
    this.phone = customer.phone
  }
}

export class CustomerErrorEntity extends Error {
  constructor(
    public readonly code: string, 
    public readonly message: string
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class CustomerValidationError extends CustomerErrorEntity {
  constructor(field: string, code: string, message: string) {
    super(code, `The field '${field}' ${message}`)
  }
}

export class CustomerServiceError extends CustomerErrorEntity {
  constructor(action: string, code: string, message: string) {
    super(code, `Cannot ${action}: ${message}`)
  }
}