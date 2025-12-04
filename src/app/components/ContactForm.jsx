'use client'

import React from 'react'
import { HiMail, HiPhone, HiChat } from 'react-icons/hi'
import Image from 'next/image'

const ContactForm = ({ property }) => {
  // Company information - you can move this to a config file or env variables
  const companyInfo = {
    name: 'Kratos Realty',
    logo: '/logo.png', // Update with your actual logo path
    phone: '+233 24 499 0190',
    email: 'kratosrealtygh@gmail.com',
    whatsapp: '+233 24 499 0190',
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello, I'm interested in this property: ${property?.title || ''}`)
    const whatsappUrl = `https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about: ${property?.title || ''}`)
    const body = encodeURIComponent(`Hello,\n\nI'm interested in learning more about this property.\n\nProperty: ${property?.title || ''}\n\nThank you!`)
    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`
  }

  const handleCall = () => {
    window.location.href = `tel:${companyInfo.phone}`
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        {companyInfo.logo && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
            <Image
              src={companyInfo.logo}
              alt={companyInfo.name}
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-white">{companyInfo.name}</h3>
          <p className="text-white/60 text-sm">Contact us today</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-white/80">
          <HiPhone className="w-5 h-5 text-secondary flex-shrink-0" />
          <a 
            href={`tel:${companyInfo.phone}`}
            className="hover:text-white transition-colors"
          >
            {companyInfo.phone}
          </a>
        </div>
        <div className="flex items-center gap-3 text-white/80">
          <HiMail className="w-5 h-5 text-secondary flex-shrink-0" />
          <a 
            href={`mailto:${companyInfo.email}`}
            className="hover:text-white transition-colors break-all"
          >
            {companyInfo.email}
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/40 flex items-center justify-center gap-2"
        >
          <HiChat className="w-5 h-5" />
          Contact via WhatsApp
        </button>
        <button
          onClick={handleEmail}
          className="w-full bg-secondary hover:bg-[#d19a2e] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/40 flex items-center justify-center gap-2"
        >
          <HiMail className="w-5 h-5" />
          Send Email
        </button>
        <button
          onClick={handleCall}
          className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-white/20 flex items-center justify-center gap-2"
        >
          <HiPhone className="w-5 h-5" />
          Call Now
        </button>
      </div>
    </div>
  )
}

export default ContactForm

