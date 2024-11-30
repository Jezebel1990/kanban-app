import { useEffect, useState } from "react";
import { useFetchDataFromDbQuery } from "@/components/redux/services/apiSlice";
import { useAppSelector } from "@/components/redux/hooks";
import { getCurrentBoardName } from "@/components/redux/features/appSlice";
import { MdEdit, MdDelete} from "react-icons/md";

interface ITask {
    title: string;
    description: string;
    status: string;
  }
  
interface Column {
    name: string;
    tasks?: ITask[];
  }

export default function BoardTasks() {
    const { isLoading, data } = useFetchDataFromDbQuery();
    const [columns, setColumns] = useState<Column[]>([]);
    const activeBoard = useAppSelector(getCurrentBoardName);

    useEffect(() => {
        if (data !== undefined) {
          const [boards] = data;
          if (boards) {
            // Get the data of the active board
            const activeBoardData = boards.boards.find(
              (board: { name: string }) => board.name === activeBoard
            );
            if (activeBoardData) {
              const { columns } = activeBoardData;
              setColumns(columns);
            }
          }
        }
      }, [data, activeBoard]);

    return (
        <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-[#FFFF8F]">
  {isLoading ? (
        <p className="text-3xl w-full text-[#FFBF00] text-center font-bold">Carregando tarefas...</p>
      ) : (
        <>
     {columns.length > 0 ? (
            <div className="flex space-x-6">
              {columns.map((column) => {
                const { id, name, tasks } = column;
                return (
                  <div key={id} className="w-[17.5rem] shrink-0">
                    <p className="text-black">{`${name} (${
                      tasks ? tasks?.length : 0
                    })`}</p>

    {tasks &&
(tasks.length > 0 ? (
    tasks.map((task) => {
      const { id, title, status } = task;

      
      return (
        <div
          key={id}
          className="bg-white p-6 rounded-md mt-6 flex items-center justify-between border shadow-orange"
        >
          <p>{title}</p>
          <div className="flex items-center space-x-1">
            <MdEdit className="text-lg cursor-pointer text-[#FFBF00]" />
            <MdDelete className="text-lg cursor-pointer text-red-500" />
          </div>
        </div>
      );
    })
  ) : (
    <div className="mt-6 h-full rounded-md border-dashed border-4 border-[#FFBF00]" />
  ))}
</div>
);
})}
{columns.length < 7 ? (
                <div className="rounded-md bg-white w-[17.5rem] mt-12 shrink-0 flex justify-center items-center border shadow-orange">
         <p className="cursor-pointer font-bold text-black text-2xl">
            + Nova Coluna
            </p>
           </div>
           ) : (
            ""
           )}
            </div>
  ) : (
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
        )}
        </>
       )}
        </div>
    )
}