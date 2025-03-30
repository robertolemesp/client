import type { FC } from 'react'

interface EditIconProps {
  onClick: () => void
}

const EditIcon: FC<EditIconProps> = ({ onClick }) =>
  <span
    className='edit-customer-icon text-xl text-black mr-2 cursor-pointer'
    aria-label='Edit'
    onClick={onClick}
  >
    ✏️
  </span>

export default EditIcon
