import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const handleSupportMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, message } = req.query;

    if (!name || !email || !message) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Sahyogi Mail Client <${process.env.MAIL_ID}>`,
      to: process.env.SUPPORT_RECEIVER || "support@sahyogi.com",
    //   cc: `${email}`,
      replyTo: `${name} <${email}>`,
      subject: "Sahyogi Support Request",
      html: `
          <h2>New Support Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
    });

    console.log("Mail Sent Successfully");
    res.status(200).json({ message: "Mail sent successfully!" });
  } catch (error) {
    console.error("Error sending support mail:", error);
    next(error);
  }
};

export default handleSupportMail;
