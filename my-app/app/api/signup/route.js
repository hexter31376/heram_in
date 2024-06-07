// app/api/signup/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../utils/db';
import { hashPassword } from '../../../utils/hash';

export async function POST(req) {
  const { email, password, username } = await req.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  console.log('Received data:', { email, password, username });

  if (!email || !emailRegex.test(email) || !password || password.trim().length < 6) {
    console.log('Invalid input:', { email, password, username });
    return NextResponse.json({ message: 'Invalid input.' }, { status: 422 });
  }

  const client = await clientPromise;
  const db = client.db();
  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists!' }, { status: 422 });
  }

  const hashedPassword = await hashPassword(password);

  try {
    const result = await db.collection('users').insertOne({
      email,
      username,
      password: hashedPassword,
    });

    console.log('Inserted document ID:', result.insertedId);
    return NextResponse.json({ message: 'User created!', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error inserting document:', error);
    return NextResponse.json({ message: 'Database error.' }, { status: 500 });
  }
}
