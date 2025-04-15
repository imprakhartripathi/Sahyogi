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
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <style>
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #a8d0ef; /* light mode background */
        color: #13203a; /* light mode text */
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
        border: 1px solid #394153; /* border-dark */
      }

      .header {
        text-align: center;
        margin-bottom: 32px;
      }

      .title {
        margin: 0;
        color: #13203a;
      }

      .subtitle {
        color: #3768bb;
        margin-top: 8px;
        font-weight: normal;
      }

      .logo {
        max-height: 60px;
        margin-bottom: 16px;
      }

      .card {
        padding: 16px;
        background-color: #f0f6fc;
        border: 1px solid #3768bb;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .footer {
        text-align: center;
        font-size: 12px;
        color: #3768bb;
        margin-top: 32px;
      }

      .footer a {
        color: #3768bb;
        text-decoration: none;
      }

      .logo-dark {
        display: none;
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #13203a;
          color: #ffffff;
        }

        .container {
          background-color: #394153;
          border-color: #a3baee;
        }

        .card {
          background-color: #2a3446;
          border-color: #3768bb;
        }

        .footer {
          color: #a3baee;
        }

        .footer a {
          color: #a3baee;
        }

        .logo-light {
          display: none;
        }

        .logo-dark {
          display: block;
        }

        .title {
          color: #ffffff;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="title">Sahyogi Mail Client</h1>
        <h2 class="subtitle">New Support Request</h2>
      </div>
      <div class="card">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Sahyogi |
        <a href="https://github.com/imprakhartripathi/Sahyogi">Visit our GitHub</a> |
        <a href="mailto:${process.env.MAIL_ID}">Contact Support</a>
      </div>
    </div>
  </body>
</html>

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
