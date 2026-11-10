import React from 'react'

// Each icon is drawn around the origin in roughly a 28-unit box and inherits
// the journey's stroke colour. Inner groups carry a small looping animation.

export const Diya: React.FC = () => (
  <>
    <path d="M -12 2 C -10 10, 10 10, 12 2 Z" />
    <path d="M -14 2 L 14 2" />
    <g className="icon-flame">
      <path d="M 0 -10 C 4 -5, 4 0, 0 2 C -4 0, -4 -5, 0 -10 Z" fill="currentColor" fillOpacity="0.2" />
    </g>
  </>
)

export const Corn: React.FC = () => (
  <g className="icon-sway">
    <path d="M -1 9 C -6 7, -10 2, -9 -6 C -6 -2, -4 4, -1 9 Z M 1 9 C 6 7, 10 2, 9 -6 C 6 -2, 4 4, 1 9 Z" />
    <path d="M 0 -14 C 5 -13, 6 4, 0 10 C -6 4, -5 -13, 0 -14 Z" fill="var(--bs-body-bg)" />
    <circle cx="-2.2" cy="-9" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="0" cy="-10" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="2.2" cy="-9" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="-2.6" cy="-5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="0" cy="-6" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="2.6" cy="-5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="-2.6" cy="-1" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="0" cy="-2" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="2.6" cy="-1" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="-2" cy="3" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="0" cy="2" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="2" cy="3" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="0" cy="6" r="0.9" fill="currentColor" stroke="none" />
    <path d="M 0 10 L 0 14" />
  </g>
)

export const TestTube: React.FC = () => (
  <>
    <path d="M -4 0 L -4 8 A 4 4 0 0 0 4 8 L 4 0 Z" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <path d="M -4 -12 L -4 8 A 4 4 0 0 0 4 8 L 4 -12 M -6.5 -12 L 6.5 -12" />
    <circle className="icon-bubble" cx="-1.2" cy="7" r="0.9" />
    <circle className="icon-bubble icon-bubble-late" cx="1.4" cy="8" r="0.7" />
  </>
)

export const MarinaBaySands: React.FC = () => (
  <>
    <path d="M -13 12 L -11 -9 L -5.5 -9 L -5.5 12 M -3 12 L -3 -9 L 3 -9 L 3 12 M 5.5 12 L 5.5 -9 L 11 -9 L 13 12" />
    <path d="M -8.5 -4 L -8.5 12 M 0 -4 L 0 12 M 8.5 -4 L 8.5 12" opacity="0.5" />
    <path d="M -16.5 -10 C -10 -15, 10 -15, 17.5 -11.5 L 15.5 -8 L -14.5 -8 Z" fill="var(--bs-body-bg)" />
    <path d="M -18 12 L 18 12" />
    <path className="icon-wave" d="M -14 15.5 q 2 -1.6 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0 t 4 0" />
  </>
)

export const Apple: React.FC = () => (
  <g className="icon-bob">
    <path d="M 0 -5 C -3 -9, -11 -8, -11 -1 C -11 6, -6 12, -2 11 C -1 10.5, 1 10.5, 2 11 C 6 12, 11 6, 11 -1 C 11 -8, 3 -9, 0 -5 Z" />
    <path d="M 0 -5 C 0 -8, 1 -10, 2 -12" />
    <path d="M 1 -8 C 3 -12, 7 -12, 8 -10 C 6 -7, 3 -7, 1 -8 Z" />
  </g>
)

export const Bean: React.FC = () => (
  <>
    <path d="M -14 2 C -14 -7, -6 -10, 0 -9 C 6 -10, 14 -7, 14 2 C 14 5, 12 7, 9 7 C 6 7, 4 1, 0 1 C -4 1, -6 7, -9 7 C -12 7, -14 5, -14 2 Z" />
    <path d="M -16 10 L 16 10" />
    <path className="icon-gleam" d="M -9 -3 C -6 -6.5, -1 -7, 4 -6 M -10.5 1 C -10 -1, -9 -2, -7.5 -3" />
  </>
)
