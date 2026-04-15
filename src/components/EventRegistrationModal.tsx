'use client'
import React, { useState } from 'react'
import { X, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sendEventConfirmationEmail } from '../lib/email'
import type { Event } from '../lib/types'

interface EventRegistrationModalProps {
  event: Event
  onClose: () => void
}

export default function EventRegistrationModal({ event, onClose }: EventRegistrationModalProps) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await addDoc(collection(db, 'event_registrations'), {
        event_id: event.id,
        event_title: event.title,
        event_date: event.event_date,
        ...form,
        registered_at: new Date().toISOString(),
        status: 'pending',
      })

      // Send confirmation emails (non-blocking)
      sendEventConfirmationEmail({
        name: form.full_name,
        email: form.email,
        phone: form.phone,
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-3xl p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <p className="text-green-100 text-sm font-medium mb-1">Register for Event</p>
          <h2 className="text-xl font-bold leading-tight pr-8">{event.title}</h2>
          <p className="text-green-100 text-sm mt-2">{formatDate(event.event_date)}</p>
          {event.location && (
            <p className="text-green-100 text-sm">📍 {event.location}</p>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're Registered!</h3>
              <p className="text-gray-500 text-sm mb-2">
                Thank you <strong>{form.full_name}</strong>! A confirmation email has been sent to <strong>{form.email}</strong>.
              </p>
              <p className="text-gray-400 text-xs mb-6">We'll be in touch with further details closer to the event.</p>
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    placeholder="John Doe"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="john@example.com"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+255 700 000 000"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Message / Questions
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Any questions or special requirements…"
                    rows={3}
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-400 transition-colors resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering…' : 'Register Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}