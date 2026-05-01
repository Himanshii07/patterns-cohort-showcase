import { useState, useEffect } from 'react';
import './Learnings.css';

function Learnings() {
  const [activeCard, setActiveCard] = useState(null);
  const [doodles, setDoodles] = useState([]);
  const [showIBM, setShowIBM] = useState(true);

  {/*useEffect(() => {
    // Generate random floating doodles
    const generateDoodles = () => {
      const doodleEmojis = ['✨', '💡', '🎨', '🚀', '💻', '🧠', '📊', '🎯', '⚡', '🌟'];
      const newDoodles = [];
      
      for (let i = 0; i < 15; i++) {
        newDoodles.push({
          id: i,
          emoji: doodleEmojis[Math.floor(Math.random() * doodleEmojis.length)],
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration: 10 + Math.random() * 20,
          delay: Math.random() * 5,
        });
      }
      
      setDoodles(newDoodles);
    };

    generateDoodles();
  }, []); */}

  const learnings = [
    {
      id: 1,
      title: 'IBM Framework',
      emoji: '🏗️',
      keywords: ['PDLC', 'EDT', 'Structure', 'Process'],
      description: 'learned that IBM has a framework for literally everything. PDLC (Product Development Life Cycle) is basically the roadmap from "i have an idea" to "omg it\'s actually working". EDT (Enterprise Design Thinking) is how we make sure we\'re not just building random stuff.',
      funFact: 'fun fact: there\'s an acronym for everything at IBM. EVERYTHING.'
    },
    {
      id: 2,
      title: 'TTV Obsession',
      emoji: '⚡',
      keywords: ['Time To Value', 'Speed', 'Impact', 'Efficiency'],
      description: 'IBM is OBSESSED with TTV (Time To Value). it\'s not about how fast you build, it\'s about how fast users get value. mind blown 🤯. basically: ship fast, but make it count.',
      funFact: 'they mentioned TTV like 47 times in one session. i counted.'
    },
    {
      id: 3,
      title: 'Carbon Design System',
      emoji: '🎨',
      keywords: ['Design System', 'Components', 'Consistency', 'Accessibility'],
      description: 'Carbon is IBM\'s design system and it\'s actually fire 🔥. pre-built components, accessibility baked in, and it looks good. no more "let me just center this div" for 3 hours.',
      funFact: 'Carbon has components for things i didn\'t even know needed components'
    },
    {
      id: 4,
      title: 'Accessibility First',
      emoji: '♿',
      keywords: ['A11y', 'Inclusive', 'WCAG', 'Everyone'],
      description: 'accessibility isn\'t an afterthought, it\'s THE thought. learned about screen readers, keyboard navigation, color contrast, and why "click here" is the worst link text ever.',
      funFact: 'now i judge every website i visit. sorry not sorry.'
    },
    {
      id: 5,
      title: 'Outcome > Output',
      emoji: '🎯',
      keywords: ['Impact', 'Results', 'Value', 'Purpose'],
      description: 'this was drilled into our heads: focus on OUTCOMES (what changes for users) not OUTPUTS (what you shipped). shipping 10 features means nothing if they don\'t help anyone.',
      funFact: 'this phrase haunts my dreams now'
    },
    {
      id: 6,
      title: 'Storytelling',
      emoji: '📖',
      keywords: ['Narrative', 'Context', 'Communication', 'Persuasion'],
      description: 'data without a story is just numbers on a screen. learned how to craft narratives that make people care. turns out, humans like stories. who knew?',
      funFact: 'every presentation is now a mini movie in my head'
    },
    {
      id: 7,
      title: 'Hills Statement',
      emoji: '⛰️',
      keywords: ['Goals', 'Vision', 'Alignment', 'Direction'],
      description: 'Hills are IBM\'s way of setting goals. it\'s not "build a feature", it\'s "enable users to [do something meaningful]". way more inspiring than a jira ticket.',
      funFact: 'i now write hills for my grocery shopping. "enable me to eat healthy this week"'
    },
    {
      id: 8,
      title: 'Gen Z Vibes',
      emoji: '💅',
      keywords: ['Collaboration', 'Energy', 'Innovation', 'Squad'],
      description: 'being in a cohort full of gen z was different. we memed our way through serious topics, brought fresh perspectives, and proved that you can be professional AND have personality.',
      funFact: 'we had more emojis in our slack than actual words'
    }
  ];

  const ibmAcronyms = [
    { acronym: 'TTV', full: 'Time To Value', desc: 'how fast users get value from your product' },
    { acronym: 'PDLC', full: 'Product Development Life Cycle', desc: 'the framework for building products' },
    { acronym: 'EDT', full: 'Enterprise Design Thinking', desc: 'IBM\'s approach to design thinking' },
    { acronym: 'MVP', full: 'Minimum Viable Product', desc: 'simplest version that delivers value' },
    { acronym: 'KPI', full: 'Key Performance Indicator', desc: 'metrics that matter' },
    { acronym: 'OBR', full: 'Outcome-Based Roadmap', desc: 'planning based on outcomes, not outputs' },
    { acronym: 'POC', full: 'Proof of Concept', desc: 'testing if an idea actually works' },
    { acronym: 'SME', full: 'Subject Matter Expert', desc: 'the person who actually knows stuff' },
    { acronym: 'A11y', full: 'Accessibility', desc: '11 letters between A and Y' },
    { acronym: 'WCAG', full: 'Web Content Accessibility Guidelines', desc: 'rules for making web accessible' },
  ];

  const genZSlangs = [
    { acronym: 'ngl', full: 'not gonna lie', desc: 'being honest rn' },
    { acronym: 'fr', full: 'for real', desc: 'no cap, seriously' },
    { acronym: 'iykyk', full: 'if you know you know', desc: 'insider knowledge vibes' },
    { acronym: 'delulu', full: 'delusional', desc: 'so optimistic it loops back into chaos' },
    { acronym: 'ate', full: 'absolutely nailed it', desc: 'served excellence, left no crumbs' },
    { acronym: 'imo/imho', full: 'in my (humble) opinion', desc: 'just my thoughts tho' },
    { acronym: 'rn', full: 'right now', desc: 'at this very moment' },
    { acronym: 'smh', full: 'shaking my head', desc: 'disappointed but not surprised' },
    { acronym: 'slay', full: 'did incredibly well', desc: 'absolutely nailed it with confidence and style' },
    { acronym: 'it’s giving', full: 'the energy or vibe something is serving', desc: 'used when the aesthetic speaks before words do' },
  ];

  const currentAcronyms = showIBM ? ibmAcronyms : genZSlangs;

  return (
    <div className="learnings-page">
      {/* Floating Doodles */}
      <div className="doodles-container">
        {doodles.map((doodle) => (
          <div
            key={doodle.id}
            className="floating-doodle"
            style={{
              left: `${doodle.left}%`,
              top: `${doodle.top}%`,
              animationDuration: `${doodle.duration}s`,
              animationDelay: `${doodle.delay}s`,
            }}
          >
            {doodle.emoji}
          </div>
        ))}
      </div>

      <div className="learnings-content">
        <header className="learnings-header">
          <h1 className="learnings-title">What I Actually Learned </h1>
          <p className="learnings-subtitle">
            spoiler alert: it's more than just buzzwords (but there are a lot of those too)
          </p>
        </header>

        <div className="learnings-grid">
          {learnings.map((learning) => (
            <div
              key={learning.id}
              className={`learning-card ${activeCard === learning.id ? 'active' : ''}`}
              onClick={() => setActiveCard(activeCard === learning.id ? null : learning.id)}
            >
              <div className="card-front">
                <div className="card-emoji">{learning.emoji}</div>
                <h3 className="card-title">{learning.title}</h3>
                <div className="keywords">
                  {learning.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="click-hint">click to learn more ✨</p>
              </div>
              
              {activeCard === learning.id && (
                <div className="card-back">
                  <p className="card-description">{learning.description}</p>
                  <p className="fun-fact">{learning.funFact}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="acronym-section">
          <h2 className="acronym-title">Let's Test Your Acronym Knowledge 🧠</h2>
          <p className="acronym-subtitle">hover to reveal the meaning (no cheating!)</p>
          
          <div className="acronym-toggle">
            <button
              className={`toggle-btn ${showIBM ? 'active' : ''}`}
              onClick={() => setShowIBM(true)}
            >
              IBM Acronyms 💼
            </button>
            <button
              className={`toggle-btn ${!showIBM ? 'active' : ''}`}
              onClick={() => setShowIBM(false)}
            >
              Gen Z Slang 💅
            </button>
          </div>

          <div className="acronym-grid">
            {currentAcronyms.map((item, index) => (
              <div key={index} className="acronym-card">
                <div className="acronym-front">
                  <span className="acronym-text">{item.acronym}</span>
                </div>
                <div className="acronym-back">
                  <p className="acronym-full">{item.full}</p>
                  <p className="acronym-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="key-takeaways">
          <h2>Key Takeaways (aka the tl;dr) 📝</h2>
          <div className="takeaways-grid">
            <div className="takeaway-item">
              <span className="takeaway-number">01</span>
              <p>frameworks exist for a reason (even if they have weird acronyms)</p>
            </div>
            <div className="takeaway-item">
              <span className="takeaway-number">02</span>
              <p>accessibility isn't optional, it's essential</p>
            </div>
            <div className="takeaway-item">
              <span className="takeaway-number">03</span>
              <p>speed matters, but impact matters more</p>
            </div>
            <div className="takeaway-item">
              <span className="takeaway-number">04</span>
              <p>storytelling {'>'} data dumps</p>
            </div>
            <div className="takeaway-item">
              <span className="takeaway-number">05</span>
              <p>gen z can be professional AND fun (we're multitaskers)</p>
            </div>
            <div className="takeaway-item">
              <span className="takeaway-number">06</span>
              <p>design systems save lives (and time)</p>
            </div>
          </div>
        </section>

        <section className="final-thoughts">
          <h2>Final Thoughts 💭</h2>
          <p>
            this cohort wasn't just about learning IBM's way of doing things. 
            it was about understanding WHY they do things that way. and honestly? 
            most of it makes sense. (shocking, i know)
          </p>
          <p>
            would i do it again? absolutely. would i remember all the acronyms? 
            probably not. but that's what google is for, right? 😅
          </p>
        </section>
      </div>
    </div>
  );
}

export default Learnings;

// Made with Bob
