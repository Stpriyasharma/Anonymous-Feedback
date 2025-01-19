import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
    email:string,
    username:string,
    verifyCode:string, 
):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to:email,
            subject :"Anonymous message| Verification code",
            react:VerificationEmail({username,otp:verifyCode}),
        });
        return {success:true,message:"Verification email send successfully"};
    }catch(error){
        console.error("Error sending Verification email",error);
        return ({
            success:false,
             message:"Failed to send Verfication email"}
            )
    };
} 