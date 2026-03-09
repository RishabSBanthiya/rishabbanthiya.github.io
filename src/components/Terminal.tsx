import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { WeatherDisplay } from './terminal/WeatherDisplay'
import { SubstackDisplay } from './terminal/SubstackDisplay'

interface CommandHistory {
  command: string
  output: React.ReactNode
}

interface Position {
  x: number
  y: number
}

interface FileSystemNode {
  type: 'file' | 'directory'
  content?: string
  children?: Record<string, FileSystemNode>
}

// Virtual filesystem structure
const fileSystem: Record<string, FileSystemNode> = {
  '/home/rishab': {
    type: 'directory',
    children: {
      'about.txt': {
        type: 'file',
        content: `Name: Rishab Banthiya
Role: Programming Analyst at Societe Generale
Location: Chicago, IL

Education:
- University of Illinois at Urbana-Champaign
- B.S. Computer Science + Economics (2020-2024)
- GPA: 3.8/4.0

Focus areas: Data engineering, backend systems, quantitative finance`
      },
      'resume.pdf': {
        type: 'file',
        content: '[Binary file - use "resume" command to open]'
      },
      'contact.txt': {
        type: 'file',
        content: `Contact Information
==================

Email: banthiya.rishab1511@gmail.com
LinkedIn: linkedin.com/in/rishrub
GitHub: github.com/rishabSBanthiya
Phone: (217) 200-6074`
      },
      'projects': {
        type: 'directory',
        children: {
          'polymarket.md': {
            type: 'file',
            content: `# Polymarket Analytics

Live multi-agent trading system for prediction markets.

## Architecture
- Four concurrent strategies running in parallel
- Bond arbitrage, flow copy-trading, statistical arbitrage, sports

## Tech Stack
- Python, asyncio, WebSockets
- SQLite for local state
- scikit-learn for ML models

## Status: Active Development`
          },
          'sports-betting.md': {
            type: 'file',
            content: `# Sports Betting Portfolio Optimizer

Modeling Premier League outcomes as binary options.

## Approach
- Markowitz portfolio optimization
- Kelly criterion for position sizing
- Historical odds analysis

## Tech Stack
- Python, NumPy, scikit-learn
- Pandas for data processing

## Results
- Backtested on 3 seasons of data`
          },
          'prediction-market-data.md': {
            type: 'file',
            content: `# Prediction Market Data Services

Real-time data infrastructure for prediction markets.

## Overview
- High-performance data pipelines for market data collection
- Real-time WebSocket streaming and historical data storage
- REST API for market analysis and backtesting

## GitHub
https://github.com/RishabSBanthiya/prediction-market-data-services

## Status: Active Development`
          },
          'README.md': {
            type: 'file',
            content: `# Projects

This directory contains documentation for my main projects.

- polymarket.md - Multi-agent trading system
- sports-betting.md - Portfolio optimization for sports betting
- prediction-market-data.md - Data services for prediction markets`
          }
        }
      },
      'experience': {
        type: 'directory',
        children: {
          'socgen.log': {
            type: 'file',
            content: `=== Societe Generale ===
Role: Programming Analyst
Location: Chicago, IL
Period: Jul 2024 - Present

[2024-07] Joined full-time after internship conversion
[2024-08] Built report delivery engine on Spark/Azure HDInsight
[2024-09] Reduced query times from 45 min to under 5 min
[2024-10] Developed Python/Pandas data comparison platform
[2024-11] Won 1st place AMER in company hackathon (RAG search tool)
[2024-12] ETL pipeline for SAP BusinessObjects migration`
          },
          'socgen-intern.log': {
            type: 'file',
            content: `=== Societe Generale (Internship) ===
Role: Technology Analyst Intern
Location: Chicago, IL
Period: Jun 2023 - Aug 2023

[2023-06] Started summer internship
[2023-07] Built full-stack SLR reporting application
[2023-08] Implemented PostgreSQL backend with Spring Boot
[2023-08] Created Highcharts dashboards for data visualization`
          },
          'banach.log': {
            type: 'file',
            content: `=== Banach Technologies ===
Role: Quantitative Analyst Intern
Location: Remote
Period: Oct 2022 - May 2023

[2022-10] Joined as quant intern
[2022-11] Research on reinforcement learning for trading
[2023-01] Developed deep Q-learning trading agent
[2023-03] Backtesting framework for crypto markets
[2023-05] Final presentation on agent performance`
          },
          'pfizer.log': {
            type: 'file',
            content: `=== Pfizer ===
Role: Software Engineering Intern
Location: Groton, CT
Period: Jun 2022 - Aug 2022

[2022-06] Started summer internship
[2022-07] Built Apache Airflow pipelines
[2022-08] Automated data workflows for research team`
          }
        }
      },
      'education': {
        type: 'directory',
        children: {
          'uiuc.txt': {
            type: 'file',
            content: `University of Illinois at Urbana-Champaign
==========================================

Degree: B.S. Computer Science + Economics
Period: Aug 2020 - May 2024
GPA: 3.8/4.0

Relevant Coursework:
- Data Structures & Algorithms
- Database Systems
- Machine Learning
- Econometrics
- Financial Economics

Teaching Experience:
- Course Assistant for CS 126 (Software Design Studio)
- Course Assistant for CS 222 (Software Design Lab)
- Period: Jun 2022 - May 2023
- Mentored students via code reviews and lab sections`
          },
          'certifications.txt': {
            type: 'file',
            content: `Certifications & Training
=========================

- Azure Fundamentals (AZ-900)
- Spark Performance Tuning (Internal)
- Agile/Scrum Methodology`
          }
        }
      },
      'skills': {
        type: 'directory',
        children: {
          'technical.json': {
            type: 'file',
            content: JSON.stringify({
              "languages": ["Python", "Java", "SQL", "JavaScript"],
              "frameworks": ["Apache Spark", "Pandas", "Airflow", "NumPy", "Spring Boot"],
              "tools": ["Docker", "Jenkins", "Git"],
              "cloud": ["Microsoft Azure", "HDInsight"],
              "databases": ["PostgreSQL"],
              "spoken": ["English (native)", "Hindi (fluent)"]
            }, null, 2)
          },
          'languages.txt': {
            type: 'file',
            content: `Programming Languages
====================

Python     ████████████████████ Expert
Java       ████████████████░░░░ Advanced
SQL        ████████████████████ Expert
JavaScript ████████████░░░░░░░░ Intermediate
TypeScript ████████████░░░░░░░░ Intermediate`
          }
        }
      },
      'blog': {
        type: 'directory',
        children: {
          'README.md': {
            type: 'file',
            content: `# Blog (Substack)

Essays from rishrub.substack.com
Use 'substack' command for a formatted reading experience.

Posts:
- the-siren-song-of-remote-work.md  (Mar 9, 2026)
- picking-nits.md                   (Mar 5, 2026)
- credentialed-critique.md          (Feb 24, 2026)
- the-world-is-ending.md            (Feb 16, 2026)`
          },
          'the-siren-song-of-remote-work.md': {
            type: 'file',
            content: `# the siren song of remote work
> "the lines of church and state are becoming more blurred."
> Mar 9, 2026

The news cycle moves at an unprecedented pace. Consider recent Middle East geopolitical instability and its oil price impacts. An interesting detail: the triggering event occurred Friday evening when markets were closed. Traditionally, this would mean waiting until Monday's opening bell for price discovery. However, crypto-native exchanges now offer Real-World Assets like USOIL-USDH pairs on Hyperliquid, enabling continuous price discovery.

A tech incubator partner questioned why restricted trading hours ever existed. This sentiment troubles me, who sees it as symptomatic of loosening labor protections under the guise of "agency." Remote work represents another manifestation of this troubling trend.

The weekend concept derives from Judeo-Christian sabbaths and labor union activism. If introduced today, it would likely face criticism as restrictive. Yet historical perspective matters: Industrial Revolution labor movements fought against cheap labor flooding that destroyed bargaining power. Modern technology has abandoned these lessons.

The "996" workweek exemplifies current dynamics. This emerged alongside "building in public" - sharing company journeys transparently to engage pre-product customers. While fostering community, it creates crushing peer pressure. Combined with hustle culture and shock marketing, stepping back draws ridicule as "not gonna make it."

Technology exhibits dangerous hubris, assuming it's always right and first. Restricted trading hours existed for retail investor protection. Similarly, labor protections deserve reconsideration rather than dismissal.

Remote work's deceptive aspect concerns me most. Small concessions compound: earlier meetings, quicker lunches, constant availability. This blurs work-life boundaries mentally when physical distance disappears. Home becomes inseparable from work, requiring "third spaces" or even "second spaces" for separation.

I appreciate remote work's flexibility but warn it only qualifies as a perk when employees can genuinely disconnect. Without ability to "turn off," it harms those with minimal bargaining power most severely - rarely a genuine choice for vulnerable workers.

As an addendum - it is often uncomfortable to dissent. Acknowledging the difficulty of questioning successful, competent figures whose views you find "obviously, and stupidly wrong" is something I am still working on.`
          },
          'picking-nits.md': {
            type: 'file',
            content: `# picking nits
> "wanna take this outside?"
> Mar 5, 2026

I'm particularly fond of zero-sum games. Although I wasn't a promising talent, I enjoyed chess growing up. When I, like most high school kids, was burdened with choosing something I could lie about having been interested in on a college essay, I stumbled upon debate. Think back to the insufferable debate clique you may have had back in school, perhaps you were even among them - that was briefly my bread and butter. My alma mater can perhaps breathe easy knowing I didn't voraciously lie through my teeth when I said I enjoyed it, but perhaps it is time to come clean; the club I mentioned I was president of had one member. I bring up the skeletons in my closet to grieve the habits I may have developed then. Now, when someone brings up an opinion, I can only think of favouring and, more often than not, opposing arguments. I find myself in long-winded debates about topics I have little interest in, solely because I enjoy the back-and-forth and treat it much like I would a chess game, with a winner and a loser. Yet, I don't think I am alone - more and more I've begun to see conversations on and offline treated like zero-sum games. It doesn't matter if the subject is incredibly nuanced or stupidly simple; we discuss in search of a winner and a loser. It seems meaningless then to engage with other opinions, but there is still a need to have these conversations, so the question I then find myself asking is, when to argue?

I'd like to work backwards. How does an argument end? Let's imagine an argument with someone, I'll refer to this hypothetical foe as 'Poe'. Either you or Poe concedes or gives up, or you reach an impasse at an axiomatic truth where you have to agree to disagree. The latter has always frustrated me; it's often an unsatisfying conclusion where each is only more emboldened in their own beliefs from when they started. I therefore believe that you must outline these at the start, so that at least the grief is short. Realise that this implies all arguments of opinion start from these truths. However much I plead the case of Baby Keem's new album, they seem to fall on deaf ears for many of my friends. This I can live with; these arguments tend to have low stakes, and I will continue treating them as zero-sum games where most of the utility comes from riling up my peers. For more nuanced topics, if the truth in question is something you find self-evident, you're better off not engaging. You or Poe cannot discuss in good faith.

The former is more interesting. Both you and Poe must be ready to concede or give up in earnest. Yet how must you know this without arguing? Poe needs to have some sort of credibility in your eyes as someone who will reasonably change his mind if presented with new facts. This is why we give leeway to old friends if they give us a new opinion we disagree with, or actually, why we give them more leeway in general. So what should I do when Poe approaches me at a bar and tells me, "Tottenham Hotspur doesn't have a shot at silverware this season"? A perfectly fine statement to many, I suppose, but I vehemently disagree. I'm willing to change my mind, but I know nothing of Poe; should I not engage then? Seems simple enough, but the more arguments we have about governance, for example, happen with strangers and have more of an implication than my gameday plans. In line with gamification, maybe I ask myself, "What do I stand to gain from this?" At best, a begrudging gunner who accepts the lottery odds of my flailing team. At worst, many hours of my night are lost. The choice is clear - I come to defend the Spurs. Kidding aside, this seems to mean only arguing when the stakes are high enough. When listing both conditions together, having no differences in self-evident truths and having a stake that matters, the cases to consider increasingly dwindle.

Now onto the last piece of the puzzle, Poe comes up to and touts an economic policy you disagree with. Poe's a voter just as you are, the stakes are perhaps higher than football. How do you approach this argument? Again keeping in mind you'd like to have a conclusion, try and reach those assumptions which you believe are self evident first. If Poe believes that consumers are strictly rational, that's your out. Reducing a take to set of these assumptions may seem counter intuitive but will make it easier for everyone.

Although this may seem like a long-winded way to express my desire to argue less, taking the time to reflect on my arguments and why I argue helped dampen my contrarian instincts, and if you ever had the displeasure to debate at school, I hope it helped you as well.`
          },
          'credentialed-critique.md': {
            type: 'file',
            content: `# credentialed critique
> "who do you know here?"
> Feb 24, 2026

Couldn't run a mile as a kid, but I was among the many armchair experts who commented on cricket games with an unwavering air of authority. So when my authority was impugned with my sister's, "Why don't you try doing that?" it stuck with me. Of course, it was silly - both my criticisms and the idea that I must be able to do what they do to have an opinion. Entire industries of pundits and commentators provide valuable insights, even if they aren't running around on the field. However, it felt a little more disingenuous when I began questioning the morality of the choices my peers made in the industry. It's easy enough to say you wouldn't work for Corp 'E' without having an offer letter in front of you, but then how do you ever have an earnest discussion about anything?

At the outset, I want to acknowledge three things. First, I understand it would be of little sense to simply say that one must be credentialed to offer their opinion. Second, it is equally senseless to say that everyone's take is well-informed or that everyone should have one in the first place. I'm having trouble reconciling the two, and wanted to explore the murky, perhaps grey area that lies in between. This is obviously a vast area, but the question I want to focus on specifically is - "Among your peers, do accomplishments in industry make arguments you make better?" Third, I don't have an answer. At least nothing satisfying, yet I will try my best to offer something of a conclusion.

As an aside, I wanted to take a moment to express my vehement hatred for the line of thinking that follows, "where do you draw the line"? I urge you, if ever you find yourself talking to someone and they pull this out of the bag, in the best case, they are arguing in bad faith. Most of the abstract will never have clean boundaries, and trying to draw them is a fool's errand, and the endeavour is losing the forest for the trees. There are often strong signals on either side, and we acknowledge a margin of error and draw something in between more often than for logistical reasons. I apologize, but I did need to get that off my chest.

It will be easier to talk through with characters, let's say 'Klaus' has accepted a prestigious and competitive offer to work as an engineer for Corp 'E', which is in the business of ruthlessly hunting golden retrievers. Klaus is still early in his career; he was obviously torn about his decision. 'Violet', a distinguished engineer who's been offered the position before and declined, thinks it is deplorable. 'Sunny', a recent graduate yet to find a job, believes the same. 'Olaf', who's an eccentric engineering lead, thinks a job is a job and Corp 'E' is on the cutting edge of technology albeit if the only case is for golden retriever hunting. Let's throw in 'Esme', who is like 'Sunny', a recent graduate still unemployed, who thinks the money at Corp 'E' is nothing to scoff at and would change her life.

It would be easy enough to dismiss both Esme and Sunny and only consider Violet and Olaf. Following that, perhaps it would make sense to disregard Olaf as well, although he's certainly accomplished; he wasn't technically ever offered that same position, so maybe he carries a little less water than Violet. Perhaps you say this line of thinking is fallacious, that I am only making appeals to authority, but I argue that Violet's authority isn't what I'm appealing to; it's the sympathy she has for the choice. The others, I argue, are naive, or even bitter. Which is often what you will hear about criticisms of taking up roles at the Corp 'E's in the real world. Frustratingly, though, this line of argument posits the need for sympathy. A morality cannot be constructed from real-life situations; it is expressly to better navigate these situations when we arrive at them that we have one in the first place. I hope I bear no criticism when I say I think it is wrong to murder for compensation, even if I haven't been given the opportunity to do so. If you disagree with this argument should work well within your framework, and this is where we shall part ways.

It would be equally easy to be blind to everyone's backgrounds and judge them solely on the strength of the evidence they offer. We now have the problem of positing the need to ignore sympathy. This, too, seems frustrating; someone who has wrestled with these decisions obviously has something valuable to offer. Perhaps then you decide to weigh these decisions by how much they can sympathize with Klaus, but you're back to dismissing Esme and Sunny, who are unemployed, perhaps even for no fault of their own. Moreover, this disfavours the young who are often the lifeblood for change. What thriving industry turns a deaf ear on their young?

So what's left? I don't know, I'm not Klaus. I'm not trying to be clever or glib, I am not Klaus, I am not wrestling with his decision, so I'm not sure what he or what the Klaus's of the world think when making their mind up. I have my own personal views on the matter, sure, and I want Klaus to hear them. That's perhaps what I've taken out of this: it's incredibly difficult to stack these arguments together, so make sure yours is one of them. I wish I had something more concrete, but the best you can do is share what you have because there isn't a single Violet, Esme, Sunny, or Olaf; there are so many, and whose voice is amplified is often as important as what they're saying. Just to end - golden retriever hunters? Come on, Klaus, you could do better.`
          },
          'the-world-is-ending.md': {
            type: 'file',
            content: `# the world is ending
> "and other unhelpful truths."
> Feb 16, 2026

It's now a dreary daily affair to see a provocatively titled op-ed that claims a significant coming change, and more often than not, it is not a hopeful future it illustrates. Perhaps at first you dismiss these as the musings of those hoping for engagement, but more and more the authors seem more and more credible, and the situation more and more morose. Yet, not one of these I've read has advised anything more than vague directions to take "action" or "notice," and I can't help but feel defeated. Even worse, I now hear the same among conversations I have in person, we're ever so eager to describe without prescription. Frustrated, I find myself asking - if the world is to end, what am I to do about it?

It would be hard to start without addressing the "boogeyman" and, more often, the subject of these pieces - AI. I find it so jarring in discourse now, I'll be referring to it as "he who shall not be named". Just as a note, while I am in a technical field and use "he who shall not be named" more than perhaps the next person, I am not at the forefront of research. I do not fully understand its current capabilities or challenges, and I don't know how it will grow in the next few years. I particularly find all conversations about the subject soul-crushing, and perhaps this is my own fault, but it seems every note these discussions I see end on encourages giving up. It started with it's encroachment on art, but now it's parasitically become a part of the daily discourse, and we talk about it anthropomorphized like we would an acquaintance. I find no issue with the informative content about these discussions. It is obviously apparent that it's grown at an exponential pace and will have an impact on daily workings. What I have an issue with is that no one seems to discuss what we can do to create a post-"he who shall not be named" world that actually functions. If you're subscribing to the idea of "he who shall not be named" being human or better than, are you not prescribing giving up? The race to horde resources will be over soon enough, and then what? The following may be logically falacious - but if it's the end of the world you have to subscribe to, I'd rather disregard it as a possibility. So now, without a shred of evidence or authority, I'll proclaim "he who shall not be named" will not economically upend the world.

I feel similarly about other systemic issues. I don't want to go into the specifics of any, but I'm sure you've read about causes that have stirred concern in your heart - yet you've seen very little done to change what you think is a widely known problem, and it leaves you confused and frustrated. When you read about these causes, there is rarely any inspiration on what to do, or at least anything you believe could actually make a sustainable change. I understand this isn't true for everyone or for every cause, but if the problem exists, I must be onto something? I must pause here to make a distinction. I'm highlighting issues that, for the most part, are recognised as such and for which there is a widely accepted "next steps" or no recognized way forward at all.

Ask yourself if you knew the world was ending - what would you actually do? Not today or tomorrow, but if someone benevolent being came down and told us for a fact it would be "soon," would our discussion about this be any different from how we talk about systemic issues today? Again, I would implore you, however absurd it may sound, to simply not believe the benevolent being.

Maybe I am just a cynic or ignorant, and I'd love to be wrong, but the most widely spread takes seem to follow the structure I've outlined above. So I implore you to believe perhaps the less believable outcome, or the more hopeful future, and continue; and don't ask more than if we must talk about these, we must also provide something constructive, else we do more harm than good.`
          }
        }
      }
    }
  }
}

// Helper function to resolve path
const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath.startsWith('/')) {
    return targetPath
  }

  if (targetPath === '~') {
    return '/home/rishab'
  }

  const parts = currentPath.split('/').filter(p => p)
  const targetParts = targetPath.split('/').filter(p => p)

  for (const part of targetParts) {
    if (part === '..') {
      if (parts.length > 2) { // Don't go above /home/rishab
        parts.pop()
      }
    } else if (part !== '.') {
      parts.push(part)
    }
  }

  return '/' + parts.join('/')
}

// Helper function to get node at path
const getNode = (path: string): FileSystemNode | null => {
  if (path === '/home/rishab') {
    return fileSystem['/home/rishab']
  }

  const relativePath = path.replace('/home/rishab/', '')
  const parts = relativePath.split('/')

  let current: FileSystemNode | null = fileSystem['/home/rishab']

  for (const part of parts) {
    if (!part) continue
    if (current?.type !== 'directory' || !current.children?.[part]) {
      return null
    }
    current = current.children[part]
  }

  return current
}

// Helper function to get display path (with ~ for home)
const getDisplayPath = (path: string): string => {
  return path.replace('/home/rishab', '~')
}

// Helper function to parse command flags
const parseCommand = (command: string) => {
  const parts = command.split(' ')
  const baseCommand = parts[0].toLowerCase()
  const args = parts.slice(1)
  const flags = args.filter(arg => arg.startsWith('-'))
  const params = args.filter(arg => !arg.startsWith('-'))
  return { baseCommand, args, flags, params }
}

const Terminal: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [currentPath, setCurrentPath] = useState('/home/rishab')
  const [suggestion, setSuggestion] = useState('')
  const [historyPreview, setHistoryPreview] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isNavigatingHistory = useRef<boolean>(false)

  // ASCII Loading Animation Component
  const LoadingAnimation: React.FC = () => {
    const [frame, setFrame] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setFrame(prev => (prev + 1) % 4)
      }, 200)
      return () => clearInterval(interval)
    }, [])

    const frames = [
      '⠋ Loading...',
      '⠙ Loading...',
      '⠹ Loading...',
      '⠸ Loading...'
    ]

    return (
      <div className="loading-container">
        <div className="loading-content">
          <pre className="loading-ascii">
{`
██████╗ ██╗███████╗██╗  ██╗██████╗ ██╗   ██╗██████╗ ███████╗
██╔══██╗██║██╔════╝██║  ██║██╔══██╗██║   ██║██╔══██╗██╔════╝
██████╔╝██║███████╗███████║██████╔╝██║   ██║██████╔╝███████╗
██╔══██╗██║╚════██║██╔══██║██╔══██╗██║   ██║██╔══██╗╚════██║
██║  ██║██║███████║██║  ██║██║  ██║╚██████╔╝██████╔╝███████║
╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
          </pre>
          <div className="loading-spinner">
            {frames[frame]}
          </div>
          <div className="loading-text">
            <p>Initializing terminal interface...</p>
            <p>Loading interactive features...</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle ls command
  const handleLsCommand = (args: string[], flags: string[]): React.ReactNode => {
    const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath
    const node = getNode(targetPath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">ls: cannot access '{args[0]}': No such file or directory</p>
        </div>
      )
    }

    if (node.type === 'file') {
      return (
        <div className="command-output">
          <p className="output-line">{args[0]}</p>
        </div>
      )
    }

    const entries = Object.entries(node.children || {})
    const showDetails = flags.includes('-l') || flags.includes('-la') || flags.includes('-al')
    const showHidden = flags.includes('-a') || flags.includes('-la') || flags.includes('-al')

    if (showDetails) {
      return (
        <div className="command-output">
          <p className="output-line">total {entries.length}</p>
          {showHidden && (
            <>
              <p className="output-line">drwxr-xr-x  {entries.length + 2} rishab rishab 4096 Jan 13 12:00 .</p>
              <p className="output-line">drwxr-xr-x  3 rishab rishab 4096 Jan 13 12:00 ..</p>
            </>
          )}
          {entries.map(([name, entry]) => (
            <p key={name} className="output-line">
              {entry.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'}  1 rishab rishab {entry.type === 'directory' ? '4096' : (entry.content?.length || 0).toString().padStart(4)} Jan 13 12:00 <span className={entry.type === 'directory' ? 'directory-name' : ''}>{name}{entry.type === 'directory' ? '/' : ''}</span>
            </p>
          ))}
        </div>
      )
    }

    // Simple listing
    const dirs = entries.filter(([, e]) => e.type === 'directory').map(([n]) => n + '/')
    const files = entries.filter(([, e]) => e.type === 'file').map(([n]) => n)

    return (
      <div className="command-output">
        <p className="output-line">
          {[...dirs.map(d => <span key={d} className="directory-name">{d}  </span>), ...files.join('  ')]}
        </p>
      </div>
    )
  }

  // Handle cd command
  const handleCdCommand = (targetDir: string): React.ReactNode => {
    if (!targetDir || targetDir === '~') {
      setCurrentPath('/home/rishab')
      return null
    }

    const newPath = resolvePath(currentPath, targetDir)
    const node = getNode(newPath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">cd: {targetDir}: No such file or directory</p>
        </div>
      )
    }

    if (node.type !== 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">cd: {targetDir}: Not a directory</p>
        </div>
      )
    }

    setCurrentPath(newPath)
    return null
  }

  // Handle cat command
  const handleCatCommand = (filename: string): React.ReactNode => {
    if (!filename) {
      return (
        <div className="command-output">
          <p className="output-line error">cat: missing operand</p>
          <p className="output-line">Usage: cat &lt;file&gt;</p>
        </div>
      )
    }

    const filePath = resolvePath(currentPath, filename)
    const node = getNode(filePath)

    if (!node) {
      return (
        <div className="command-output">
          <p className="output-line error">cat: {filename}: No such file or directory</p>
        </div>
      )
    }

    if (node.type === 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">cat: {filename}: Is a directory</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        <pre>{node.content}</pre>
      </div>
    )
  }

  // Handle tree command
  const handleTreeCommand = (targetPath?: string): React.ReactNode => {
    const path = targetPath ? resolvePath(currentPath, targetPath) : currentPath
    const node = getNode(path)

    if (!node || node.type !== 'directory') {
      return (
        <div className="command-output">
          <p className="output-line error">tree: {targetPath || '.'}: Not a directory</p>
        </div>
      )
    }

    const buildTree = (n: FileSystemNode, prefix: string = ''): string[] => {
      if (n.type !== 'directory' || !n.children) return []

      const entries = Object.entries(n.children)
      const lines: string[] = []

      entries.forEach(([name, child], idx) => {
        const isLast = idx === entries.length - 1
        const connector = isLast ? '└── ' : '├── '
        const childPrefix = isLast ? '    ' : '│   '

        if (child.type === 'directory') {
          lines.push(`${prefix}${connector}${name}/`)
          lines.push(...buildTree(child, prefix + childPrefix))
        } else {
          lines.push(`${prefix}${connector}${name}`)
        }
      })

      return lines
    }

    const treeLines = buildTree(node)

    return (
      <div className="command-output">
        <p className="output-line">{getDisplayPath(path)}</p>
        {treeLines.map((line, idx) => (
          <p key={idx} className="output-line" style={{ fontFamily: 'monospace' }}>{line}</p>
        ))}
        <p className="output-line"></p>
        <p className="output-line">{Object.values(node.children || {}).filter(c => c.type === 'directory').length} directories, {Object.values(node.children || {}).filter(c => c.type === 'file').length} files</p>
      </div>
    )
  }

  const commands: Record<string, (args?: string) => React.ReactNode> = {
    help: () => (
      <div className="command-output">
        <div className="help-section">
          <p className="help-title">Available Commands:</p>
          <div className="command-list">
            <div className="command-item">
              <span className="cmd-name">ls [path]</span>
              <span className="cmd-desc">List directory contents (-l for details, -a for hidden)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cd &lt;dir&gt;</span>
              <span className="cmd-desc">Change directory (supports .., ~, relative/absolute paths)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">cat &lt;file&gt;</span>
              <span className="cmd-desc">Display file contents</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">pwd</span>
              <span className="cmd-desc">Print working directory</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">tree [path]</span>
              <span className="cmd-desc">Display directory tree</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">resume</span>
              <span className="cmd-desc">View/download my resume</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">linkedin</span>
              <span className="cmd-desc">Open my LinkedIn profile</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">github</span>
              <span className="cmd-desc">Open my GitHub profile</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">neofetch</span>
              <span className="cmd-desc">Display system information</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">substack [slug]</span>
              <span className="cmd-desc">Read my blog posts (or 'substack open')</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">weather</span>
              <span className="cmd-desc">Get current weather</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">grep &lt;term&gt;</span>
              <span className="cmd-desc">Search through content</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">history</span>
              <span className="cmd-desc">Show command history</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">theme &lt;name&gt;</span>
              <span className="cmd-desc">Change theme (terminal, win95)</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">clear</span>
              <span className="cmd-desc">Clear the terminal</span>
            </div>
            <div className="command-item">
              <span className="cmd-name">help</span>
              <span className="cmd-desc">Show this help message</span>
            </div>
          </div>
        </div>
      </div>
    ),

    theme: (args?: string) => {
      const themeName = args?.trim().toLowerCase()

      if (!themeName) {
        return (
          <div className="command-output">
            <p className="output-line">Current theme: {theme}</p>
            <p className="output-line">Available themes: terminal, win95</p>
            <p className="output-line">Usage: theme &lt;name&gt;</p>
          </div>
        )
      }

      if (themeName === 'terminal' || themeName === 'win95') {
        setTheme(themeName as 'terminal' | 'win95')
        return (
          <div className="command-output">
            <p className="output-line success">Theme changed to: {themeName}</p>
          </div>
        )
      }

      return (
        <div className="command-output">
          <p className="output-line error">Unknown theme: {themeName}</p>
          <p className="output-line">Available themes: terminal, win95</p>
        </div>
      )
    },

    resume: () => {
      window.open('/rishab-banthiya-resume.pdf', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening resume...</p>
        </div>
      )
    },

    linkedin: () => {
      window.open('https://www.linkedin.com/in/rishrub/', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening LinkedIn profile...</p>
        </div>
      )
    },

    github: () => {
      window.open('https://github.com/rishabSBanthiya/', '_blank')
      return (
        <div className="command-output">
          <p className="output-line success">Opening GitHub profile...</p>
        </div>
      )
    },

    clear: () => null,

    whoami: () => (
      <div className="command-output">
        <p className="output-line">rishab</p>
      </div>
    ),

    date: () => (
      <div className="command-output">
        <p className="output-line">{new Date().toString()}</p>
      </div>
    ),

    neofetch: () => (
      <div className="command-output">
        <pre className="neofetch-output">{`
   ___           rishab@local
  /   \\          ──────────────────────────
 | O O |         OS: Terminal v1.0
  \\___/          Host: rishab-banthiya.com
                 Uptime: since 2024
                 Shell: /bin/terminal

                 Role: Programming Analyst @ Societe Generale
                 Education: UIUC CS + Econ (3.8 GPA)
                 Languages: Python, Java, SQL, JavaScript
                 Frameworks: Spark, Pandas, Airflow, Spring Boot
                 Cloud: Azure, HDInsight, PostgreSQL
                 Location: Chicago, IL
`}</pre>
      </div>
    ),

    ping: () => {
      return (
        <div className="command-output">
          <p className="output-line success">64 bytes from rishab-banthiya.com: icmp_seq=1 ttl=64 time=0.420ms</p>
          <p className="output-line success">Ping successful.</p>
        </div>
      )
    },

    pwd: () => (
      <div className="command-output">
        <p className="output-line">{currentPath}</p>
      </div>
    ),

    uname: () => (
      <div className="command-output">
        <p className="output-line">Terminal 1.0.0 (React/TypeScript)</p>
      </div>
    ),

    uptime: () => {
      const now = new Date()
      return (
        <div className="command-output">
          <p className="output-line">{now.toLocaleTimeString()} up since 2024, 1 user, load average: 0.00, 0.01, 0.05</p>
        </div>
      )
    },

    hostname: () => (
      <div className="command-output">
        <p className="output-line">rishab-banthiya.com</p>
      </div>
    ),
  }

  // Get autocomplete suggestions
  const getAutocomplete = (input: string): string => {
    if (!input) return ''

    const parts = input.split(' ')
    const baseCommand = parts[0].toLowerCase()

    // Autocomplete command
    if (parts.length === 1) {
      const availableCommands = [...Object.keys(commands), 'ls', 'cd', 'cat', 'tree', 'grep', 'history', 'weather', 'echo', 'ssh', 'substack', 'blog']
      const matches = availableCommands.filter(cmd =>
        cmd.toLowerCase().startsWith(baseCommand)
      )
      if (matches.length === 1 && matches[0].toLowerCase() !== baseCommand) {
        return matches[0]
      }
    }

    // Autocomplete file/directory for ls, cd, cat, tree
    if (parts.length === 2 && ['ls', 'cd', 'cat', 'tree'].includes(baseCommand)) {
      const partial = parts[1]
      const partialPath = partial.includes('/') ? partial.substring(0, partial.lastIndexOf('/') + 1) : ''
      const partialName = partial.includes('/') ? partial.substring(partial.lastIndexOf('/') + 1) : partial

      const searchPath = resolvePath(currentPath, partialPath || '.')
      const node = getNode(searchPath)

      if (node?.type === 'directory' && node.children) {
        const matches = Object.entries(node.children)
          .filter(([name]) => name.toLowerCase().startsWith(partialName.toLowerCase()))
          .map(([name, child]) => name + (child.type === 'directory' ? '/' : ''))

        if (matches.length === 1) {
          return `${baseCommand} ${partialPath}${matches[0]}`
        }
      }
    }

    return ''
  }

  // Handle input change with autocomplete
  const handleInputChange = (value: string) => {
    const wasNavigating = isNavigatingHistory.current
    isNavigatingHistory.current = false

    setCurrentCommand(value)
    if (!wasNavigating) {
      setHistoryIndex(-1)
      setHistoryPreview('')
    }
    const autocompletion = getAutocomplete(value)
    setSuggestion(autocompletion)
  }

  // Handle Tab key for autocomplete and arrow keys for history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'Up') {
      e.preventDefault()
      if (commandHistory.length === 0) return

      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)

      isNavigatingHistory.current = true
      setHistoryIndex(newIndex)
      setHistoryPreview(commandHistory[newIndex])
      setSuggestion('')
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'Down') {
      e.preventDefault()
      if (historyIndex === -1) return

      const newIndex = historyIndex + 1

      isNavigatingHistory.current = true
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setHistoryPreview('')
      } else {
        setHistoryIndex(newIndex)
        setHistoryPreview(commandHistory[newIndex])
      }
      setSuggestion('')
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (historyPreview) {
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      } else if (suggestion) {
        setCurrentCommand(suggestion)
        setSuggestion('')
      }
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
      if (historyPreview && currentCommand === '') {
        e.preventDefault()
        setCurrentCommand(historyPreview)
        setHistoryPreview('')
        setHistoryIndex(-1)
      }
    }
  }

  // Helper function for weather command
  const handleWeatherCommand = (): React.ReactNode => {
    return <WeatherDisplay />
  }

  // Helper function for grep command
  const handleGrepCommand = (searchTerm: string): React.ReactNode => {
    if (!searchTerm) {
      return (
        <div className="command-output">
          <p className="output-line error">Usage: grep &lt;pattern&gt;</p>
        </div>
      )
    }

    const results: { file: string; line: string }[] = []
    const lowerSearch = searchTerm.toLowerCase()

    // Search through all files recursively
    const searchNode = (node: FileSystemNode, path: string) => {
      if (node.type === 'file' && node.content) {
        const lines = node.content.split('\n')
        lines.forEach(line => {
          if (line.toLowerCase().includes(lowerSearch)) {
            results.push({ file: path, line: line.trim() })
          }
        })
      } else if (node.type === 'directory' && node.children) {
        Object.entries(node.children).forEach(([name, child]) => {
          searchNode(child, `${path}/${name}`)
        })
      }
    }

    searchNode(getNode(currentPath)!, getDisplayPath(currentPath))

    if (results.length === 0) {
      return (
        <div className="command-output">
          <p className="output-line">No matches found for "{searchTerm}"</p>
        </div>
      )
    }

    return (
      <div className="command-output">
        {results.slice(0, 20).map((result, idx) => (
          <p key={idx} className="output-line">
            <span style={{ color: 'var(--accent-secondary)' }}>{result.file}</span>:{result.line}
          </p>
        ))}
        {results.length > 20 && (
          <p className="output-line">... and {results.length - 20} more matches</p>
        )}
      </div>
    )
  }

  // Helper function for pipe operator
  const handlePipeCommand = (fullCommand: string): React.ReactNode => {
    const pipeCommands = fullCommand.split(' | ').map(cmd => cmd.trim())

    if (pipeCommands.length < 2) {
      return (
        <div className="command-output">
          <p className="output-line error">Invalid pipe usage</p>
        </div>
      )
    }

    const firstCmd = pipeCommands[0].toLowerCase()
    const secondCmd = pipeCommands[1].toLowerCase()

    if (firstCmd === 'history' && secondCmd.startsWith('grep ')) {
      const searchTerm = secondCmd.substring(5).toLowerCase()
      const filtered = commandHistory.filter(cmd =>
        cmd.toLowerCase().includes(searchTerm)
      )

      return (
        <div className="command-output">
          {filtered.length === 0 ? (
            <p className="output-line">No matches found</p>
          ) : (
            filtered.map((cmd, idx) => (
              <p key={idx} className="output-line">{cmd}</p>
            ))
          )}
        </div>
      )
    }

    return (
      <div className="command-output">
        <p className="output-line">Pipe combination not yet supported</p>
        <p className="output-line">Try: history | grep &lt;term&gt;</p>
      </div>
    )
  }

  const welcomeMessage = () => (
    <div className="welcome-message">
      <pre className="terminal-banner">
{`
██████╗ ██╗███████╗██╗  ██╗██████╗ ██╗   ██╗██████╗ ███████╗
██╔══██╗██║██╔════╝██║  ██║██╔══██╗██║   ██║██╔══██╗██╔════╝
██████╔╝██║███████╗███████║██████╔╝██║   ██║██████╔╝███████╗
██╔══██╗██║╚════██║██╔══██║██╔══██╗██║   ██║██╔══██╗╚════██║
██║  ██║██║███████║██║  ██║██║  ██║╚██████╔╝██████╔╝███████║
╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
      </pre>
      <p className="output-line">Welcome to Rishab's site! Type 'help' to get started.</p>
      <p className="output-line">Try: ls, cd projects, cat about.txt, substack</p>
      <p className="output-line"></p>
    </div>
  )

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Initialize terminal with welcome message
  useEffect(() => {
    if (!isLoading) {
      setHistory([{ command: '', output: welcomeMessage() }])
    }
  }, [isLoading])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCommand = currentCommand.trim()

    if (!trimmedCommand) {
      setCurrentCommand('')
      return
    }

    // Add to command history and reset history index
    setCommandHistory(prev => {
      const newHistory = [...prev, trimmedCommand]
      return newHistory
    })
    setHistoryIndex(-1)
    setHistoryPreview('')

    if (trimmedCommand.toLowerCase() === 'clear') {
      setHistory([])
      setCurrentCommand('')
      return
    }

    // Handle pipe operator
    if (trimmedCommand.includes(' | ')) {
      const pipeOutput = handlePipeCommand(trimmedCommand)
      setHistory([...history, { command: currentCommand, output: pipeOutput }])
      setCurrentCommand('')
      return
    }

    let output: React.ReactNode
    const { baseCommand, flags, params } = parseCommand(trimmedCommand)

    if (baseCommand === 'ls') {
      output = handleLsCommand(params, flags)
    } else if (baseCommand === 'cd') {
      output = handleCdCommand(params[0] || '~')
    } else if (baseCommand === 'cat') {
      output = handleCatCommand(params[0])
    } else if (baseCommand === 'tree') {
      output = handleTreeCommand(params[0])
    } else if (baseCommand === 'ssh') {
      const url = params.join(' ')
      if (url) {
        let fullUrl = url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          fullUrl = 'https://' + url
        }
        try {
          window.open(fullUrl, '_blank', 'noopener,noreferrer')
          output = (
            <div className="command-output">
              <p className="output-line success">Opening {url}...</p>
            </div>
          )
        } catch {
          output = (
            <div className="command-output">
              <p className="output-line error">Failed to open URL</p>
            </div>
          )
        }
      } else {
        output = (
          <div className="command-output">
            <p className="output-line error">Usage: ssh &lt;url&gt;</p>
          </div>
        )
      }
    } else if (baseCommand === 'history') {
      if (flags.includes('--clear') || flags.includes('-c')) {
        setCommandHistory([])
        output = (
          <div className="command-output">
            <p className="output-line success">Command history cleared</p>
          </div>
        )
      } else if (flags.includes('--count')) {
        output = (
          <div className="command-output">
            <p className="output-line">Total commands: {commandHistory.length}</p>
          </div>
        )
      } else {
        output = (
          <div className="command-output">
            {commandHistory.length === 0 ? (
              <p className="output-line">No command history yet.</p>
            ) : (
              commandHistory.map((cmd, idx) => (
                <p key={idx} className="output-line">
                  {(idx + 1).toString().padStart(4)}  {cmd}
                </p>
              ))
            )}
          </div>
        )
      }
    } else if (baseCommand === 'weather') {
      output = handleWeatherCommand()
    } else if (baseCommand === 'substack' || baseCommand === 'blog') {
      const substackArgs = params.join(' ')
      output = <SubstackDisplay args={substackArgs} />
    } else if (baseCommand === 'grep') {
      const searchTerm = params.join(' ')
      output = handleGrepCommand(searchTerm)
    } else if (baseCommand === 'theme') {
      const themeName = params.join(' ')
      output = commands.theme(themeName)
    } else if (baseCommand === 'echo') {
      output = (
        <div className="command-output">
          <p className="output-line">{trimmedCommand.substring(5)}</p>
        </div>
      )
    } else if (commands[baseCommand]) {
      output = commands[baseCommand]()
    } else {
      output = (
        <div className="command-output">
          <p className="output-line error">Command not found: {baseCommand}</p>
          <p className="output-line">Type 'help' for available commands.</p>
        </div>
      )
    }

    setHistory([...history, { command: currentCommand, output }])
    setCurrentCommand('')
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  // Show loading animation while loading
  if (isLoading) {
    return <LoadingAnimation />
  }

  const displayPath = getDisplayPath(currentPath)

  return (
    <div
      className={`terminal-wrapper ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="terminal-header" ref={headerRef}>
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">rishab@local:{displayPath}</div>
      </div>
      <div className="terminal-container" onClick={handleTerminalClick}>
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index}>
              {item.command && (
                <div className="terminal-input-line">
                  <span className="terminal-prompt">rishab@local:{displayPath}$</span>
                  <span className="terminal-command">{item.command}</span>
                </div>
              )}
              {item.output}
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <div className="terminal-input-line">
              <label htmlFor="terminal-input" className="terminal-prompt">
                rishab@local:{displayPath}$
              </label>
              <div className="terminal-input-wrapper">
                <input
                  id="terminal-input"
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-input"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                {historyPreview && !currentCommand && (
                  <span className="terminal-suggestion">
                    <span className="suggestion-text">{historyPreview}</span>
                  </span>
                )}
                {historyPreview && currentCommand && historyPreview.startsWith(currentCommand) && (
                  <span className="terminal-suggestion">
                    {currentCommand}
                    <span className="suggestion-text">
                      {historyPreview.substring(currentCommand.length)}
                    </span>
                  </span>
                )}
                {!historyPreview && suggestion && currentCommand && (
                  <span className="terminal-suggestion">
                    {currentCommand}
                    <span className="suggestion-text">
                      {suggestion.substring(currentCommand.length)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Terminal
