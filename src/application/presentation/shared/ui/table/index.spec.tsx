import { JSX } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Table, { type Column } from '.'

interface TestData {
  id: number
  name: string
  details?: string
  element?: JSX.Element
}

describe('Table', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the table headers correctly', () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name' }
    ]

    const data: TestData[] = [
      { id: 1, name: 'Roberto' },
      { id: 2, name: 'Robert' }
    ]

    const handleCellClick = jest.fn()
    const actions = jest.fn(() => <button>Action</button>)

    const { getByText } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
      />
    )
    expect(getByText('ID')).toBeInTheDocument()
    expect(getByText('Name')).toBeInTheDocument()
    expect(getByText('Ações')).toBeInTheDocument()
  })

  it('renders data rows and cells', () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name' }
    ]
    const data: TestData[] = [
      { id: 1, name: 'Roberto' },
      { id: 2, name: 'Robert' }
    ]
    const handleCellClick = jest.fn()
    const actions = jest.fn(() => <button>Action</button>)

    const { getByText } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
      />
    )

    expect(getByText('Roberto')).toBeInTheDocument()
    expect(getByText('Robert')).toBeInTheDocument()
  })

  it('calls onCellClick when a wrapped cell is clicked', async () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name', wrapped: true }
    ]
    const data: TestData[] = [
      { id: 1, name: 'Roberto Lemes' }
    ]
    const handleCellClick = jest.fn()
    const actions = jest.fn(() => <button>Action</button>)

    const { getByText } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
      />
    )

    const wrappedCell = getByText('Ver')
    await userEvent.click(wrappedCell)

    expect(handleCellClick).toHaveBeenCalledWith(
      { id: 1, name: 'Roberto Lemes' },
      'name'
    )
  })

  it('renders action elements for each row', () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name' }
    ]
    const data: TestData[] = [
      { id: 1, name: 'Roberto' },
      { id: 2, name: 'Robert' }
    ]
    const handleCellClick = jest.fn()
    const actions = jest.fn((id) => <button>Action for {id}</button>)

    const { getByText } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
      />
    )

    expect(getByText('Action for 1')).toBeInTheDocument()
    expect(getByText('Action for 2')).toBeInTheDocument()
  })

  it('applies custom DOM classes when provided', () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' }
    ]
    const data: TestData[] = [
      { id: 1, name: 'Alice' }
    ]
    const handleCellClick = jest.fn()
    const actions = jest.fn(() => <button>Action</button>)

    const { container, getByRole } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
        domElementsClassNames={{
          table: 'custom-table',
          th: 'custom-th',
          tr: 'custom-tr',
          td: 'custom-td'
        }}
      />
    )

    const table = getByRole('table')
    expect(table).toHaveClass('custom-table')

    const headerCells = container.querySelectorAll('th')
    headerCells.forEach(th => {
      expect(th).toHaveClass('custom-th')
    })

    const rows = container.querySelectorAll('tr')
    rows.forEach(tr => {
      expect(tr).toHaveClass('custom-tr')
    })

    const dataCells = container.querySelectorAll('td')
    dataCells.forEach(td => {
      expect(td).toHaveClass('custom-td')
    })
  })

  it('displays an element if row[column.key] is a JSX element', () => {
    const columns: Column<TestData>[] = [
      { label: 'ID', key: 'id' },
      { label: 'Custom Element', key: 'element' }
    ]
    const data: TestData[] = [
      { 
        id: 1, 
        name: 'Alice', 
        element: <div data-testid='custom-element'>Hello</div> 
      }
    ]
    const handleCellClick = jest.fn()
    const actions = jest.fn(() => <button>Action</button>)

    const { getByTestId } = render(
      <Table<TestData>
        data={data}
        dataItemIndexKey='id'
        columns={columns}
        onCellClick={handleCellClick}
        actions={actions}
      />
    )

    expect(getByTestId('custom-element')).toBeInTheDocument()
    expect(getByTestId('custom-element')).toHaveTextContent('Hello')
  })
})
