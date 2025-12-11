"use client";
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { axiosApi } from '../lib/axiosApi';
import Navbar from '../components/Navbar';
import gsap from 'gsap';

const page = () => {
    
    const [isTimerRunning,setIsTimerRunning] = useState<boolean>(false);
    const [timerSeconds,setTimerSeconds] = useState<number>(0);
    const [timerStartTime,setTimerStartTime] = useState<Date | null>(null);
    const catRef = useRef<HTMLDivElement>(null);
    const [catName,setCatName] = useState<string>("");
    const [catColour,setCatColour] = useState<string>("#ffffff");
    const [fetchedCat,setFetchedCat] = useState<{id:number; name:string; colour:string;}[]>([]);
    const [taskName,setTaskName]= useState<string>("");
    const [startTime,setStartTime] = useState<string>("00:00");
    const [endTime,setEndTime] = useState<string>("00:00");
    const [selectCatName,setSelectCatName] = useState<string>("");
    const [ date,setDate] = useState<Date>();
    const [formattedDate,setFormattedDate] = useState<string>("");
    const [no_of_hours,setNo_of_hours] = useState<number>(0);
    const [catId,setCatId] = useState<number>();
    const [categoryOpen,setCategoryOpen] = useState<boolean>(false);
    const [selectCat,setSelectCat] = useState<boolean>(false);
    const [currentWeekStart,setCurrentWeekStart] = useState<Date>(new Date());
    const [week,setWeek] = useState<Date[]>([]);
    const [width,setWidth] = useState<number>(0);
    const hours = Array.from({length:24},(_,i) => {
        const hour = i %12 === 0 ? 12: i%12;
        const ampm = i<12 ? "AM" : "PM";
        return `${hour.toString().padStart(2,"0")}:00${ampm}`;
    })

    const todayRaw = new Date();
    const [sched,setSched] = useState<boolean>(false);
    const [catOpen,setCatOpen] = useState<boolean>(false);
    const options = { day:"numeric" as const,month:"long" as const,year:"numeric" as const};
    const today = todayRaw.toLocaleDateString("en-IN",options);
    console.log(today);

    const [TaskList,setTaskList] = useState<{name:string; start_time:string; end_time:string; date:Date; formattedDate:string;no_of_hours:number;userId:number;categories: {id: number; name: string; colour: string;}[];}[]>([]);


    const formatTimerDisplay = (seconds:number) => {
        const hours = Math.floor(seconds/3600);
        const minutes = Math.floor((seconds%3600)/60);
        const secs = seconds%60;

        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }

    const fetchTask = async () => {
        try {
            
            const res = await axiosApi.get(`/task`);
            console.log("fetched successfully:",res.data);
            setTaskList(res.data);
        }
        catch(err){
            console.error("error in fetching data from the task table:",err);
        }
            
    }



    const submitTask = async () => {
        try {

            const [startHour,startMin] = startTime.split(':').map(Number);
            const [endHour,endMin] = endTime.split(':').map(Number);
            const startMinutes = startHour*60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            const diffMin = endMinutes - startMinutes;
            const hours = diffMin/60;

            const currentDate = new Date();
            const formatted = currentDate.toLocaleDateString("en-IN",{
                day:"numeric",
                month:"long",
                year:"numeric"
            }) 
            const res = await axiosApi.post('/task',{
                name:taskName,
                start_time:startTime,
                end_time:endTime,
                date:currentDate,
                formattedDate:formatted,
                no_of_hours: hours,
                categoryIds: catId ? [catId] : [],
            });
            setTaskName("");
            setStartTime("00:00");
            setEndTime("00:00");
            setCatId(undefined);
            console.log("Tasks created successfully!:",res.data);
            fetchTask();
        }
        catch(err){
            console.error("Error when uploading data to the task table:",err);
        }
    }

    const startTimer = () => {
        if (isTimerRunning) {
            setIsTimerRunning(false);

            const now = new Date();
            const hours = now.getHours().toString().padStart(2,'0');
            const minutes = now.getHours().toString().padStart(2,'0');
            setEndTime(`${hours}:${minutes}`);


        }
        else{
            const now = new Date();
            const hours = now.getHours().toString().padStart(2,'0');
            const minutes = now.getHours().toString().padStart(2,'0');
            setStartTime(`${hours}:${minutes}`);
            setTimerStartTime(now);
            setTimerSeconds(0);
            setIsTimerRunning(true);
    }
}
    useEffect( ()=> {
        let interval: NodeJS.Timeout;

        if (isTimerRunning && timerStartTime){
            interval = setInterval( ()=> {
                const now = new Date();
                const diff = Math.floor((now.getTime() - timerStartTime.getTime())/1000);
                setTimerSeconds(diff);
            },1000)
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    },[isTimerRunning,timerStartTime])

    const submitCat = async () => {
        try {
            const res  = await axiosApi.post(`/category`,{
                colour:catColour,
                name:catName,
            })
            console.log("category created!");
            fetchCategory();
        }
        catch(err){
            console.error("error when inputting category:",err);
        }
    }
    const [open,setOpen] = useState<boolean>(false);
    
    const fetchCategory = async () =>{
        try {
            
            const res = await axiosApi.get(`/category`);
            console.log("Categories already created are:",res.data);
            setFetchedCat(res.data);
        }
        catch (err){
            console.error("Error occured when fetching data from category table:",err);
        }
    }

    const generateWeek = (startDate:any) => {
        const date = new Date(startDate);
        const dayIndex  = date.getDay();
        const diffToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;

        const monday = new Date(date);
        monday.setDate(monday.getDate() + diffToMonday);
        
        const generatedWeek = [...Array(7)].map( (_,i) => {
            const d  = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        })

        setWeek(generatedWeek);
        setCurrentWeekStart(monday);
    }

    const goToPreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        generateWeek(newStart);
    }

    const goToNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        generateWeek(newStart);
    }

    const goToToday = () => {
        generateWeek(new Date());
    }

    const getTasksForDay = (day:Date) => {
        return TaskList.filter( task => {
            const taskDate = new Date(task.date);
            return (
                taskDate.getDate() === day.getDate() &&
                taskDate.getMonth() === day.getMonth() &&
                taskDate.getFullYear() === day.getFullYear()
            )
        })
    }

    const timeToPosition = (timeStr:string) => {
        const [hours,min] = timeStr.split(":").map(Number);
        return hours +min/60;
    }

    const hexToRgba = (hex:string, alpha:number) => {
        if (!hex || hex.length < 7) {
            return `rgba(107, 114, 128, ${alpha})`; 
        }
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getTaskStyle = (task:any) => {
        const startPos = timeToPosition(task.start_time);
        const endPos = timeToPosition(task.end_time);
        const duration = endPos - startPos;

        return{
            
            left:`${startPos*175}px`,
            width:`${duration*175}px`,
            border:`2px solid  ${hexToRgba(task.categories[0]?.colour, 0.6)}`,
            backgroundColor:'#011502',
        
        }
    }

    useEffect( ()=> {
        const currentWidth = window.innerWidth;
        setWidth(currentWidth);
        const today = new Date();
        const dayIndex = today.getDay();
        const diffToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;

        const monday  =  new Date(today);
        monday.setDate(monday.getDate() + diffToMonday);

        const generatedWeek = [...Array(7)].map((_,i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate()+i);
            return d;
        })
        setWeek(generatedWeek);
        
    },[]);

    useEffect(() => {
     
        
            
            fetchCategory();
            fetchTask();
            const elements = [catRef.current,'.time','.time1','.time3','.time4','.time5'].filter(Boolean);
            gsap.to(elements,{
                opacity:1,
                duration:0.4,
                stagger:0.3
            })
       
    }, []);
  return (
    <div className=' bg-[#1b1b1e]  h-[100vh] overflow-hidden relative'>
        <Navbar/>
        <div className='md:ml-[10vw]   '>
        <p className='bg-[#1b1b1e] py-3 px-5 mt-5 text-4xl'>Activity Chart</p>
        <div className='flex flex-col  md:space-y-5 md:pb-[50px]'>
        <div className='bg-[#1b1b1e] relative h-[45vh] md:h-[30vh]'>
            <div className='fixed'>
            <div className='bg-[#1b1b1e] md:p-4 w-[84vw]   rounded-lg mt-8 '>
            <h3 className='text-lg font-semibold mb-3 text-center time opacity-0'>Categories</h3>
            <div className='flex flex-wrap gap-4 text-center justify-center items-center'>
            {fetchedCat.map(cat => (
                <div key={cat.id} className='flex items-center gap-2  time6' ref={catRef}>
                    <div 
                    className='w-4 h-4 rounded' 
                    style={{backgroundColor: cat.colour}}
                    />
                    <span className='text-sm'>{cat.name}</span>
                </div>
            ))}
            </div>
        </div>
       <div className='flex items-center justify-between  p-1 md:p-2 mt-5 w-[100vw] md:w-[88vw]'>
            <button onClick={goToPreviousWeek} className='ml-2  p-2 md:p-3 bg-[#2f184b] opacity-0 time4 rounded-md'>Previous Week</button>
            <div className='flex  items-center flex-col time2 opacity-0 justify-center ml-7'>
                <p className='mb-1'>{today}</p>
                <p>{week[0]?.toLocaleDateString("en-IN",{month:"short",day:"numeric"})} - 
                    {week[6]?.toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"})}
                </p>
            </div>
            <div className='flex gap-3'>
                {width > 768 && <button className=' p-2 md:p-3 bg-[#2f184b] time3 opacity-0 rounded-md' onClick={goToToday}>This Week</button>}
                <button className='p-2 mr-2 md:mr-auto md:p-3 bg-[#2f184b] time5 opacity-0 rounded-lg text-center' onClick={goToNextWeek}>Next Week</button>
            </div>
        </div>     
            
        <div className='md:left-[65%] md:top-[5%] justify-center md:absolute z-50  p-5 relative' >
            { !sched &&   <button className='bg-[#2f184b] px-4 md:px-2 md:h-auto  p-[5px] md:w-[200px] md:left-[15vw] md:absolute text-[#F1F0EA] text-2xl rounded-md block mx-auto time1 opacity-0' onClick={() => {
                setSched(!sched)
            }}>Create Schedule</button> }
            { sched && <div className='space-y-5  bg-[#1a1423]  md:ml-[5vw]'>
                <div className='space-y-3 -mt-[25vh] p-3 md:-mt-[70px]   z-75 bg-[#1a1423] flex flex-col'>
                {/* Start Timer function or Set time for past activities */}
                <input type="text" className='border rounded-md p-1 text-gray-300' placeholder=' Activity Name' value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                />
                
                <div className='relative'>
                {/* DropDownList */}
                <div className='relative'>
        
        <div className='flex flex-row justify-between text-gray-500 '>{!selectCat ?  'select a category': `${selectCatName}`}

        <div className='text-white pr-[15px] cursor-pointer' onClick={ () =>{setOpen(!open)}}>▼</div>
        </div>
        {open && 
        <div className='flex flex-col rounded-md overflow-scroll hide-scrollbar bg-[#2C2A2F] '>
            <div>
            <div className='cursor-pointer p-2'  onClick={() => setCatOpen(!catOpen)} >Create a category</div>
            {catOpen && 
            <div className='flex flex-col'>
                <div className='flex flex-row justify-around mb-3 p-2'>
                    <input type="text" placeholder=' name' className='border border-gray-500 rounded-md' value={catName} onChange={(e) => setCatName(e.target.value)} />
                    <div className='flex flex-row'>
                    <label htmlFor="color" className='text-gray-400 mr-2'>Color</label>
                    <input value={catColour} type="color" onChange={(e) => setCatColour(e.target.value)} />
                    </div>
                    </div>
                    <div className='w-full text-center flex items-center justify-center rounded-md p-2'>

                    <button type='submit' className='bg-[#0A0815] w-fit text-center flex items-center justify-center rounded-md p-2' onClick={() => {
                        submitCat();
                        setCatOpen(!catOpen);
                        setOpen(!open);
                        setSelectCat(!selectCat);
                    }}>Create Category</button>
                    </div>
                </div>}
            </div>



            <hr  className='text-gray-500'/>
            {fetchedCat.map( (cat,id) => (
                <div key={id} className='cursor-pointer'
                onClick={() => {setCatId(cat.id)
                    setOpen(!open);
                    setSelectCatName(cat.name);
                    setSelectCat(!selectCat);

                }}
                >
                <div  className='text-gray-200 flex flex-row justify-around p-2' >
                    <p>{cat.name}</p>
                    <div className='w-[20px] h-[20px] rounded-full ' style={{backgroundColor: cat.colour}}></div>
                </div>
                <hr className='text-gray-400' />
                </div>
            ))}
            
            
        </div>}
        </div>
                </div>
                
                
                {isTimerRunning && (
        <div className='bg-[#2d1f3d] p-3 text-center border-t border-[#5a1d7f]'>
            <div className='text-3xl font-mono text-[#10b981] font-bold animate-pulse'>
                {formatTimerDisplay(timerSeconds)}
            </div>
            <div className='text-xs text-gray-400 mt-1'>
                Started at {startTime}
            </div>
        </div>
    )}
                <button className='bg-[#2f184b] text-[#F1F0EA] p-[5px] rounded-md' onClick={startTimer}>{isTimerRunning ? '⏸ Stop Timer' : '▶ Start Timer Now'}</button>
                <div className='md:space-x-3 md:space-y-0 space-y-3 flex md:flex-row flex-col'>
                    <input type="time" className='border p-1 rounded-md text-gray-300' placeholder=' Starting Time ' value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input type="time" className='border p-1 rounded-md text-gray-300' placeholder=' Ending Time'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
                </div>
                <div className='flex flex-row justify-center items-center'>
                <div className='border p-[2px] bg-[#F1F0EA] text-black text-center rounded-md px-[4px] cursor-pointer' onClick={() => {setSched(false);
                    submitTask();
                }}>Create</div>
                </div>
                </div>}
           
        </div>
        </div>
        </div>
        <div className='relative h-[55vh] bg-[#080708] md:h-[70vh] overflow-scroll hide-scrollbar opacity-0 time5'>
            <div className='flex flex-row z-0 left-[175px] absolute bg-[#080708]'>
                {hours.map((t,i) => (
                    <div className='border  border-gray-800 w-[175px]  h-[715px] md:h-[1430px] px-[8px]'  key={i}>{t}</div>
                ))}
            </div>    
            <div>
                
            </div>
            
            <div className='w-[4400px] sticky z-50 pt-[30px] h-[730px] md:h-[1530px] overflow-y-hidden'>
            
    
                {week.map((day,index) => {
                    const dayTasks = getTasksForDay(day);
                    const isToday = day.toDateString() === todayRaw.toDateString();

                    return (
                        <div key={index} className={`flex h-[100px] md:h-[200px] border flex-row justify-start border-gray-800   `}>
                            <div className='w-[175px] p-4 rounded-md  flex flex-col justify-start '>

                            
                            <div className={`text-2xl ${isToday ? 'text-[#ffceff]' : ''}`}>{day.toLocaleDateString("en-IN",{day:"numeric",weekday:'long'})}</div>
                            <div>{day.toLocaleDateString("en-IN",{month:"long"})}</div>
                            {dayTasks.length > 0 && (
                                <div>{dayTasks.length} task{dayTasks.length > 1 ? 's':""}</div>
                            )}
                        </div>

                        <div className='flex relative'>
                            <div className='  h-full'> 
                                {hours.map((j,i) => (
                                    <div key={i} className='w-[175px] border border-gray-800 h-full'>

                                    </div>
                                ))}
                            </div>

                        {dayTasks.map((task,taskIdx) => (
                            <div
                            key={taskIdx}
                            className='absolute top-2  p-4 h-[calc(100%-1rem)] mx-2 rounded-md  text-[#c6c7c4] text-center text-sm flex items-center justify-center flex-col space-y-3 overflow-hidden cursor-pointer  hover:opacity-90 transition-opacity'
                            style={getTaskStyle(task)}
                            title={`${task.name}\n${task.start_time} - ${task.end_time}\n${task.no_of_hours}h`}
                        >
                            <div className='font-semibold truncate text-4xl '>{task.name}</div>
                            <div className='text-xs opacity-90 text-[#e4d6a7]'>
                                {task.start_time} - {task.end_time}
                            </div>
                            <div className='text-xs text-[#e4d6a7] opacity-75'>
                                {task.no_of_hours}h
                            </div>
                        </div>
                        ))}
                        </div>

                        </div>
                        
                    )
                })}
            </div>
                
        </div>
        </div>
        </div>
    </div>
  )
}

export default page