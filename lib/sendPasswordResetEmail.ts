import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { PasswordResetEmail } from "@/emails/password-reset-email";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
  },
});

const url =
  process.env.NODE_ENV === "production"
    ? "https://soul-touch.vercel.app"
    : "http://localhost:3000";

export const sendPasswordResetLink = async (email: string, token: string) => {
  const resetLink = `${url}/reset-password?email=${email}&token=${token}`;
  const emailHtml = await render(PasswordResetEmail({ url: resetLink }));

  const mailOptions = {
    from: `"AI SaaS Templates" <${process.env.NODE_MAILER_EMAIL}>`,
    to: email,
    subject: "Password Reset",
    html: emailHtml,
  };

  try {
    transporter.sendMail(mailOptions);
    console.log("Password reset link sent successfully");
  } catch (error) {
    console.error("Error sending password reset link:", error);
    throw error;
  }
};
