import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMembershipApplicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Membership application routes
  app.post("/api/membership-applications", async (req, res) => {
    try {
      const validatedData = insertMembershipApplicationSchema.parse(req.body);
      const application = await storage.createMembershipApplication(validatedData);
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

  // Get next reference number (for preview)
  app.get("/api/next-reference-number", async (req, res) => {
    try {
      const nextRefNumber = await storage.getNextReferenceNumber();
      res.json({ referenceNumber: nextRefNumber });
    } catch (error) {
      console.error("Error getting next reference number:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Email sending route
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, html } = req.body;

      // Validate required fields
      if (!to || !subject || !html) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: to, subject, html'
        });
      }

      // Using SendGrid (since you have SENDGRID_API_KEY configured)
      if (!process.env.SENDGRID_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'SENDGRID_API_KEY not found in environment variables'
        });
      }

      const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            },
          ],
          from: {
            email: "info@landroverclub.or.tz",
            name: "Land Rover Club Tanzania",
          },
          content: [
            {
              type: "text/html",
              value: html,
            },
          ],
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("SendGrid API error:", errorText);
        return res.status(500).json({
          success: false,
          error: `SendGrid API error: ${errorText}`
        });
      }

      const result = await emailResponse.json();
      return res.status(200).json({ success: true, data: result });

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
