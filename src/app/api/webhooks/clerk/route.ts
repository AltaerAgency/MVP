import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { newRequestId } from "@/lib/utils";
import { audit } from "@/lib/audit";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const requestId = newRequestId();
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new Response("Server misconfigured",{status:500});
  const svixId=req.headers.get("svix-id"), svixTs=req.headers.get("svix-timestamp"), svixSig=req.headers.get("svix-signature");
  if (!svixId||!svixTs||!svixSig) return new Response("Missing Svix headers",{status:400});
  const body = await req.text();
  let event: WebhookEvent;
  try { event = new Webhook(secret).verify(body,{"svix-id":svixId,"svix-timestamp":svixTs,"svix-signature":svixSig}) as WebhookEvent; }
  catch { logger.warn({requestId},"invalid Clerk webhook"); return new Response("Invalid signature",{status:400}); }
  logger.info({requestId,type:event.type},"clerk webhook");
  try { await handle(event,requestId); return new Response("ok"); }
  catch(err){ logger.error({requestId,type:event.type,error:String(err)},"webhook failed"); return new Response("Handler error",{status:500}); }
}
async function handle(event: WebhookEvent, requestId: string) {
  switch(event.type){
    case "user.created": case "user.updated": {
      const u=event.data; const email=u.email_addresses?.[0]?.email_address??"";
      await prisma.user.upsert({where:{clerkUserId:u.id},create:{clerkUserId:u.id,email,name:[u.first_name,u.last_name].filter(Boolean).join(" ")||null,avatarUrl:u.image_url??null},update:{email,name:[u.first_name,u.last_name].filter(Boolean).join(" ")||null,avatarUrl:u.image_url??null}});
      break;
    }
    case "user.deleted": { const id=(event.data as {id:string}).id; await prisma.membership.deleteMany({where:{user:{clerkUserId:id}}}); break; }
    case "organization.created": {
      const o=event.data;
      const org = await prisma.organization.create({data:{clerkOrgId:o.id,name:o.name,slug:o.slug??o.id.slice(-12),planId:"trial",planStatus:"trialing",trialEndsAt:new Date(Date.now()+14*24*60*60*1000)}});
      await audit({organizationId:org.id,action:"org.created",resourceType:"organization",resourceId:org.id,requestId});
      break;
    }
    case "organization.updated": { const o=event.data; await prisma.organization.update({where:{clerkOrgId:o.id},data:{name:o.name,slug:o.slug??undefined}}); break; }
    case "organizationMembership.created": case "organizationMembership.updated": {
      const m=event.data;
      const user=await prisma.user.findUnique({where:{clerkUserId:m.public_user_data.user_id}});
      const org=await prisma.organization.findUnique({where:{clerkOrgId:m.organization.id}});
      if(!user||!org)return;
      const isAdmin=m.role==="org:admin";
      await prisma.membership.upsert({where:{userId_organizationId:{userId:user.id,organizationId:org.id}},create:{userId:user.id,organizationId:org.id,role:isAdmin&&event.type==="organizationMembership.created"?"owner":isAdmin?"admin":"editor"},update:{}});
      if(event.type==="organizationMembership.created") await audit({organizationId:org.id,userId:user.id,action:"member.joined",requestId});
      break;
    }
    case "organizationMembership.deleted": {
      const m=event.data;
      const user=await prisma.user.findUnique({where:{clerkUserId:m.public_user_data.user_id}});
      const org=await prisma.organization.findUnique({where:{clerkOrgId:m.organization.id}});
      if(user&&org){await prisma.membership.deleteMany({where:{userId:user.id,organizationId:org.id}});await audit({organizationId:org.id,userId:user.id,action:"member.removed",requestId});}
      break;
    }
  }
}
