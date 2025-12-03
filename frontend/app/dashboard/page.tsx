"use client";
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar';
import { axiosApi } from '../lib/axiosApi';
import gsap from 'gsap';

const page = () => {
  const [width,setWidth] = useState<number>();
  const [tasks,setTasks] = useState<any[]>([]);
  const [categories,setCategories] = useState<any[]>([]);
  const [activeTask,setActiveTasks] = useState<any>(null);
  const taskRef = useRef<HTMLDivElement>(null);
  const fetchTasks = async () => {
    try {
      const res = await axiosApi.get(`/task`);
      console.log("Data loaded successfully from Task table:",res.data);
      setTasks(res.data);
    }
    catch(err){
      console.error("error when fetching data from task table:",err);
    }
  }

  const fetchCategories = async () => {
    try{
      const res = await axiosApi.get('/category');
      console.log('Data loaded successfully from the category table:',res.data);
      setCategories(res.data);
    }
    catch(err){
      console.log("Error in fetching data from the category table:",err);
    }
  }

  useEffect(()=>{
   
      fetchCategories();
      fetchTasks();
      const elements = ['.dashmain',
        taskRef.current,
        '.dash', '.dash1', '.dash2', '.dash3', '.dash4',
        '.dash5', '.dash6', '.dash7', '.dash8', '.dash9', '.dash10'
      ].filter(Boolean); 
        gsap.to(elements,{
          opacity:1,
          duration:0.5,
          stagger:0.2,
          ease:'power3.inOut'
        })
  },[]);

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
    console.log("category hours:",categoryHours);
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
        const catName = task.categories[0]?.name;
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
      <div className='flex flex-col p-4 h-[40%]'>
        <div className='-mb-4'> 
          <p>{title}</p>
          <p>TotalHours: {totalHours.toFixed(1)} hours</p>

        </div>

        <div className='flex-1 gap-3 px-2 flex items-end '>
          {Object.entries(data).map(([category,hours]) => {
            const cat  = categories.find(c => c.name === category);
            const percentage =   ((hours as number)/maxHours) * 100;

            return (
              <div key={category} className='flex-1 h-full flex flex-col items-center gap-2'>
                <div className='w-full h-[130px] mt-7 flex flex-col items-center justify-end'>
                  <span className='text-sm font-semibold mb-1'>{(hours as number).toFixed(1)}h</span>
                  <div className='w-full relative rounded-t-lg transition-all duration-500'
                  style={{
                    height: `${Math.max(percentage, 5)}%`,
                    backgroundColor: cat?.colour || '#6b7280',
                    
                  }}
                  >
                    
                  </div>
                </div>
                <div className='text-center mt-5'>
                  <div className='w-3 h-3 rounded-full mx-auto mb-1'
                  style={{
                    backgroundColor: cat?.colour ||  '#6b7280'
                  }}
                  ></div>
                  <span className='text-xs text-gray-400'>{category}</span>
                </div>
              </div>
            )

          })}


        </div>

      </div>
    )
  }

  const PieChart = ({ data,title}:any) => {
    const total = Object.values(data).reduce((a,b) => (a as number) + (b as number),0) as number;
    if (total == 0){
      return (
        <div className='flex items-center justify-center'>
          <h3 className='text-xl font-semibold mb-4 '>{title}</h3>
          <p className='text-center mt-[100px] -ml-[200px]'>No Tasks done today</p>
        </div>
      )
    }

    let currentAngle = 0;
    return (
      <div className='flex flex-col items-center justify-center p-4'>
        <p>{title}</p>
        <div className='relative w-40 h-40'>
        <svg viewBox="0 0 100 100" className='transform -rotate-90'>
          {Object.entries(data).map(([category,hours]) => {
            if ((hours as number) === 0 ) return null;
            const cat = categories.find(c => c.name === category);
            const percentage = (hours as number)/total;
            const angle = percentage * 360;

            const startAngle = currentAngle;
            const endAngle = angle  + currentAngle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI)/180;
            const endRad = (endAngle * Math.PI)/180;

            const x1 = 50 + 45*Math.cos(startRad);
            const y1 = 50 + 45*Math.sin(startRad);
            const x2 = 50 + 45*Math.cos(endRad);
            const y2 = 50 + 45*Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;
            const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <path key={category}
              d={path}
              fill = {cat?.colour || '#6b7280' }
              stroke='#041f1e'
                  strokeWidth='1'
              ></path>
            )


          })}
        </svg>
        <div className='inset-0 flex absolute items-center justify-center'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-[#14213d]'>{totalDailyHours.toFixed(1)}</div>
            <div className='text-xs text-gray-400'>hours</div>
          </div>
        </div>
        </div>

        <div className='mt-4 grid grid-cols-1 gap-2'>
        {Object.entries(data).map(([category, hours]) => {
            if ((hours as number) === 0) return null;
            const cat = categories.find(c => c.name === category);
            const percentage = (((hours as number) / total) * 100).toFixed(0);
            
            return (
              <div key={category} className='flex items-center gap-2'>
                <div 
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: cat?.colour || '#6b7280' }}
                />
                <span className='text-xs text-gray-400'>
                  {category} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )
  }

  useEffect(() => {
    setWidth(window.innerWidth)
  },[])
  return (
    <div className='opacity-0 dashmain'>
      <Navbar/>
      <div className='md:ml-[10vw] p-[25px] md:p-[15px] space-y-5'>
        <p className='text-3xl opacity-0 dash' >Dashboard</p>
        
        {/* Active Task Banner */}
        {activeTask && (
          <div 
            className='p-0 rounded-lg border-l-4 dash1 opacity-0'
            style={{ 
              borderColor: activeTask.categories[0]?.colour || '#10b981',
              backgroundColor: `${activeTask.categories[0]?.colour}20`
            }}
          >
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <div>
                <div className='flex items-center py-4 px-1 dash2 opacity-0 gap-2'>
                  <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                  <span className='text-sm font-semibold text-green-400'>ACTIVE NOW</span>
                </div>
                <h3 className='text-xl font-bold mt-1 px-2 dash3 opacity-0'>{activeTask.name}</h3>
                <p className='text-sm text-gray-400 mt-1 p-2 dash4 opacity-0'>
                  {activeTask.start_time} - {activeTask.end_time} ({activeTask.no_of_hours}h)
                </p>
              </div>
              <div 
                className='px-3 py-1 mr-4 mb-4 rounded-full text-sm dash5 opacity-0 font-semibold text-[#14213d]'
                style={{ backgroundColor: activeTask.categories[0]?.colour || '#6b7280' }}
              >
                {activeTask.categories[0]?.name}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className='flex flex-col md:flex-row mt-[20px] gap-5'>
          {/* Box1 - Weekly Bar Chart */}
          <div className='w-full md:w-[65%] h-[300px] bg-[#041f1e] dash6 opacity-0 rounded-md'>
            <BarChart className="dash7 opacity-0"
              data={weeklyData} 
              title="Weekly Overview" 
              totalHours={totalWeeklyHours}
            />
          </div>
          
          {/* Box2 - Daily Pie Chart */}
          <div className='w-full md:w-[35%] h-[300px] dash8 opacity-0 bg-[#041f1e] rounded-md'>
            <PieChart className="dash9 opacity-0"
              data={dailyData} 
              title="Today's Activities"
            />
          </div>
        </div>
        
        {/* Today's Tasks */}
        <div className='flex flex-col md:flex-row gap-5 text-center justify-center items-stretch'>
          {todayTasks.length === 0 ? (
            <div className='w-full bg-[#041f1e] rounded-lg p-8 dash10 opacity-0 text-gray-400'>
              No tasks scheduled for today
            </div>
          ) : (
            todayTasks.map(task => {
              const isActive = isTaskActive(task);
              
              return (
                <div
                  key={task.id} ref={taskRef}
                  className={`flex-1 bg-[#041f1e] rounded-lg p-4 border-2 transition-all ${
                    isActive ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <div className='flex items-start justify-between mb-2' >
                    <h3 className='font-semibold text-lg'>{task.name}</h3>
                    {isActive && (
                      <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    )}
                  </div>
                  
                  <div className='flex items-center justify-center gap-2 text-sm text-gray-400 mb-3' >
                    <span>{task.start_time}</span>
                    <span>→</span>
                    <span>{task.end_time}</span>
                  </div>
                  
                  <div className='text-xl font-bold mb-3 '>{task.no_of_hours}h</div>
                  
                  <div 
                    className='px-3 py-1 rounded-full text-xs font-semibold text-[#14213d] inline-block'
                    style={{ backgroundColor: task.categories[0]?.colour || '#6b7280' }}
                  >
                    {task.categories[0]?.name}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
