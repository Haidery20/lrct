import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, LucideIcon } from 'lucide-react';
import { getContactDetails } from '../lib/db';
import type { ContactDetail } from '../lib/types';

// Map contact type strings to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  social: MessageCircle,
  whatsapp: MessageCircle,
};

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetail[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getContactDetails().then(setContactDetails);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Wire up your email/form handler here
    console.log('Form submitted:', formData);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    }, 1000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to join our adventures? Have questions about membership or upcoming events?
            We'd love to hear from you and welcome you to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info from Firestore */}
          <div className={`transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>

            <div className="space-y-6">
              {contactDetails.length === 0 ? (
                // Fallback static info while Firestore loads or if empty
                [
                  { icon: Mail, title: 'Email Us', info: 'info@landroverclub.or.tz', subInfo: 'We respond within 24 hours' },
                  { icon: Phone, title: 'Call Us', info: '+255 713 652 642', subInfo: 'Mon-Fri 9AM-6PM EAT' },
                  { icon: MapPin, title: 'Visit Us', info: 'Dar es Salaam, Tanzania', subInfo: 'Monthly meetings at various locations' },
                  { icon: MessageCircle, title: 'WhatsApp', info: '+255 713 652 642', subInfo: 'Quick questions and updates' },
                ].map((contact) => (
                  <div key={contact.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 flex-shrink-0">
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{contact.title}</h4>
                      <p className="text-green-600 font-medium mb-1">{contact.info}</p>
                      <p className="text-gray-600 text-sm">{contact.subInfo}</p>
                    </div>
                  </div>
                ))
              ) : (
                contactDetails.map((detail) => {
                  const Icon = iconMap[detail.type?.toLowerCase()] ?? MessageCircle;
                  return (
                    <div key={detail.id} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{detail.label}</h4>
                        <p className="text-green-600 font-medium mb-1">{detail.value}</p>
                        {detail.sub_info && (
                          <p className="text-gray-600 text-sm">{detail.sub_info}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className={`mt-12 p-8 bg-white rounded-2xl shadow-lg transition-all duration-1000 delay-900 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Join Land Rover Club Tanzania?</h4>
              <ul className="space-y-3 text-gray-700">
                {['Expert guidance for all skill levels', 'Access to exclusive trails and locations', 'Professional maintenance workshops', 'Strong community support network', 'Conservation and environmental awareness'].map((item) => (
                  <li key={item} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-600 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+255 xxx xxx xxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your interest in joining the club..." />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{sending ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}</span>
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;