import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModels';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userName, email, password } = reqBody;
    console.log({ reqBody });
    // check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // has password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ userName, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log('User saved');

    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser?._id });
    return NextResponse.json({ message: 'User Created', success: true, savedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
