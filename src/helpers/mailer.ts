import User from '@/models/userModels';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId?.toString(), 10);
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if ((emailType = 'RESET')) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILER_USER_NAME!,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'patilvishal755@gmail.com',
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p> click <a href="${process.env.DOMAIN!}/${
        emailType === 'VERIFY' ? 'verifyEmail?token=' : 'resetPassword?token='
      }${hashedToken}"> ${emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password'}</a>
      or copy paste the link in your browser. 
      <br>
      ${process.env.DOMAIN!}/${
        emailType === 'VERIFY' ? 'verifyEmail?token=' : 'resetPassword?token='
      }${hashedToken}
      </p>`,
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
