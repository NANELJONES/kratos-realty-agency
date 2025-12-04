'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import Image from 'next/image'

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#aboutUs' },
    { name: 'Explore Properties', href: '/properties' },
    { name: 'Contact Us', href: '/contactUs' },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.includes(href.replace('#', ''))
  }

  const handleLinkClick = (href) => {
    setIsMobileMenuOpen(false)
    
    // Handle smooth scroll for hash links
    if (href.includes('#')) {
      const [path, hash] = href.split('#')
      if (pathname === path || (path === '/' && pathname === '/')) {
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }

  return (
    <>
      {/* Top Bar - Only Menu Button */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 right-0 z-50 bg-primary/60 backdrop-blur-md transition-all duration-300"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <HiMenu className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Full Height Side Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-primary/60 backdrop-blur-md shadow-2xl z-50 h-full flex flex-col"
            >
              {/* Logo Section */}
              <div className="px-6 pt-8 pb-6 border-b border-white/10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4">
                    
                      <img
                        src="/logo.png"
                        alt="Kratos Realty Agency Logo"
                        fill
                        className="w-full"
                        priority
                      />
                    
                    {/* <span className="text-white text-lg md:text-xl">
                      Kratos Realty
                    </span> */}
                  </div>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 flex flex-col pt-8 px-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className={`block py-4 text-lg md:text-xl font-medium border-b border-white/10 transition-colors ${
                        isActive(item.href)
                          ? 'text-secondary'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Nav
