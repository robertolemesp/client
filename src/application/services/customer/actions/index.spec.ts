import { customerCreateFormSubmitAction, customerUpdateFormSubmitAction } from './index'
import { CustomerService } from '@/application/services/customer'
import { ServiceErrorEntity } from '@/domain/error/entity'

jest.mock('@/application/services/customer')

const mockCreateCustomer = jest.fn()
const mockUpdateCustomer = jest.fn()

;(CustomerService as jest.Mock).mockImplementation(() => ({
  createCustomer: mockCreateCustomer,
  updateCustomer: mockUpdateCustomer
}))

describe('Customer Form Actions (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('customerCreateFormSubmitAction', () => {
    it('returns success true when customer is created', async () => {
      const mockCustomer = { id: 1, name: 'Test' }
      mockCreateCustomer.mockResolvedValueOnce(mockCustomer)

      const formData = new FormData()
      formData.set('name', 'Test')
      formData.set('email', 'test@email.com')
      formData.set('birthday', '1990-01-01')
      formData.set('cpf', '123.456.789-00')
      formData.set('rg', '12.345.678-9')
      formData.set('phone', '(12) 34567-8901')

      const result = await customerCreateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: true, payload: mockCustomer })
      expect(mockCreateCustomer).toHaveBeenCalled()
    })

    it('returns success false when customer creation throws ServiceErrorEntity', async () => {
      const errorPayload = [{ fieldName: 'name', errors: ['REQUIRED'] }]
      mockCreateCustomer.mockImplementation(() => {
        throw new ServiceErrorEntity('Service Customer', errorPayload)
      })

      const formData = new FormData()

      const result = await customerCreateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: false, payload: errorPayload })
    })

    it('returns success false when customer creation throws generic error', async () => {
      mockCreateCustomer.mockImplementation(() => {
        throw new Error('Something went wrong')
      })

      const formData = new FormData()

      const result = await customerCreateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: false, payload: new Error('Something went wrong') })
    })
  })

  describe('customerUpdateFormSubmitAction', () => {
    it('returns success true when customer is updated', async () => {
      mockUpdateCustomer.mockResolvedValueOnce(undefined)

      const formData = new FormData()
      formData.set('id', '1')
      formData.set('name', 'Updated Name')
      formData.set('birthday', '1990-01-01')
      formData.set('cpf', '123.456.789-00')
      formData.set('rg', '12.345.678-9')
      formData.set('phone', '(12) 34567-8901')

      const result = await customerUpdateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: true, payload: undefined })
      expect(mockUpdateCustomer).toHaveBeenCalled()
    })

    it('returns success false when update throws ServiceErrorEntity', async () => {
      const errorPayload = [{ fieldName: 'cpf', errors: ['INVALID'] }]
      mockUpdateCustomer.mockImplementation(() => {
        throw new ServiceErrorEntity('Service Customer', errorPayload)
      })

      const formData = new FormData()

      const result = await customerUpdateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: false, payload: errorPayload })
    })

    it('returns success false when update throws generic error', async () => {
      mockUpdateCustomer.mockImplementation(() => {
        throw new Error('Update failed')
      })

      const formData = new FormData()

      const result = await customerUpdateFormSubmitAction(null, formData)

      expect(result).toEqual({ success: false, payload: new Error('Update failed') })
    })
  })
})
