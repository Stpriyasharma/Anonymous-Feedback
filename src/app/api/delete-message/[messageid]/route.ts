import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest} from 'next/server';
import {jwtDecode} from 'jwt-decode';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const token = request.cookies.get('auth-token')

  if (!token) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const decodedToken = jwtDecode(token?.value);
  const id = (decodedToken as any).id

  try {
    const updateResult = await UserModel.updateOne(
      { _id: id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}