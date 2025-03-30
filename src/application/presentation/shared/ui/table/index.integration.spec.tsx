import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table, { type Column } from '.'

interface TestData {
  id: number
  name: string
}

describe('Table (Integration)', () => {
  const columns: Column<TestData>[] = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' }
  ]

  const data: TestData[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`
  }))

  const handleCellClick = jest.fn()
  const actions = jest.fn((id) => <button>Action {id}</button>)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays paginated data correctly', () => {
    render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
        itemsPerPage={5}
      />
    )

    for (let i = 1; i <= 5; i++) 
      expect(screen.getByText(`User ${i}`)).toBeInTheDocument()
    
    expect(screen.queryByText('User 6')).not.toBeInTheDocument()
  })

  it('navigates to next and previous pages', async () => {
    render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
        itemsPerPage={5}
      />
    )

    const user = userEvent.setup()
    const nextButton = screen.getAllByRole('button', { name: '➜' })[1]
    await user.click(nextButton)

    expect(screen.getByText('User 6')).toBeInTheDocument()
    expect(screen.queryByText('User 1')).not.toBeInTheDocument()

    const prevButton = screen.getAllByRole('button', { name: '➜' })[0]
    await user.click(prevButton)

    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.queryByText('User 6')).not.toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
        itemsPerPage={5}
      />
    )

    const prevButton = screen.getAllByRole('button', { name: '➜' })[0]
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', async () => {
    render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
        itemsPerPage={15}
      />
    )

    const nextButton = screen.getAllByRole('button', { name: '➜' })[1]
    expect(nextButton).toBeDisabled()
  })
})
