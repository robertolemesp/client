import { Authentication } from "./model"
import { AuthenticationValidator } from "./services/validation"

export class AuthenticationEntity implements Authentication {
  public email: string
  public password: string

  constructor({ email, password }: Authentication) {
    AuthenticationValidator.validateEntity({ email, password })
    this.email = email
    this.password = password
  }
}
