import { type VercelRequest, type VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

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
}
