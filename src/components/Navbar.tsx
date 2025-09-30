import React, { useState } from 'react'

const Navbar: React.FC = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)

  const handleNavLinkClick = () => {
    setIsNavCollapsed(true)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">
          rishab-banthiya
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse justify-content-end ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link larger-header"
                href="https://www.linkedin.com/in/rishrub/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavLinkClick}
              >
                <i className="fab fa-linkedin"></i> linkedin
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link larger-header"
                href="https://github.com/rishabSBanthiya/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavLinkClick}
              >
                <i className="fab fa-github"></i> github
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link larger-header"
                href="/rishab-banthiya-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavLinkClick}
              >
                <i className="fas fa-file-pdf"></i> resume
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar