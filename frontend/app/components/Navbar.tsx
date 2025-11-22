"use client";
import React, { useEffect, useState } from 'react'
import icon from '../../assets/icon.svg';
import { useRouter } from 'next/navigation';
const Navbar = () => {
    const [width,setWidth] = useState<number>(0);
    const [full,setFull] = useState<boolean>(false);
    const router = useRouter();
    const fullscreen = () => {
        setFull(!full);
    }

    useEffect( ()=>{
        setWidth(window.innerWidth);
    },[])

  return (
    <div>
        {width > 768 ? 
            <div className='w-[10vw] bg-[#0c1821] h-[100vh] py-4 fixed pl-3'>
                <p>Navigation</p>
                <div className='flex py-5 pl-1 flex-col space-y-3 '>
                    <div className='cursor-pointer' onClick={() => {
                        router.push("/timetable");
                    }}>Activity</div>
                    <div className='cursor-pointer'
                    onClick={() => {
                        router.push("/dashboard")
                    }}>Dashboard</div>
                    

                </div>
            <div>

            </div>
        </div> :

            <div className='w-full bg-[#0c1820] '>
                <button onClick={fullscreen} className='bg-white' ><img src='/iconnew.png' alt="" className='h-[25px]' /></button>
                {full && <div className='space-y-3 flex flex-col h-[100dvh]  '>
                        <div className='cursor pointer' onClick={ () => {
                            router.push('/timetable')
                        }}>Activity</div>
                        <div>Tasks</div>
                        <div>Settings</div>
                    </div>}
        
        </div> }
    </div>
  )
}

export default Navbar