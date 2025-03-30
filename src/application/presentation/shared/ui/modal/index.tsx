import type { FC, PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  title?: string
  onClose: () => void
}

const Modal: FC<ModalProps> = ({ onClose, title, children }) => {
  const handleModalCloseButtonClick = onClose

  return <dialog open className='flex flex-col justify-center items-center fixed inset-0 w-[90%] max-w-[600px] h-[700px] px-1 sm:px-4 py-6 rounded shadow-lg shadow-primary-600 bg-black'>
    <div className='w-full flex justify-between items-center px-6 py-2 mb-auto'>
      <h2 className='text-2xl font-bold text-white'>{ title }</h2>
      <button 
        className='modal-close-button w-10 h-10 flex items-center justify-center text-2xl font-bold bg-gray-100 rounded-full shadow-md hover:shadow-gray-300 transition-shadow' 
        onClick={handleModalCloseButtonClick}
      >
        &times;
      </button>
    </div>
    <div className='w-full h-full overflow-auto'>
      { children }
    </div>
  </dialog>
}

export default Modal