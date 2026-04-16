'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  X, User, Mail, Phone, Car, CheckCircle, PenLine, RotateCcw,
  Download, Loader2, Calendar, Tent, CreditCard, AlertCircle, MessageSquare
} from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sendEventConfirmationEmail } from '../lib/email'
import { generateMembershipPDF } from '../lib/generateMembershipPDF'
import type { Event } from '../lib/types'

// ── Signature Canvas ───────────────────────────────────────────────────────────
const SignatureCanvas: React.FC<{ onChange: (dataUrl: string | null) => void }> = ({ onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [hasSignature, setHasSignature] = useState(false)

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    isDrawing.current = true
    const pos = getPos(e, canvas)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
  }, [])

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (!isDrawing.current) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const pos = getPos(e, canvas)
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#1a1a1a'
    ctx.lineTo(pos.x, pos.y); ctx.stroke()
    setHasSignature(true)
  }, [])

  const stopDraw = useCallback(() => {
    if (!isDrawing.current) return
    isDrawing.current = false
    const canvas = canvasRef.current
    if (canvas) onChange(canvas.toDataURL('image/png'))
  }, [onChange])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDraw)
    canvas.addEventListener('mouseleave', stopDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)
    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDraw)
      canvas.removeEventListener('mouseleave', stopDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDraw)
    }
  }, [startDraw, draw, stopDraw])

  const clear = () => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false); onChange(null)
  }

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white" style={{ touchAction: 'none' }}>
        <canvas ref={canvasRef} width={600} height={150} className="w-full cursor-crosshair block" style={{ height: '150px' }} />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-gray-400">
              <PenLine className="h-4 w-4" />
              <span className="text-sm">Draw your signature here</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 border-b border-gray-300" />
      </div>
      {hasSignature && (
        <button type="button" onClick={clear} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <RotateCcw className="h-3 w-3" /> Clear signature
        </button>
      )}
    </div>
  )
}

// ── Pricing tables ─────────────────────────────────────────────────────────────
const ONE_NIGHT_PRICES: Record<string, string> = {
  '1': '110,000/=',
  '2': '160,000/=',
  '3': '240,000/=',
  '4': '320,000/=',
}
const TWO_NIGHT_PRICES: Record<string, string> = {
  '1': '170,000/=',
  '2': '310,000/=',
  '3': '460,000/=',
  '4': '600,000/=',
}

const ACK_ITEMS = [
  'I understand that payment is required for selected package and accommodation options.',
  'Participation in the event is at your own risk; organizers are not liable for injury, damage, or loss.',
  'You are responsible for ensuring your vehicle is roadworthy and safe for off-road driving.',
  'All bookings must be paid for based on your selected food and accommodation options.',
  'Payments may be non-refundable unless stated otherwise.',
  'Participants must follow event rules, respect others, and protect the environment.',
  'Your personal data will be collected and used only for event purposes, in line with the Personal Data Protection Act, 2022.',
  'By registering, you agree to these terms and consent to data use.',
]

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS = ['Participant', 'Attendance', 'Accommodation', 'Costs', 'Extra']

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-between px-1 mb-6">
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
            i < current ? 'bg-green-600 text-white' :
            i === current ? 'bg-green-600 text-white ring-4 ring-green-100' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-[10px] font-medium hidden sm:block ${i === current ? 'text-green-700' : 'text-gray-400'}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all duration-300 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
)

// ── Reusable option button ─────────────────────────────────────────────────────
const OptionBtn: React.FC<{
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  badge?: string
}> = ({ selected, onClick, children, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 text-left ${
      selected
        ? 'border-green-500 bg-green-50 text-green-800 ring-1 ring-green-400'
        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <span className="flex items-center gap-2">
      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
        selected ? 'border-green-500' : 'border-gray-300'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-green-500 block" />}
      </span>
      {children}
    </span>
    {badge && (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        selected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {badge}
      </span>
    )}
  </button>
)

// ── Day chip ───────────────────────────────────────────────────────────────────
const DayChip: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 ${
      selected
        ? 'border-green-500 bg-green-600 text-white ring-1 ring-green-400'
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
)

// ── Section wrapper ────────────────────────────────────────────────────────────
const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
      {icon}
    </div>
    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</span>
  </div>
)

// ── Field label ────────────────────────────────────────────────────────────────
const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

// ── Main modal ─────────────────────────────────────────────────────────────────
interface EventRegistrationModalProps {
  event: Event
  onClose: () => void
}

export default function EventRegistrationModal({ event, onClose }: EventRegistrationModalProps) {
  const [step, setStep] = useState(0)

  // Section 1 – Participant details
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [vehicle, setVehicle] = useState('')

  // Section 2 – Attendance & package
  const [days, setDays] = useState<string[]>([])
  const [duration, setDuration] = useState<'one' | 'two' | ''>('')
  const [peopleCount, setPeopleCount] = useState<string>('') // '1'|'2'|'3'|'4'

  // Section 3 – Accommodation
  const [accomType, setAccomType] = useState('')
  const [accomNights, setAccomNights] = useState('')

  // Section 4 – Costs & confirmation
  const [acks, setAcks] = useState<Set<number>>(new Set())
  const [allAcks, setAllAcks] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [signature, setSignature] = useState<string | null>(null)

  // Section 5 – Additional info
  const [emergency, setEmergency] = useState('')
  const [comments, setComments] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Derived price
  const priceTable = duration === 'one' ? ONE_NIGHT_PRICES : duration === 'two' ? TWO_NIGHT_PRICES : {}
  const selectedPrice = peopleCount && priceTable[peopleCount] ? priceTable[peopleCount] : null

  // Toggle acknowledgement
  const toggleAck = (i: number) => {
    setAcks(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }
  const toggleAllAcks = () => {
    if (allAcks) { setAcks(new Set()); setAllAcks(false) }
    else { setAcks(new Set(ACK_ITEMS.map((_, i) => i))); setAllAcks(true) }
  }
  useEffect(() => {
    setAllAcks(acks.size === ACK_ITEMS.length)
  }, [acks])

  // Step validation
  const canNext = () => {
    if (step === 0) return fullName.trim() !== '' && phone.trim() !== '' && email.trim() !== ''
    if (step === 1) return days.length > 0 && duration !== ''
    if (step === 2) return accomType !== ''
    if (step === 3) return acks.size === ACK_ITEMS.length && paymentMethod !== '' && signature !== null
    return true
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  async function handleSubmit() {
    if (!signature) { setError('Signature is required to complete registration.'); return }
    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'event_registrations'), {
        event_id: event.id,
        event_title: event.title,
        event_date: event.event_date,
        // Section 1
        full_name: fullName,
        email,
        phone,
        vehicle,
        // Section 2
        days_attending: days,
        duration,
        people_count: peopleCount,
        package_price: selectedPrice,
        // Section 3
        accommodation_type: accomType,
        accommodation_nights: accomNights,
        // Section 4
        payment_method: paymentMethod,
        signature,
        // Section 5
        emergency_contact: emergency,
        comments,
        registered_at: new Date().toISOString(),
        status: 'pending',
      })

      sendEventConfirmationEmail({
        name: fullName,
        email,
        phone,
        event_title: event.title,
        event_date: event.event_date,
        event_location: event.location,
        event_time: event.time,
      }).catch(err => console.error('Email failed:', err))

      setSubmitted(true)
    } catch (err) {
      setError('Failed to register. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    let logo_base_64: string | undefined
    try {
      const res = await fetch('/lrct.svg')
      const svgText = await res.text()
      logo_base_64 = await new Promise<string>((resolve) => {
        const img = new Image()
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const size = 512; canvas.width = size; canvas.height = size
          const ctx = canvas.getContext('2d')
          if (ctx) { ctx.clearRect(0, 0, size, size); ctx.drawImage(img, 0, 0, size, size); resolve(canvas.toDataURL('image/png')) }
          URL.revokeObjectURL(url)
        }
        img.src = url
      })
    } catch (e) { console.error('Logo fetch error:', e) }

    await generateMembershipPDF({
      type: 'event',
      full_name: fullName,
      email,
      phone,
      vehicle,
      days_attending: days.join(', '),
      duration,
      people_count: peopleCount,
      package_price: selectedPrice ?? '',
      accommodation_type: accomType,
      accommodation_nights: accomNights,
      payment_method: paymentMethod,
      emergency_contact: emergency,
      message: comments,
      event_title: event.title,
      event_date: formatDate(event.event_date),
      event_location: event.location,
      applicant_signature: signature,
      submitted_at: new Date().toISOString(),
      logo_base64: logo_base_64,
    })
  }

  // ── Render steps ─────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Step 0: Participant Details ──────────────────────────────────────────
      case 0:
        return (
          <div className="space-y-4">
            <SectionTitle icon={<User className="h-4 w-4" />} title="Participant Details" />

            <div>
              <FieldLabel required>Full name</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              </div>
            </div>

            <div>
              <FieldLabel required>Phone number</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+255 700 000 000"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              </div>
            </div>

            <div>
              <FieldLabel required>Email address</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              </div>
            </div>

            <div>
              <FieldLabel>Vehicle type / model</FieldLabel>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)}
                  placeholder="e.g. Toyota Land Cruiser 70 Series"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              </div>
            </div>
          </div>
        )

      // ── Step 1: Attendance & Package ─────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-5">
            <SectionTitle icon={<Calendar className="h-4 w-4" />} title="Attendance & Package" />

            <div>
              <FieldLabel required>Which days will you attend?</FieldLabel>
              <div className="flex gap-2">
                {['1st May', '2nd May', '3rd May'].map(d => (
                  <DayChip key={d} label={d} selected={days.includes(d)}
                    onClick={() => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} />
                ))}
              </div>
            </div>

            <div>
              <FieldLabel required>Duration of stay</FieldLabel>
              <div className="space-y-2">
                <OptionBtn selected={duration === 'one'} onClick={() => { setDuration('one'); setPeopleCount('') }}>One night</OptionBtn>
                <OptionBtn selected={duration === 'two'} onClick={() => { setDuration('two'); setPeopleCount('') }}>Two nights</OptionBtn>
              </div>
            </div>

            {duration && (
              <div>
                <FieldLabel>
                  Number of people attending (full board
                  {duration === 'one' ? ' · 1 night' : ' · 2 nights'})
                </FieldLabel>
                <div className="space-y-2">
                  {Object.entries(duration === 'one' ? ONE_NIGHT_PRICES : TWO_NIGHT_PRICES).map(([count, price]) => (
                    <OptionBtn key={count} selected={peopleCount === count}
                      onClick={() => setPeopleCount(count)}
                      badge={`TZS ${price}`}>
                      {count} {count === '1' ? 'person' : 'people'}
                    </OptionBtn>
                  ))}
                </div>
                {selectedPrice && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Package total</span>
                    <span className="text-base font-bold text-green-700">TZS {selectedPrice}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )

      // ── Step 2: Accommodation ────────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-5">
            <SectionTitle icon={<Tent className="h-4 w-4" />} title="Accommodation" />

            <div>
              <FieldLabel required>Preferred accommodation type</FieldLabel>
              <div className="space-y-2">
                {['Own Camping Gear', 'RockShungu Camping Gear'].map(type => (
                  <OptionBtn key={type} selected={accomType === type} onClick={() => setAccomType(type)}>{type}</OptionBtn>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Number of nights for accommodation</FieldLabel>
              <div className="space-y-2">
                {['1 Night', '2 Nights'].map(n => (
                  <OptionBtn key={n} selected={accomNights === n} onClick={() => setAccomNights(n)}>{n}</OptionBtn>
                ))}
              </div>
            </div>
          </div>
        )

      // ── Step 3: Costs & Confirmation ─────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-5">
            <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Costs & Confirmation" />

            {selectedPrice && (
              <div className="flex items-center justify-between bg-green-600 text-white rounded-xl px-4 py-3">
                <span className="text-sm font-semibold">Your package total</span>
                <span className="text-lg font-bold">TZS {selectedPrice}</span>
              </div>
            )}

            <div>
              <FieldLabel required>Terms & conditions</FieldLabel>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {ACK_ITEMS.map((text, i) => (
                  <label key={i} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors text-xs leading-relaxed ${acks.has(i) ? 'bg-green-50 text-gray-800' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={acks.has(i)} onChange={() => toggleAck(i)}
                      className="mt-0.5 flex-shrink-0 accent-green-600" />
                    {text}
                  </label>
                ))}
                <label className={`flex items-center gap-3 px-4 py-3 cursor-pointer font-semibold text-sm transition-colors ${allAcks ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                  <input type="checkbox" checked={allAcks} onChange={toggleAllAcks}
                    className="flex-shrink-0 accent-green-600" />
                  I have read and agree to the Terms & Conditions and Data Privacy Notice.
                </label>
              </div>
            </div>

            <div>
              <FieldLabel required>Payment method</FieldLabel>
              <div className="space-y-2">
                {['Mobile Money', 'Bank Transfer', 'Cash'].map(method => (
                  <OptionBtn key={method} selected={paymentMethod === method} onClick={() => setPaymentMethod(method)}>{method}</OptionBtn>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel required>Your signature</FieldLabel>
              <SignatureCanvas onChange={setSignature} />
            </div>
          </div>
        )

      // ── Step 4: Additional Info ──────────────────────────────────────────────
      case 4:
        return (
          <div className="space-y-4">
            <SectionTitle icon={<AlertCircle className="h-4 w-4" />} title="Additional Information" />

            <div>
              <FieldLabel>Emergency contact name & phone number</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={emergency} onChange={e => setEmergency(e.target.value)}
                  placeholder="e.g. Jane Doe — +255 712 345 678"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors" />
              </div>
            </div>

            <div>
              <FieldLabel>Additional comments or requests</FieldLabel>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea value={comments} onChange={e => setComments(e.target.value)}
                  placeholder="Any special requests, dietary requirements, or notes…"
                  rows={4}
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors resize-none" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              <strong>Review your details</strong> — once submitted, your registration will be sent for processing.
              {selectedPrice && <span className="block mt-0.5">Package total: <strong>TZS {selectedPrice}</strong> via {paymentMethod || '—'}</span>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ── Submitted state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold">You're Registered!</h2>
            <p className="text-green-100 text-sm mt-1">{event.title}</p>
          </div>
          <div className="p-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Thank you <strong className="text-gray-900">{fullName}</strong>! A confirmation has been sent to <strong className="text-gray-900">{email}</strong>.
            </p>
            <p className="text-gray-400 text-xs">We look forward to an adventurous and fun-filled weekend with you.</p>
            <div className="flex flex-col gap-3 pt-4">
              <button onClick={handleDownloadPDF}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm">
                <Download className="h-4 w-4" /> Download Registration PDF
              </button>
              <button onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main modal ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-6 text-white flex-shrink-0">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
          <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-1">Register for Event</p>
          <h2 className="text-xl font-bold leading-tight pr-8">{event.title}</h2>
          <p className="text-green-100 text-sm mt-1">{formatDate(event.event_date)}</p>
          {event.location && <p className="text-green-100 text-sm">📍 {event.location}</p>}
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <StepIndicator current={step} />

          {renderStep()}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 pb-6 flex gap-3 flex-shrink-0 border-t border-gray-100 pt-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              ← Back
            </button>
          ) : (
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Next →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Registering…</> : 'Complete Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}