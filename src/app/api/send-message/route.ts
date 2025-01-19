import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
//tested
export async function POST(request:Request){
    await dbConnect()

   const {username, content} =  await request.json()
   
   try {
    const user = await UserModel.findOne({username})
    if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },
    {status:404})
    }

    //isuser acceping ,essages

    if(!user.isAcceptingMessages){
      return Response.json({
        success:false,
        message:"User currently not accepting messages"
      },
    {status:403})
    }

    const newMessage = {content, createdAt:new Date()}
    user.messages.push(newMessage as Message)

    await user.save()

    return Response.json({
        success:true,
        message:"message sent successfully"
    },
     {status:200})
     

   } catch (error) {
    console.log("Error adding messages",error)
    return Response.json({
        success:false,
        message:"Error Verifying messages"
    },
     {status:500})

   }
}