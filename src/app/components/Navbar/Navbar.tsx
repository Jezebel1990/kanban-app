'use client'

import { useState } from 'react'
import Dropdown from '../Dropdown/Dropdown';

export default function Navbar() {

    const [show, setShow] = useState<boolean>(false);

    return (
        <nav className="bg-white border flex h-24">
          <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
            <p className="font-bold text-3xl">Planeja+</p>
          </div>

          <div className="flex justify-between w-full items-center pr-[2.12rem]">
            <p className="text-black text-2xl font-bold pl-6">
                Nome da Tarefa
            </p>

            <div className="flex items-center space-x-3">
              <button className="bg-[#FFBF00] text-white px-4 py-2 flex rounded-3xl items-center space-x-2">
                <p>+ Nova Tarefa</p>
              </button>
              <div className='relative flex items-center'>
              <button   onClick={() => setShow(!show)} className="text-3xl mb-4">
               ...
              </button>
              <Dropdown show={show}/>
              </div>
              </div>
            </div>
        </nav>
    );
}