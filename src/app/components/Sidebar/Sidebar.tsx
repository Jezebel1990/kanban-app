import { useState } from "react";
import { useAppDispatch } from "@/components/redux/hooks";
import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice";
import { setCurrentBoardName, openAddAndEditBoardModal } from "@/components/redux/features/appSlice";

export default function Sidebar() {

  const [active, setActive] = useState<number>(0);

 const { data } = useFetchDataFromDbQuery();
 const dispatch = useAppDispatch();

 const handleNav = (index: number, name: string) => {
  setActive(index);
  dispatch(setCurrentBoardName(name));
};

    return (
        <aside className="w-[18.75rem] flex-none dark:bg-[#FFFAA0] h-full py-6 pr-6">
          {data && (
            <>
        <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
          {`Todos os Cartões (${data[0]?.boards.length})`}
        </p>

        {data[0]?.boards.map(
            (board: { [key: string]: any }, index: number) => {
              const { name, id } = board;
              const isActive = index === active; // Check if the board is active
              return (
                <div
                  key={id}
                  onClick={() => handleNav(index, name)} // Handle navigation through boards on click
                  className={`${
                    isActive ? 'rounded-tr-full rounded-br-full bg-[#FFBF00] text-white' : 'text-black'
                  } cursor-pointer flex items-center space-x-2 pl-[2.12rem] py-3 pb-3`}>
           <p className="text-white text-lg capitalize">{name}</p>
        </div>
         );
        }
      )}
        </>
       )}
        <button
        onClick={() => dispatch(openAddAndEditBoardModal("Adicionar Novo Cartão"))} 
        className="flex items-center space-x-2 pl-[2.12rem] py-3">
          <p className="text-base font-bold capitalize text-main">
             + Novo Cartão
          </p>
        </button>
        </aside>
    );
}