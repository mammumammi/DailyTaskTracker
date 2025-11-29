"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { axiosApi } from '../lib/axiosApi';
import Navbar from '../components/Navbar';

const page = () => {
    const [catName,setCatName] = useState<string>("");
    const [catColour,setCatColour] = useState<string>("#ffffff");
    const [fetchedCat,setFetchedCat] = useState<{id:number; name:string; colour:string;}[]>([]);
    const [taskName,setTaskName]= useState<string>("");
    const [startTime,setStartTime] = useState<string>("00:00");
    const [endTime,setEndTime] = useState<string>("00:00");
    const [ date,setDate] = useState<Date>();
    const [formattedDate,setFormattedDate] = useState<string>("");
    const [no_of_hours,setNo_of_hours] = useState<number>(0);
    const [catId,setCatId] = useState<number>();
    
    
    const [currentWeekStart,setCurrentWeekStart] = useState<Date>(new Date());
    const [week,setWeek] = useState<Date[]>([]);
    const hours = Array.from({length:24},(_,i) => {
        const hour = i %12 === 0 ? 12: i%12;
        const ampm = i<12 ? "AM" : "PM";
        return `${hour.toString().padStart(2,"0")}:00${ampm}`;
    })

    const todayRaw = new Date();
    const [sched,setSched] = useState<boolean>(false);
    const [catOpen,setCatOpen] = useState<boolean>(false);
    const options = { day:"numeric",month:"long",year:"numeric"};
    const today = todayRaw.toLocaleDateString("en-IN",options);
    console.log(today);

    const [TaskList,setTaskList] = useState<{name:string; start_time:string; end_time:string; date:Date; formattedDate:string;no_of_hours:number;userId:number;categories: {id: number; name: string; colour: string;}[];}[]>([]);

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

    }
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

    const getTaskStyle = (task:any) => {
        const startPos = timeToPosition(task.start_time);
        const endPos = timeToPosition(task.end_time);
        const duration = endPos - startPos;

        return{
            left:`${startPos*175}px`,
            width:`${duration*175}px`,
            backgroundColor: task.categories[0]?.colour || "#ffffff"
        }
    }

    useEffect( ()=> {
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
       
    }, []);
  return (
    <div className='mt-[20px]'>
        <Navbar/>
        <div className='ml-[10vw]'>
        <p>Activity Chart</p>
        <div className='flex flex-col  space-y-5 py-[50px]'>

        <div className='bg-[#0A0815] p-4 rounded-lg mt-8'>
    <h3 className='text-lg font-semibold mb-3 text-center'>Categories</h3>
    <div className='flex flex-wrap gap-4 text-center justify-center items-center'>
        {fetchedCat.map(cat => (
            <div key={cat.id} className='flex items-center gap-2'>
                <div 
                    className='w-4 h-4 rounded' 
                    style={{backgroundColor: cat.colour}}
                />
                <span className='text-sm'>{cat.name}</span>
            </div>
        ))}
    </div>
</div>
       <div className='flex items-center justify-between p-2 mt-5'>
            <button onClick={goToPreviousWeek} className='p-2 bg-[#192932] rounded-md'>← Previous</button>
            <div className='text-center'>
                <p className='mb-1'>{today}</p>
                <p>{week[0]?.toLocaleDateString("en-IN",{month:"short",day:"numeric"})} - 
                    {week[6]?.toLocaleDateString("en-IN",{month:"short",day:"numeric",year:"numeric"})}
                </p>
            </div>
            <div className='flex gap-2'>
                <button className='p-2 bg-[#2F243A] rounded-md' onClick={goToToday}>Today</button>
                <button className='p-2 bg-[#321427] rounded-md' onClick={goToNextWeek}>Next →</button>
            </div>
        </div>     
            
        <div className='md:left-[65%] md:top-[5%] justify-center md:absolute z-75 bg-[#160521] p-5 relative' >
            { !sched &&   <button className='bg-[#471766] px-4 md:px-2 p-[5px] md:w-[200px] md:left-[18vw] md:absolute text-[#F1F0EA] text-2xl rounded-md ' onClick={() => {
                setSched(!sched)
            }}>Create Schedule</button> }
            { sched && <div className='space-y-5'>
                <div className='space-y-3 flex flex-col'>
                {/* Start Timer function or Set time for past activities */}
                <input type="text" className='border rounded-md p-1 text-gray-300' placeholder=' Activity Name' value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                />
                
                <div className='relative'>
                {/* DropDownList */}
                <div className='relative'>
        
        <div className='flex flex-row justify-between text-gray-500 '>select a category

        <div className='text-white pr-[15px] cursor-pointer' onClick={ () =>{setOpen(!open)}}>▼</div>
        </div>
        {open && 
        <div className='flex flex-col rounded-md bg-[#2C2A2F] '>
            <div>
            <div className='cursor-pointer p-2'  onClick={() => setCatOpen(!catOpen)} >Create a category</div>
            {catOpen && 
            <div className='flex flex-col'>
                <div className='flex flex-row justify-around mb-3'>
                    <input type="text" placeholder=' name' className='border border-gray-500 rounded-md' value={catName} onChange={(e) => setCatName(e.target.value)} />
                    <div className='flex flex-row'>
                    <label htmlFor="color" className='text-gray-400 mr-2'>Color</label>
                    <input value={catColour} type="color" onChange={(e) => setCatColour(e.target.value)} />
                    </div>
                    </div>
                    <div className='w-full text-center flex items-center justify-center rounded-md p-2'>

                    <button type='submit' className='bg-[#0A0815] w-fit text-center flex items-center justify-center rounded-md p-2' onClick={submitCat}>Create Category</button>
                    </div>
                </div>}
            </div>



            <hr  className='text-gray-500'/>
            {fetchedCat.map( (cat,id) => (
                <div key={id} className='cursor-pointer'
                onClick={() => setCatId(cat.id)}
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
                
                

                <button className='bg-[#471766] text-[#F1F0EA] p-[5px] rounded-md' onClick={startTimer}>Start Time Now</button>
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
                <div className='flex flex-row w-full justify-around'>Goal Hours <input type='text' className='border md:flex md:justify-end md:flex-row rounded-md w-[50px] text-center ml-3' placeholder='eg:0'></input>
                <div className='border p-[2px] bg-[#F1F0EA] text-black rounded-md px-[4px] cursor-pointer' onClick={() => {setSched(!sched);
                    submitTask();
                }}>Create</div>
                </div>
                </div>}
           
        </div>
        <div className='relative'>
            <div className='flex flex-row z-0 left-[175px + 10vw] absolute '>
                {hours.map((t,i) => (
                    <div className='border  border-gray-800 w-[175px] h-[1430px] px-[8px]'  key={i}>{t}</div>
                ))}
            </div>    
            <div>
                
            </div>
            
            <div className='w-[4400px] sticky z-50 pt-[30px] h-[1400px] overflow-y-hidden'>
            
    
                {week.map((day,index) => {
                    const dayTasks = getTasksForDay(day);
                    const isToday = day.toDateString() === todayRaw.toDateString();

                    return (
                        <div key={index} className={`flex h-[200px] border flex-row justify-start border-gray-800   `}>
                            <div className='w-[175px] p-4 rounded-md  flex flex-col justify-start '>

                            
                            <div className={`text-2xl ${isToday ? 'text-[#10b981]' : ''}`}>{day.toLocaleDateString("en-IN",{day:"numeric",weekday:'long'})}</div>
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
                            className='absolute top-2  p-4 h-[calc(100%-1rem)] rounded-md  text-black text-center text-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity'
                            style={getTaskStyle(task)}
                            title={`${task.name}\n${task.start_time} - ${task.end_time}\n${task.no_of_hours}h`}
                        >
                            <div className='font-semibold truncate'>{task.name}</div>
                            <div className='text-xs opacity-90'>
                                {task.start_time} - {task.end_time}
                            </div>
                            <div className='text-xs opacity-75'>
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