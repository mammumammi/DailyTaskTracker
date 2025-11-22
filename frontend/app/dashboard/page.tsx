"use client";
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { axiosApi } from '../lib/axiosApi';

const page = () => {
  const [width,setWitdth] = useState<number>(window.innerWidth);
  const [userId,setUserId] = useState<number>();
  const [tasks,setTasks] = useState<any[]>([]);
  const [categories,setCategories] = useState<any[]>([]);
  const [activeTask,setActiveTasks] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      const res = await axiosApi.get(`/task/${userId}`);
      console.log("Data loaded successfully from Task table:",res.data);
      setTasks(res.data);
    }
    catch(err){
      console.error("error when fetching data from task table:",err);
    }
  }

  const fetchCategories = async () => {
    try{
      const res = await axiosApi.post('/category');
      console.log('Data loaded successfully from the category table:',res.data);
      setCategories(res.data);
    }
    catch(err){
      console.log("Error in fetching data from the category table:",err);
    }
  }

  useEffect(()=>{
    if (userId){
      fetchCategories();
      fetchTasks();
    }
  },[userId]);

  const getWeeklyData = () => {
    const categoryHours:{[key:string]:number} = {};
    categories.forEach(cat => {
      categoryHours[cat.name] = 0;
    });

    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7*24*60*60*1000);

      if (taskDate >= weekAgo && taskDate<=today){
        const catName = task.categories[0]?.name;
        if (catName && categoryHours[catName] !== undefined){
          categoryHours[catName] +=  task.no_of_hours;
        }
      }
    });
    return categoryHours;
  }

  const getDailyData = () => {
    const categoryHours:{[key:string]:number}={};
    categories.forEach(cat => {
      categoryHours[cat.name] = 0;
    });

    const today = new Date();
    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      if (
        taskDate.getDate() === today.getDate() && taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      ) {
        const catName = categories[0]?.name;
        if (catName && categoryHours[catName]!== undefined){
          categoryHours[catName] += task.no_of_hours;
        }
      }
    })
    return categoryHours;
  }

  const getTodayTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()
      )
    })
  }

  const isTaskActive = (task:any) => {
    const now = new Date();
    const [startHour,startMin] = task.start_time.split(":").map(Number);
    const [endHour,endMin] = task.end_time.split(":").map(Number);

    const taskStart = new Date();
    taskStart.setHours(startHour,startMin,0);
    const taskEnd = new Date();
    taskEnd.setHours(endHour,endMin,0);

    return now >= taskStart && now<= taskEnd;
  }

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const todayTasks = getTodayTasks();
  
  const totalWeeklyHours = Object.values(weeklyData).reduce((a, b) => (a as number) + (b as number), 0) as number;
const totalDailyHours = Object.values(dailyData).reduce((a, b) => (a as number) + (b as number), 0) as number;
  useEffect(() => {
    const checkActiveTasks = () => {
      const active = todayTasks.find(task => isTaskActive(task));
      setActiveTasks(active || null);
    }

    checkActiveTasks();
    const interval = setInterval(checkActiveTasks,120000);

    return ()=> clearInterval(interval);

  },[tasks])


  const BarChart = ({data,title,totalHours}:any) => {
    const maxHours = Math.max(...Object.values(data).map( v=> v as number),1);

    return (
      <div className='flex flex-col'>
        <div className='mb-4'>
          <p>{title}</p>
          <p>TotalHours: {totalHours.toFixed(1)} hours</p>

        </div>

        <div className='flex-1 gap-3 px-2 flex items-end'>
          {Object.entries(data).map(([category,hours]) => {
            const cat  = categories.find(c => c.name === c.category);
            const percentage =  ( (hours as number)/maxHours) * 100;

            return (
              <div>Bar chart of weekly basis</div>
            )

          })}


        </div>

      </div>
    )
  }

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId){
      setUserId(Number(storedUserId))
    }
  },[])
  return (
    <div>
      <Navbar/>
      <div className='md:ml-[10vw] p-[25px] md:p-[15px]  space-y-5'>
      <p className='text-3xl'>Dashboard</p>
      <div className='flex flex-col md:flex-row mt-[20px] space-x-5 space-y-5'>
        <div className='w-full h-[200px] md:w-[65%] md:h-[300px] bg-[#041f1e] rounded-md' >Box1</div>
        <div className='w-full h-[200px] md:w-[35%] md:h-[300px] bg-[#041f1e] rounded-md'>Box2</div>
        <div>
          
        </div>
      </div>
      <div className='flex flex-row space-x-5 text-center  justify-center items-center'>
        <p>Task 1</p>
        <p>Task 2</p>
        <p>Task 3</p>
      </div>

      </div>
    </div>
  )
}

export default page