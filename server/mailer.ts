import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Land Rover Club Tanzania" <${process.env.SMTP_USER}>`;
const ADMIN = process.env.ADMIN_EMAIL || "info@landroverclub.or.tz";

export async function sendMail(to: string, subject: string, html: string) {
  return transporter.sendMail({ from: FROM, to, subject, html });
}

export async function sendAdminMail(subject: string, html: string) {
  return transporter.sendMail({ from: FROM, to: ADMIN, subject, html });
}