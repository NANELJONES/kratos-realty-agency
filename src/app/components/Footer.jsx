'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineMail, HiOutlinePhone, HiOutlineChat } from 'react-icons/hi'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const contactInfo = {
    phone: '+233 24 499 0190',
    email: 'kratosrealtygh@gmail.com',
    whatsapp: '+233 24 499 0190',
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#aboutUs' },
    { name: 'Explore Properties', href: '/properties' },
    { name: 'Contact Us', href: '/#contactUs' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com' },
  ]

  return (
    <footer className="w-full bg-primary border-t border-white/10 relative">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-12 md:py-16">
           {/* Logo and Company Name */}
           <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3 md:absolute md:top-0 md:right-0">
              <div className="relative   md:w-[20em] md:h-[20em] w-[10em] h-[10em]">
                <Image
                  src="/logo.png"
                  alt="Kratos Realty Agency Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {/* <h3 className="text-white font-bold text-lg md:text-xl">
                Kr8tos Realty Agency
              </h3> */}
            </div>
        
          <h1 className="text-white text-4xl lg:!text-[8em]">Let's Talk</h1>
            <h4 className="text-white/70 text-sm">
            Realty In The Clouds Of Realties
            </h4>
         
          
          </div>
    

        <div className="flex mt-10 md:mt-20 flex-row items-start justify-between flex-wrap gap-8 md:gap-12 mb-8">
       

          {/* Contact Information */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-base md:text-lg mb-2">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <Link 
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-white/80 hover:text-secondary transition-colors"
              >
                <HiOutlinePhone className="w-5 h-5 text-secondary" />
                <span className="text-sm md:text-base">{contactInfo.phone}</span>
              </Link>
              <Link 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-white/80 hover:text-secondary transition-colors"
              >
                <HiOutlineMail className="w-5 h-5 text-secondary" />
                <span className="text-sm md:text-base break-all">{contactInfo.email}</span>
              </Link>
              <Link 
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-secondary transition-colors"
              >
                <HiOutlineChat className="w-5 h-5 text-secondary" />
                <span className="text-sm md:text-base">WhatsApp</span>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-base md:text-lg mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-secondary transition-colors text-sm md:text-base"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-base md:text-lg mb-2">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-secondary transition-colors text-white hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} Kr8tos Realty Agency. All Rights Reserved.
            </p>
            <p className="text-white/60 text-sm text-center md:text-right">
              Developed by{' '}
              <Link 
                href="https://kr8tos.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary/80 transition-colors font-semibold"
              >
                Kr8tos
              </Link>
            </p>
          </div>
        </div>



      </div>
    </footer>
  )
}

export default Footer
