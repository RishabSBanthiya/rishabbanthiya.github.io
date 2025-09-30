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
        <h5 className="larger-first-line">Hey, I'm Rishab - I like to build.</h5>
        <p className="left-align">Hack, hack. I'm in the mainframe.</p>

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