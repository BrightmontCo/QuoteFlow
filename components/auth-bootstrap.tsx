"use client";
import { useLayoutEffect } from "react";
import { getSupabaseBrowser } from "../lib/supabase-browser";

export default function AuthBootstrap(){
  useLayoutEffect(()=>{
    const supabase=getSupabaseBrowser();
    const original=window.fetch.bind(window);
    let active=true;
    window.fetch=async(input:RequestInfo|URL,init:RequestInit={})=>{
      const url=typeof input==="string"?input:input instanceof URL?input.toString():input.url;
      if(url.startsWith("/api/")){
        const {data}=await supabase.auth.getSession();
        const headers=new Headers(init.headers||{});
        if(data.session?.access_token) headers.set("Authorization",`Bearer ${data.session.access_token}`);
        init={...init,headers};
      }
      return original(input,init);
    };
    const protect=async()=>{
      const path=window.location.pathname;
      const publicPage=path==="/login"||path==="/signup"||path.startsWith("/auth/");
      const {data}=await supabase.auth.getSession();
      if(active&&!data.session&&!publicPage) window.location.replace("/login");
      if(active&&data.session&&path==="/login") window.location.replace("/");
    };
    void protect();
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      const path=window.location.pathname;
      const publicPage=path==="/login"||path==="/signup"||path.startsWith("/auth/");
      if(!session&&!publicPage) window.location.replace("/login");
    });
    return()=>{active=false;window.fetch=original;subscription.unsubscribe();};
  },[]);
  return null;
}
