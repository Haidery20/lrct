import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const nextRefNumber = await storage.getNextReferenceNumber();
      res.json({ referenceNumber: nextRefNumber });
    } catch (error) {
      console.error("Error getting next reference number:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}