"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { axiosApi } from "./lib/axiosApi";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
export default function Login() {

  const [width,setWidth] = useState<number>(0);
  const[username,setUsername] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const router = useRouter();
  const signUp = async (username:string,password:string) => {
    try {
      const res = await axiosApi.post("/login/signup",{
        username,password
      });
      console.log("User created successfully:",res.data);

      if (res.data.access_token){
        localStorage.setItem("token",res.data.access_token);
        localStorage.setItem("userId",res.data.userId);
        alert("Signup successful! You are now logged in.");
        router.push("/dashboard")
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
      const res = await axiosApi.post('/login/login',{
        username,password
      });

      console.log("Login success:",res.data);

      if (res.data.access_token){
        localStorage.setItem("token",res.data.access_token);
        localStorage.setItem("userId",res.data.userId);
        alert("login successful! You are now logged in.");
        router.push("/dashboard")
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

  useEffect( ()=> {
    setWidth(window.innerWidth);
  },[])

  return (
    <div className="h-full p-[50px] md:m-auto mt-[50px] ">

      <div className="flex md:items-center justify-center flex-col md:flex-row  ">

      { width> 768 && <div className=" text-center full h-[650px] md:w-[80vw] border-amber-50 border rounded-tl-[10%] rounded-tr-[2%] rounded-br-[2%] rounded-bl-[10%]">About Section</div>}
      <div className="h-[650px] md:w-[80vw] flex md:space-y-[50px] border border-amber-50 md:rounded-[10%] rounded-[2%]  md:rounded-tl-[2%] md:rounded-bl-[2%] text-center flex-col space-y-5 p-[20px] justify-center md:items-center">
        <p className="text-2xl">Login Section</p>
        <div  className="space-y-5 flex md:space-y-[50px] flex-col">
          <div className="flex flex-col space-x-2 items-center text-center">
          <label >Username</label>
          <input type="text" name="user" value={username} onChange={(e) => setUsername(e.target.value)} id="user" className="border rounded-md w-[50%] md:w-[100%] " placeholder=" Username" />
          </div>
          <div className="flex flex-col space-x-2 items-center text-center mt-5">
            <label >Password</label>
            <input type="password" value={password}
            onChange={ (e) => setPassword(e.target.value)} name="password" id="pass" className="border-1 rounded-md w-[50%] md:w-[100%]" placeholder=" Password" />
          </div>
          <button  type='button'  className="bg-green-900 p-3 rounded-xl" onClick={handleLogin}>Login</button>
          <button onClick={signInWithGoogle} type='button' className="bg-blue-950 p-3 rounded-xl">
            Continue with Google
          </button>
        </div>

        <div>
  New User? 
  <button 
    type='button'
    onClick={handleSignup} 
    className="text-blue-200 ml-2 hover:text-blue-100 underline"
  >
    Register here
  </button>
</div>
        </div>

      </div>
    </div>
  );
}
