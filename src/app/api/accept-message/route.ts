
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { type NextRequest } from 'next/server'
import {jwtDecode} from 'jwt-decode';

//tested

export async function POST(request: NextRequest){
    await dbConnect()

    const token = request.cookies.get('auth-token')
       
    if(!token){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },
    {status:401})
     }
        

     const decodedToken = jwtDecode(token.value);

    const id = (decodedToken as any).id;

     const {acceptMessages} = await request.json()
    
     try {
       const updatedUser =  await UserModel.findByIdAndUpdate(id,{isAcceptingMessage:acceptMessages},{new:true})

       if(!updatedUser){
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages"
        },
    {status:401})
       }

       return Response.json({
        success:true,
        message:"Messages acceptance status updated successfully ",
        updatedUser
    },
{status:200})
     } catch (error) {
        console.log('failed to update user status to accept messages')
        return Response.json({
            success:false,
            messages:"failed to update user status to accept messages"
        },
    {status:500})
     }
}


export async function GET(request:NextRequest){
    await dbConnect()

    const token = request.cookies.get('auth-token')
     if(!token){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },
    {status:401})
     }

     const decodedToken = jwtDecode(token.value);
     const userId = (decodedToken as any).id;

     try {
        const foundUser = await UserModel.findById(userId)

     if(!foundUser){
        return Response.json({
            success:false,
            message:"user not found"
        },
    {status:404})
       }

       return Response.json({
        success:true,
        isAcceptingMessages :foundUser.isAcceptingMessages,
       },
    {status:200 })

     } catch (error) {
        console.log('Error in getting message acceptance status')
        return Response.json({
            success:false,
            messages:"Error in getting message acceptance status"
        },
    {status:500})
     }
    }