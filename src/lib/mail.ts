import nodemailer from "nodemailer";

// Gmail App Passwords are displayed with spaces but SMTP auth requires no spaces
const cleanPass = (process.env.EMAIL_PASS ?? "").replace(/\s+/g, "");

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: cleanPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10_000,
  greetingTimeout:   10_000,
  socketTimeout:     15_000,
});
