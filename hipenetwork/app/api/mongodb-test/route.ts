import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/mongodb/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await connectToMongoDB();
    return NextResponse.json(
      { message: 'Connected successfully to MongoDB' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB', details: error.message },
      { status: 500 }
    );
  }
}
