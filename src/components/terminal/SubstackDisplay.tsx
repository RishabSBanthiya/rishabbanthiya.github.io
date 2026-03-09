import React, { useState, useEffect } from 'react'

interface SubstackPost {
  slug: string
  title: string
  subtitle: string
  date: string
  content: string
  wordCount: number
  url: string
}

const SUBSTACK_POSTS: SubstackPost[] = [
  {
    slug: 'the-siren-song-of-remote-work',
    title: 'the siren song of remote work',
    subtitle: 'the lines of church and state are becoming more blurred.',
    date: 'Mar 9, 2026',
    wordCount: 850,
    url: 'https://rishrub.substack.com/p/the-siren-song-of-remote-work',
    content: `The news cycle moves at an unprecedented pace. Consider recent Middle East geopolitical instability and its oil price impacts. An interesting detail: the triggering event occurred Friday evening when markets were closed. Traditionally, this would mean waiting until Monday's opening bell for price discovery. However, crypto-native exchanges now offer Real-World Assets like USOIL-USDH pairs on Hyperliquid, enabling continuous price discovery.

A tech incubator partner questioned why restricted trading hours ever existed. This sentiment troubles me, who sees it as symptomatic of loosening labor protections under the guise of "agency." Remote work represents another manifestation of this troubling trend.

The weekend concept derives from Judeo-Christian sabbaths and labor union activism. If introduced today, it would likely face criticism as restrictive. Yet historical perspective matters: Industrial Revolution labor movements fought against cheap labor flooding that destroyed bargaining power. Modern technology has abandoned these lessons.

The "996" workweek exemplifies current dynamics. This emerged alongside "building in public" - sharing company journeys transparently to engage pre-product customers. While fostering community, it creates crushing peer pressure. Combined with hustle culture and shock marketing, stepping back draws ridicule as "not gonna make it."

Technology exhibits dangerous hubris, assuming it's always right and first. Restricted trading hours existed for retail investor protection. Similarly, labor protections deserve reconsideration rather than dismissal.

Remote work's deceptive aspect concerns me most. Small concessions compound: earlier meetings, quicker lunches, constant availability. This blurs work-life boundaries mentally when physical distance disappears. Home becomes inseparable from work, requiring "third spaces" or even "second spaces" for separation.

I appreciate remote work's flexibility but warn it only qualifies as a perk when employees can genuinely disconnect. Without ability to "turn off," it harms those with minimal bargaining power most severely - rarely a genuine choice for vulnerable workers.

As an addendum - it is often uncomfortable to dissent. Acknowledging the difficulty of questioning successful, competent figures whose views you find "obviously, and stupidly wrong" is something I am still working on.`
  },
  {
    slug: 'picking-nits',
    title: 'picking nits',
    subtitle: 'wanna take this outside?',
    date: 'Mar 5, 2026',
    wordCount: 836,
    url: 'https://rishrub.substack.com/p/picking-nits',
    content: `I'm particularly fond of zero-sum games. Although I wasn't a promising talent, I enjoyed chess growing up. When I, like most high school kids, was burdened with choosing something I could lie about having been interested in on a college essay, I stumbled upon debate. Think back to the insufferable debate clique you may have had back in school, perhaps you were even among them - that was briefly my bread and butter. My alma mater can perhaps breathe easy knowing I didn't voraciously lie through my teeth when I said I enjoyed it, but perhaps it is time to come clean; the club I mentioned I was president of had one member. I bring up the skeletons in my closet to grieve the habits I may have developed then. Now, when someone brings up an opinion, I can only think of favouring and, more often than not, opposing arguments. I find myself in long-winded debates about topics I have little interest in, solely because I enjoy the back-and-forth and treat it much like I would a chess game, with a winner and a loser. Yet, I don't think I am alone - more and more I've begun to see conversations on and offline treated like zero-sum games. It doesn't matter if the subject is incredibly nuanced or stupidly simple; we discuss in search of a winner and a loser. It seems meaningless then to engage with other opinions, but there is still a need to have these conversations, so the question I then find myself asking is, when to argue?

I'd like to work backwards. How does an argument end? Let's imagine an argument with someone, I'll refer to this hypothetical foe as 'Poe'. Either you or Poe concedes or gives up, or you reach an impasse at an axiomatic truth where you have to agree to disagree. The latter has always frustrated me; it's often an unsatisfying conclusion where each is only more emboldened in their own beliefs from when they started. I therefore believe that you must outline these at the start, so that at least the grief is short. Realise that this implies all arguments of opinion start from these truths. However much I plead the case of Baby Keem's new album, they seem to fall on deaf ears for many of my friends. This I can live with; these arguments tend to have low stakes, and I will continue treating them as zero-sum games where most of the utility comes from riling up my peers. For more nuanced topics, if the truth in question is something you find self-evident, you're better off not engaging. You or Poe cannot discuss in good faith.

The former is more interesting. Both you and Poe must be ready to concede or give up in earnest. Yet how must you know this without arguing? Poe needs to have some sort of credibility in your eyes as someone who will reasonably change his mind if presented with new facts. This is why we give leeway to old friends if they give us a new opinion we disagree with, or actually, why we give them more leeway in general. So what should I do when Poe approaches me at a bar and tells me, "Tottenham Hotspur doesn't have a shot at silverware this season"? A perfectly fine statement to many, I suppose, but I vehemently disagree. I'm willing to change my mind, but I know nothing of Poe; should I not engage then? Seems simple enough, but the more arguments we have about governance, for example, happen with strangers and have more of an implication than my gameday plans. In line with gamification, maybe I ask myself, "What do I stand to gain from this?" At best, a begrudging gunner who accepts the lottery odds of my flailing team. At worst, many hours of my night are lost. The choice is clear - I come to defend the Spurs. Kidding aside, this seems to mean only arguing when the stakes are high enough. When listing both conditions together, having no differences in self-evident truths and having a stake that matters, the cases to consider increasingly dwindle.

Now onto the last piece of the puzzle, Poe comes up to and touts an economic policy you disagree with. Poe's a voter just as you are, the stakes are perhaps higher than football. How do you approach this argument? Again keeping in mind you'd like to have a conclusion, try and reach those assumptions which you believe are self evident first. If Poe believes that consumers are strictly rational, that's your out. Reducing a take to set of these assumptions may seem counter intuitive but will make it easier for everyone.

Although this may seem like a long-winded way to express my desire to argue less, taking the time to reflect on my arguments and why I argue helped dampen my contrarian instincts, and if you ever had the displeasure to debate at school, I hope it helped you as well.`
  },
  {
    slug: 'credentialed-critique',
    title: 'credentialed critique',
    subtitle: 'who do you know here?',
    date: 'Feb 24, 2026',
    wordCount: 990,
    url: 'https://rishrub.substack.com/p/credentialed-critique',
    content: `Couldn't run a mile as a kid, but I was among the many armchair experts who commented on cricket games with an unwavering air of authority. So when my authority was impugned with my sister's, "Why don't you try doing that?" it stuck with me. Of course, it was silly - both my criticisms and the idea that I must be able to do what they do to have an opinion. Entire industries of pundits and commentators provide valuable insights, even if they aren't running around on the field. However, it felt a little more disingenuous when I began questioning the morality of the choices my peers made in the industry. It's easy enough to say you wouldn't work for Corp 'E' without having an offer letter in front of you, but then how do you ever have an earnest discussion about anything?

At the outset, I want to acknowledge three things. First, I understand it would be of little sense to simply say that one must be credentialed to offer their opinion. Second, it is equally senseless to say that everyone's take is well-informed or that everyone should have one in the first place. I'm having trouble reconciling the two, and wanted to explore the murky, perhaps grey area that lies in between. This is obviously a vast area, but the question I want to focus on specifically is - "Among your peers, do accomplishments in industry make arguments you make better?" Third, I don't have an answer. At least nothing satisfying, yet I will try my best to offer something of a conclusion.

As an aside, I wanted to take a moment to express my vehement hatred for the line of thinking that follows, "where do you draw the line"? I urge you, if ever you find yourself talking to someone and they pull this out of the bag, in the best case, they are arguing in bad faith. Most of the abstract will never have clean boundaries, and trying to draw them is a fool's errand, and the endeavour is losing the forest for the trees. There are often strong signals on either side, and we acknowledge a margin of error and draw something in between more often than for logistical reasons. I apologize, but I did need to get that off my chest.

It will be easier to talk through with characters, let's say 'Klaus' has accepted a prestigious and competitive offer to work as an engineer for Corp 'E', which is in the business of ruthlessly hunting golden retrievers. Klaus is still early in his career; he was obviously torn about his decision. 'Violet', a distinguished engineer who's been offered the position before and declined, thinks it is deplorable. 'Sunny', a recent graduate yet to find a job, believes the same. 'Olaf', who's an eccentric engineering lead, thinks a job is a job and Corp 'E' is on the cutting edge of technology albeit if the only case is for golden retriever hunting. Let's throw in 'Esme', who is like 'Sunny', a recent graduate still unemployed, who thinks the money at Corp 'E' is nothing to scoff at and would change her life.

It would be easy enough to dismiss both Esme and Sunny and only consider Violet and Olaf. Following that, perhaps it would make sense to disregard Olaf as well, although he's certainly accomplished; he wasn't technically ever offered that same position, so maybe he carries a little less water than Violet. Perhaps you say this line of thinking is fallacious, that I am only making appeals to authority, but I argue that Violet's authority isn't what I'm appealing to; it's the sympathy she has for the choice. The others, I argue, are naive, or even bitter. Which is often what you will hear about criticisms of taking up roles at the Corp 'E's in the real world. Frustratingly, though, this line of argument posits the need for sympathy. A morality cannot be constructed from real-life situations; it is expressly to better navigate these situations when we arrive at them that we have one in the first place. I hope I bear no criticism when I say I think it is wrong to murder for compensation, even if I haven't been given the opportunity to do so. If you disagree with this argument should work well within your framework, and this is where we shall part ways.

It would be equally easy to be blind to everyone's backgrounds and judge them solely on the strength of the evidence they offer. We now have the problem of positing the need to ignore sympathy. This, too, seems frustrating; someone who has wrestled with these decisions obviously has something valuable to offer. Perhaps then you decide to weigh these decisions by how much they can sympathize with Klaus, but you're back to dismissing Esme and Sunny, who are unemployed, perhaps even for no fault of their own. Moreover, this disfavours the young who are often the lifeblood for change. What thriving industry turns a deaf ear on their young?

So what's left? I don't know, I'm not Klaus. I'm not trying to be clever or glib, I am not Klaus, I am not wrestling with his decision, so I'm not sure what he or what the Klaus's of the world think when making their mind up. I have my own personal views on the matter, sure, and I want Klaus to hear them. That's perhaps what I've taken out of this: it's incredibly difficult to stack these arguments together, so make sure yours is one of them. I wish I had something more concrete, but the best you can do is share what you have because there isn't a single Violet, Esme, Sunny, or Olaf; there are so many, and whose voice is amplified is often as important as what they're saying. Just to end - golden retriever hunters? Come on, Klaus, you could do better.`
  },
  {
    slug: 'the-world-is-ending',
    title: 'the world is ending',
    subtitle: 'and other unhelpful truths.',
    date: 'Feb 16, 2026',
    wordCount: 710,
    url: 'https://rishrub.substack.com/p/the-world-is-ending',
    content: `It's now a dreary daily affair to see a provocatively titled op-ed that claims a significant coming change, and more often than not, it is not a hopeful future it illustrates. Perhaps at first you dismiss these as the musings of those hoping for engagement, but more and more the authors seem more and more credible, and the situation more and more morose. Yet, not one of these I've read has advised anything more than vague directions to take "action" or "notice," and I can't help but feel defeated. Even worse, I now hear the same among conversations I have in person, we're ever so eager to describe without prescription. Frustrated, I find myself asking - if the world is to end, what am I to do about it?

It would be hard to start without addressing the "boogeyman" and, more often, the subject of these pieces - AI. I find it so jarring in discourse now, I'll be referring to it as "he who shall not be named". Just as a note, while I am in a technical field and use "he who shall not be named" more than perhaps the next person, I am not at the forefront of research. I do not fully understand its current capabilities or challenges, and I don't know how it will grow in the next few years. I particularly find all conversations about the subject soul-crushing, and perhaps this is my own fault, but it seems every note these discussions I see end on encourages giving up. It started with it's encroachment on art, but now it's parasitically become a part of the daily discourse, and we talk about it anthropomorphized like we would an acquaintance. I find no issue with the informative content about these discussions. It is obviously apparent that it's grown at an exponential pace and will have an impact on daily workings. What I have an issue with is that no one seems to discuss what we can do to create a post-"he who shall not be named" world that actually functions. If you're subscribing to the idea of "he who shall not be named" being human or better than, are you not prescribing giving up? The race to horde resources will be over soon enough, and then what? The following may be logically falacious - but if it's the end of the world you have to subscribe to, I'd rather disregard it as a possibility. So now, without a shred of evidence or authority, I'll proclaim "he who shall not be named" will not economically upend the world.

I feel similarly about other systemic issues. I don't want to go into the specifics of any, but I'm sure you've read about causes that have stirred concern in your heart - yet you've seen very little done to change what you think is a widely known problem, and it leaves you confused and frustrated. When you read about these causes, there is rarely any inspiration on what to do, or at least anything you believe could actually make a sustainable change. I understand this isn't true for everyone or for every cause, but if the problem exists, I must be onto something? I must pause here to make a distinction. I'm highlighting issues that, for the most part, are recognised as such and for which there is a widely accepted "next steps" or no recognized way forward at all.

Ask yourself if you knew the world was ending - what would you actually do? Not today or tomorrow, but if someone benevolent being came down and told us for a fact it would be "soon," would our discussion about this be any different from how we talk about systemic issues today? Again, I would implore you, however absurd it may sound, to simply not believe the benevolent being.

Maybe I am just a cynic or ignorant, and I'd love to be wrong, but the most widely spread takes seem to follow the structure I've outlined above. So I implore you to believe perhaps the less believable outcome, or the more hopeful future, and continue; and don't ask more than if we must talk about these, we must also provide something constructive, else we do more harm than good.`
  }
]

interface SubstackDisplayProps {
  args?: string
}

export const SubstackDisplay: React.FC<SubstackDisplayProps> = ({ args }) => {
  const [posts, setPosts] = useState<SubstackPost[]>(SUBSTACK_POSTS)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    fetch('https://rishrub.substack.com/feed', {
      signal: controller.signal
    })
      .then(res => {
        clearTimeout(timeoutId)
        if (res.ok) return res.text()
        throw new Error('Failed to fetch')
      })
      .then(xml => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        const items = doc.querySelectorAll('item')

        if (items.length > 0) {
          const freshPosts: SubstackPost[] = []
          items.forEach(item => {
            const title = item.querySelector('title')?.textContent || ''
            const link = item.querySelector('link')?.textContent || ''
            const pubDate = item.querySelector('pubDate')?.textContent || ''
            const description = item.querySelector('description')?.textContent || ''
            const slug = link.split('/p/')[1] || title.toLowerCase().replace(/\s+/g, '-')

            const existing = SUBSTACK_POSTS.find(p => p.slug === slug)

            freshPosts.push({
              slug,
              title,
              subtitle: existing?.subtitle || '',
              date: new Date(pubDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              content: existing?.content || description.replace(/<[^>]*>/g, ''),
              wordCount: existing?.wordCount || description.split(/\s+/).length,
              url: link
            })
          })
          setPosts(freshPosts)
        }
        setIsLoading(false)
      })
      .catch(() => {
        clearTimeout(timeoutId)
        setFetchError(true)
        setIsLoading(false)
      })

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  const trimmedArgs = args?.trim().toLowerCase() || ''

  if (trimmedArgs === 'open') {
    window.open('https://rishrub.substack.com', '_blank', 'noopener,noreferrer')
    return (
      <div className="command-output">
        <p className="output-line success">Opening rishrub.substack.com...</p>
      </div>
    )
  }

  if (trimmedArgs && trimmedArgs !== 'list') {
    const post = posts.find(p =>
      p.slug === trimmedArgs ||
      p.slug.includes(trimmedArgs) ||
      p.title.toLowerCase().includes(trimmedArgs)
    )

    if (!post) {
      return (
        <div className="command-output">
          <p className="output-line error">Post not found: {args}</p>
          <p className="output-line">Use 'substack' to see available posts.</p>
        </div>
      )
    }

    const readTime = Math.ceil(post.wordCount / 200)

    return (
      <div className="command-output">
        <div className="substack-post">
          <div className="substack-post-header">
            <p className="output-line" style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {post.title}
            </p>
            <p className="output-line" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', marginBottom: '8px' }}>
              "{post.subtitle}"
            </p>
            <p className="output-line" style={{ color: 'var(--text-muted)' }}>
              {post.date} | {readTime} min read | {post.wordCount} words
            </p>
            <p className="output-line" style={{ color: 'var(--border-primary)' }}>
              {'─'.repeat(60)}
            </p>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: '1.8', color: 'var(--text-secondary)', margin: '12px 0' }}>
            {post.content}
          </pre>
          <p className="output-line" style={{ color: 'var(--border-primary)' }}>
            {'─'.repeat(60)}
          </p>
          <p className="output-line" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Read on Substack: {post.url}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="command-output">
        <p className="output-line">Fetching posts from rishrub.substack.com...</p>
        <div className="loading-skeleton" style={{ height: '80px', background: 'var(--bg-secondary)', borderRadius: '4px', marginTop: '8px' }} />
      </div>
    )
  }

  return (
    <div className="command-output">
      <pre style={{ color: 'var(--text-primary)', fontWeight: 'bold', margin: '0 0 4px 0' }}>
{`
 ___       _       _             _
/ __|_   _| |__ __| |_ __ _  __| | __
\\__ \\ | | | '_ (_-<  _/ _\` |/ _| |/ /
|___/\\_,_|_.__/__/\\__\\__,_|\\__|_|\\_\\
`}
      </pre>
      <p className="output-line" style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
        rishrub.substack.com {fetchError ? '(cached)' : ''}
      </p>
      <p className="output-line" style={{ color: 'var(--border-primary)' }}>
        {'─'.repeat(60)}
      </p>
      {posts.map((post, idx) => {
        const readTime = Math.ceil(post.wordCount / 200)
        return (
          <div key={post.slug} style={{ margin: '12px 0' }}>
            <p className="output-line">
              <span style={{ color: 'var(--text-muted)' }}>{idx + 1}. </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{post.title}</span>
            </p>
            <p className="output-line" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', marginLeft: '20px' }}>
              "{post.subtitle}"
            </p>
            <p className="output-line" style={{ color: 'var(--text-muted)', marginLeft: '20px' }}>
              {post.date} | {readTime} min read
            </p>
          </div>
        )
      })}
      <p className="output-line" style={{ color: 'var(--border-primary)', marginTop: '8px' }}>
        {'─'.repeat(60)}
      </p>
      <p className="output-line" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Usage: substack &lt;slug&gt; to read a post
      </p>
      <p className="output-line" style={{ color: 'var(--text-muted)' }}>
        Example: substack picking-nits
      </p>
      <p className="output-line" style={{ color: 'var(--text-muted)' }}>
        substack open - open Substack in browser
      </p>
    </div>
  )
}

export default SubstackDisplay
export { SUBSTACK_POSTS }
export type { SubstackPost }
