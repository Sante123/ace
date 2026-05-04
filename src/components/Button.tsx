import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  unstyled?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', unstyled = false, className = '', ...rest }) => {
  const classNames = unstyled ? className : `${styles.button} ${styles[variant]} ${className || ''}`
  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  )
}

export default Button