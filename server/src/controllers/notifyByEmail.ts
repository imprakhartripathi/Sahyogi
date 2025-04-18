import nodemailer from "nodemailer";
import User from "../models/Users";
import { Notification, NotificationType } from "../models/Notifications";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS,
  },
});

// Helper: send email
const sendNotificationEmail = async (
  to: string,
  title: string,
  desc: string,
  type: NotificationType
) => {
  const html = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <p><b>Type:</b> ${type}</p>
    <hr/>
    <p>This is an automated notification from <strong>Sahyogi</strong>.</p>
  `;

  await transporter.sendMail({
    from: `"Sahyogi" <${process.env.MAIL_ID}>`,
    to,
    subject: `🔔 Notification from Sahyogi: ${title}`,
    html,
  });
};

// Create notification + send email
export const createEmailNotification = async (
  userEmail: string,
  title: string,
  desc: string,
  type: NotificationType
) => {
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found for email: " + userEmail);
    }

    if (user.emailNotificationsOn) {
      await sendNotificationEmail(userEmail, title, desc, type);
      console.log(`Email sent to ${userEmail} for notification.`);
    }

  } catch (error) {
    console.error("Failed to create notification and send email:", error);
  }
};
