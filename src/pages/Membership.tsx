"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Users, Heart, Shield, Check, Upload, ArrowLeft, CheckCircle, ChevronRight, ChevronLeft, PenLine, RotateCcw, X, ScrollText, Loader2 } from "lucide-react"
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

type Tab = 'choose' | 'fan' | 'member'
type MemberStep = 1 | 2 | 3 | 4

// ── Upload with progress ──────────────────────────────────────────────────────
const uploadFileWithProgress = (
  file: File,
  path: string,
  onProgress: (pct: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => reject(err),
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    )
  })
}

// ── Upload step types ─────────────────────────────────────────────────────────
type UploadStep = {
  label: string
  status: 'waiting' | 'uploading' | 'done' | 'skipped'
  progress: number
}

const SubmitProgress: React.FC<{ steps: UploadStep[] }> = ({ steps }) => (
  <div className="space-y-3 py-2">
    {steps.map((s) => (
      <div key={s.label} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {s.status === 'done' || s.status === 'skipped'
              ? <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              : s.status === 'uploading'
              ? <Loader2 className="h-4 w-4 text-green-600 animate-spin flex-shrink-0" />
              : <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />}
            <span className={`font-medium ${
              s.status === 'done' || s.status === 'skipped' ? 'text-gray-400' :
              s.status === 'uploading' ? 'text-gray-900' : 'text-gray-400'
            }`}>{s.label}</span>
          </div>
          {s.status === 'uploading' && <span className="text-xs text-gray-500 tabular-nums">{s.progress}%</span>}
          {(s.status === 'done' || s.status === 'skipped') && <span className="text-xs text-green-600">Done</span>}
        </div>
        {s.status === 'uploading' && (
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden ml-6">
            <div className="h-full bg-green-500 rounded-full transition-all duration-150" style={{ width: `${s.progress}%` }} />
          </div>
        )}
      </div>
    ))}
  </div>
)

// ── T&C Content ───────────────────────────────────────────────────────────────
const FAN_TCS = [
  { title: "1. Who Can Register as a Fan", body: "Membership as a Fan is open to any person who has an interest in Land Rovers and the Land Rover Club Tanzania (LRCT) community. You do not need to own a Land Rover to register as a Fan. Fans must be 16 years of age or older. Registering under a false identity is strictly prohibited." },
  { title: "2. Fan Benefits", body: "As a registered Fan, you will receive access to LRCT community updates, newsletters, and invitations to public club events. Fan status does not confer voting rights, access to members-only events, or eligibility for club office. Benefits are provided at the discretion of the club committee and may change without prior notice." },
  { title: "3. Conduct & Community Standards", body: "All Fans are ambassadors of the LRCT community. You agree to engage respectfully with all club members and fellow fans across all LRCT platforms, events, and communications. Harassment, discrimination, hate speech, or behaviour that brings the club into disrepute will result in immediate removal from the fan register without notice." },
  { title: "4. Use of Your Information", body: "By registering, you consent to LRCT storing and using your name, email address, phone number, location, and profile photo solely for club communication and record-keeping purposes. Your information will not be sold or shared with third parties outside of club operations. You may request removal of your data at any time by contacting landroverclubtz@gmail.com." },
  { title: "5. Events & Activities", body: "Fans who attend LRCT public events do so at their own risk. LRCT accepts no liability for injury, loss, or damage sustained during events. Fans are expected to comply with all safety briefings and instructions given by club organisers at any event." },
  { title: "6. Transition to Full Membership", body: "Fan registration does not guarantee acceptance as a full club member. A separate membership application, guarantor, and payment of the prescribed fees are required for full membership." },
  { title: "7. Termination of Fan Status", body: "LRCT reserves the right to remove any individual from the fan register at any time for breach of these terms, conduct unbecoming, or at the discretion of the club committee. No fees are involved and removal carries no right of appeal." },
  { title: "8. Amendments", body: "LRCT reserves the right to amend these terms at any time. Continued use of fan benefits after notification of changes constitutes acceptance of the updated terms." },
]

const MEMBER_TCS = [
  { title: "1. Eligibility for Membership", body: "Full membership of Land Rover Club Tanzania (LRCT) is open to individuals who own or have a direct interest in a Land Rover vehicle. Applicants must be 18 years of age or older, hold a valid National ID or Passport, and be sponsored by an existing LRCT member in good standing (Mdhamini). The club committee reserves the right to accept or decline any application without being required to give reasons." },
  { title: "2. Application Process", body: "A completed application form must be submitted together with a copy of your National ID or Passport, a passport-size photograph, guarantor details, and proof of payment of the prescribed fees. Applications are reviewed by the club committee and a decision communicated within a reasonable period. Submission of an application does not guarantee acceptance." },
  { title: "3. Fees & Subscriptions", body: "The following fees apply: (a) Form Fee — TSh 50,000 payable once upon collecting the form; (b) Entry Fee — TSh 60,000 payable once upon acceptance; (c) Monthly Subscription — TSh 15,000 payable between the 1st and 5th of each month; (d) General Contributions — TSh 50,000 applicable for events such as funerals, uniforms, and other club matters. All fees must be paid within 14 days of acceptance. Fees are non-refundable except at the sole discretion of the committee." },
  { title: "4. Member Obligations", body: "Members agree to: abide by the LRCT Constitution, Rules and Regulations at all times; maintain their vehicle in a roadworthy condition when attending club events; pay all subscriptions and contributions on time; attend club meetings where possible; treat fellow members, fans, and the public with respect; and uphold the reputation of LRCT in all conduct." },
  { title: "5. Off-Road Events & Safety", body: "Participation in LRCT off-road trips, expeditions, and technical events is entirely at the member's own risk. LRCT, its officers, and committee members accept no liability for injury, death, vehicle damage, loss of property, or any other loss howsoever arising during club activities. Members must attend safety briefings, follow the instructions of designated trail leaders, and carry adequate recovery equipment." },
  { title: "6. Vehicle Responsibility", body: "Each member is solely responsible for the roadworthiness, insurance, and legal compliance of their vehicle. LRCT accepts no responsibility for mechanical failures, accidents, or third-party claims arising from members' vehicles." },
  { title: "7. Code of Conduct", body: "Members must at all times conduct themselves in a manner consistent with the values of the club. Behaviour that is deemed abusive, discriminatory, dishonest, or damaging to the reputation of LRCT may result in suspension or permanent expulsion. A suspended or expelled member forfeits all fees paid and has no claim against the club." },
  { title: "8. Use of Your Information", body: "By applying for membership, you consent to LRCT collecting, storing, and using your personal information — including your name, contact details, date of birth, photograph, ID copy, and signature — for membership administration, communication, and club records. Your information will not be shared with third parties outside of LRCT operations without your consent." },
  { title: "9. Resignation & Termination", body: "A member wishing to resign must notify the club Secretary in writing. Resignation does not entitle the member to a refund of any fees paid. The committee may terminate membership for non-payment of subscriptions exceeding three months or conduct unbecoming. A terminated member may appeal to the full committee within 30 days." },
  { title: "10. Amendments", body: "LRCT reserves the right to amend these terms, the Constitution, and club regulations at any time by resolution of the committee or at a General Meeting. Members will be notified of material changes and continued membership constitutes acceptance." },
]

// ── T&C Modal ─────────────────────────────────────────────────────────────────
type TCType = 'fan' | 'member'

const TCModal: React.FC<{ type: TCType; onClose: () => void }> = ({ type, onClose }) => {
  const sections = type === 'fan' ? FAN_TCS : MEMBER_TCS
  const title = type === 'fan' ? 'Fan Registration — Terms & Conditions' : 'Membership Application — Terms & Conditions'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'fan' ? 'text-green-700 bg-green-100' : 'text-gray-900 bg-gray-100'}`}>
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Land Rover Club Tanzania · landroverclubtz@gmail.com</p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
            Please read these terms carefully. By proceeding you confirm that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">{s.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            These terms are governed by the laws of the United Republic of Tanzania. For questions, contact the LRCT Secretary at landroverclubtz@gmail.com or P.O. Box 77, Morogoro, Tanzania.
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className={`w-full py-3 rounded-xl font-semibold transition-colors text-white ${type === 'fan' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
            I have read these Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Signature Canvas ──────────────────────────────────────────────────────────
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

// ── Step Progress Bar ─────────────────────────────────────────────────────────
const StepBar: React.FC<{ step: MemberStep }> = ({ step }) => {
  const steps = ['Personal Info', 'Guarantor', 'Fees & Payment', 'Declaration']
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>
        {steps.map((label, i) => {
          const n = (i + 1) as MemberStep
          const done = step > n; const active = step === n
          return (
            <div key={label} className="flex flex-col items-center z-10 gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                done ? 'bg-green-500 border-green-500 text-white' :
                active ? 'bg-white border-green-500 text-green-600' :
                'bg-white border-gray-300 text-gray-400'
              }`}>
                {done ? <Check className="h-4 w-4" /> : n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-green-600' : done ? 'text-gray-600' : 'text-gray-400'}`}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>
)

const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"

// ── Main Component ────────────────────────────────────────────────────────────
const Membership = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [tab, setTab] = useState<Tab>('choose')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadSteps, setUploadSteps] = useState<UploadStep[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const [tcModal, setTcModal] = useState<TCType | null>(null)
  const [fanTcAgreed, setFanTcAgreed] = useState(false)
  const [memberTcAgreed, setMemberTcAgreed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const patchStep = (index: number, patch: Partial<UploadStep>) =>
    setUploadSteps(s => s.map((step, i) => i === index ? { ...step, ...patch } : step))

  // ── Fan form ──────────────────────────────────────────────────────────────
  const [fanData, setFanData] = useState({ full_name: '', email: '', phone: '', city: '' })
  const [fanPhoto, setFanPhoto] = useState<File | null>(null)
  const [fanPhotoPreview, setFanPhotoPreview] = useState<string | null>(null)

  const submitFan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fanTcAgreed) return
    setSubmitError(null)
    setIsSubmitting(true)
    const steps: UploadStep[] = [
      { label: 'Uploading photo', status: fanPhoto ? 'waiting' : 'skipped', progress: 0 },
      { label: 'Saving registration', status: 'waiting', progress: 0 },
    ]
    setUploadSteps(steps)
    try {
      let photo_url = ''
      if (fanPhoto) {
        setUploadSteps(s => s.map((st, i) => i === 0 ? { ...st, status: 'uploading' } : st))
        photo_url = await uploadFileWithProgress(fanPhoto, `fans/${Date.now()}_${fanPhoto.name}`,
          (pct) => setUploadSteps(s => s.map((st, i) => i === 0 ? { ...st, progress: pct } : st)))
        setUploadSteps(s => s.map((st, i) => i === 0 ? { ...st, status: 'done', progress: 100 } : st))
      }
      setUploadSteps(s => s.map((st, i) => i === 1 ? { ...st, status: 'uploading', progress: 50 } : st))
      await addDoc(collection(db, 'fans'), { ...fanData, photo_url, type: 'fan', status: 'active', tc_agreed: true, created_at: new Date().toISOString() })
      setUploadSteps(s => s.map((st, i) => i === 1 ? { ...st, status: 'done', progress: 100 } : st))
      await new Promise(r => setTimeout(r, 500))
      setSubmitSuccess(true)
    } catch (err: any) {
      console.error('Fan submit error:', err)
      setSubmitError(err?.message ?? 'Something went wrong. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Member form ───────────────────────────────────────────────────────────
  const [memberStep, setMemberStep] = useState<MemberStep>(1)
  const [personal, setPersonal] = useState({ full_name: '', dob: '', gender: '', po_box: '', phone: '', email: '', bio: '', heard_about: '', heard_other: '' })
  const [idDoc, setIdDoc] = useState<File | null>(null)
  const [idDocName, setIdDocName] = useState<string | null>(null)
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null)
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string | null>(null)
  const [guarantor, setGuarantor] = useState({ full_name: '', po_box: '', phone: '', email: '', description: '' })
  const [guarantorSignature, setGuarantorSignature] = useState<string | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentProofName, setPaymentProofName] = useState<string | null>(null)
  const [applicantSignature, setApplicantSignature] = useState<string | null>(null)
  const [declarationAgreed, setDeclarationAgreed] = useState(false)

  const stepValid = (s: MemberStep): boolean => {
    if (s === 1) return !!(personal.full_name && personal.dob && personal.gender && personal.phone && personal.email)
    if (s === 2) return !!(guarantor.full_name && guarantor.phone)
    if (s === 3) return !!paymentProof
    if (s === 4) return !!(applicantSignature && declarationAgreed && memberTcAgreed)
    return false
  }

  const submitMember = async () => {
    if (!stepValid(4)) return
    setSubmitError(null)
    setIsSubmitting(true)
    const steps: UploadStep[] = [
      { label: 'Uploading photo', status: memberPhoto ? 'waiting' : 'skipped', progress: 0 },
      { label: 'Uploading ID document', status: idDoc ? 'waiting' : 'skipped', progress: 0 },
      { label: 'Uploading payment proof', status: 'waiting', progress: 0 },
      { label: 'Saving application', status: 'waiting', progress: 0 },
    ]
    setUploadSteps(steps)
    try {
      const ts = Date.now()
      let photo_url = '', id_doc_url = '', payment_proof_url = ''

      if (memberPhoto) {
        patchStep(0, { status: 'uploading' })
        photo_url = await uploadFileWithProgress(memberPhoto, `members/photos/${ts}_${memberPhoto.name}`,
          (pct) => patchStep(0, { progress: pct }))
        patchStep(0, { status: 'done', progress: 100 })
      }

      if (idDoc) {
        patchStep(1, { status: 'uploading' })
        id_doc_url = await uploadFileWithProgress(idDoc, `members/ids/${ts}_${idDoc.name}`,
          (pct) => patchStep(1, { progress: pct }))
        patchStep(1, { status: 'done', progress: 100 })
      }

      patchStep(2, { status: 'uploading' })
      payment_proof_url = await uploadFileWithProgress(paymentProof!, `members/payments/${ts}_${paymentProof!.name}`,
        (pct) => patchStep(2, { progress: pct }))
      patchStep(2, { status: 'done', progress: 100 })

      patchStep(3, { status: 'uploading', progress: 50 })
      await addDoc(collection(db, 'membership_applications'), {
        ...personal, photo_url, id_doc_url,
        guarantor: { ...guarantor, signature: guarantorSignature },
        payment_proof_url,
        applicant_signature: applicantSignature,
        declaration_agreed: declarationAgreed,
        tc_agreed: memberTcAgreed,
        type: 'member', status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      patchStep(3, { status: 'done', progress: 100 })
      await new Promise(r => setTimeout(r, 500))
      setSubmitSuccess(true)
    } catch (err: any) {
      console.error('Member submit error:', err)
      setSubmitError(err?.message ?? 'Something went wrong. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetAll = () => {
    setSubmitSuccess(false); setSubmitError(null)
    setTab('choose'); setMemberStep(1)
    setUploadSteps([]); setFanTcAgreed(false); setMemberTcAgreed(false)
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {tab === 'fan' ? 'Welcome to the LRCT Family!' : 'Application Submitted!'}
          </h2>
          <p className="text-gray-600 mb-3">
            {tab === 'fan'
              ? 'You have been registered as a fan. We will be in touch with updates and events!'
              : 'Your membership application has been received. Our team will review and confirm within 2–3 business days.'}
          </p>
          {tab === 'member' && <p className="text-sm text-gray-500 mb-8">Questions? Email <span className="font-medium">landroverclubtz@gmail.com</span></p>}
          <button onClick={resetAll} className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Back to Membership
          </button>
        </div>
      </section>
    )
  }

  // ── Submitting overlay ────────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {tab === 'fan' ? 'Registering you...' : 'Submitting your application...'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Please keep this page open. This may take a moment.</p>
            <SubmitProgress steps={uploadSteps} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="membership" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="h-4 w-4" /> Join Us
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Be Part of{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">LRCT</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you own a Land Rover or simply love the lifestyle — there is a place for you here.
          </p>
        </div>

        {/* ── CHOOSE ───────────────────────────────────────────────────────── */}
        {tab === 'choose' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div onClick={() => setTab('fan')} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500 group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Heart className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fan</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">Free</div>
              <p className="text-gray-600 mb-6">Love Land Rovers but don't own one yet? Join as a fan and stay connected.</p>
              <ul className="space-y-3 mb-8">
                {['Access to community updates', 'Invited to public events', 'Newsletter subscription', 'No payment required'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700"><Check className="h-5 w-5 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <div className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-center group-hover:bg-green-700 transition-colors">Register as Fan</div>
            </div>

            <div onClick={() => setTab('member')} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-gray-900 group">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                <Shield className="h-8 w-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Member</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">From <span className="text-green-600">15,000</span></div>
              <div className="text-sm text-gray-500 mb-4">TSh / month</div>
              <p className="text-gray-600 mb-6">Own a Land Rover? Become a full member with exclusive benefits and access.</p>
              <ul className="space-y-3 mb-8">
                {['Full club membership', 'Off-road trips & expeditions', 'Technical workshops', 'Priority event booking', 'Member discounts'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700"><Check className="h-5 w-5 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <div className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-center group-hover:bg-gray-800 transition-colors">Apply for Membership</div>
            </div>
          </div>
        )}

        {/* ── FAN FORM ─────────────────────────────────────────────────────── */}
        {tab === 'fan' && (
          <div className="max-w-xl mx-auto">
            <button onClick={() => setTab('choose')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><Heart className="h-6 w-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Fan Registration</h3>
                  <p className="text-gray-500 text-sm">Free — no payment required</p>
                </div>
              </div>
              <form onSubmit={submitFan} className="space-y-5">
                <div className="flex justify-center mb-4">
                  <label className="cursor-pointer group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 group-hover:border-green-500 flex items-center justify-center overflow-hidden transition-colors">
                      {fanPhotoPreview
                        ? <img src={fanPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                        : <div className="text-center"><Upload className="h-6 w-6 text-gray-400 mx-auto" /><span className="text-xs text-gray-400 mt-1 block">Photo</span></div>}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFanPhoto(f); setFanPhotoPreview(URL.createObjectURL(f)) } }} />
                  </label>
                </div>
                <Field label="Full Name" required>
                  <input type="text" required value={fanData.full_name} onChange={e => setFanData({...fanData, full_name: e.target.value})} className={inputCls} placeholder="Your full name" />
                </Field>
                <Field label="Email Address" required>
                  <input type="email" required value={fanData.email} onChange={e => setFanData({...fanData, email: e.target.value})} className={inputCls} placeholder="your@email.com" />
                </Field>
                <Field label="Phone Number" required>
                  <input type="tel" required value={fanData.phone} onChange={e => setFanData({...fanData, phone: e.target.value})} className={inputCls} placeholder="+255 xxx xxx xxx" />
                </Field>
                <Field label="City / Location" required>
                  <input type="text" required value={fanData.city} onChange={e => setFanData({...fanData, city: e.target.value})} className={inputCls} placeholder="Dar es Salaam" />
                </Field>

                {/* T&C — mandatory */}
                <div className={`flex items-start gap-3 p-4 border-2 rounded-xl transition-colors ${fanTcAgreed ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <input type="checkbox" id="fan-tc" checked={fanTcAgreed} onChange={e => setFanTcAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0" />
                  <label htmlFor="fan-tc" className="text-sm text-gray-700 cursor-pointer">
                    I have read and agree to the{' '}
                    <button type="button" onClick={() => setTcModal('fan')} className="text-green-600 hover:text-green-700 underline underline-offset-2 font-medium">
                      Fan Registration Terms & Conditions
                    </button>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
                {!fanTcAgreed && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 -mt-2">
                    <ScrollText className="h-3 w-3 flex-shrink-0" /> You must agree to the Terms & Conditions to register.
                  </p>
                )}

                {submitError && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 py-3 px-4 rounded-lg">{submitError}</p>
                )}

                <button type="submit" disabled={!fanTcAgreed}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Register as Fan
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MEMBER FORM ──────────────────────────────────────────────────── */}
        {tab === 'member' && (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => { setTab('choose'); setMemberStep(1) }} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"><Shield className="h-6 w-6 text-gray-900" /></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Membership Application</h3>
                  <p className="text-gray-500 text-sm">Fomu ya Maombi ya Kujiunga — LRCT</p>
                </div>
              </div>

              <StepBar step={memberStep} />

              {/* STEP 1 */}
              {memberStep === 1 && (
                <div className="space-y-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 pb-2">A. Taarifa Binafsi — Personal Information</p>
                  <div className="flex justify-center">
                    <label className="cursor-pointer group">
                      <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 group-hover:border-green-500 flex items-center justify-center overflow-hidden transition-colors">
                        {memberPhotoPreview
                          ? <img src={memberPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                          : <div className="text-center p-2"><Upload className="h-6 w-6 text-gray-400 mx-auto" /><span className="text-xs text-gray-400 mt-1 block">Picha / Photo</span></div>}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setMemberPhoto(f); setMemberPhotoPreview(URL.createObjectURL(f)) } }} />
                    </label>
                  </div>
                  <Field label="Full Name / Jina Kamili" required>
                    <input type="text" value={personal.full_name} onChange={e => setPersonal({...personal, full_name: e.target.value})} className={inputCls} placeholder="Full name as on ID" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date of Birth / Tarehe ya Kuzaliwa" required>
                      <input type="date" value={personal.dob} onChange={e => setPersonal({...personal, dob: e.target.value})} className={inputCls} />
                    </Field>
                    <Field label="Gender / Jinsia" required>
                      <select value={personal.gender} onChange={e => setPersonal({...personal, gender: e.target.value})} className={inputCls}>
                        <option value="">Select...</option>
                        <option value="Me">Me (Male)</option>
                        <option value="Ke">Ke (Female)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="P.O. Box / S.L.P">
                    <input type="text" value={personal.po_box} onChange={e => setPersonal({...personal, po_box: e.target.value})} className={inputCls} placeholder="P.O. Box number" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone / Simu ya Mkononi" required>
                      <input type="tel" value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} className={inputCls} placeholder="+255 xxx xxx xxx" />
                    </Field>
                    <Field label="Email / Barua Pepe" required>
                      <input type="email" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} className={inputCls} placeholder="your@email.com" />
                    </Field>
                  </div>
                  <Field label="ID / Passport Copy — Nakala ya Kitambulisho" hint="Upload a copy of your National ID or Passport">
                    <label className={`flex items-center gap-3 w-full py-3 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${idDoc ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}>
                      <Upload className={`h-5 w-5 ${idDoc ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm ${idDoc ? 'text-green-700' : 'text-gray-500'}`}>{idDocName ?? 'Click to upload ID or Passport'}</span>
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setIdDoc(f); setIdDocName(f.name) } }} />
                    </label>
                  </Field>
                  <Field label="Brief Profile / Wasifu kwa Ufipi" hint="Tell us a little about yourself">
                    <textarea rows={3} value={personal.bio} onChange={e => setPersonal({...personal, bio: e.target.value})} className={inputCls} placeholder="Brief background about yourself..." />
                  </Field>
                  <Field label="How did you hear about LRCT? / Umepataje taarifa?" required>
                    <select value={personal.heard_about} onChange={e => setPersonal({...personal, heard_about: e.target.value})} className={inputCls}>
                      <option value="">Select...</option>
                      <option value="Rafiki">Rafiki (Friend)</option>
                      <option value="Mwanaklabu">Mwanaklabu (Club Member)</option>
                      <option value="Mtandaoni">Mtandaoni (Online)</option>
                      <option value="Nyingine">Nyingine (Other)</option>
                    </select>
                  </Field>
                  {personal.heard_about === 'Nyingine' && (
                    <Field label="Please specify / Taja">
                      <input type="text" value={personal.heard_other} onChange={e => setPersonal({...personal, heard_other: e.target.value})} className={inputCls} placeholder="How did you hear about us?" />
                    </Field>
                  )}
                </div>
              )}

              {/* STEP 2 */}
              {memberStep === 2 && (
                <div className="space-y-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 pb-2">Mdhamini — Guarantor Details</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    Your guarantor should be an existing LRCT member who can vouch for your application.
                  </div>
                  <Field label="Guarantor Full Name / Jina la Mdhamini" required>
                    <input type="text" value={guarantor.full_name} onChange={e => setGuarantor({...guarantor, full_name: e.target.value})} className={inputCls} placeholder="Guarantor's full name" />
                  </Field>
                  <Field label="P.O. Box / Anuani">
                    <input type="text" value={guarantor.po_box} onChange={e => setGuarantor({...guarantor, po_box: e.target.value})} className={inputCls} placeholder="P.O. Box" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone / Simu" required>
                      <input type="tel" value={guarantor.phone} onChange={e => setGuarantor({...guarantor, phone: e.target.value})} className={inputCls} placeholder="+255 xxx xxx xxx" />
                    </Field>
                    <Field label="Email / Barua Pepe">
                      <input type="email" value={guarantor.email} onChange={e => setGuarantor({...guarantor, email: e.target.value})} className={inputCls} placeholder="guarantor@email.com" />
                    </Field>
                  </div>
                  <Field label="Guarantor's Statement / Maelezo ya Mdhamini" hint="Guarantor's description and recommendation of the applicant">
                    <textarea rows={4} value={guarantor.description} onChange={e => setGuarantor({...guarantor, description: e.target.value})} className={inputCls} placeholder="Brief statement about the applicant..." />
                  </Field>
                  <Field label="Guarantor Signature / Sahihi ya Mdhamini">
                    <SignatureCanvas onChange={setGuarantorSignature} />
                  </Field>
                </div>
              )}

              {/* STEP 3 */}
              {memberStep === 3 && (
                <div className="space-y-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 pb-2">Ada na Michango — Fees & Payment</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-900 text-white">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Aina ya Malipo</th>
                          <th className="text-right px-4 py-3 font-medium">Kiwango</th>
                          <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Maelezo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { type: 'Malipo ya Fomu', amount: '50,000/-', note: 'One-time, on collecting form' },
                          { type: 'Ada ya Kiingilio', amount: '60,000/-', note: 'One-time, on joining' },
                          { type: 'Ada ya Mwezi', amount: '15,000/-', note: 'Monthly (1st–5th of each month)', highlight: true },
                          { type: 'Michango Mbali Mbali', amount: '50,000/-', note: 'Contributions (funeral, uniform, etc.)' },
                        ].map((row: any) => (
                          <tr key={row.type} className={row.highlight ? 'bg-green-50' : 'bg-white'}>
                            <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                            <td className="px-4 py-3 text-right font-bold text-green-700 whitespace-nowrap">TSh {row.amount}</td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1">Muhimu / Important</p>
                    All fees must be paid within <strong>14 days</strong> of acceptance. Full payment details will be provided in your acceptance letter.
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3">Payment Instructions / Maelekezo ya Malipo</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Send via M-Pesa to:</p>
                      <p className="text-xl font-bold text-gray-900">+255 763 652 641</p>
                      <p className="text-gray-500">or: +255 718 133 333</p>
                      <p className="mt-2">Account: <strong>Land Rover Club Tanzania</strong></p>
                      <p className="text-xs text-gray-400 mt-2">Use your full name as the payment reference.</p>
                    </div>
                  </div>
                  <Field label="Upload Proof of Payment / Pakia Uthibitisho wa Malipo" required hint="Screenshot or photo of your M-Pesa confirmation">
                    <label className={`flex items-center gap-3 w-full py-4 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${paymentProof ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}>
                      <Upload className={`h-5 w-5 ${paymentProof ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${paymentProof ? 'text-green-700' : 'text-gray-500'}`}>{paymentProofName ?? 'Click to upload screenshot or receipt'}</span>
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPaymentProof(f); setPaymentProofName(f.name) } }} />
                    </label>
                  </Field>
                </div>
              )}

              {/* STEP 4 — Declaration + Signature + T&C at end */}
              {memberStep === 4 && (
                <div className="space-y-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 pb-2">Tamko la Mwombaji — Applicant Declaration</p>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
                    <p className="mb-3">
                      Mimi <strong className="text-gray-900">{personal.full_name || '_______________'}</strong> ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.
                    </p>
                    <p className="text-gray-500 italic border-t border-gray-200 pt-3">
                      I, <strong className="text-gray-700">{personal.full_name || '_______________'}</strong>, hereby apply to join the Tanzania Land Rover Club. I promise to be faithful and comply with all conditions in the Club's Constitution, Rules and Regulations if my application is accepted. I confirm that all information provided in this form is true and accurate.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                    <input type="checkbox" id="declaration" checked={declarationAgreed} onChange={e => setDeclarationAgreed(e.target.checked)}
                      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                    <label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer">
                      I have read and agree to the declaration above. I confirm all provided information is truthful and accurate.
                    </label>
                  </div>

                  <Field label="Applicant Signature / Sahihi ya Mwombaji" required>
                    <SignatureCanvas onChange={setApplicantSignature} />
                  </Field>

                  {/* T&C at the very end — mandatory before submit */}
                  <div className={`flex items-start gap-3 p-4 border-2 rounded-xl transition-colors ${memberTcAgreed ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" id="member-tc" checked={memberTcAgreed} onChange={e => setMemberTcAgreed(e.target.checked)}
                      className="mt-0.5 h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-500 cursor-pointer flex-shrink-0" />
                    <label htmlFor="member-tc" className="text-sm text-gray-700 cursor-pointer">
                      I have read and agree to the{' '}
                      <button type="button" onClick={() => setTcModal('member')} className="text-gray-900 hover:text-gray-700 underline underline-offset-2 font-medium">
                        Membership Terms & Conditions
                      </button>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                  {!memberTcAgreed && (
                    <p className="text-xs text-amber-600 flex items-center gap-1 -mt-2">
                      <ScrollText className="h-3 w-3 flex-shrink-0" /> You must agree to the Terms & Conditions to submit.
                    </p>
                  )}

                  {submitError && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 py-3 px-4 rounded-lg">{submitError}</p>
                  )}

                  <button type="button" disabled={!stepValid(4)} onClick={submitMember}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Submit Membership Application
                  </button>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setMemberStep((memberStep - 1) as MemberStep)} disabled={memberStep === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-0 disabled:pointer-events-none font-medium">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                {memberStep < 4 && (
                  <button type="button" onClick={() => setMemberStep((memberStep + 1) as MemberStep)} disabled={!stepValid(memberStep)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {tcModal && <TCModal type={tcModal} onClose={() => setTcModal(null)} />}

    </section>
  )
}

export default Membership