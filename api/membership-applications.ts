import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertMembershipApplicationSchema } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}