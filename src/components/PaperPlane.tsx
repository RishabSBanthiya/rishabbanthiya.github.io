import React from 'react'
import { isMotionReduced } from '../utils/motion'

// Flight path with one loop-the-loop, in viewBox units
const FLIGHT_PATH =
  'M 8 60 C 70 64, 120 62, 150 44 C 172 30, 160 8, 140 10 C 118 12, 112 40, 138 52 C 165 64, 200 40, 232 26'

// One cycle: fly, rest at the end of the trail, fade out, repeat
const CYCLE_DURATION = '10s'
const FLIGHT_KEY_TIMES = '0;0.4;1'
const FLIGHT_KEY_SPLINES = '0.45 0 0.55 1;0 0 1 1'

// The plane itself, nose pointing along +x so rotation can follow a path
export const PlaneGlyph: React.FC = () => (
  <>
    <path d="M 9 0 L -7 -6 L -3 0 L -7 6 Z" fill="var(--bs-body-bg)" strokeWidth="1.2" />
    <path d="M -3 0 L 9 0" strokeWidth="1.2" />
  </>
)

const PaperPlane: React.FC = () => {
  return (
    <svg
      className="paper-plane text-body-secondary mb-2"
      viewBox="0 0 240 80"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <path id="flight-path" d={FLIGHT_PATH} />
        {/* Reveals the dotted trail behind the plane as it flies */}
        <mask id="trail-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="80">
          <path
            d={FLIGHT_PATH}
            stroke="white"
            strokeWidth="6"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={isMotionReduced ? 0 : 1}
          >
            {!isMotionReduced && (
              <animate
                attributeName="stroke-dashoffset"
                values="1;0;0"
                keyTimes={FLIGHT_KEY_TIMES}
                calcMode="spline"
                keySplines={FLIGHT_KEY_SPLINES}
                dur={CYCLE_DURATION}
                repeatCount="indefinite"
              />
            )}
          </path>
        </mask>
      </defs>

      <g opacity={isMotionReduced ? 1 : 0}>
        {!isMotionReduced && (
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.05;0.9;1"
            dur={CYCLE_DURATION}
            repeatCount="indefinite"
          />
        )}
        <use href="#flight-path" strokeWidth="1.2" strokeDasharray="0.1 5" opacity="0.6" mask="url(#trail-reveal)" />
        <g transform={isMotionReduced ? 'translate(232 26) rotate(-27)' : undefined}>
          {!isMotionReduced && (
            <animateMotion
              rotate="auto"
              keyPoints="0;1;1"
              keyTimes={FLIGHT_KEY_TIMES}
              calcMode="spline"
              keySplines={FLIGHT_KEY_SPLINES}
              dur={CYCLE_DURATION}
              repeatCount="indefinite"
            >
              <mpath href="#flight-path" />
            </animateMotion>
          )}
          <PlaneGlyph />
        </g>
      </g>
    </svg>
  )
}

export default PaperPlane
