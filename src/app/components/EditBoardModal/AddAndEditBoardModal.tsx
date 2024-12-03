import React from "react";
import { useState, useEffect } from "react";
import { Modal, ModalBody } from "../Modal/Modal";
import { useAppSelector, useAppDispatch } from "@/components/redux/hooks";

import {
    getAddAndEditBoardModalValue,
    getAddAndEditBoardModalVariantValue,
    closeAddAndEditBoardModal,
    getCurrentBoardName,
    } from "@/components/redux/features/appSlice";
    import {
        useFetchDataFromDbQuery,
        useUpdateBoardToDbMutation,
      } from "@/components/redux/services/apiSlice";
import { FaTimes } from "react-icons/fa";
import { id } from '../../utils/data';

interface IAddBoardData {
    id: string,
    name: string;
    columns: {
      id: string;
      name: string;
      columns?: { name: string; tasks?: { [key: string]: any }[] };
    }[];
  }

  const addBoardData = {
    id: id(),
    name: "",
    columns: [
      {
        id: id(),
        name: "",
        tasks: [],
      },
    ],
};

export default function AddAndEditBoardModal() {

    const [boardData, setBoardData] = useState<IAddBoardData>();
    const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false);
    const [emptyColumnIndex, setEmptyColumnIndex] = useState<number>();

    const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue);
    const isVariantAdd = modalVariant === "Adicione Novo Cartão";
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(getAddAndEditBoardModalValue);
    const currentBoardTitle = useAppSelector(getCurrentBoardName);
    const closeModal = () => dispatch(closeAddAndEditBoardModal());
    let { data } = useFetchDataFromDbQuery();
    const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();

    useEffect(() => {
        if (data) {
    
          if (isVariantAdd) {
            setBoardData(addBoardData);
          } else {
            const activeBoard = data[0]?.boards.find(
              (board: { name: string }) => board.name === currentBoardTitle
            );
            setBoardData(activeBoard);
          }
        }
      }, [data, modalVariant]);

      useEffect(() => {
        const timeoutId = setTimeout(() => {
          setIsBoardNameEmpty(false);
          setEmptyColumnIndex(undefined);
        }, 3000);
        return () => clearTimeout(timeoutId);
      }, [emptyColumnIndex, isBoardNameEmpty]);

      const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (boardData) {
          const newName = { ...boardData, name: e.target.value };
          setBoardData(newName);
        }
      };

      const handleColumnNameChange = (index: number) => {
        return function (e: React.ChangeEvent<HTMLInputElement>) {
          // handle change for create new board modal
          if (boardData) {
            const modifyColumns = boardData.columns.map((column, columnIndex) => {
              if (columnIndex === index) {
                return { ...column, name: e.target.value };
              }
              return column;
            });
            const modifiedColumn = { ...boardData, columns: modifyColumns };
            setBoardData(modifiedColumn);
          }
        };
      };

      const handleAddNewColumn = () => {
        // max columns we want to have in a board is 7
        if (boardData && boardData.columns.length < 6) {
          // Make a copy of the existing boardData
          const updatedBoardData = { ...boardData };
          // Create a new column object
          const newColumn = { id: id(), name: "", tasks: [] };
          // Push the new column to the columns array in the copy
          updatedBoardData.columns = [...updatedBoardData.columns, newColumn];
          // Update the state with the modified copy
          setBoardData(updatedBoardData);
        }
      };

      const handleDeleteColumn = (index: number) => {
        if (boardData) {
          const filteredColumns = boardData.columns.filter(
            (_column, columnIndex) => columnIndex !== index
          );
          setBoardData({ ...boardData, columns: filteredColumns });
        }
      };

      const handleAddNewBoardToDb = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        // check if any of the column names are empty before submiting
        const emptyColumnStringChecker = boardData?.columns.some(
          (column) => column.name === ""
        ); 
    
        //condition to run if the board name is empty
        if (boardData?.name === "") {
          setIsBoardNameEmpty(true);
        }

        if (emptyColumnStringChecker) {
            const emptyColumn = boardData?.columns.findIndex(
              (column) => column.name == ""
            );
            setEmptyColumnIndex(emptyColumn);
          }
      
          if (boardData?.name !== "" && !emptyColumnStringChecker) {
            //submit to the database after verifying that the board name and none of the column names aren't empty
            if (data) {
              let [boards] = data;
              const addBoard = [...boards.boards, boardData];
              boards = addBoard;
              updateBoardToDb(boards);
            }
          }
        };

        const handleEditBoardToDb = (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const emptyColumnStringChecker = boardData?.columns.some(
              (column) => column.name === ""
            );
            //condition to run if the board name is empty
            if (boardData?.name === "") {
              setIsBoardNameEmpty(true);
            }
            //if any of the column names is empty, update the emptyColumnIndex with its index
            if (emptyColumnStringChecker) {
              const emptyColumn = boardData?.columns.findIndex(
                (column) => column.name == ""
              );
              setEmptyColumnIndex(emptyColumn);
            }
            //submit to the database after verifying that the board name and none of the column names aren't empty
            if (boardData?.name !== "" && !emptyColumnStringChecker) {
              if (data) {
                const [boards] = data;
                const boardsCopy = [...boards.boards]; 
                const activeBoardIndex = boardsCopy.findIndex(
                  (board: { name: string }) => board.name === currentBoardTitle
                );
                const updatedBoard = {
                  ...boards.boards[activeBoardIndex],
                  name: boardData!.name,
                  columns: boardData!.columns,
                } ;
                boardsCopy[activeBoardIndex] = updatedBoard;
                updateBoardToDb(boardsCopy);
              }
            }
          };

 return (
   <Modal isOpen={isOpen} onRequestClose={closeModal}>
     <ModalBody>
     {boardData && (
          <>
      <p className="text-lg font-bold">{modalVariant}</p>
      <div className="py-6">
              <div>
                <label htmlFor="boardName" className="text-sm">
                  Nome do Cartão
                </label>
                <div className="pt-2">
                <input 
                    id="boardName"
                    className={`${
                        isBoardNameEmpty ? "border-red-500" : "border-[#FFFAA0]"
                      } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                    placeholder="Nome"
                    value={boardData.name}
                    onChange={handleBoardNameChange}
                    />
                </div>

                {isBoardNameEmpty ? (
                  <p className="text-xs text-red-500">
                    O nome do cartão não pode estar vazio
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="" className="text-sm">
                  Coluna de Cartões
                </label>
                {boardData &&
                  boardData.columns.map(
                    (column: { name: string, id: string }, index: number) => {
                      const { name, id } = column;
                      return (
                        <div key={id} className="pt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              className={`${
                                emptyColumnIndex === index
                                  ? "border-red-500"
                                  : "border-[#FFFAA0]"
                              } border border-[#FFFAA0] focus:outline-none text-sm cursor-pointer w-full p-2 rounded`}
                              placeholder="ex. Fazer Compras"
                              onChange={(e) => handleColumnNameChange(index)(e)}
                              value={name!}
                            />
                            <div>
                              <FaTimes
                              className="text-red-500"
                                onClick={() => handleDeleteColumn(index)}
                              />
                            </div>
                          </div>
                          {/* display this error if the board name is empty */}
                          {emptyColumnIndex === index ? (
                            <p className="text-xs text-red-500">
                            Nome da coluna não pode estar vazio
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }
                  )}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleAddNewColumn}
                    className="bg-[#FFBF00] rounded-3xl py-2 w-full text-sm text-white font-semibold"
                  >
                    <p>+ Nova Coluna</p>
                  </button>
                </div>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                    // function to run depending on the variant of the modals
                    isVariantAdd
                      ? handleAddNewBoardToDb(e)
                      : handleEditBoardToDb(e);
                  }}
                  className="bg-[#fd8900] rounded-3xl py-2 w-full text-sm text-white font-semibold"
                >
                  {/* text to display depending on the variant of the modal */}
                  <p>
                    {isLoading
                      ? "Carregando"
                      : `${isVariantAdd ? "Criar Novo Cartão" : "Salvar Alterações"}`}
                  </p>
                </button>
              </div>
            </div>
          </>
        )}
     </ModalBody>
</Modal>
 );
}