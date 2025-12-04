'use client'

import React from 'react'

/**
 * Button component with primary, secondary, and tertiary variants
 * @param {string} variant - Button style variant: 'primary', 'secondary', or 'tertiary'
 * @param {React.ReactNode} children - Button content
 * @param {function} onClick - Click handler function
 * @param {string} type - Button type: 'button', 'submit', or 'reset'
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} className - Additional CSS classes
 * @param {object} ...props - Other HTML button attributes
 */
const Button = ({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'primary_button',
    secondary: 'secondary_button',
    tertiary: 'tertiary_button'
  }[variant] || 'primary_button'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

