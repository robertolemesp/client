import { Address } from './model'

export class AddressEntity implements Address {
  public id?: number
  public customerId?: number
  public street: string
  public zipcode: string
  public number: string
  public city: string
  public state: string
  
  constructor(address: Address) { 
    if (address.id)
      this.id = address.id
    
    if (address.customerId)
      this.customerId = address.customerId

    this.street = address.street
    this.zipcode = address.zipcode
    this.number = address.number
    this.city = address.city
    this.state = address.state
  }
}
