import styles from './Footer.module.css'
import Button from './Button'

const EMAIL    = 'aceaisolutions@outlook.com'
const LINKEDIN = 'https://www.linkedin.com/in/eze-patrick-811ab136a?utm_source=share_via&utm_content=profile&utm_medium=member_ios'

const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            <span className={styles.logoAce}>ACE</span>
            <span className={styles.logoAi}> AI</span>
          </p>
          <p className={styles.tagline}>Intelligence, applied.</p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <Button unstyled onClick={() => scrollTo('#services')}>Services</Button>
          <Button unstyled onClick={() => scrollTo('#about')}>About</Button>
          <Button unstyled onClick={() => scrollTo('#contact')}>Contact</Button>
          <a href={`mailto:${EMAIL}`}>Email Us</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} Ace AI Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
