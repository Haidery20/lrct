import jsPDF from 'jspdf'

interface MembershipPDFData {
  type?: 'fan' | 'member'
  full_name: string
  dob?: string
  gender?: string
  phone: string
  email: string
  po_box?: string
  bio?: string
  heard_about?: string
  guarantor_name: string
  guarantor_phone: string
  guarantor_email?: string
  guarantor_po_box?: string
  applicant_signature?: string | null
  submitted_at?: string
  logo_base64?: string
  photo_url?: string         // Passport photo URL
  id_doc_url?: string        // Cloudinary URL
  payment_proof_url?: string // Cloudinary URL
}

// Fetch a remote URL and return base64 data URL
const fetchAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const generateMembershipPDF = async (data: MembershipPDFData): Promise<void> => {
  // Pre-fetch remote attachments before building PDF
  let photoBase64: string | null = null
  let idDocBase64: string | null = null
  let paymentProofBase64: string | null = null

  if (data.photo_url) {
    try { photoBase64 = await fetchAsBase64(data.photo_url) } catch { /* skip */ }
  }
  if (data.id_doc_url) {
    try { idDocBase64 = await fetchAsBase64(data.id_doc_url) } catch { /* skip */ }
  }
  if (data.payment_proof_url) {
    try { paymentProofBase64 = await fetchAsBase64(data.payment_proof_url) } catch { /* skip */ }
  }

  const doc = new jsPDF('p', 'mm', 'a4')
  const pageW = 210
  const margin = 18
  const contentW = pageW - margin * 2
  let y = 0

  // ── Helpers ───────────────────────────────────────────────────────────────
  const text = (
    str: string, x: number, yPos: number,
    opts?: { align?: 'left' | 'center' | 'right'; maxWidth?: number }
  ) => doc.text(str, x, yPos, opts as any)

  const line = (x1: number, y1: number, x2: number, y2: number) =>
    doc.line(x1, y1, x2, y2)

  const rect = (x: number, yPos: number, w: number, h: number, style: 'F' | 'S' | 'FD' = 'F') =>
    doc.rect(x, yPos, w, h, style)

  const field = (
    label: string, value: string,
    xLabel: number, xValue: number, yPos: number, valueWidth = 80
  ) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(100, 100, 100)
    text(label, xLabel, yPos)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(20, 20, 20)
    const lines = doc.splitTextToSize(value || '—', valueWidth)
    text(lines[0], xValue, yPos)
    doc.setDrawColor(200, 200, 200)
    line(xValue, yPos + 1.5, xValue + valueWidth, yPos + 1.5)
  }

  const sectionHeader = (title: string, yPos: number) => {
    doc.setFillColor(17, 24, 39)
    rect(margin, yPos, contentW, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    text(title, margin + 3, yPos + 5)
    return yPos + 7
  }

  const checkY = (needed: number) => {
    if (y + needed > 272) {
      doc.addPage()
      y = 20
    }
  }

  const addFooter = () => {
    const total: number = (doc as any).internal.getNumberOfPages()
    for (let p = 1; p <= total; p++) {
      doc.setPage(p)
      doc.setFillColor(17, 24, 39)
      rect(0, 285, pageW, 12, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(180, 180, 180)
      text(
        'Land Rover Club Tanzania  ·  P.O. Box 77, Morogoro  ·  info@landroverclub.or.tz  ·  landroverclub.or.tz',
        pageW / 2, 293, { align: 'center' }
      )
    }
  }

  const submittedDate = data.submitted_at
    ? new Date(data.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const isFan = data.type === 'fan'

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(21, 128, 61)
  rect(0, 0, pageW, 30, 'F')

  // Logo top-left
  if (data.logo_base64) {
    try {
      doc.addImage(data.logo_base64, 'PNG', margin, 4, 20, 20)
    } catch { /* skip */ }
  }

  // Title centered (shifted right to clear logo)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  text('Land Rover Club Tanzania', pageW / 2 + 10, 13, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(220, 252, 231)
  const subtitle = isFan
    ? 'Fomu ya Usajili wa Shauku (Fan)  ·  Fan Registration Form'
    : 'Fomu ya Maombi ya Uanachama  ·  Membership Application Form'
  text(subtitle, pageW / 2 + 10, 22, { align: 'center' })

  // White strip below header
  y = 30
  doc.setFillColor(255, 255, 255)
  rect(0, y, pageW, 10, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  text(`Date Submitted: ${submittedDate}`, margin, y + 7)

  // Photo box — right aligned, starts at y=30, height 34
  const photoX = pageW - margin - 26
  const photoY = y + 1
  const photoH = 34
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(160, 160, 160)
  rect(photoX, photoY, 26, photoH, 'FD')
  
  if (photoBase64) {
    try {
      doc.addImage(photoBase64, 'JPEG', photoX + 1, photoY + 1, 24, photoH - 2)
    } catch {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(130, 130, 130)
      text('PICHA', photoX + 13, photoY + 14, { align: 'center' })
      text('PHOTO', photoX + 13, photoY + 20, { align: 'center' })
    }
  } else {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(130, 130, 130)
    text('PICHA', photoX + 13, photoY + 14, { align: 'center' })
    text('PHOTO', photoX + 13, photoY + 20, { align: 'center' })
  }

  // Content starts below both the strip and the photo box
  y = photoY + photoH + 6  // = 71 — safely below photo

  const col1x = margin
  const col2x = margin + contentW / 2 + 2
  const halfW = contentW / 2 - 6  // safe column value width

  // ── SECTION 1 ─────────────────────────────────────────────────────────────
  checkY(isFan ? 40 : 55)
  y = sectionHeader('1. TAARIFA BINAFSI  ·  PERSONAL INFORMATION', y) + 6

  if (isFan) {
    field('Full Name / Jina Kamili', data.full_name, col1x, col1x + 35, y, contentW - 40)
    y += 11
    field('Email / Barua Pepe', data.email, col1x, col1x + 30, y, halfW - 35)
    field('Phone / Simu', data.phone, col2x, col2x + 25, y, halfW - 30)
    y += 11
    field('Location / Mahali', data.po_box || '—', col1x, col1x + 30, y, contentW - 35)
    y += 13
  } else {
    field('Full Name / Jina Kamili', data.full_name, col1x, col1x + 35, y, halfW - 35)
    field('Gender / Jinsia',
      data.gender === 'Me' ? 'Me (Male)' : data.gender === 'Ke' ? 'Ke (Female)' : data.gender || '—',
      col2x, col2x + 25, y, halfW - 25)
    y += 11

    field('Date of Birth / Tarehe ya Kuzaliwa',
      data.dob ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '—',
      col1x, col1x + 48, y, halfW - 48)
    field('P.O. Box / Location', data.po_box || '—', col2x, col2x + 30, y, halfW - 30)
    y += 11

    field('Phone / Simu', data.phone, col1x, col1x + 25, y, halfW - 25)
    field('Email / Barua Pepe', data.email, col2x, col2x + 30, y, halfW - 30)
    y += 11

    if (!isFan) {
      field('How did you hear about us?', data.heard_about || '—', col1x, col1x + 48, y, contentW - 50)
      y += 13
    }
  }

  if (data.bio && !isFan) {
    checkY(24)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(100, 100, 100)
    text('Brief Profile / Wasifu kwa Ufipi', col1x, y)
    y += 5
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(20, 20, 20)
    const bioLines = doc.splitTextToSize(data.bio, contentW - 4)
    const bioH = bioLines.length * 4.5 + 6
    doc.setFillColor(252, 252, 252); doc.setDrawColor(220, 220, 220)
    rect(col1x - 1, y - 4, contentW + 2, bioH, 'FD')
    doc.text(bioLines, col1x + 2, y)
    y += bioH + 4
  }

  // ── SECTION 2 ─────────────────────────────────────────────────────────────
  if (!isFan) {
    checkY(44)
    y = sectionHeader('2. MDHAMINI  ·  GUARANTOR DETAILS', y) + 6

    field('Full Name / Jina la Mdhamini', data.guarantor_name, col1x, col1x + 33, y, halfW - 35)
    field('P.O. Box', data.guarantor_po_box || '—', col2x, col2x + 22, y, halfW - 24)
    y += 11
    field('Phone / Simu', data.guarantor_phone, col1x, col1x + 24, y, halfW - 26)
    field('Email / Barua Pepe', data.guarantor_email || '—', col2x, col2x + 24, y, halfW - 26)
    y += 14
  }

  // ── SECTION 3 ─────────────────────────────────────────────────────────────
  if (!isFan) {
    checkY(62)
    y = sectionHeader('3. ADA NA MICHANGO  ·  FEES & CONTRIBUTIONS', y) + 6

    const fees = [
      { type: 'Malipo ya Fomu (Form Fee)',            amount: 'TSh 50,000/-', note: 'One-time, on collecting form' },
      { type: 'Ada ya Kiingilio (Entry Fee)',          amount: 'TSh 60,000/-', note: 'One-time, on joining' },
      { type: 'Ada ya Mwezi (Monthly Fee)',            amount: 'TSh 15,000/-', note: 'Payable 1st–5th of each month' },
      { type: 'Michango Mbali Mbali (Contributions)', amount: 'TSh 50,000/-', note: 'Funeral, uniform, events etc.' },
    ]

    doc.setFillColor(243, 244, 246); rect(col1x, y, contentW, 6, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(60, 60, 60)
    text('Description', col1x + 2, y + 4)
    text('Amount', col1x + 95, y + 4)
    text('Notes', col1x + 125, y + 4)
    y += 6

    fees.forEach((fee, i) => {
      if (i % 2 === 0) { doc.setFillColor(250, 250, 250); rect(col1x, y, contentW, 6, 'F') }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(20, 20, 20)
      text(fee.type, col1x + 2, y + 4)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(21, 128, 61)
      text(fee.amount, col1x + 95, y + 4)
      doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100)
      text(fee.note, col1x + 125, y + 4)
      y += 6
    })
    doc.setDrawColor(220, 220, 220)
    doc.rect(col1x, y - fees.length * 6 - 6, contentW, fees.length * 6 + 6, 'S')
    y += 6

    checkY(24)
    doc.setFillColor(240, 253, 244); doc.setDrawColor(187, 247, 208)
    rect(col1x, y, contentW, 20, 'FD')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(21, 128, 61)
    text('Payment via M-Pesa:', col1x + 3, y + 6)
    doc.setFontSize(11); doc.setTextColor(17, 24, 39)
    text('+255 763 652 641', col1x + 3, y + 13)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100)
    text('or: +255 718 133 333  ·  Account name: Land Rover Club Tanzania', col1x + 3, y + 18)
    y += 26
  }

  // ── SECTION 4 ─────────────────────────────────────────────────────────────
  checkY(55)
  const sectionTitle = isFan ? '2. TAMKO LA MWOMBAJI  ·  FAN DECLARATION' : '4. TAMKO LA MWOMBAJI  ·  APPLICANT DECLARATION'
  y = sectionHeader(sectionTitle, y) + 6

  const declaration = isFan
    ? `Mimi ${data.full_name || '_______________'} ninasajiliwa kama shauku (Fan) wa Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.`
    : `Mimi ${data.full_name || '_______________'} ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.`
  const declLines = doc.splitTextToSize(declaration, contentW - 6)
  const declH = declLines.length * 4.5 + 10
  checkY(declH + 38)
  doc.setFillColor(249, 250, 251); doc.setDrawColor(220, 220, 220)
  rect(col1x, y, contentW, declH, 'FD')
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50)
  doc.text(declLines, col1x + 3, y + 6)
  y += declH + 8

  // Signature row
  checkY(30)
  const sigW = contentW / 2 - 5
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(60, 60, 60)
  text('Applicant Signature / Sahihi ya Mwombaji', col1x, y)
  text('Date / Tarehe', col2x, y)
  y += 4

  if (data.applicant_signature) {
    try {
      doc.addImage(data.applicant_signature, 'PNG', col1x, y, sigW, 20)
    } catch {
      doc.setDrawColor(200, 200, 200); rect(col1x, y, sigW, 20, 'S')
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(150, 150, 150)
      text('[Signature on file]', col1x + sigW / 2, y + 11, { align: 'center' })
    }
  } else {
    doc.setDrawColor(200, 200, 200); rect(col1x, y, sigW, 20, 'S')
  }

  doc.setDrawColor(200, 200, 200); rect(col2x, y, sigW, 20, 'S')
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(20, 20, 20)
  text(submittedDate, col2x + sigW / 2, y + 12, { align: 'center' })
  y += 26

  // ── IMPORTANT NOTES ───────────────────────────────────────────────────────
  checkY(30)
  y = sectionHeader('MUHIMU  ·  IMPORTANT NOTES', y) + 6
  const notes = [
    'Ambatisha nakala ya Kitambulisho (NIDA / Hati ya Kusafiria / Leseni ya Udereva)',
    "Attach a copy of National ID, Passport, or Driver's License",
    'Mawasiliano: +255 731 652 652  |  +255 763 652 641  |  info@landroverclub.or.tz',
  ]
  notes.forEach((note) => {
    checkY(8)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50)
    text(`• ${note}`, col1x + 2, y); y += 6
  })

  // ── ATTACHMENT: ID DOCUMENT ───────────────────────────────────────────────
  if (idDocBase64 && !isFan) {
    doc.addPage(); y = 20
    y = sectionHeader('KIAMBATISHO 1  ·  ID / PASSPORT COPY', y) + 8
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80, 80, 80)
    text(`Applicant: ${data.full_name}  ·  Submitted: ${submittedDate}`, col1x, y)
    y += 8
    const imgFormat = data.id_doc_url?.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'
    try {
      doc.addImage(idDocBase64, imgFormat, col1x, y, contentW, 160)
    } catch {
      try { doc.addImage(idDocBase64, 'PNG', col1x, y, contentW, 160) } catch {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(150, 150, 150)
        text('[ID document could not be rendered]', pageW / 2, y + 20, { align: 'center' })
      }
    }
  }

  // ── ATTACHMENT: PAYMENT PROOF ─────────────────────────────────────────────
  if (paymentProofBase64 && !isFan) {
    doc.addPage(); y = 20
    y = sectionHeader('KIAMBATISHO 2  ·  UTHIBITISHO WA MALIPO  ·  PAYMENT PROOF', y) + 8
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80, 80, 80)
    text(`Applicant: ${data.full_name}  ·  Submitted: ${submittedDate}`, col1x, y)
    y += 8
    const imgFormat = data.payment_proof_url?.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'
    try {
      doc.addImage(paymentProofBase64, imgFormat, col1x, y, contentW, 160)
    } catch {
      try { doc.addImage(paymentProofBase64, 'PNG', col1x, y, contentW, 160) } catch {
        doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(150, 150, 150)
        text('[Payment proof could not be rendered]', pageW / 2, y + 20, { align: 'center' })
      }
    }
  }

  // ── FOOTER (all pages) ────────────────────────────────────────────────────
  addFooter()

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fileName = `LRCT-Membership-${(data.full_name || 'applicant').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}