import { useAppDispatch } from '@/components/redux/hooks'
import { openAddAndEditBoardModal, openDeleteBoardAndTaskModal } from '@/components/redux/features/appSlice';

interface IDropdown {
    show: boolean
   }

export default function Dropdown({ show }: IDropdown) {
  const dispatch = useAppDispatch()
    
return (
<div
  className={`${
    show ? "block" : "hidden"
  } w-48 absolute top-full bg-white
   border shadow-orange right-0 py-2 rounded-2xl`} 
>
  <div className="hover:bg-[#FFD700]">
   <button
   onClick={() => dispatch(openAddAndEditBoardModal('Editar Cartão'))} 
   className="text-sm px-4 py-2">Editar Cartão</button>
  </div>
  <div className="hover:bg-[#FFD700]">
    <button 
    onClick={() => dispatch(openDeleteBoardAndTaskModal({variant: "Deletar este cartão?"}))}
     className="text-sm px-4 py-2">
      Deletar Cartão
    </button>
  </div>
</div>
)}