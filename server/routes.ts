import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMembershipApplicationSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `"Land Rover Club Tanzania" <${process.env.SMTP_USER || "info@landroverclub.or.tz"}>`;
const ADMIN = process.env.ADMIN_EMAIL || "info@landroverclub.or.tz";

async function sendMail(to: string, subject: string, html: string) {
  const transporter = createTransporter();
  return transporter.sendMail({ from: FROM, to, subject, html });
}

async function sendAdminMail(subject: string, html: string) {
  return sendMail(ADMIN, subject, html);
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Membership application — save to DB + fire emails
  app.post("/api/membership-applications", async (req, res) => {
    try {
      const validatedData = insertMembershipApplicationSchema.parse(req.body);
      const application = await storage.createMembershipApplication(validatedData);

      const d = validatedData as any;

      // Fire emails without blocking the response
      Promise.allSettled([
        // 1. Confirmation to applicant
        sendMail(
          d.email,
          "Membership Application Received — Land Rover Club Tanzania",
          `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
            <div style="background:#111827;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px">Application Received ✓</h1>
            </div>
            <div style="background:#f9fafb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
              <p style="margin-top:0">Dear <strong>${d.full_name}</strong>,</p>
              <p>Thank you for submitting your membership application to <strong>Land Rover Club Tanzania</strong>. We have received it and it is now under review by the committee.</p>
              <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
                <p style="margin:0 0 8px 0;font-weight:bold">Application Summary</p>
                <table style="width:100%;border-collapse:collapse;font-size:14px">
                  <tr><td style="padding:6px 0;color:#6b7280;width:140px">Full Name</td><td style="padding:6px 0;font-weight:600">${d.full_name}</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${d.email}</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${d.phone}</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280">Guarantor</td><td style="padding:6px 0">${d.guarantor_name || "—"}</td></tr>
                </table>
              </div>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0">
                <p style="margin:0 0 8px 0;font-weight:bold;color:#15803d">What happens next?</p>
                <ol style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.9">
                  <li>The committee will verify your submitted documents</li>
                  <li>Your guarantor may be contacted for confirmation</li>
                  <li>You will receive a decision within <strong>7–10 business days</strong></li>
                </ol>
              </div>
              <p style="font-size:14px">Questions? Contact us at <a href="mailto:info@landroverclub.or.tz" style="color:#15803d">info@landroverclub.or.tz</a></p>
              <p style="margin-bottom:0">Best regards,<br/><strong>Land Rover Club Tanzania Committee</strong></p>
            </div>
            <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">© ${new Date().getFullYear()} Land Rover Club Tanzania · P.O. Box 77, Morogoro</p>
          </div>`
        ),

        // 2. Admin notification
        sendAdminMail(
          `New Membership Application: ${d.full_name}`,
          `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#111">New Membership Application</h2>
            <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Personal Details</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
              <tr><td style="padding:6px 0;color:#6b7280;width:160px">Full Name</td><td style="padding:6px 0;font-weight:600">${d.full_name}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${d.email}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${d.phone}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Date of Birth</td><td style="padding:6px 0">${d.dob || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Gender</td><td style="padding:6px 0">${d.gender || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">P.O. Box</td><td style="padding:6px 0">${d.po_box || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Heard About</td><td style="padding:6px 0">${d.heard_about || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Bio</td><td style="padding:6px 0">${d.bio || "—"}</td></tr>
            </table>
            <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Guarantor</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
              <tr><td style="padding:6px 0;color:#6b7280;width:160px">Name</td><td style="padding:6px 0;font-weight:600">${d.guarantor_name || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${d.guarantor_phone || "—"}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${d.guarantor_email || "—"}</td></tr>
            </table>
            <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Documents</h3>
            <p style="font-size:14px">
              ${d.photo_url ? `<a href="${d.photo_url}" style="color:#15803d;margin-right:16px">📷 View Photo</a>` : ""}
              ${d.id_doc_url ? `<a href="${d.id_doc_url}" style="color:#15803d;margin-right:16px">🪪 View ID Document</a>` : ""}
              ${d.payment_proof_url ? `<a href="${d.payment_proof_url}" style="color:#15803d">💳 View Payment Proof</a>` : ""}
            </p>
            <p style="font-size:12px;color:#9ca3af;margin-top:24px">Submitted: ${new Date().toLocaleString()}</p>
          </div>`
        ),
      ]).catch(console.error);

      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        console.error("Error creating membership application:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get next reference number
  app.get("/api/next-reference-number", async (req, res) => {
    try {
      const nextRefNumber = await storage.getNextReferenceNumber();
      res.json({ referenceNumber: nextRefNumber });
    } catch (error) {
      console.error("Error getting next reference number:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Generic send-email route (used by frontend for fan + event emails)
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;

      if (!to || !subject || !html) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: to, subject, html",
        });
      }

      await sendMail(to, subject, html);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Email sending error:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}