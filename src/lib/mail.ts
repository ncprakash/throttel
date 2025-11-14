import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // smtp.titan.email
  port: Number(process.env.EMAIL_PORT), // 465
  secure: true,                      // REQUIRED for port 465
  auth: {
    user: process.env.EMAIL_USER,    // contact@tfcustoms.in
    pass: process.env.EMAIL_PASS,    // titan mailbox password
  },
  tls: {
    rejectUnauthorized: false,       // Titan requires this
  },
});
