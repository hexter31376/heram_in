// app/api/login/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../utils/db';
import { verifyPassword } from '../../../utils/hash';
import { generateToken } from '../../../utils/jwt';

export async function POST(req) {
  const { email, password } = await req.json();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  console.log('Received data:', { email, password });

  if (!email || !emailRegex.test(email) || !password || password.trim().length === 0) {
    console.log('Invalid input:', { email, password });
    return NextResponse.json({ message: 'Invalid input.' }, { status: 422 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'No user found!' }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return NextResponse.json({ message: 'Invalid password!' }, { status: 403 });
  }

  const token = generateToken({ userId: user._id, email: user.email });
  console.log('Generated token:', token);

  return NextResponse.json({ message: 'Logged in!', token }, { status: 200 });
}
