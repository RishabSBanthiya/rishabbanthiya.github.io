import React, { useState } from 'react'

const Hero: React.FC = () => {
  const [isAboutMeVisible, setIsAboutMeVisible] = useState(false)

  const toggleAboutMe = () => {
    setIsAboutMeVisible(!isAboutMeVisible)
  }

  return (
    <>
      <div className="circular-picture">
        <img src="/html-tag-icon.png" alt="Profile Picture" className="profile-picture" />
      </div>

      <div className="container mt-5 text-center">
        <div className="retro-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-button red"></span>
              <span className="terminal-button yellow"></span>
              <span className="terminal-button green"></span>
            </div>
            <div className="terminal-title">rishab@terminal:~$</div>
          </div>
          <div className="terminal-body">
            <h5 className="larger-first-line">Hey, I'm Rishab - I like to build.</h5>
            <p className="left-align">Hack, hack. I'm in the mainframe.</p>
          </div>
        </div>

        <div className="button-container mt-4">
          <a
            href="mailto:banthiya.rishab1511@gmail.com"
            className="btn btn-outline-dark custom-button"
            role="button"
          >
            Contact Me
          </a>

          <button
            className="btn btn-outline-dark custom-button"
            type="button"
            onClick={toggleAboutMe}
          >
            About Me
          </button>
        </div>

        <div className={`collapse mt-3 ${isAboutMeVisible ? 'show' : ''}`}>
          <p className="left-align">
            I enjoy exploring new technologies, building projects, and learning about the intersection of technology and business.
          </p>
        </div>
      </div>
    </>
  )
}

export default Hero