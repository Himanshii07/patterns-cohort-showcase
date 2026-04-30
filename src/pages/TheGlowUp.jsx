import { useEffect, useRef, useState } from 'react';
import './TheGlowUp.css';

function TheGlowUp() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!revealed) setRevealed(true);
    };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fill with black overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (revealed) {
        // Create radial gradient for light spotlight
        const gradient = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 0,
          mousePos.x, mousePos.y, 250
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

        // Cut out the spotlight area
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos, revealed]);



  return (
    <div className="glow-up-page">
      <canvas ref={canvasRef} className="spotlight-canvas"></canvas>
      
      <div className="glow-content">
        {!revealed && (
          <div className="initial-message">
            <h2>move your cursor to reveal the truth... 👀</h2>
          </div>
        )}

        <section className="glow-section">
          <h1 className="glow-title">The Glow Up 💡</h1>
          <p className="glow-subtitle">aka how i went from "what's a pattern?" to "actually i know stuff now"</p>
        </section>

        <section className="glow-section">
          <div className="glow-card">
            <h2>Before Patterns Cohort 😬</h2>
            <ul>
              <li>thought design patterns were just... pretty designs?</li>
              <li>accessibility = making things look nice (lol no)</li>
              <li>TTV? thought it was a typo of TV 📺</li>
              <li>PDLC sounded like a boy band</li>
              <li>carbon design = something about the environment??</li>
            </ul>
          </div>
        </section>

        <section className="glow-section">
          <div className="glow-card highlight-card">
            <h2>After Patterns Cohort ✨</h2>
            <ul>
              <li>design patterns = reusable solutions (mind blown 🤯)</li>
              <li>accessibility = everyone can use it (revolutionary concept)</li>
              <li>TTV = Time To Value (IBM's obsession, and honestly? valid)</li>
              <li>PDLC = Product Development Life Cycle (not a band, sadly)</li>
              <li>Carbon = IBM's design system (and it's actually fire 🔥)</li>
            </ul>
          </div>
        </section>

        <section className="glow-section">
          <div className="transformation-grid">
            <div className="transform-item">
              <div className="emoji">🎨</div>
              <h3>Design Thinking</h3>
              <p>learned to think like a designer (even though i'm not one)</p>
            </div>

            <div className="transform-item">
              <div className="emoji">🧠</div>
              <h3>Problem Solving</h3>
              <p>turns out there's a framework for everything</p>
            </div>

            <div className="transform-item">
              <div className="emoji">🤝</div>
              <h3>Collaboration</h3>
              <p>working with gen z hits different ngl</p>
            </div>

            <div className="transform-item">
              <div className="emoji">📈</div>
              <h3>Impact Focus</h3>
              <p>outcome {'>'} output (they really drilled this in)</p>
            </div>
          </div>
        </section>

        <section className="glow-section">
          <div className="quote-card">
            <p className="quote">"Focus on the outcome, not the output"</p>
            <p className="quote-author">- literally everyone at IBM</p>
            <p className="quote-meaning">translation: make stuff that actually matters, not just stuff</p>
          </div>
        </section>

        <section className="glow-section final-section">
          <h2>The Real Glow Up? 🌟</h2>
          <p className="final-text">
            it's not just about learning frameworks and acronyms 
            (though there were A LOT of those). it's about understanding 
            how to build things that actually help people. and doing it 
            with a squad of other gen z folks who get it. 
          </p>
          <p className="final-text">
            10/10 would recommend. would do it again. 
            (but maybe with less acronyms next time pls 🙏)
          </p>
        </section>
      </div>
    </div>
  );
}

export default TheGlowUp;

// Made with Bob
