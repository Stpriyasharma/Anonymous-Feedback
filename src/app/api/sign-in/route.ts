import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import { cookies } from 'next/headers'

export async function POST(request:Request){
    await dbConnect();

    try {
        
        const {email, password} = await request.json();
         
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return Response.json({
              success: false,
              message: `Please Fill up All the Required Fields`,
            },{
                status:400
            })
        }
         
          const user = await UserModel.findOne({email })

        if (!user) {
            throw new Error('No user found with this email');
        }
        
        if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
        }

        const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                  );
        
        
        if(!isPasswordCorrect){
            throw new Error('Passowrd is wrong');
        }        
        
        
          const secret = process.env.JWT_SECRET;
            let token = jwt.sign(
                { email: user.email,username :user.username, id: user._id},secret as string,
                {
                  expiresIn: "24h",
                }
              )
          
              
         
          const cookieStore = await cookies()

          cookieStore.set('auth-token', token, {
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/',
          })
           
         
          return Response.json({
            success:true,
            message:"user login successfully",
            token
          },{
            status:200
          })    

    } catch (error) {
        return Response.json({
            success:true,
            message:"user failure",
          },{
            status:500
          })    
    }
}