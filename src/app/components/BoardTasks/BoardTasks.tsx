import { useEffect, useState, useRef } from "react";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation
} from "@/components/redux/services/apiSlice";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";
import { getCurrentBoardName } from "@/components/redux/features/appSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../StrictModeDroppable/StrictModeDroppable";
import {
  openAddAndEditBoardModal,
  openAddAndEditTaskModal,
  openDeleteBoardAndTaskModal
} from '@/components/redux/features/appSlice';

interface ITask {
  id: string;
  title: string;
  status: string;
}

interface Column {
  id: string;
  name: string;
  tasks: ITask[];
}

export default function BoardTasks() {
  const { isLoading, data } = useFetchDataFromDbQuery();
  const [updateBoardToDb] = useUpdateBoardToDbMutation();
  const [columns, setColumns] = useState<Column[]>([]);

  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const dispatch = useAppDispatch();
  const initialRender = useRef(true);

  useEffect(() => {
    if (data !== undefined) {
      const [boards] = data;
      if (boards) {
        // Get the data of the active board
        const activeBoardData = boards.boards.find(
          (board: { name: string }) => board.name === currentBoardTitle
        );
        if (activeBoardData) {
          const { columns } = activeBoardData;
          setColumns(columns);
        }
      }
    }
  }, [data, currentBoardTitle]);

  const handleDragEnd = async ({ destination, source }: any) => {
    // Check if the destination is not null (i.e., it was dropped in a valid droppable)
    if (!destination) return;

    // get a deep nested copy of the columns state
    const newColumns = columns.map((column) => ({
      ...column,
      tasks: [...column.tasks], // Create a new array for tasks
    }));

    // Find the source and destination columns based on their droppableIds
    const sourceColumnIndex = newColumns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destinationColumnIndex = newColumns.findIndex(
      (col) => col.id === destination.droppableId
    );

    // Task that was dragged
    const itemMoved = newColumns[sourceColumnIndex]?.tasks[source.index];

    // Remove from its source
    newColumns[sourceColumnIndex].tasks.splice(source.index, 1);

    // Insert into its destination
    newColumns[destinationColumnIndex].tasks.splice(
      destination.index,
      0,
      itemMoved
    );

    // Update the state
    setColumns(newColumns);
  };

  useEffect(() => {
    // Check if it's the initial render, to avoid sending the data to the backend on mount
    if (!initialRender.current) {
      // Update the backend with the new order
      try {
        if (data) {
          const [boards] = data;
          const boardsCopy = [...boards.boards];
          const activeBoardIndex = boardsCopy.findIndex(
            (board: { name: string }) => board.name === currentBoardTitle
          );
          const updatedBoard = {
            ...boards.boards[activeBoardIndex],
            columns,
          };
          boardsCopy[activeBoardIndex] = updatedBoard;
          updateBoardToDb(boardsCopy);
        }
      } catch (error) {
        // Handle error
        console.error("Erro alteração no quadro:", error);
      }
    } else {
      // Set initial render to false after the first render
      initialRender.current = false;
    }
  }, [columns]);

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-[#FFFF8F] bg-light-cubes bg-repeat bg-center"
    style={{ backgroundSize: "150px 150px" }}>
      {isLoading ? (
        <p className="text-3xl w-full text-[#FFBF00] text-center font-bold">
          Carregando tarefas...
        </p>
      ) : (
        <>
          {columns.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex space-x-6">
                {columns.map((column, _index) => {
                  const { id, name } = column;
                  return (
                    <div key={id} className="w-[17.5rem] shrink-0">
                      <p className="text-black font-medium">{`${column.name} (${column.tasks ? column.tasks?.length : 0
                        })`}</p>
                      <Droppable droppableId={id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="h-full"
                          >
                            {column.tasks &&
                              (column.tasks.length > 0 ? (
                                column.tasks.map((task, index) => {
                                  const { id, title, status } = task;
                                  return (
                                    <Draggable
                                      key={id}
                                      draggableId={id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="bg-white p-6 rounded-md mt-6 flex items-center justify-between border shadow-orange"
                                        >
                                          <p>{task.title}</p>
                                          <div className="flex items-center space-x-1">
                                            <MdEdit
                                              onClick={() =>
                                                dispatch(
                                                  openAddAndEditTaskModal({
                                                    variant: "Editar Tarefa",
                                                    title,
                                                    index,
                                                    name,
                                                  })
                                                )
                                              }
                                              className="text-lg cursor-pointer text-[#FFBF00]"
                                            />
                                            <MdDelete
                                              onClick={() =>
                                                dispatch(
                                                  openDeleteBoardAndTaskModal({
                                                    variant: "Deletar esta Tarefa?",
                                                    title,
                                                    status,
                                                    index,
                                                  }),
                                                )
                                              }
                                              className="text-lg cursor-pointer text-red-500" />
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })
                              ) : (
                                <div className="mt-6 h-full rounded-md border-dashed border-4 border-[#FFBF00]" />
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )
                })}
                {columns.length < 7 ? (
                  <div
                    onClick={() =>
                      dispatch(openAddAndEditBoardModal("Editar Quadro"))
                    }
                    className="rounded-md bg-white w-[17.5rem] mt-12 shrink-0 flex justify-center items-center border shadow-orange">
                    <p className="cursor-pointer font-semibold text-black text-2xl">
                      + Nova Coluna
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </DragDropContext>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="text-black text-sm">
                  Este quadro está vazio. Crie uma nova coluna para começar.
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
  );
}
