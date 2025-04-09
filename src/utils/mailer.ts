import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    await transporter.sendMail({
      from: `"EMS Notifications" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};
