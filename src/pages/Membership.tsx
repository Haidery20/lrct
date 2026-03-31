"use client"

import React, { useState, useEffect, useRef } from "react"
import { Users, Heart, Shield, Check, Upload, ArrowLeft, CheckCircle } from "lucide-react"
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

type Tab = 'choose' | 'fan' | 'member'
type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const Membership = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [tab, setTab] = useState<Tab>('choose')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ── Fan Form ──────────────────────────────────────────────────────────────
  const [fanData, setFanData] = useState({
    full_name: '', email: '', phone: '', city: ''
  })
  const [fanPhoto, setFanPhoto] = useState<File | null>(null)
  const [fanPhotoPreview, setFanPhotoPreview] = useState<string | null>(null)

  const handleFanPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFanPhoto(file)
      setFanPhotoPreview(URL.createObjectURL(file))
    }
  }

  const submitFan = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState('submitting')
    try {
      let photo_url = ''
      if (fanPhoto) {
        const storageRef = ref(storage, `fans/${Date.now()}_${fanPhoto.name}`)
        await uploadBytes(storageRef, fanPhoto)
        photo_url = await getDownloadURL(storageRef)
      }
      await addDoc(collection(db, 'fans'), {
        ...fanData,
        photo_url,
        type: 'fan',
        status: 'active',
        created_at: new Date().toISOString(),
      })
      setSubmitState('success')
    } catch (err) {
      console.error(err)
      setSubmitState('error')
    }
  }

  // ── Member Form ───────────────────────────────────────────────────────────
  const [memberData, setMemberData] = useState({
    full_name: '', email: '', phone: '', city: '', tier: 'Basic'
  })
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null)
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentProofName, setPaymentProofName] = useState<string | null>(null)

  const handleMemberPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMemberPhoto(file)
      setMemberPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handlePaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentProof(file)
      setPaymentProofName(file.name)
    }
  }

  const tiers = [
    {
      name: 'Basic',
      price: '50,000',
      features: ['Monthly club meetings', 'Basic maintenance tips', 'Community forum access', 'Newsletter subscription'],
    },
    {
      name: 'Premium',
      price: '100,000',
      popular: true,
      features: ['All Basic features', 'Monthly off-road trips', 'Technical workshops', 'Priority event booking', 'Exclusive member discounts'],
    },
    {
      name: 'VIP',
      price: '200,000',
      features: ['All Premium features', 'Private expedition access', 'Personal mechanic consultation', 'VIP event invitations', 'Annual Land Rover merchandise'],
    },
  ]

  const selectedTier = tiers.find(t => t.name === memberData.tier) ?? tiers[0]

  const submitMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentProof) { alert('Please upload proof of payment'); return }
    setSubmitState('submitting')
    try {
      let photo_url = ''
      if (memberPhoto) {
        const storageRef = ref(storage, `members/photos/${Date.now()}_${memberPhoto.name}`)
        await uploadBytes(storageRef, memberPhoto)
        photo_url = await getDownloadURL(storageRef)
      }
      const proofRef = ref(storage, `members/payments/${Date.now()}_${paymentProof.name}`)
      await uploadBytes(proofRef, paymentProof)
      const payment_proof_url = await getDownloadURL(proofRef)

      await addDoc(collection(db, 'membership_applications'), {
        ...memberData,
        photo_url,
        payment_proof_url,
        type: 'member',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setSubmitState('success')
    } catch (err) {
      console.error(err)
      setSubmitState('error')
    }
  }

  // ── Success Screen ────────────────────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {tab === 'fan' ? 'Welcome to the LRCT Family!' : 'Application Submitted!'}
          </h2>
          <p className="text-gray-600 mb-8">
            {tab === 'fan'
              ? 'You have been registered as a fan. We will be in touch with updates and events!'
              : 'Your membership application and payment proof have been received. Our team will review and confirm within 2-3 business days.'}
          </p>
          <button
            onClick={() => { setSubmitState('idle'); setTab('choose') }}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            Back to Membership
          </button>
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
            <Users className="h-4 w-4" />
            Join Us
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Be Part of{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">LRCT</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you own a Land Rover or simply love the lifestyle — there is a place for you here.
          </p>
        </div>

        {/* Choose Tab */}
        {tab === 'choose' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Fan Card */}
            <div
              onClick={() => setTab('fan')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500 group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <Heart className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fan</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">Free</div>
              <p className="text-gray-600 mb-6">Love Land Rovers but don't own one yet? Join as a fan and stay connected with the community.</p>
              <ul className="space-y-3 mb-8">
                {['Access to community updates', 'Invited to public events', 'Newsletter subscription', 'No payment required'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-center group-hover:bg-green-700 transition-colors">
                Register as Fan
              </div>
            </div>

            {/* Member Card */}
            <div
              onClick={() => setTab('member')}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-gray-900 group"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors">
                <Shield className="h-8 w-8 text-gray-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Member</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">From <span className="text-green-600">50,000</span></div>
              <div className="text-sm text-gray-500 mb-4">TSh / month</div>
              <p className="text-gray-600 mb-6">Own a Land Rover and want full club access? Become a full member with exclusive benefits.</p>
              <ul className="space-y-3 mb-8">
                {['Full club membership', 'Off-road trips & expeditions', 'Technical workshops', 'Priority event booking', 'Member discounts'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-center group-hover:bg-gray-800 transition-colors">
                Apply for Membership
              </div>
            </div>
          </div>
        )}

        {/* Fan Form */}
        {tab === 'fan' && (
          <div className="max-w-xl mx-auto">
            <button onClick={() => setTab('choose')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Fan Registration</h3>
                  <p className="text-gray-500 text-sm">Free — no payment required</p>
                </div>
              </div>

              <form onSubmit={submitFan} className="space-y-5">
                {/* Photo upload */}
                <div className="flex justify-center mb-4">
                  <label className="cursor-pointer group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 group-hover:border-green-500 flex items-center justify-center overflow-hidden transition-colors">
                      {fanPhotoPreview ? (
                        <img src={fanPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-400 mt-1 block">Photo</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFanPhoto} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required value={fanData.full_name} onChange={e => setFanData({...fanData, full_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" required value={fanData.email} onChange={e => setFanData({...fanData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" required value={fanData.phone} onChange={e => setFanData({...fanData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="+255 xxx xxx xxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City / Location *</label>
                  <input type="text" required value={fanData.city} onChange={e => setFanData({...fanData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="Dar es Salaam" />
                </div>

                <button type="submit" disabled={submitState === 'submitting'}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitState === 'submitting' ? 'Registering...' : 'Register as Fan'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Member Form */}
        {tab === 'member' && (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setTab('choose')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Membership Application</h3>
                  <p className="text-gray-500 text-sm">Full club membership with payment</p>
                </div>
              </div>

              {/* Tier selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Membership Tier *</label>
                <div className="grid grid-cols-3 gap-3">
                  {tiers.map(tier => (
                    <button key={tier.name} type="button"
                      onClick={() => setMemberData({...memberData, tier: tier.name})}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        memberData.tier === tier.name ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      {tier.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">Popular</span>
                      )}
                      <div className="font-bold text-gray-900">{tier.name}</div>
                      <div className="text-green-600 font-semibold text-sm">{tier.price} TSh</div>
                    </button>
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {selectedTier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={submitMember} className="space-y-5">
                {/* Photo upload */}
                <div className="flex justify-center mb-2">
                  <label className="cursor-pointer group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 group-hover:border-green-500 flex items-center justify-center overflow-hidden transition-colors">
                      {memberPhotoPreview ? (
                        <img src={memberPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-400 mt-1 block">Photo</span>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleMemberPhoto} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" required value={memberData.full_name} onChange={e => setMemberData({...memberData, full_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" required value={memberData.email} onChange={e => setMemberData({...memberData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" required value={memberData.phone} onChange={e => setMemberData({...memberData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="+255 xxx xxx xxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City / Location *</label>
                  <input type="text" required value={memberData.city} onChange={e => setMemberData({...memberData, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    placeholder="Dar es Salaam" />
                </div>

                {/* Payment info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">Payment Instructions</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Send <span className="font-bold text-green-700">{selectedTier.price} TSh</span> via M-Pesa to:</p>
                    <p className="text-lg font-bold text-gray-900">+255 713 652 642</p>
                    <p className="text-gray-500">Account name: Land Rover Club Tanzania</p>
                    <p className="text-gray-500 text-xs mt-2">Use your full name as the reference when sending payment.</p>
                  </div>
                </div>

                {/* Payment proof upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Proof of Payment *</label>
                  <label className={`flex items-center justify-center gap-3 w-full py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    paymentProof ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                  }`}>
                    <Upload className={`h-5 w-5 ${paymentProof ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${paymentProof ? 'text-green-700' : 'text-gray-500'}`}>
                      {paymentProofName ?? 'Click to upload screenshot or receipt'}
                    </span>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handlePaymentProof} />
                  </label>
                </div>

                <button type="submit" disabled={submitState === 'submitting'}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitState === 'submitting' ? 'Submitting Application...' : 'Submit Membership Application'}
                </button>

                {submitState === 'error' && (
                  <p className="text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

export default Membership
