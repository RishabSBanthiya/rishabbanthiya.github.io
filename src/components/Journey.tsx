import React, { useEffect, useRef } from 'react'
import { PlaneGlyph } from './PaperPlane'
import { isMotionReduced } from '../utils/motion'
import { Apple, Bean, Corn, Diya, MarinaBaySands, TestTube } from './StopIcons'

interface JourneyStop {
  place: string
  title: string
  detail: string
  icon: StopIconName
  x: number
  y: number
}

// Scene coordinates (viewBox units); stops zigzag between two columns,
// pulled closer together on phones so the labels beside them have room
const SCENE_WIDTH = 480
const SCENE_HEIGHT = 1080
type StopIconName = 'diya' | 'corn' | 'testTube' | 'marinaBay' | 'apple' | 'bean'

const STOP_ICONS: Record<StopIconName, React.FC> = {
  diya: Diya,
  corn: Corn,
  testTube: TestTube,
  marinaBay: MarinaBaySands,
  apple: Apple,
  bean: Bean,
}

const isNarrowScreen = window.matchMedia('(max-width: 575.98px)').matches
const LEFT_X = isNarrowScreen ? 195 : 170
const RIGHT_X = isNarrowScreen ? 285 : 310

const JOURNEY_STOPS: JourneyStop[] = [
  { place: 'Bangalore, India', title: 'Where I grew up (kinda)', detail: '', icon: 'diya', x: LEFT_X, y: 90 },
  { place: 'Urbana-Champaign, IL', title: 'University of Illinois', detail: 'B.S. Computer Science + Economics · 2020–2024', icon: 'corn', x: RIGHT_X, y: 270 },
  { place: 'Groton, CT', title: 'Pfizer', detail: 'Software Engineering Intern · Summer 2022', icon: 'testTube', x: LEFT_X, y: 450 },
  { place: 'Singapore (remote)', title: 'Banach Technologies', detail: 'Quantitative Analyst Intern · 2022–2023', icon: 'marinaBay', x: RIGHT_X, y: 630 },
  { place: 'New York, NY', title: 'Société Générale', detail: 'Technology Analyst Intern · Summer 2023', icon: 'apple', x: LEFT_X, y: 810 },
  { place: 'Chicago, IL', title: 'Société Générale', detail: 'Analyst, Corporate & Investment Banking · 2024–present', icon: 'bean', x: RIGHT_X, y: 990 },
]

// Icons sit on the inner side of each stop, opposite the label
const ICON_OFFSET_X = 36
const ICON_OFFSET_Y = -4

// Smooth S-curves from the top of the scene through every stop in order
const JOURNEY_PATH = JOURNEY_STOPS.reduce((path, stop, index) => {
  if (index === 0) {
    return `M ${SCENE_WIDTH / 2} 0 C ${SCENE_WIDTH / 2} ${stop.y * 0.55}, ${stop.x} ${stop.y * 0.45}, ${stop.x} ${stop.y}`
  }
  const previous = JOURNEY_STOPS[index - 1]
  const midY = (previous.y + stop.y) / 2
  return `${path} C ${previous.x} ${midY}, ${stop.x} ${midY}, ${stop.x} ${stop.y}`
}, '')

const LAST_STOP_Y = JOURNEY_STOPS[JOURNEY_STOPS.length - 1].y

// How far down the viewport the plane hovers while scrolling (0 = top, 1 = bottom)
const VIEWPORT_ANCHOR = 0.55
const EASING = 0.12

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const Journey: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const stopRefs = useRef<(SVGGElement | null)[]>([])
  const labelRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const scene = sceneRef.current
    const path = pathRef.current
    const trail = trailRef.current
    const plane = planeRef.current
    if (!scene || !path || !trail || !plane) return

    const totalLength = path.getTotalLength()

    // Fraction of the path at which each stop sits, found by sampling
    const stopFractions = JOURNEY_STOPS.map((stop) => {
      let bestLength = 0
      let bestDistance = Infinity
      for (let length = 0; length <= totalLength; length += 2) {
        const point = path.getPointAtLength(length)
        const distance = (point.x - stop.x) ** 2 + (point.y - stop.y) ** 2
        if (distance < bestDistance) {
          bestDistance = distance
          bestLength = length
        }
      }
      return bestLength / totalLength
    })

    const render = (progress: number) => {
      const length = progress * totalLength
      const point = path.getPointAtLength(length)
      const ahead = path.getPointAtLength(Math.min(length + 1, totalLength))
      const behind = path.getPointAtLength(Math.max(length - 1, 0))
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI

      plane.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle}) scale(1.4)`)
      trail.setAttribute('stroke-dashoffset', String(1 - progress))
      // The stop nearest the plane is the one in focus
      let activeIndex = 0
      stopFractions.forEach((fraction, index) => {
        if (Math.abs(fraction - progress) < Math.abs(stopFractions[activeIndex] - progress)) activeIndex = index
      })
      stopRefs.current.forEach((stop, index) => {
        stop?.classList.toggle('is-visited', progress >= stopFractions[index] - 0.005)
        stop?.classList.toggle('is-active', index === activeIndex)
      })
      labelRefs.current.forEach((label, index) => {
        label?.classList.toggle('is-active', index === activeIndex)
      })
    }

    if (isMotionReduced) {
      render(1)
      return
    }

    let currentProgress = 0
    let targetProgress = 0
    let frameId = 0

    const tick = () => {
      currentProgress += (targetProgress - currentProgress) * EASING
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress
      }
      render(currentProgress)
      frameId = currentProgress === targetProgress ? 0 : requestAnimationFrame(tick)
    }

    const handleScroll = () => {
      const rect = scene.getBoundingClientRect()
      const sceneTop = rect.top + window.scrollY
      const anchor = window.innerHeight * VIEWPORT_ANCHOR
      // Progress runs from the scene reaching the anchor line to the last stop
      // reaching it, or to the bottom of the page if that comes first
      const startScroll = sceneTop - anchor
      const lastStopScroll = sceneTop + rect.height * (LAST_STOP_Y / SCENE_HEIGHT) - anchor
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const endScroll = Math.min(lastStopScroll, maxScroll)
      targetProgress = clamp((window.scrollY - startScroll) / Math.max(endScroll - startScroll, 1), 0, 1)
      if (!frameId) frameId = requestAnimationFrame(tick)
    }

    handleScroll()
    currentProgress = targetProgress
    render(currentProgress)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section id="journey" className="journey mx-auto px-3" aria-label="The route so far">
      <div className="journey-scene position-relative" ref={sceneRef}>
        <svg
          className="journey-svg d-block w-100 text-body-secondary"
          viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <defs>
            <path id="journey-path" d={JOURNEY_PATH} ref={pathRef} />
            <mask id="journey-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE_WIDTH} height={SCENE_HEIGHT}>
              <path
                d={JOURNEY_PATH}
                stroke="white"
                strokeWidth="8"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1}
                ref={trailRef}
              />
            </mask>
          </defs>

          <use href="#journey-path" strokeWidth="1.2" strokeDasharray="0.1 5" opacity="0.4" />
          <use href="#journey-path" strokeWidth="1.2" strokeDasharray="0.1 5" mask="url(#journey-reveal)" />

          {JOURNEY_STOPS.map((stop, index) => {
            const Icon = STOP_ICONS[stop.icon]
            const iconX = stop.x + (stop.x === LEFT_X ? ICON_OFFSET_X : -ICON_OFFSET_X)
            return (
              <g
                key={stop.place}
                className="journey-stop"
                ref={(element) => { stopRefs.current[index] = element }}
              >
                <circle className="journey-marker" cx={stop.x} cy={stop.y} r={4} strokeWidth="1.2" />
                <g transform={`translate(${iconX} ${stop.y + ICON_OFFSET_Y})`}>
                  <g className="journey-icon" strokeWidth="1.2">
                    <Icon />
                  </g>
                </g>
              </g>
            )
          })}

          <g ref={planeRef} transform={`translate(${SCENE_WIDTH / 2} 0) rotate(90) scale(1.4)`}>
            <PlaneGlyph />
          </g>
        </svg>

        {JOURNEY_STOPS.map((stop, index) => {
          const isLeft = stop.x === LEFT_X
          const columnOffset = `calc(${isLeft ? 100 - (stop.x / SCENE_WIDTH) * 100 : (stop.x / SCENE_WIDTH) * 100}% + var(--journey-label-gap))`
          return (
            <div
              key={stop.place}
              className={`journey-label ${isLeft ? 'text-end' : 'text-start'}`}
              ref={(element) => { labelRefs.current[index] = element }}
              style={{ top: `${(stop.y / SCENE_HEIGHT) * 100}%`, [isLeft ? 'right' : 'left']: columnOffset }}
            >
              <div className="journey-place">{stop.place}</div>
              <div>{stop.title}</div>
              {stop.detail && <div className="small text-body-secondary">{stop.detail}</div>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Journey
