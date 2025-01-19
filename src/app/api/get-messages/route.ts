
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { type NextRequest } from 'next/server'
import {jwtDecode} from 'jwt-decode';
import mongoose from "mongoose";

//tested
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
 const id = (decodedToken as any).id;
 const userId = new mongoose.Types.ObjectId(id);

 try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
     
    
    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }
    
    
    if(user.length === 0){
      return Response.json(
        { message: 'You have no message', success: false },
        { status: 404 }
      );
    }


    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}