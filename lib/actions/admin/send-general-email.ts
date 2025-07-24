"use server";

import { GeneralEmail } from "@/emails/general-email";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
  },
});

/**
 * Send a general email to a user
 */
export async function sendEmailToUser({
  email,
  name,
  subject,
  message,
  userId,
}: {
  email: string;
  name?: string;
  subject: string;
  message: string;
  userId: string;
}) {
  try {
    // Render the email HTML using the template
    const emailHtml = await render(
      GeneralEmail({
        subject,
        message,
        recipientName: name,
        buttonText: "Contact Us",
        buttonUrl: "https://soul-touch.vercel.app/support",
      }),
    );

    // Configure mail options
    const mailOptions = {
      from: `"AI SaaS Templates" <${process.env.NODE_MAILER_EMAIL}>`,
      to: email,
      subject: subject,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId,
        title: "New Email",
        message: `You have received a new email: ${subject}`,
        type: "info",
        isAdmin: false,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
}
