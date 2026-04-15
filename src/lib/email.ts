const ADMIN_EMAIL = 'info@landroverclub.or.tz'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

// All emails go through the Express server → Plesk SMTP
const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('Email error:', err)
    }
  } catch (err) {
    console.error('Failed to send email:', err)
  }
}

// ── Fan Registration ──────────────────────────────────────────────────────────
export const sendFanConfirmationEmail = async (data: {
  full_name: string
  email: string
  phone: string
  city: string
}) => {
  await Promise.allSettled([
    sendEmail({
      to: data.email,
      subject: 'Welcome to LRCT Fans! — Land Rover Club Tanzania',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#15803d;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">Welcome to LRCT Fans! 🎉</h1>
          </div>
          <div style="background:#f9fafb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
            <p style="margin-top:0">Dear <strong>${data.full_name}</strong>,</p>
            <p>Thank you for registering as a fan with <strong>Land Rover Club Tanzania</strong>. We're excited to have you in our community!</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
              <p style="margin:0 0 8px 0;font-weight:bold;color:#15803d">Your Registration Details</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:6px 0;color:#6b7280">Name</td><td style="padding:6px 0;font-weight:600">${data.full_name}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.email}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.phone}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">City</td><td style="padding:6px 0">${data.city}</td></tr>
              </table>
            </div>
            <p style="font-weight:bold;margin-bottom:8px">As a Fan you'll receive:</p>
            <ul style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.8">
              <li>Community updates &amp; announcements</li>
              <li>Invitations to public LRCT events</li>
              <li>Monthly newsletter</li>
            </ul>
            <p style="margin-top:24px;font-size:14px">Questions? Email us at <a href="mailto:info@landroverclub.or.tz" style="color:#15803d">info@landroverclub.or.tz</a></p>
            <p style="margin-bottom:0">Best regards,<br/><strong>Land Rover Club Tanzania Team</strong></p>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">© ${new Date().getFullYear()} Land Rover Club Tanzania · P.O. Box 77, Morogoro</p>
        </div>`,
    }),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Fan Registration: ${data.full_name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#111">New Fan Registration</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#6b7280;width:140px">Name</td><td style="padding:6px 0;font-weight:600">${data.full_name}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.email}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.phone}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">City</td><td style="padding:6px 0">${data.city}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Registered At</td><td style="padding:6px 0">${new Date().toLocaleString()}</td></tr>
          </table>
        </div>`,
    }),
  ])
}

// ── Member Application ────────────────────────────────────────────────────────
// NOTE: membership emails are now fired automatically in server/routes.ts
// when POST /api/membership-applications is called.
// You only need to call this if you want to send from the frontend manually.
export const sendMemberConfirmationEmail = async (data: {
  full_name: string
  email: string
  phone: string
  dob: string
  gender: string
  po_box: string
  heard_about: string
  bio: string
  guarantor_name: string
  guarantor_phone: string
  guarantor_email: string
  photo_url: string
  id_doc_url: string
  payment_proof_url: string
}) => {
  await Promise.allSettled([
    sendEmail({
      to: data.email,
      subject: 'Membership Application Received — Land Rover Club Tanzania',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#111827;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">Application Received ✓</h1>
          </div>
          <div style="background:#f9fafb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
            <p style="margin-top:0">Dear <strong>${data.full_name}</strong>,</p>
            <p>Thank you for submitting your membership application to <strong>Land Rover Club Tanzania</strong>. We have received it and it is now under review by the committee.</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
              <p style="margin:0 0 8px 0;font-weight:bold">Application Summary</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:6px 0;color:#6b7280;width:140px">Full Name</td><td style="padding:6px 0;font-weight:600">${data.full_name}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.email}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.phone}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Guarantor</td><td style="padding:6px 0">${data.guarantor_name}</td></tr>
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
        </div>`,
    }),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Membership Application: ${data.full_name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#111">New Membership Application</h2>
          <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Personal Details</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#6b7280;width:160px">Full Name</td><td style="padding:6px 0;font-weight:600">${data.full_name}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.email}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.phone}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Date of Birth</td><td style="padding:6px 0">${data.dob}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Gender</td><td style="padding:6px 0">${data.gender}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">P.O. Box</td><td style="padding:6px 0">${data.po_box || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Heard About</td><td style="padding:6px 0">${data.heard_about}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Bio</td><td style="padding:6px 0">${data.bio || '—'}</td></tr>
          </table>
          <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Guarantor</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#6b7280;width:160px">Name</td><td style="padding:6px 0;font-weight:600">${data.guarantor_name}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.guarantor_phone}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.guarantor_email || '—'}</td></tr>
          </table>
          <h3 style="color:#15803d;border-bottom:1px solid #e5e7eb;padding-bottom:8px">Documents</h3>
          <p style="font-size:14px">
            ${data.photo_url ? `<a href="${data.photo_url}" style="color:#15803d;margin-right:16px">📷 View Photo</a>` : ''}
            ${data.id_doc_url ? `<a href="${data.id_doc_url}" style="color:#15803d;margin-right:16px">🪪 View ID Document</a>` : ''}
            ${data.payment_proof_url ? `<a href="${data.payment_proof_url}" style="color:#15803d">💳 View Payment Proof</a>` : ''}
          </p>
          <p style="font-size:12px;color:#9ca3af;margin-top:24px">Submitted: ${new Date().toLocaleString()}</p>
        </div>`,
    }),
  ])
}

// ── Event Registration ────────────────────────────────────────────────────────
export const sendEventConfirmationEmail = async (data: {
  name: string
  email: string
  phone: string
  event_title: string
  event_date: string
  event_location?: string
  event_time?: string
}) => {
  await Promise.allSettled([
    sendEmail({
      to: data.email,
      subject: `You're registered for ${data.event_title} — LRCT`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#15803d;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">Event Registration Confirmed 🚙</h1>
          </div>
          <div style="background:#f9fafb;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
            <p style="margin-top:0">Dear <strong>${data.name}</strong>,</p>
            <p>You're registered for the following LRCT event. We look forward to seeing you there!</p>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0">
              <p style="margin:0 0 12px 0;font-size:18px;font-weight:bold;color:#111">${data.event_title}</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:6px 0;color:#6b7280;width:100px">📅 Date</td><td style="padding:6px 0;font-weight:600">${new Date(data.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
                ${data.event_time ? `<tr><td style="padding:6px 0;color:#6b7280">🕐 Time</td><td style="padding:6px 0">${data.event_time}</td></tr>` : ''}
                ${data.event_location ? `<tr><td style="padding:6px 0;color:#6b7280">📍 Location</td><td style="padding:6px 0">${data.event_location}</td></tr>` : ''}
                <tr><td style="padding:6px 0;color:#6b7280">👤 Name</td><td style="padding:6px 0">${data.name}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">📱 Phone</td><td style="padding:6px 0">${data.phone || '—'}</td></tr>
              </table>
            </div>
            <p style="font-size:14px;color:#6b7280">Questions? Email <a href="mailto:info@landroverclub.or.tz" style="color:#15803d">info@landroverclub.or.tz</a></p>
            <p style="margin-bottom:0">See you at the event!<br/><strong>Land Rover Club Tanzania Team</strong></p>
          </div>
          <p style="text-align:center;font-size:11px;color:#9ca3af;margin-top:16px">© ${new Date().getFullYear()} Land Rover Club Tanzania</p>
        </div>`,
    }),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Event Registration: ${data.name} → ${data.event_title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2>New Event Registration</h2>
          <p><strong>Event:</strong> ${data.event_title}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#6b7280;width:140px">Name</td><td style="padding:6px 0;font-weight:600">${data.name}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0">${data.email}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td style="padding:6px 0">${data.phone || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Location</td><td style="padding:6px 0">${data.event_location || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Registered At</td><td style="padding:6px 0">${new Date().toLocaleString()}</td></tr>
          </table>
        </div>`,
    }),
  ])
}