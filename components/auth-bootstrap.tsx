"use client";
import { useEffect } from "react";
import { getSupabaseBrowser } from "../lib/supabase-browser";

export default function AuthBootstrap(){
 useEffect(()=>{
  const supabase=getSupabaseBrowser();
  const original=window.fetch.bind(window);
  window.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
   const url=typeof input==="string"?input:input instanceof URL?input.toString():input.url;
   if(url.startsWith("/api/")){
    const {data}=await supabase.auth.getSession();
    const headers=new Headers(init?.headers||{});
    if(data.session)headers.set("Authorization",`Bearer ${data.session.access_token}`);
    init={...init,headers};
   }
   return original(input,init);
  };
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   const path=window.location.pathname; const publicPage=path==="/login"||path==="/signup"||path.startsWith("/auth/");
   if(!session&&!publicPage)window.location.href="/login";
  });
  supabase.auth.getSession().then(({data})=>{if(!data.session&&!(["/login","/signup"].includes(window.location.pathname)))window.location.href="/login"});
  return()=>{window.fetch=original;subscription.unsubscribe()};
 },[]);
 return null;
}
