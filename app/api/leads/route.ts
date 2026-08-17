import { NextResponse } from "next/server";
import { getAuthenticatedUser, getSupabaseAdmin } from "../../../lib/supabase-server";

async function auth(request: Request) { return getAuthenticatedUser(request); }
export async function GET(request: Request) {
  try { const user=await auth(request); if(!user)return NextResponse.json({success:false,error:"Authentication required"},{status:401}); const db=getSupabaseAdmin(); const id=new URL(request.url).searchParams.get("id"); let q=db.from("leads").select("*").eq("owner_id",user.id); if(id)q=q.eq("id",id); const {data,error}=await q; if(error)return NextResponse.json({success:false,error:error.message},{status:500}); return NextResponse.json({success:true,data:data||[]}); }
  catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Failed to load leads"},{status:500});}
}
export async function POST(request: Request) {
  try { const user=await auth(request); if(!user)return NextResponse.json({success:false,error:"Authentication required"},{status:401}); const db=getSupabaseAdmin(); const b=await request.json(); const payload={owner_id:user.id,name:b.name?.trim(),phone:b.phone||null,email:b.email||null,address:b.address||null,service:b.service||null,problem:b.problem||null,status:b.status||"New","quote amount":b["quote amount"]??b.quoteAmount??null,"appointment date":b["appointment date"]??b.appointmentDate??null,notes:b.notes||null}; if(!payload.name)return NextResponse.json({success:false,error:"Name is required"},{status:400}); const {data,error}=await db.from("leads").insert(payload).select().single(); if(error)return NextResponse.json({success:false,error:error.message},{status:500}); return NextResponse.json({success:true,data:[data]},{status:201}); }
  catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Failed to create lead"},{status:500});}
}
export async function PATCH(request: Request) {
  try { const user=await auth(request); if(!user)return NextResponse.json({success:false,error:"Authentication required"},{status:401}); const db=getSupabaseAdmin(); const b=await request.json(); if(!b.id)return NextResponse.json({success:false,error:"Lead ID is required"},{status:400}); const u:Record<string,unknown>={}; for(const f of ["name","phone","email","address","service","problem","status","notes"])if(b[f]!==undefined)u[f]=b[f]||null; if(b.quoteAmount!==undefined||b["quote amount"]!==undefined){const v=b.quoteAmount??b["quote amount"];u["quote amount"]=v===""||v===null?null:Number(v)} if(b.appointmentDate!==undefined||b["appointment date"]!==undefined)u["appointment date"]=b.appointmentDate??b["appointment date"]??null; if(!Object.keys(u).length)return NextResponse.json({success:false,error:"No changes supplied"},{status:400}); const {data,error}=await db.from("leads").update(u).eq("id",b.id).eq("owner_id",user.id).select(); if(error)return NextResponse.json({success:false,error:error.message},{status:500}); return NextResponse.json({success:true,data:data||[]}); }
  catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Failed to update lead"},{status:500});}
}
export async function DELETE(request: Request) {
  try { const user=await auth(request); if(!user)return NextResponse.json({success:false,error:"Authentication required"},{status:401}); const db=getSupabaseAdmin(); const id=new URL(request.url).searchParams.get("id"); if(!id)return NextResponse.json({success:false,error:"Lead ID is required"},{status:400}); const {error}=await db.from("leads").delete().eq("id",id).eq("owner_id",user.id); if(error)return NextResponse.json({success:false,error:error.message},{status:500}); return NextResponse.json({success:true}); }
  catch(e){return NextResponse.json({success:false,error:e instanceof Error?e.message:"Failed to delete lead"},{status:500});}
}
