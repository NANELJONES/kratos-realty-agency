'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Services data
const services = [
  {
    id: 1,
    name: "Luxury Real Estates",
    description: "Discover exclusive luxury properties that match your refined taste. From premium residential estates to high-end commercial spaces, we curate a collection of exceptional properties that define luxury living. Our expert team ensures every detail meets the highest standards of quality and sophistication.",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
  },
  {
    id: 2,
    name: "Property Management",
    description: "Comprehensive property management services designed to maximize your investment returns. We handle everything from tenant relations and maintenance to financial reporting and legal compliance. Our proactive approach ensures your properties are well-maintained and profitable year-round.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
  },
  {
    id: 3,
    name: "Real Estate Investment",
    description: "Strategic investment guidance to help you build wealth through real estate. Whether you're a first-time investor or expanding your portfolio, we provide market analysis, property evaluation, and investment strategies tailored to your financial goals. Let us help you make informed decisions that yield long-term returns.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
  },
  {
    id: 4,
    name: "Consultation Services",
    description: "Expert real estate consultation to guide you through every step of your property journey. From market insights and property valuation to negotiation strategies and legal advice, our experienced consultants provide personalized guidance to help you make confident decisions in today's dynamic real estate market.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0"
  }
]

const OurServices = () => {
  const [activeService, setActiveService] = useState(1) // Default to first service

  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 z-20 bg-primary/30">
      <div className="">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="huge_text text-white mb-4">Our Services</h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
          {/* Left Side - Image (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3"
          >
            <div className="relative w-full h-64 md:h-80 lg:h-[500px]">
              <Image
                src={services.find(s => s.id === activeService)?.image || services[0].image}
                alt={services.find(s => s.id === activeService)?.name || services[0].name}
                fill
                className="object-cover grayscale"
              />
            </div>
          </motion.div>

          {/* Right Side - Services List (2/3 width) */}
          <div className="w-full lg:w-2/3 space-y-6 md:space-y-8">
            {services.map((service, index) => {
              const isActive = service.id === activeService
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setActiveService(service.id)}
                  onMouseLeave={() => setActiveService(1)}
                  className="cursor-pointer group"
                >
                  <div className="flex justify-between items-center gap-4 md:gap-6">
                    {/* Service Number */}
                    <span 
                      className="text-2xl md:text-3xl lg:text-4xl text-white transition-all duration-300"
                      style={{ fontWeight: isActive ? 600 : 300 }}
                    >
                      {service.id}.
                    </span>
                    
                    {/* Service Content */}
                    <div className="flex-1 grid border-b border-white grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Service Name */}
                      <h3 
                        className="text-xl md:text-2xl lg:!text-[2.4em] text-white mb-2 transition-all duration-300"
                        style={{ fontWeight: isActive ? 700 : 300 }}
                      >
                        {service.name}
                      </h3>
                      
                      {/* Underline */}
                      {/* <div className="w-full h-px bg-white mb-3 md:mb-4"></div> */}
                      
                      {/* Description */}
                      <p className="!text-[0.8em] text-white/80 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurServices
