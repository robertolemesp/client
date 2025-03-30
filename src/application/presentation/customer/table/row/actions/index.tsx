import type { FC, JSX } from 'react'
import type { Customer } from '@/domain/customer/model'

import { mergeClassNames } from '@/utils/classname'

import EditIcon from '@/application/presentation/shared/ui/table/actions/edit'
import RemoveIcon from '@/application/presentation/shared/ui/table/actions/remove'

type CustomerId = Customer['id']

interface CustomerListTableRowActionsProps {
  className?: string
  customerId: CustomerId
  onEdit?: (customerId: CustomerId) => void
  onRemove?: (customerId: CustomerId) => void
}

const CustomerListTableRowActions: FC<CustomerListTableRowActionsProps> = ({ className, customerId, onEdit, onRemove }): JSX.Element => {
  const handleEditActionIconClick = (): void => onEdit?.(customerId)
  const handleRemoveActionIconClick = (): void => onRemove?.(customerId)
  
  return <div className={mergeClassNames('flex items-center gap-1', className)}>
    <EditIcon onClick={handleEditActionIconClick} />
    <RemoveIcon onClick={handleRemoveActionIconClick} />
  </div>
}

export default CustomerListTableRowActions
