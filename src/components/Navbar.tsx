import { useEffect, useRef, useState } from 'react'
import Button from './Button'

import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about'    },
  { label: 'Contact',  href: '#contact'  },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a href="#" className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={styles.logoAce}>ACE</span>
            <span className={styles.logoAi}> AI</span>
          </a>

          <ul className={styles.links}>
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Button unstyled className={styles.link} onClick={() => handleNavClick(l.href)}>
                  {l.label}
                </Button>
              </li>
            ))}
          </ul>

          <Button unstyled className={styles.cta} onClick={() => handleNavClick('#contact')}>
            Get in Touch
          </Button>

          <Button
            type="button"
            unstyled
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </Button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <ul>
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <Button unstyled onClick={() => handleNavClick(l.href)}>{l.label}</Button>
            </li>
          ))}
          <li>
            <Button unstyled className={styles.mobileCta} onClick={() => handleNavClick('#contact')}>
              Get in Touch
            </Button>
          </li>
        </ul>
      </div>
    </>
  )
}
