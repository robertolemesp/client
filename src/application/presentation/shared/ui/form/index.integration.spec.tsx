import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AppRouterContextProviderMock } from '@/infrastructure/testing/jest/__mocks__/next-app-router-context-provider'

import Form from '.'

describe('Form (Integration)', () => {
  it('submits with real logic, except for server actions', async () => {
    const onActionStateChange = jest.fn()

    const { getByText } = render(
      <AppRouterContextProviderMock>
        <Form
          onActionStateChange={onActionStateChange}
          action={async (_state, formData) => {
            const entries = Object.fromEntries(formData.entries())
            return { success: true, payload: entries }
          }}
        >
          <input name='name' defaultValue='test' />
        </Form>
      </AppRouterContextProviderMock>
    )

    await userEvent.click(getByText('Submit'))

    expect(onActionStateChange).toHaveBeenCalledWith({
      success: true,
      payload: { name: 'test' }
    })
  })
})
