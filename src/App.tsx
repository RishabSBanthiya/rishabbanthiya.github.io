import PaperPlane from './components/PaperPlane'
import Journey from './components/Journey'

interface ProfileLink {
  label: string
  href: string
}

const PROFILE_LINKS: ProfileLink[] = [
  { label: 'Resume', href: '/rishab-banthiya-resume.pdf' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rishrub/' },
  { label: 'Substack', href: 'https://rishrub.substack.com/' },
]

const ProfileLinks: React.FC = () => (
  <nav className="d-flex flex-wrap justify-content-center gap-4 fs-5" aria-label="Profile links">
    {PROFILE_LINKS.map((link) => (
      <a
        key={link.href}
        className="link-body-emphasis link-offset-3 link-underline-opacity-25 link-underline-opacity-100-hover"
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {link.label}
      </a>
    ))}
  </nav>
)

function App() {
  return (
    <>
      <main className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center px-4 position-relative">
        <PaperPlane />
        <h1 className="display-4 mb-2">Rishab Banthiya</h1>
        <p className="fs-5 text-body-secondary mb-4">Analyst at Société Générale</p>
        <ProfileLinks />
        <a
          href="#journey"
          className="scroll-hint position-absolute bottom-0 mb-4 small text-body-secondary text-decoration-none"
        >
          the route so far ↓
        </a>
      </main>
      <Journey />
      <footer className="d-flex justify-content-center py-5">
        <ProfileLinks />
      </footer>
    </>
  )
}

export default App
