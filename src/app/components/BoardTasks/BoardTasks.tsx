export default function BoardTasks() {
    return (
        <div className="overflow-x-auto overflow-y-auto w-full bg-[#FFFF8F]">
        <div className="w-full h-full flex justify-center items-center">
         <div className="flex flex-col items-center">
          <p className="text-black text-sm">
          Este cartão está vazio. Crie uma nova coluna para começar.
          </p>
          <button className="bg-[#FFBF00] text-white px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2">
             <p>+ Nova Coluna</p>
          </button>
         </div>
        </div>
        </div>
    )
}