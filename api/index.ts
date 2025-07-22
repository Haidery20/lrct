import express from 'express';
import { storage } from '../server/storage';
import { insertMembershipApplicationSchema } from '../shared/schema';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Membership application routes
app.post("/membership-applications", async (req, res) => {
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
app.get("/next-reference-number", async (req, res) => {
  try {
    const nextRefNumber = await storage.getNextReferenceNumber();
    res.json({ referenceNumber: nextRefNumber });
  } catch (error) {
    console.error("Error getting next reference number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;