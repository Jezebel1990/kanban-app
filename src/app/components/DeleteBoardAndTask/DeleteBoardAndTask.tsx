import React from "react";
import { Modal, ModalBody } from "../Modal/Modal";
   import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
   import {
   closeDeleteBoardAndTaskModal,
   getDeleteBoardAndTaskModalValue,
   getDeleteBoardAndTaskModalVariantValue,
   getDeleteBoardAndTaskModalTitle,
   getDeleteBoardAndTaskModalIndex,
   getDeleteBoardAndTaskModalStatus,
   getCurrentBoardName,
   } from "@/components/redux/features/appSlice";
   import {
   useFetchDataFromDbQuery,
   useUpdateBoardToDbMutation,
   } from "@/components/redux/services/apiSlice";

   export default function DeleteBoardAndTaskModal() {
    const dispatch = useAppDispatch();
    const isModalOpen = useAppSelector(getDeleteBoardAndTaskModalValue);
    const closeModal = () => dispatch(closeDeleteBoardAndTaskModal());
    const currentBoardName = useAppSelector(getCurrentBoardName);
    const modalVariant = useAppSelector(getDeleteBoardAndTaskModalVariantValue);
    const taskTitle = useAppSelector(getDeleteBoardAndTaskModalTitle);
    const taskIndex = useAppSelector(getDeleteBoardAndTaskModalIndex);
    const taskStatus = useAppSelector(getDeleteBoardAndTaskModalStatus);
    const { data } = useFetchDataFromDbQuery();
    const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();

    const handleDelete = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (data) {
          if (modalVariant === "Deletar este quadro?") {
            // Implement the logic for deleting the board
            if (currentBoardName) {
              //  Assuming data is available, you need to handle the logic to update the data
              const [boards] = data;
              const updatedBoards = boards.boards.filter(
                (board: { name: string }) => board.name !== currentBoardName
              );
              updateBoardToDb(updatedBoards);
            }
          } else {
            // Implement the logic for deleting a task
            if (taskIndex !== undefined && taskStatus && currentBoardName) {
              const [boards] = data;
              //  Handle the logic to update the tasks
              const updatedBoards = boards.boards.map(
                (board: {
                  name: string;
                  columns: [{ name: string; tasks: [] }];
                }) => {
                // check the board active board
                  if (board.name === currentBoardName) {
                    // loop through the columns of the board to find the column in which the task to edit is
                    const updatedColumns = board.columns.map((column) => {
                      if (column.name === taskStatus) {
                        // delete the the task
                        const updatedTasks = column.tasks.filter(
                          (_, index: number) => index !== taskIndex
                        );
                        return { ...column, tasks: updatedTasks };
                      }
                      return column;
                    });
                    return { ...board, columns: updatedColumns };
                  }
                  return board;
                }
              );
              updateBoardToDb(updatedBoards);
            }
          }
        }
       };

       return (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          <ModalBody>
            <p className="text-red font-bold text-lg">{modalVariant}</p>
            <div className="pt-6">
              <p className="text-sm text-medium-grey leading-6">
                {modalVariant === "Deletar este quadro?"
                  ? `Tem certeza de que deseja excluir o quadro '${currentBoardName}' ? Esta ação removerá todas as colunas
e tarefas e não pode ser revertida.`
                  : `Tem certeza de que deseja excluir a tarefa '${taskTitle}' ? Esta ação não pode ser revertida.`}
              </p>
            </div>
            <div className="pt-6 flex space-x-2">
              <div className="w-1/2">
                <button
                  type="submit"
                  onClick={(e: React.FormEvent<HTMLButtonElement>) =>
                    handleDelete(e)
                  }
                  className="bg-red-500 rounded-3xl py-2 w-full text-sm text-white font-semibold"
                >
                  {" "}
                  {isLoading ? "Carregando" : "Deletar"}
                </button>
              </div>
              <div className="w-1/2">
                <button
                  onClick={closeModal}
                  className="bg-[#FFBF00] rounded-3xl py-2 w-full text-sm text-white font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
       );
  }