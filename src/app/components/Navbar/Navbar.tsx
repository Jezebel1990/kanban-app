'use client'

import { useEffect, useState } from 'react'
import Dropdown from '../Dropdown/Dropdown';
import { useFetchDataFromDbQuery } from '@/components/redux/services/apiSlice';
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks';
import { setCurrentBoardName, getCurrentBoardName, openAddAndEditTaskModal } from '@/components/redux/features/appSlice';

export default function Navbar() {

    const [show, setShow] = useState<boolean>(false);
    const { data } = useFetchDataFromDbQuery();
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (data) {
        const activeBoard = data[0]?.boards[0];
        dispatch(setCurrentBoardName(activeBoard.name));
      }
    }, [data]);

const currentBoardName = useAppSelector(getCurrentBoardName);

    return (
        <nav className="bg-white border-b-2 flex h-24">
          <div className="flex-none w-[18.75rem] border-b-2  border-white flex items-center pl-[2.12rem] bg-[#0e1726]">
            <p className="font-bold text-3xl text-white">Planeja+</p>
          </div>

          <div className="flex justify-between w-full items-center pr-[2.12rem]">
            <p className="text-black text-2xl font-bold pl-6">
              {currentBoardName}
            </p>

            <div className="flex items-center space-x-3">
              <button 
              type='button'
              onClick={() => dispatch(openAddAndEditTaskModal({variant: 'Adicionar Nova Tarefa'}))}
              className="bg-[#FFBF00] text-white px-4 py-2 flex rounded-3xl items-center space-x-2">
                <p>+ Nova Tarefa</p>
              </button>
              <div className='relative flex items-center'>
              <button onClick={() => setShow(!show)} className="text-3xl mb-4">
               ...
              </button>
              <Dropdown show={show}/>
              </div>
              </div>
            </div>
        </nav>
    );
}