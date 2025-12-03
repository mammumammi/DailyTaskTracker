"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { axiosApi } from "./lib/axiosApi";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { Lavishly_Yours } from "next/font/google";
const siteUrl = 'https://productive-wife-frontend-p65wf7hwa-aashins-projects-c166e660.vercel.app/';
const lavishlyYours = Lavishly_Yours({
  weight: ["400"],
  subsets: ["latin"],
});

export default function Login() {
  const [playVideo,setPlayVideo] = useState<boolean>(false);
  const [startAnimation,setStartAnimation] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const googleRef = useRef<HTMLVideoElement>(null);
  const [width,setWidth] = useState<number>(0);
  const[username,setUsername] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const router = useRouter();
  const signUp = async (username:string,password:string) => {
    try {
      handlePlayVideo(); 
      const res = await axiosApi.post("/login/signup",{
        username,password
      });
      console.log("User created successfully:",res.data);

      if (res.data.access_token){

        setTimeout(() => {
         
         localStorage.setItem("token",res.data.access_token);
         localStorage.setItem("userId",res.data.userId);
         router.push("/dashboard")
        },12000)
        
      }

      return res.data;
    }
    catch (err){
      console.log("error occured during signup:",err);
    }
  }


 
  
  const handleSignup = async (e:React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    await signUp(username,password);
  }

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    await login(username,password);
  }

  const login = async(username:string,password:string) => {
    try {
      handlePlayVideo();
      const res = await axiosApi.post('/login/login',{
        username,password
      });

      console.log("Login success:",res.data);

      if (res.data.access_token){
        setTimeout( () => {

          
          localStorage.setItem("token",res.data.access_token);
          localStorage.setItem("userId",res.data.userId);
          router.push("/dashboard")
        },12000);
      }
    }
    catch(err){
      console.log("Error when login in :",err);
    }
  }

  
  

  const signInWithGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ✅ Prevent default
    
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard` // ✅ Valid URL
      }
    });
    
    if (error) {
      console.log('Error in OAuth:', error.message);
      alert(`OAuth error: ${error.message}`); // ✅ User feedback
    }
  }

  

  const handlePlayVideo = () => {
    setPlayVideo(true);
    setTimeout(() => {
      if (videoRef.current && containerRef.current){
        const video = videoRef.current;

     

        const tl = gsap.timeline();
        tl.to(['.introFont','.em','.em1','.ps','.ps1','.log1','.log2','.log3'],{
          autoAlpha:0,
          duration:0.5,
          x:-200
        }).to(containerRef.current,{
          position:'absolute',
          right:'5vw',
          width:'90vw',
          height:"85vh",
          duration:3,
          ease:'power3.inOut'
        })
        .to([video],{
          width:'90vw',
          height:'85vh',
          duration:3,
          objectPosition:'right',
          objectFit:'cover',
          onStart: () => {
            video.play();
          }
        },"<")
        .to([".t1", ".t2", ".t3"], {
          opacity: 1,
          duration: 3,
          stagger: {
            each: 2,
            onComplete: (self) => {
              gsap.to(self.targets()[0], {
                opacity: 0,
                duration: 1,
              });
            }
          },
          ease: "power3.inOut"
        }).to('.mainPage',{
          opacity:0,
          duration:1,
          ease:'power4.in'
        });
        
      }
    },50)

  }



  useEffect( ()=> {
    setWidth(window.innerWidth);
    const initial = gsap.timeline();
    initial.to('.introFont',{
      opacity:1,
      duration:0.3,
      ease:'power3.in'
    }).to(['.em','.em1','.ps','.ps1','.log1','.log2','.log3'],{
      opacity:1,
      duration:0.5,
      ease:'power4.in',
      stagger:0.2
    }).to('.vid',{
      opacity:1,
      duration:1.7,
      ease:'power4.in'
    },"<")
  },[])

  return (
    <div className="h-full flex md:flex-row mainPage relative flex-col-reverse py-[25px] px-[25px] w-[100vw]  justify-center mt-[50px] items-center ">
      <div className=" flex items-center flex-col w-[100vw]">
        <div className="space-y-[10px]">
          <div className={`${lavishlyYours.className} text-4xl opacity-0 introFont font-semibold flex flex-col space-y-2`} >

          <p>Hello Human!</p>
          <p>Let's Get Productive </p>
          </div>
          <div className="space-y-2 mt-[50px]  ">
            <p className="ml-1 opacity-0 em">Email</p>
            <input type="text" placeholder=" Enter email" value={username} onChange={(e) => setUsername(e.target.value)} className="p-2 em1 w-[250px] opacity-0 border rounded-[10px] border-[#6c757d]" />
            <p className="ml-1 ps mt-5 opacity-0">Password</p>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 opacity-0 ps1 w-[250px] border rounded-[10px] border-[#6c757d]" />
          </div>
        </div>
        <div className="space-y-[15px] mt-[40px] flex flex-col ">
          <button className="bg-[#e8ddb5] text-[#160f29] opacity-0 log1 rounded-[15px] w-[250px] p-3 text-1xl hover:text-[#edeec9] hover:bg-[#160f29] hover:border-[#edeec9] border duration-500  " onClick={handleLogin} >Login</button>
          <button className="bg-[#e8ddb5] text-[#160f29] rounded-[15px] w-[250px] opacity-0 log2 p-3 text-1xl hover:text-[#edeec9] hover:bg-[#160f29] hover:border-[#edeec9] border duration-500 " onClick={handleSignup} >Sign Up</button>
          <button className="bg-[#e8ddb5] text-[#160f29] rounded-[15px] w-[250px] p-3 text-1xl opacity-0 log3 hover:text-[#edeec9] hover:bg-[#160f29] hover:border-[#edeec9] border duration-500 flex flex-row items-center justify-center " onClick={signInWithGoogle} ><img
          src='google.svg' className="mr-2 object-fill h-[25px]"
          />Continue with Google </button>
        </div>
      </div>
      <div 
        className="md:w-[65vw] md:h-[80vh] h-[30vh] w-[100vh] rounded-2xl relative text-center overflow-hidden" 
        ref={containerRef}
      >
        <div className="vid opacity-0">
            <video src='https://res.cloudinary.com/ddbkg48oy/video/upload/v1764760437/new_gknyh6.mp4' className="absolute object-cover  h-full" ref={videoRef} />

        </div>
          
          
      </div>
      <div className="absolute transform top-[65%] left-1/2 opacity-0 t1 text-4xl">To New Beginnings</div>
      <div className="absolute transform top-[65%] left-1/2 opacity-0 t2 text-4xl">To A Better You</div>
      <div className="absolute transform top-[65%] left-1/2 opacity-0 t3 text-4xl">From the current You</div>
    </div>
  );
}
