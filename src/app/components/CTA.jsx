'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from './Button'
import { HiOutlineSearch, HiOutlineMail } from 'react-icons/hi'

const CTA = () => {
  return (
    <section 
      className="w-full h-screen max-h-[500px] flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1565402170291-8491f14678db?q=80&w=1117&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(25, 27, 50, 0.7) 0%, rgba(25, 27, 50, 0.9) 100%)'
        }}
      />

      {/* Content */}
      <div className="relative   z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl  md:text-5xl lg:!text-[3em] text-white leading-tight"
        >
          Looking for your next dream property?
      
        
        </motion.h2>

        <span className="text-secondary text-2xl sm:text-3xl md:text-4xl lg:!text-[2em]">Let us handle it for you</span>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/properties">
            <Button variant="primary">
              <HiOutlineSearch className="w-5 h-5" />
              Explore Properties
            </Button>
          </Link>
          <Link href="/#contactUs">
            <Button variant="secondary">
              <HiOutlineMail className="w-5 h-5" />
              Contact Us
            </Button>
          </Link>
        </motion.div>
      </div>




    </section>
  )
}

export default CTA
